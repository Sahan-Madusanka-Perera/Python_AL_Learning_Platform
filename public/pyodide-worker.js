/* ============================================================================
 * Python runtime worker: runs real CPython (Pyodide/WASM) off the main thread.
 *
 * Capabilities:
 *   • streaming stdout/stderr (unbatched, so `input("prompt: ")` shows up)
 *   • truly interactive input() via SharedArrayBuffer + Atomics.wait
 *   • Ctrl-C style interrupt for runaway loops
 *   • line-by-line tracing (powers the hand-trace / variable visualiser)
 *   • an in-memory file system for the file-handling module
 *   • sqlite3 from the stdlib for the database module
 * ==========================================================================*/

/* eslint-disable no-undef */
import { loadPyodide } from "/pyodide/pyodide.mjs";

const MAX_OUTPUT = 400_000; // hard cap so a runaway print loop can't eat RAM
const WORK_DIR = "/home/student";

let pyodide = null;
let ready = false;

/** SharedArrayBuffer used to block the worker while waiting for stdin. */
let stdinCtl = null; // Int32Array view: [0]=state, [1]=byteLength
let stdinBuf = null; // Uint8Array view over the payload region
let interruptBuffer = null;

let currentId = null;
let stdinQueue = [];
let outBuffer = "";
let outKind = "stdout";
let outBytes = 0;
let truncated = false;
let lastFlush = 0;

const decoder = new TextDecoder();

/* ── output plumbing ─────────────────────────────────────────────────────── */

function flushOut() {
  if (!outBuffer) return;
  self.postMessage({ type: "output", id: currentId, stream: outKind, text: outBuffer });
  outBuffer = "";
  lastFlush = performance.now();
}

function pushOut(text, stream) {
  if (truncated) return;
  if (stream !== outKind) {
    flushOut();
    outKind = stream;
  }
  outBytes += text.length;
  if (outBytes > MAX_OUTPUT) {
    truncated = true;
    outBuffer += text.slice(0, Math.max(0, MAX_OUTPUT - (outBytes - text.length)));
    flushOut();
    self.postMessage({
      type: "output",
      id: currentId,
      stream: "stderr",
      text: `\n\n[output stopped: more than ${MAX_OUTPUT.toLocaleString()} characters printed. Check for a loop that never ends.]\n`,
    });
    return;
  }
  outBuffer += text;
  const now = performance.now();
  if (outBuffer.length > 8192 || now - lastFlush > 40) flushOut();
}

/* ── blocking stdin ──────────────────────────────────────────────────────── */

/**
 * Called by Python whenever it wants input.
 *
 * Pyodide is configured with `autoEOF: true`, which appends an EOF after every
 * value we return. That is what makes one call here equal exactly one `input()`.
 * Without it, `input()` keeps calling back until EOF and swallows every queued
 * line at once. So we return a bare line with no trailing newline.
 */
function readStdinLine() {
  // Pre-supplied inputs (used by the auto-grader and "run with these inputs")
  if (stdinQueue.length) {
    const line = stdinQueue.shift();
    pushOut(line + "\n", "stdin-echo");
    return line;
  }

  // Interactive: park the worker until the UI sends a line back.
  if (!stdinCtl) return null; // no SharedArrayBuffer → behave like EOF

  flushOut(); // make sure the prompt is painted before we block
  Atomics.store(stdinCtl, 0, 0);
  self.postMessage({ type: "input-request", id: currentId });
  Atomics.wait(stdinCtl, 0, 0);

  const state = Atomics.load(stdinCtl, 0);
  if (state === 2) return null; // cancelled → EOF → raises EOFError in Python

  const len = Atomics.load(stdinCtl, 1);
  const text = decoder.decode(stdinBuf.slice(0, len));
  pushOut(text + "\n", "stdin-echo");
  return text;
}

/* ── Python-side helpers, installed once at boot ─────────────────────────── */

/**
 * `input("Units used: ")` normally writes its prompt to stdout, which makes the
 * prompt indistinguishable from what the program itself printed. The grader
 * then has to compare against output containing the prompt, which forces every
 * test into loose substring matching.
 *
 * So we write the prompt on its own `prompt` stream instead: the terminal still
 * shows it, but `printed` (what gets graded) contains only real output. This is
 * the same treatment echoed input already gets.
 */
