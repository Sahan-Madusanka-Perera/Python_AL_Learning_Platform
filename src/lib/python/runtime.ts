/* ============================================================================
 * Client-side handle on the Python worker.
 *
 * One worker is shared by the whole app (booting Python costs ~2s, so we do it
 * once and keep it warm). Everything is promise-based; streaming output arrives
 * through callbacks so the terminal can paint as the program runs.
 * ==========================================================================*/

/** `prompt` and `stdin-echo` are terminal chrome: shown, but never graded. */
export type Stream = "stdout" | "stderr" | "stdin-echo" | "prompt";

export interface PyError {
  type: string;
  message: string;
  line: number | null;
  offset?: number | null;
  text: string;
}

export interface VirtualFile {
  name: string;
  size: number;
  content: string;
}

export interface RunOptions {
  /** Lines fed to `input()` before the UI starts prompting interactively. */
  stdin?: string[];
  /** Files to place in the virtual working directory before running. */
  files?: { path: string; content: string }[];
  /** Wipe the working directory first. */
  resetFs?: boolean;
  /** Return the working directory contents when finished. */
  wantFiles?: boolean;
  /** Expression evaluated in the program's namespace afterwards (auto-grader). */
  evalExpr?: string;
  /** Kill the program after this many ms. */
  timeoutMs?: number;
  onOutput?: (text: string, stream: Stream) => void;
  /** Called when the program blocks on `input()`. Resolve with `sendInput`. */
  onInputRequest?: () => void;
}

export interface RunResult {
  error: PyError | null;
  evalResult: { ok: boolean; repr: string | null; error: string | null } | null;
  truncated: boolean;
  ms: number;
  files?: VirtualFile[];
  timedOut?: boolean;
  /** Full terminal transcript: prompts, echoed input, output. For display. */
  output: string;
  /** What the program itself printed, with echoed input removed. For grading. */
  printed: string;
}

export interface TraceStep {
  line: number;
  event: "line" | "return";
  func: string;
  locals: Record<string, { repr: string; type: string }>;
  out: number;
  ret?: string;
}

export interface TraceResult {
  error: PyError | null;
  steps: TraceStep[];
  overflow: boolean;
  stdout: string;
}

export type RuntimeStatus =
  | { state: "idle" }
  | { state: "booting"; message: string }
  | { state: "ready"; pythonVersion: string; interactive: boolean }
  | { state: "error"; message: string };

type Listener = (status: RuntimeStatus) => void;

const STDIN_CAPACITY = 8192;

class PythonRuntime {
  private worker: Worker | null = null;
  private status: RuntimeStatus = { state: "idle" };
  private listeners = new Set<Listener>();

  private stdinSab: SharedArrayBuffer | null = null;
  private stdinCtl: Int32Array | null = null;
  private stdinBytes: Uint8Array | null = null;
  private interruptSab: SharedArrayBuffer | null = null;
  private interruptView: Uint8Array | null = null;

  private seq = 0;
  private pending = new Map<
    number,
    {
      resolve: (v: never) => void;
      onOutput?: (t: string, s: Stream) => void;
      onInputRequest?: () => void;
      chunks: string[];
      printed: string[];
      timer?: ReturnType<typeof setTimeout>;
    }
  >();

  private readyPromise: Promise<void> | null = null;
  private resolveReady: (() => void) | null = null;
  private rejectReady: ((e: Error) => void) | null = null;

  /** True when the browser gave us SharedArrayBuffer (interactive input works). */
  get isInteractive() {
    return this.stdinCtl !== null;
  }

  getStatus() {
    return this.status;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.status);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private setStatus(s: RuntimeStatus) {
    this.status = s;
    this.listeners.forEach((fn) => fn(s));
  }

