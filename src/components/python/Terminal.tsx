"use client";

import { useEffect, useRef, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Stream } from "@/lib/python/runtime";

export interface OutputChunk {
  text: string;
  stream: Stream;
}

const STREAM_CLASS: Record<Stream, string> = {
  stdout: "text-[#d7dbf0]",
  stderr: "text-[#fda4af]",
  "stdin-echo": "text-[#7dd3fc]",
  prompt: "text-[#d7dbf0]",
};

/**
 * Program output.
 *
 * Echoed input is tinted differently from program output so a student can see
 * at a glance which lines they typed and which the program produced: the
 * transcript is otherwise genuinely ambiguous.
 */
export function Terminal({
  chunks,
  running,
  awaitingInput,
  onSubmitInput,
  emptyHint = "Output will appear here",
  className,
  minHeight = "7rem",
}: {
  chunks: OutputChunk[];
  running?: boolean;
  awaitingInput?: boolean;
  onSubmitInput?: (value: string) => void;
  emptyHint?: string;
  className?: string;
  minHeight?: string;
}) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chunks, awaitingInput]);

  useEffect(() => {
    if (awaitingInput) inputRef.current?.focus();
  }, [awaitingInput]);

  const submit = () => {
    onSubmitInput?.(draft);
    setDraft("");
  };

  const isEmpty = chunks.length === 0;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg bg-[var(--bg-code)]",
        className,
      )}
    >
      <div
        ref={scrollRef}
        className="scrollbar-slim terminal flex-1 overflow-y-auto px-3 py-2.5"
        style={{ minHeight }}
      >
        {isEmpty && !running && (
          <p className="select-none text-[#838aad]">{emptyHint}</p>
        )}
        {chunks.map((c, i) => (
          <span key={i} className={STREAM_CLASS[c.stream]}>
            {c.text}
          </span>
        ))}
        {running && !awaitingInput && (
          <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-[#818cf8] animate-blink" />
        )}
      </div>

      {awaitingInput && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2 border-t border-white/10 bg-black/25 px-3 py-2"
        >
          <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-wide text-[#7dd3fc]">
            Input
          </span>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Type your answer and press Enter"
            className="min-w-0 flex-1 bg-transparent font-[family-name:var(--font-mono)] text-[13px] text-[#e6e9f7] outline-none placeholder:text-[#5d6489]"
          />
          <button
            type="submit"
            aria-label="Send input"
            className="shrink-0 rounded-md bg-[#818cf8] p-1.5 text-[#0b0d1a] transition-opacity hover:opacity-90"
          >
            <CornerDownLeft className="size-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
