"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, HelpCircle, RotateCcw } from "lucide-react";
import type { MCQ } from "@/lib/types";
import { Inline, Markdown } from "@/components/ui/Markdown";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

/* ============================================================================
 * A multiple-choice question.
 *
 * The explanation appears whether the answer was right or wrong — being right
 * for the wrong reason is the most expensive habit a student can build.
 * ==========================================================================*/

export function QuizCard({
  question,
  compact,
  onAnswered,
  index,
}: {
  question: MCQ;
  compact?: boolean;
  onAnswered?: (correct: boolean) => void;
  index?: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const recordAnswer = useProgress((s) => s.recordAnswer);

  const correctIndex = Array.isArray(question.answer) ? question.answer[0] : question.answer;

  const choose = (i: number) => {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    const correct = i === correctIndex;
    recordAnswer(question.id, correct);
    onAnswered?.(correct);
  };

  const reset = () => {
    setPicked(null);
    setRevealed(false);
  };

  const isCorrect = picked === correctIndex;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-surface",
        revealed
          ? isCorrect
            ? "border-success-500/40"
            : "border-danger-500/40"
          : "border-line",
        !compact && "my-5",
      )}
    >
      <div className="px-4 pb-3 pt-3.5">
        <div className="flex items-start gap-2">
          {index !== undefined ? (
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-bold text-brand-soft-fg">
              {index}
            </span>
          ) : (
            <HelpCircle className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
          )}
          <p className="text-[14px] font-medium leading-snug">
            <Inline text={question.q} />
          </p>
        </div>

        {question.code && (
          <pre className="scrollbar-slim mt-2.5 overflow-x-auto rounded-lg bg-[var(--bg-code)] px-3 py-2.5 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[#d7dbf0]">
            {question.code}
          </pre>
        )}

        <ul className="mt-3 space-y-1.5">
          {question.options.map((opt, i) => {
            const isAnswer = i === correctIndex;
            const isPicked = i === picked;
            return (
              <li key={i}>
                <button
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-[13.5px] leading-snug transition-colors",
                    !revealed && "border-line bg-sunken hover:border-[var(--brand)] hover:bg-hover",
                    revealed && isAnswer && "border-success-500 bg-success-soft text-success-soft-fg",
                    revealed &&
                      isPicked &&
                      !isAnswer &&
                      "border-danger-500 bg-danger-soft text-danger-soft-fg",
                    revealed && !isAnswer && !isPicked && "border-line bg-sunken opacity-55",
                  )}
                >
                  <span
                    className={cn(
                      "mt-px grid size-5 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                      revealed && isAnswer
                        ? "border-success-500 bg-success-500 text-white"
                        : revealed && isPicked
                          ? "border-danger-500 bg-danger-500 text-white"
                          : "border-line-strong text-subtle",
                    )}
                  >
                    {revealed && isAnswer ? (
                      <Check className="size-3" />
                    ) : revealed && isPicked ? (
                      <X className="size-3" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Inline text={opt} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-sunken"
          >
            <div className="px-4 py-3">
              <p
                className={cn(
                  "mb-1 text-[12px] font-semibold uppercase tracking-wide",
                  isCorrect ? "text-success-500" : "text-danger-500",
                )}
              >
                {isCorrect ? "Correct" : "Not quite"}
              </p>
              <Markdown className="text-[13px] leading-relaxed text-muted" bare>
                {question.explain}
              </Markdown>
              <button
                onClick={reset}
                className="mt-2 flex items-center gap-1 text-[12px] font-medium text-[var(--brand)]"
              >
                <RotateCcw className="size-3" />
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