  /** Boot Python. Safe to call many times: later calls join the first. */
  start(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });

    this.setStatus({ state: "booting", message: "Waking up Python…" });

    // SharedArrayBuffer needs cross-origin isolation. If a host strips the
    // COOP/COEP headers we degrade to "supply your inputs up front" mode
    // rather than breaking entirely.
    try {
      if (typeof SharedArrayBuffer !== "undefined" && self.crossOriginIsolated) {
        this.stdinSab = new SharedArrayBuffer(8 + STDIN_CAPACITY);
        this.stdinCtl = new Int32Array(this.stdinSab, 0, 2);
        this.stdinBytes = new Uint8Array(this.stdinSab, 8);
        this.interruptSab = new SharedArrayBuffer(1);
        this.interruptView = new Uint8Array(this.interruptSab);
      }
    } catch {
      this.stdinSab = null;
    }

    this.worker = new Worker("/pyodide-worker.js", { type: "module" });
    this.worker.onmessage = (ev) => this.handleMessage(ev.data);
    this.worker.onerror = (ev) => {
      this.setStatus({ state: "error", message: ev.message || "Python failed to start." });
      this.rejectReady?.(new Error(ev.message));
    };
    this.worker.postMessage({
      type: "init",
      stdinSab: this.stdinSab,
      interruptSab: this.interruptSab,
    });

    return this.readyPromise;
  }

  private handleMessage(msg: Record<string, unknown>) {
    const type = msg.type as string;

    if (type === "boot") {
      this.setStatus({ state: "booting", message: String(msg.message) });
      return;
    }
    if (type === "ready") {
      this.setStatus({
        state: "ready",
        pythonVersion: String(msg.pythonVersion),
        interactive: Boolean(msg.interactive),
      });
      this.resolveReady?.();
      return;
    }
    if (type === "boot-error") {
      this.setStatus({ state: "error", message: String(msg.message) });
      this.rejectReady?.(new Error(String(msg.message)));
      return;
    }

    const id = msg.id as number;
    const entry = this.pending.get(id);
    if (!entry) return;

    if (type === "output") {
      const text = String(msg.text);
      const stream = msg.stream as Stream;
      entry.chunks.push(text);
      // Prompts and echoed input belong to the transcript, not to the
      // program's own output, so the grader never sees them.
      if (stream !== "stdin-echo" && stream !== "prompt") entry.printed.push(text);
      entry.onOutput?.(text, stream);
      return;
    }
    if (type === "input-request") {
      entry.onInputRequest?.();
      return;
    }
    if (type === "done" || type === "trace-done" || type === "files") {
      if (entry.timer) clearTimeout(entry.timer);
      this.pending.delete(id);
      (entry.resolve as unknown as (v: unknown) => void)({
        ...msg,
        output: entry.chunks.join(""),
        printed: entry.printed.join(""),
      });
      return;
    }
  }

  /** Answer a blocked `input()` call. */
  sendInput(text: string) {
    if (!this.stdinCtl || !this.stdinBytes) return;
    const bytes = new TextEncoder().encode(text.slice(0, STDIN_CAPACITY - 1));
    this.stdinBytes.set(bytes);
    Atomics.store(this.stdinCtl, 1, bytes.length);
    Atomics.store(this.stdinCtl, 0, 1);
    Atomics.notify(this.stdinCtl, 0);
  }

  /** Tell a blocked `input()` that no more input is coming (raises EOFError). */
  cancelInput() {
    if (!this.stdinCtl) return;
    Atomics.store(this.stdinCtl, 0, 2);
    Atomics.notify(this.stdinCtl, 0);
  }

  /** Ctrl-C. Raises KeyboardInterrupt inside the running program. */
  interrupt() {
    if (this.interruptView) {
      this.interruptView[0] = 2; // SIGINT
      this.cancelInput();
    } else {
      this.hardRestart();
    }
  }

  /** Nuke the worker and boot a fresh one (used when interrupts aren't available). */
  hardRestart() {
    this.worker?.terminate();
    this.worker = null;
    this.readyPromise = null;
    this.pending.forEach((entry) => {
      if (entry.timer) clearTimeout(entry.timer);
      (entry.resolve as unknown as (v: unknown) => void)({
        error: { type: "Stopped", message: "Stopped.", line: null, text: "Execution stopped." },
        output: entry.chunks.join(""),
        printed: entry.printed.join(""),
        truncated: false,
        ms: 0,
        evalResult: null,
        timedOut: true,
      });
    });
    this.pending.clear();
    return this.start();
  }

  private post<T>(payload: Record<string, unknown>, opts?: Partial<RunOptions>): Promise<T> {
    const id = ++this.seq;
    return new Promise<T>((resolve) => {
      const entry = {
        resolve: resolve as unknown as (v: never) => void,
        onOutput: opts?.onOutput,
        onInputRequest: opts?.onInputRequest,
        chunks: [] as string[],
        printed: [] as string[],
        timer: undefined as ReturnType<typeof setTimeout> | undefined,
      };
      if (opts?.timeoutMs) {
        entry.timer = setTimeout(() => {
          if (this.pending.has(id)) this.interrupt();
        }, opts.timeoutMs);
      }
      this.pending.set(id, entry);
      if (this.interruptView) this.interruptView[0] = 0; // clear stale SIGINT
      this.worker?.postMessage({ ...payload, id });
    });
  }

  async run(code: string, opts: RunOptions = {}): Promise<RunResult> {
    await this.start();
    return this.post<RunResult>(
      {
        type: "run",
        code,
        stdin: opts.stdin,
        files: opts.files,
        resetFs: opts.resetFs,
        wantFiles: opts.wantFiles,
        evalExpr: opts.evalExpr,
      },
      opts,
    );
  }

  async trace(code: string, opts: RunOptions & { maxSteps?: number } = {}): Promise<TraceResult> {
    await this.start();
    return this.post<TraceResult>(
      { type: "trace", code, stdin: opts.stdin, maxSteps: opts.maxSteps },
      opts,
    );
  }

  async listFiles(): Promise<VirtualFile[]> {
    await this.start();
    const res = await this.post<{ files: VirtualFile[] }>({ type: "files" });
    return res.files ?? [];
  }

  async writeFile(path: string, content: string): Promise<VirtualFile[]> {
    await this.start();
    const res = await this.post<{ files: VirtualFile[] }>({ type: "write-file", path, content });
    return res.files ?? [];
  }

  async deleteFile(path: string): Promise<VirtualFile[]> {
    await this.start();
    const res = await this.post<{ files: VirtualFile[] }>({ type: "delete-file", path });
    return res.files ?? [];
  }
}

/** Lazily-created singleton: only exists in the browser. */
let instance: PythonRuntime | null = null;

export function getRuntime(): PythonRuntime {
  if (typeof window === "undefined") {
    throw new Error("The Python runtime is browser-only.");
  }
  if (!instance) instance = new PythonRuntime();
  return instance;
}

export type { PythonRuntime };
