"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Play, Square, Loader2, RotateCcw, ArrowUpRight } from "lucide-react";
import { usePython } from "@/components/python/usePython";
import { Terminal } from "@/components/python/Terminal";
import { cn } from "@/lib/utils";

/* ============================================================================
 * The hero's proof.
 *
 * The headline claims a real Python. Rather than assert it, this panel runs it:
 * editable source, the actual Pyodide worker, real streamed output and the real
 * interpreter version. Nothing is downloaded until the visitor presses Run, so
 * a landing page still costs a landing page.
 * ==========================================================================*/

const DEMO = `# 9.4: repetition
marks = [72, 45, 91, 58, 88]
total = 0

for m in marks:
    total += m

print("Average:", total / len(marks))
print("Highest:", max(marks))
`;

/* ── highlighting ────────────────────────────────────────────────────────────
 * A whole editor is the wrong weight for a hero. This is the small subset of
 * Python the demo can contain, coloured from the app's own ramps.
 * ------------------------------------------------------------------------- */

const TOKEN =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(False|None|True|and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b(abs|bool|dict|enumerate|float|input|int|len|list|max|min|open|print|range|round|set|sorted|str|sum|tuple|zip)\b|\b(\d+(?:\.\d+)?)\b/g;

/** Same order as the capture groups above. */
const TOKEN_CLASS = [
  "text-[#838aad] italic", // comment
  "text-[#6ee7b7]", // string
  "text-[#a5b4fc]", // keyword
  "text-[#7dd3fc]", // builtin
  "text-[#fcd34d]", // number
];

function highlight(src: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const m of src.matchAll(TOKEN)) {
    const at = m.index;
    if (at > last) out.push(src.slice(last, at));
    const group = m.slice(1).findIndex(Boolean);
    out.push(
      <span key={key++} className={TOKEN_CLASS[group]}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/* ── panel ───────────────────────────────────────────────────────────────── */

const CODE_TYPE =
  "font-[family-name:var(--font-mono)] text-[12.5px] leading-[1.65] sm:text-[13px]";

export function HeroConsole({ className }: { className?: string }) {
  const [source, setSource] = useState(DEMO);
  const py = usePython();
  const preRef = useRef<HTMLPreElement>(null);

  const dirty = source !== DEMO;
  const status = py.status;

  const runtimeLabel =
    status.state === "ready"
      ? `Python ${status.pythonVersion}`
      : status.state === "booting"
        ? "Starting Python…"
        : status.state === "error"
          ? "Python failed to start"
          : "Python 3, in this tab";

  const dotClass =
    status.state === "ready"
      ? "bg-[#34d399]"
      : status.state === "booting"
        ? "bg-[#fbbf24] animate-pulse"
        : status.state === "error"
          ? "bg-[#f87171]"
          : "bg-[#5d6489]";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-[var(--bg-code)] shadow-lg ring-1 ring-white/10",
        className,
      )}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5">
        <span className="font-[family-name:var(--font-mono)] text-[11.5px] font-medium text-[#a8aeca]">
          marks.py
        </span>
        <span className="flex-1" />
        <span className="flex items-center gap-1.5 text-[11px] text-[#838aad]">
          <span className={cn("size-1.5 rounded-full", dotClass)} />
          {runtimeLabel}
        </span>
      </div>

      {/* editor: a transparent textarea sitting exactly on top of coloured source */}
      <div className="relative">
        <pre
          ref={preRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden whitespace-pre px-3.5 py-3 text-[#d7dbf0]",
            CODE_TYPE,
          )}
        >
          {highlight(source)}
        </pre>
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onScroll={(e) => {
            const pre = preRef.current;
            if (!pre) return;
            pre.scrollTop = e.currentTarget.scrollTop;
            pre.scrollLeft = e.currentTarget.scrollLeft;
          }}
          onKeyDown={(e) => {
            if (e.key !== "Tab") return;
            e.preventDefault();
            const el = e.currentTarget;
            const { selectionStart: from, selectionEnd: to } = el;
            const next = source.slice(0, from) + "    " + source.slice(to);
            setSource(next);
            requestAnimationFrame(() => el.setSelectionRange(from + 4, from + 4));
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Python source: editable"
          className={cn(
            // Exactly tall enough for the default snippet; anything longer
            // scrolls, and the clipped line is the cue that it does.
            "scrollbar-slim relative block h-[13.6rem] w-full resize-none overflow-auto",
            "whitespace-pre bg-transparent px-3.5 py-3 text-transparent caret-[#a5b4fc] outline-none",
            CODE_TYPE,
          )}
        />
      </div>

      {/* actions */}
      <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5">
        {py.running ? (
          <button
            onClick={py.stop}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#e11d48] px-3 text-[13px] font-semibold text-white transition-transform active:scale-95"
          >
            <Square className="size-3.5 fill-current" />
            Stop
          </button>
        ) : (
          <button
            onClick={() => void py.run(source)}
            disabled={py.booting}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#818cf8] px-3 text-[13px] font-semibold text-[#0b0d1a] transition-transform active:scale-95 disabled:opacity-60"
          >
            {py.booting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5 fill-current" />
            )}
            {py.booting ? "Starting…" : "Run"}
          </button>
        )}

        {dirty && !py.running && (
          <button
            onClick={() => setSource(DEMO)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12.5px] font-medium text-[#a8aeca] transition-colors hover:bg-white/8 hover:text-white"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        )}

        <span className="flex-1" />

        {py.ms !== null && !py.running && (
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-[#838aad]">
            {py.ms} ms
          </span>
        )}

        <Link
          href="/playground"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12.5px] font-medium text-[#a8aeca] transition-colors hover:bg-white/8 hover:text-white"
        >
          Playground
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <Terminal
        chunks={py.chunks}
        running={py.running}
        awaitingInput={py.awaitingInput}
        onSubmitInput={py.sendInput}
        emptyHint="Press Run. The first one starts Python."
        minHeight="4.25rem"
        // Capped so a chatty loop scrolls inside the panel instead of
        // stretching the hero down the page.
        className="max-h-[9rem] rounded-none border-t border-white/10"
      />

      {py.error && (
        <p className="border-t border-white/10 px-3.5 py-2.5 text-[12.5px] leading-snug text-[#fda4af]">
          <span className="font-semibold">{py.error.title}</span>
          {py.error.line !== null && ` · line ${py.error.line}`}
        </p>
      )}
    </div>
  );
}