const BOOTSTRAP_INPUT = String.raw`
import builtins, _al_io

_real_input = builtins.input

def _al_input(prompt=""):
    if prompt != "":
        _al_io.prompt(str(prompt))
    return _real_input()

builtins.input = _al_input
`;

const BOOTSTRAP = String.raw`
import sys, io, os, traceback, builtins, json, types, linecache

_PROGRAM = "<program>"

def _register_source(src):
    """Let traceback/linecache see the student's source so error frames can
    quote the offending line back to them."""
    linecache.cache[_PROGRAM] = (len(src), None, src.splitlines(True), _PROGRAM)

def _clean_traceback(exc):
    """Traceback showing only the student's own frames, in plain language."""
    lines = []
    tbe = traceback.TracebackException.from_exception(exc)
    frames = [f for f in tbe.stack if f.filename == _PROGRAM]
    if frames:
        lines.append("Traceback (most recent call last):")
        for f in frames:
            where = "" if f.name == "<module>" else " in " + f.name
            lines.append("  Line %d%s" % (f.lineno, where))
            if f.line:
                lines.append("    " + f.line.strip())
    lines.extend(x.rstrip("\n") for x in tbe.format_exception_only())
    return "\n".join(lines)

def _error_payload(exc):
    tbe = traceback.TracebackException.from_exception(exc)
    frames = [f for f in tbe.stack if f.filename == _PROGRAM]
    line = frames[-1].lineno if frames else getattr(exc, "lineno", None)
    return {
        "type": type(exc).__name__,
        "message": str(exc),
        "line": line,
        "text": _clean_traceback(exc),
    }

def _syntax_payload(exc):
    return {
        "type": type(exc).__name__,
        "message": exc.msg if hasattr(exc, "msg") else str(exc),
        "line": exc.lineno,
        "offset": exc.offset,
        "text": "  Line %s\n    %s\n%s: %s" % (
            exc.lineno,
            (exc.text or "").strip(),
            type(exc).__name__,
            exc.msg if hasattr(exc, "msg") else str(exc),
        ),
    }

def _run_source(src, g):
    """Execute student source. Returns None on success, else an error dict."""
    _register_source(src)
    try:
        code = compile(src, _PROGRAM, "exec")
    except SyntaxError as e:
        return _syntax_payload(e)
    try:
        exec(code, g)
    except SystemExit:
        return None
    except KeyboardInterrupt:
        return {"type": "KeyboardInterrupt", "message": "Execution stopped.",
                "line": None, "text": "Execution stopped (the program was taking too long)."}
    except BaseException as e:
        return _error_payload(e)
    return None

def _eval_expr(expr, g):
    """Evaluate an expression for unit-style checks; returns (ok, repr, error)."""
    try:
        val = eval(compile(expr, _PROGRAM, "eval"), g)
        return (True, repr(val), None)
    except BaseException as e:
        return (False, None, _clean_traceback(e))

# ── value snapshotting for the variable visualiser ──────────────────────────
_SKIP_TYPES = (types.ModuleType, types.FunctionType, types.BuiltinFunctionType,
               type, types.MethodType)

def _snap_value(v, limit=160):
    try:
        if isinstance(v, _SKIP_TYPES):
            return None
        r = repr(v)
    except BaseException:
        return None
    if len(r) > limit:
        r = r[:limit] + "…"
    return {"repr": r, "type": type(v).__name__}

def _snap_scope(d):
    out = {}
    for k, v in list(d.items()):
        if k.startswith("__") or k.startswith("_AL_"):
            continue
        s = _snap_value(v)
        if s is not None:
            out[k] = s
    return out

class _Tracer:
    """Records one entry per executed line: this is the hand-trace table."""
    def __init__(self, max_steps):
        self.steps = []
        self.max_steps = max_steps
        self.overflow = False
        self.out_len = 0

    def __call__(self, frame, event, arg):
        if frame.f_code.co_filename != _PROGRAM:
            return None
        if event == "call":
            return self
        if event not in ("line", "return"):
            return self
        if len(self.steps) >= self.max_steps:
            self.overflow = True
            raise KeyboardInterrupt
        fname = frame.f_code.co_name
        entry = {
            "line": frame.f_lineno,
            "event": event,
            "func": "main" if fname == "<module>" else fname,
            "locals": _snap_scope(frame.f_locals),
            "out": _AL_OUT.tell() if _AL_OUT else 0,
        }
        if event == "return":
            entry["ret"] = (_snap_value(arg) or {}).get("repr")
        self.steps.append(entry)
        return self

_AL_OUT = None

def _run_traced(src, g, max_steps=2500):
    global _AL_OUT
    _register_source(src)
    try:
        code = compile(src, _PROGRAM, "exec")
    except SyntaxError as e:
        return {"error": _syntax_payload(e), "steps": [], "overflow": False}
    tracer = _Tracer(max_steps)
    real_stdout = sys.stdout
    _AL_OUT = io.StringIO()
    sys.stdout = _AL_OUT
    err = None
    try:
        sys.settrace(tracer)
        exec(code, g)
    except KeyboardInterrupt:
        if not tracer.overflow:
            err = {"type": "KeyboardInterrupt", "message": "Stopped.",
                   "line": None, "text": "Execution stopped."}
    except SystemExit:
        pass
    except BaseException as e:
        err = _error_payload(e)
    finally:
        sys.settrace(None)
        sys.stdout = real_stdout
    text = _AL_OUT.getvalue()
    _AL_OUT = None
    return {"error": err, "steps": tracer.steps, "overflow": tracer.overflow, "stdout": text}

# ── virtual file system helpers ─────────────────────────────────────────────
def _fs_list(root):
    items = []
    for name in sorted(os.listdir(root)):
        p = os.path.join(root, name)
        if os.path.isfile(p):
            try:
                with open(p, "r", errors="replace") as f:
                    content = f.read(20000)
            except BaseException:
                content = "<binary file>"
            items.append({"name": name, "size": os.path.getsize(p), "content": content})
    return items
`;

