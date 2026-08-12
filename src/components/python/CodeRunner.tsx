"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Play, Square, RotateCcw, Copy, Check, Loader2 } from "lucide-react";
import { PyEditor, MobileKeyBar, insertAtCursor } from "./PyEditor";
import { Terminal } from "./Terminal";
import { ErrorPanel } from "./ErrorPanel";
import { usePython } from "./usePython";
import { cn } from "@/lib/utils";

/* ============================================================================
 * A runnable code block.
 *
 * Used everywhere in the lessons. Editable by default, because the fastest way
 * to understand a program is to change one line and see what happens.
 * ==========================================================================*/

export interface CodeRunnerProps {
  code: string;
  lang?: "python" | "sql";
  stdin?: string[];
  files?: { path: string; content: string }[];
  caption?: string;
  /** Show the editor read-only (for reference snippets that still run). */
  readOnly?: boolean;
  /** Static expected output shown when the block is not runnable. */
  staticOutput?: string;
  runnable?: boolean;
  className?: string;
  minHeight?: string;
}

export function CodeRunner({
  code,
  lang = "python",
  stdin,
  files,
  caption,
  readOnly,
  staticOutput,
  runnable = true,
  className,
  minHeight,
}: CodeRunnerProps) {
  const [source, setSource] = useState(code);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const py = usePython();

  useEffect(() => setSource(code), [code]);

  // Start booting Python as soon as a runnable block comes near the viewport,
  // so the first Run feels instant rather than costing a two-second wait.
  useEffect(() => {
    if (!runnable) return;
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          py.warmUp();
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [runnable, py]);

  const handleRun = () => {
    void py.run(source, { stdin, files, resetFs: Boolean(files) });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const dirty = source !== code;

  return (
    <div ref={hostRef} className={cn("overflow-hidden rounded-xl border border-line bg-surface", className)}>
      {caption && (
        <p className="border-b border-line bg-sunken px-3.5 py-2 text-[12.5px] leading-snug text-muted">
          {caption}
        </p>
      )}

      <PyEditor
        value={source}
        onChange={setSource}
        readOnly={readOnly}
        lang={lang}
        editorRef={editorRef}
        minHeight={minHeight ?? "60px"}
        maxHeight="420px"
        className="rounded-none border-0 border-b"
      />

      {!readOnly && runnable && (
        <MobileKeyBar onInsert={(t) => insertAtCursor(editorRef.current?.view, t)} />
      )}

      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        {runnable ? (
          <>
            {py.running ? (
              <button
                onClick={py.stop}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-danger-500 px-3 text-[13px] font-medium text-white transition-all active:scale-95"
              >
                <Square className="size-3.5 fill-current" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleRun}
                disabled={py.booting}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 text-[13px] font-medium text-[var(--brand-fg)] transition-all active:scale-95 disabled:opacity-50"
              >
                {py.booting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Play className="size-3.5 fill-current" />
                )}
                {py.booting ? "Starting Python…" : "Run"}
              </button>
            )}

            {dirty && (
              <button
                onClick={() => setSource(code)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-hover hover:text-ink"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            )}
          </>
        ) : (
          <span className="text-[12px] text-subtle">Reference only</span>
        )}

        <div className="flex-1" />

        {py.ms !== null && !py.running && (
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-subtle">
            {py.ms} ms
          </span>
        )}

        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-hover hover:text-ink"
        >
          {copied ? <Check className="size-3.5 text-success-500" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {(py.chunks.length > 0 || py.running) && (
        <div className="px-3 pb-3">
          <Terminal
            chunks={py.chunks}
            running={py.running}
            awaitingInput={py.awaitingInput}
            onSubmitInput={py.sendInput}
            minHeight="3.5rem"
          />
        </div>
      )}

      {py.error && (
        <div className="px-3 pb-3">
          <ErrorPanel error={py.error} />
        </div>
      )}

      {!runnable && staticOutput && (
        <div className="px-3 pb-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">
            Output
          </p>
          <pre className="scrollbar-slim overflow-x-auto rounded-lg bg-[var(--bg-code)] px-3 py-2.5 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[#d7dbf0]">
            {staticOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
