"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ChevronDown, Lightbulb } from "lucide-react";
import type { FriendlyError } from "@/lib/python/errors";
import { Inline } from "@/components/ui/Markdown";
import { cn } from "@/lib/utils";

/**
 * Errors, translated.
 *
 * A raw traceback tells a beginner nothing they can act on. This shows what
 * went wrong in plain language, plus an ordered list of things to check,
 * with the original traceback still one tap away.
 */
export function ErrorPanel({ error, className }: { error: FriendlyError; className?: string }) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "overflow-hidden rounded-lg border border-danger-500/30 bg-danger-soft",
        className,
      )}
    >
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger-500" />
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-danger-soft-fg">
            <Inline text={error.title} />
            {error.line !== null && (
              <span className="ml-2 rounded bg-danger-500/15 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-medium">
                line {error.line}
              </span>
            )}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-danger-soft-fg/85">
            <Inline text={error.why} />
          </p>

          <div className="mt-2.5 rounded-md bg-black/5 px-3 py-2 dark:bg-white/5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-danger-soft-fg/70">
              <Lightbulb className="size-3" />
              Things to check
            </p>
            <ul className="mt-1.5 space-y-1">
              {error.fixes.map((fix, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[13px] leading-snug text-danger-soft-fg/90"
                >
                  <span className="select-none opacity-50">{i + 1}.</span>
                  <span>
                    <Inline text={fix} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setShowRaw((v) => !v)}
            className="mt-2 flex items-center gap-1 text-[11.5px] font-medium text-danger-soft-fg/70 transition-colors hover:text-danger-soft-fg"
          >
            <ChevronDown
              className={cn("size-3 transition-transform", showRaw && "rotate-180")}
            />
            {showRaw ? "Hide" : "Show"} the exact Python message
          </button>
          {showRaw && (
            <pre className="scrollbar-slim mt-1.5 overflow-x-auto rounded-md bg-black/10 px-3 py-2 font-[family-name:var(--font-mono)] text-[11.5px] leading-relaxed text-danger-soft-fg dark:bg-black/30">
              {error.raw}
            </pre>
          )}
        </div>
      </div>
    </motion.div>
  );
}