/* ── boot ────────────────────────────────────────────────────────────────── */

async function boot() {
  self.postMessage({ type: "boot", stage: "downloading", message: "Downloading Python…" });

  pyodide = await loadPyodide({
    indexURL: "/pyodide/",
    stdLibURL: "/pyodide/python_stdlib.zip",
  });

  self.postMessage({ type: "boot", stage: "configuring", message: "Starting Python…" });

  pyodide.setStdout({
    write: (buf) => {
      pushOut(decoder.decode(buf), "stdout");
      return buf.length;
    },
  });
  pyodide.setStderr({
    write: (buf) => {
      pushOut(decoder.decode(buf), "stderr");
      return buf.length;
    },
  });
  pyodide.setStdin({ stdin: readStdinLine, isatty: false, autoEOF: true });

  // Lets the patched input() below mark its prompt as terminal chrome rather
  // than as something the student's program printed. See BOOTSTRAP_INPUT.
  pyodide.registerJsModule("_al_io", {
    prompt: (text) => pushOut(String(text), "prompt"),
  });
  pyodide.runPython(BOOTSTRAP_INPUT);

  if (interruptBuffer) pyodide.setInterruptBuffer(interruptBuffer);

  try {
    pyodide.FS.mkdirTree(WORK_DIR);
  } catch {
    /* already exists */
  }
  pyodide.FS.chdir(WORK_DIR);

  await pyodide.runPythonAsync(BOOTSTRAP);

  ready = true;
  self.postMessage({
    type: "ready",
    version: pyodide.version,
    pythonVersion: pyodide.runPython("import sys; sys.version.split()[0]"),
    interactive: Boolean(stdinCtl),
  });
}

/* ── run helpers ─────────────────────────────────────────────────────────── */

function resetRunState(id, stdin) {
  currentId = id;
  stdinQueue = Array.isArray(stdin) ? stdin.slice() : [];
  outBuffer = "";
  outBytes = 0;
  truncated = false;
  outKind = "stdout";
  lastFlush = performance.now();
}

function seedFiles(files) {
  if (!files) return;
  for (const f of files) {
    const path = f.path.startsWith("/") ? f.path : `${WORK_DIR}/${f.path}`;
    const dir = path.slice(0, path.lastIndexOf("/"));
    try {
      pyodide.FS.mkdirTree(dir);
    } catch {
      /* exists */
    }
    pyodide.FS.writeFile(path, f.content ?? "", { encoding: "utf8" });
  }
}

function listFiles() {
  try {
    const res = pyodide.runPython(`_fs_list(${JSON.stringify(WORK_DIR)})`);
    const out = res.toJs({ dict_converter: Object.fromEntries });
    res.destroy();
    return out;
  } catch {
    return [];
  }
}

async function handleRun(msg) {
  const { id, code, stdin, files, resetFs } = msg;
  resetRunState(id, stdin);

  if (resetFs) {
    try {
      for (const name of pyodide.FS.readdir(WORK_DIR)) {
        if (name === "." || name === "..") continue;
        try {
          pyodide.FS.unlink(`${WORK_DIR}/${name}`);
        } catch {
          /* directory: leave it */
        }
      }
    } catch {
      /* ignore */
    }
  }
  seedFiles(files);

  const started = performance.now();
  const globals = pyodide.globals.get("dict")();
  let error = null;
  try {
    const runner = pyodide.globals.get("_run_source");
    const result = await runner(code, globals);
    if (result) {
      error = result.toJs({ dict_converter: Object.fromEntries });
      result.destroy();
    }
    runner.destroy();
  } catch (e) {
    error = { type: "InternalError", message: String(e), line: null, text: String(e) };
  }

  // Optional expression check used by the auto-grader
  let evalResult = null;
  if (msg.evalExpr && !error) {
    try {
      const ev = pyodide.globals.get("_eval_expr");
      const tup = await ev(msg.evalExpr, globals);
      const arr = tup.toJs();
      evalResult = { ok: arr[0], repr: arr[1], error: arr[2] };
      tup.destroy();
      ev.destroy();
    } catch (e) {
      evalResult = { ok: false, repr: null, error: String(e) };
    }
  }

  globals.destroy();
  flushOut();

  self.postMessage({
    type: "done",
    id,
    error,
    evalResult,
    truncated,
    ms: Math.round(performance.now() - started),
    files: msg.wantFiles ? listFiles() : undefined,
  });
}

async function handleTrace(msg) {
  const { id, code, stdin, maxSteps } = msg;
  resetRunState(id, stdin);

  const globals = pyodide.globals.get("dict")();
  let payload = { error: null, steps: [], overflow: false, stdout: "" };
  try {
    const runner = pyodide.globals.get("_run_traced");
    const res = await runner(code, globals, maxSteps ?? 2500);
    payload = res.toJs({ dict_converter: Object.fromEntries });
    res.destroy();
    runner.destroy();
  } catch (e) {
    payload.error = { type: "InternalError", message: String(e), line: null, text: String(e) };
  }
  globals.destroy();
  flushOut();

  self.postMessage({ type: "trace-done", id, ...payload });
}

/* ── message pump ────────────────────────────────────────────────────────── */

/**
 * Only one Python job may run at a time: a second `run` arriving mid-flight
 * would otherwise clobber the stdin queue and output routing of the first.
 * Jobs are chained so they execute strictly in arrival order.
 */
let jobChain = Promise.resolve();
function enqueue(fn) {
  jobChain = jobChain.then(fn).catch((e) => {
    self.postMessage({ type: "boot-error", message: String(e) });
  });
  return jobChain;
}

self.onmessage = (ev) => {
  const msg = ev.data;

  switch (msg.type) {
    case "init": {
      if (msg.stdinSab) {
        stdinCtl = new Int32Array(msg.stdinSab, 0, 2);
        stdinBuf = new Uint8Array(msg.stdinSab, 8);
      }
      if (msg.interruptSab) {
        interruptBuffer = new Uint8Array(msg.interruptSab);
      }
      enqueue(async () => {
        try {
          await boot();
        } catch (e) {
          self.postMessage({
            type: "boot-error",
            message: String(e && e.message ? e.message : e),
          });
        }
      });
      break;
    }

    case "run":
      enqueue(() => (ready ? handleRun(msg) : undefined));
      break;

    case "trace":
      enqueue(() => (ready ? handleTrace(msg) : undefined));
      break;

    case "files":
      enqueue(() => {
        self.postMessage({ type: "files", id: msg.id, files: listFiles() });
      });
      break;

    case "write-file":
      enqueue(() => {
        seedFiles([{ path: msg.path, content: msg.content }]);
        self.postMessage({ type: "files", id: msg.id, files: listFiles() });
      });
      break;

    case "delete-file":
      enqueue(() => {
        try {
          pyodide.FS.unlink(`${WORK_DIR}/${msg.path}`);
        } catch {
          /* missing */
        }
        self.postMessage({ type: "files", id: msg.id, files: listFiles() });
      });
      break;

    default:
      break;
  }
};
