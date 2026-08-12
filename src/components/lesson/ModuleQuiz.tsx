"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { RotateCcw, Trophy, Play } from "lucide-react";
import type { Module } from "@/lib/types";
import { QuizCard } from "./QuizCard";
import { useProgress } from "@/lib/store/progress";
import { ProgressBar } from "@/components/ui/primitives";
import { shuffle, cn } from "@/lib/utils";

/**
 * The end-of-module quiz.
 *
 * Questions are shuffled on each attempt so a student cannot learn the answer
 * positions instead of the material.
 */
export function ModuleQuiz({ module: mod }: { module: Module }) {
  const [seed, setSeed] = useState(() => Date.now() % 10000);
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const best = useProgress((s) => s.quizzes[mod.id]);
  const recordQuiz = useProgress((s) => s.recordQuiz);

  const questions = useMemo(() => shuffle(mod.quiz, seed), [mod.quiz, seed]);

  const answeredCount = Object.keys(answered).length;
  const score = Object.values(answered).filter(Boolean).length;
  const allDone = answeredCount === questions.length;

  const submit = () => {
    setSubmitted(true);
    recordQuiz(mod.id, score, questions.length);
    if (score / questions.length >= 0.8) {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#6366f1", "#f59e0b", "#10b981"],
        disableForReducedMotion: true,
      });
    }
  };

  const restart = () => {
    setSeed(Date.now() % 10000);
    setAnswered({});
    setSubmitted(false);
  };

  if (!mod.quiz.length) {
    return (
      <p className="card p-6 text-center text-[13.5px] text-muted">
        No quiz for this level yet.
      </p>
    );
  }

  const percent = Math.round((score / questions.length) * 100);

  return (
    <div>
      <div className="card mb-4 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[13.5px] font-semibold">
            {submitted ? "Your result" : `Question ${Math.min(answeredCount + 1, questions.length)} of ${questions.length}`}
          </p>
          {best && (
            <span className="text-[12px] text-subtle">
              Best: {best.score}/{best.total}
            </span>
          )}
        </div>
        <ProgressBar
          value={answeredCount}
          max={questions.length}
          className="mt-2.5"
          tone={submitted ? (percent >= 80 ? "success" : "accent") : "brand"}
        />
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-3 rounded-lg px-3.5 py-3",
              percent >= 80 ? "bg-success-soft" : percent >= 50 ? "bg-accent-soft" : "bg-danger-soft",
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 text-[14px] font-semibold",
                percent >= 80
                  ? "text-success-soft-fg"
                  : percent >= 50
                    ? "text-accent-soft-fg"
                    : "text-danger-soft-fg",
              )}
            >
              {percent >= 80 && <Trophy className="size-4" />}
              {score} out of {questions.length} ({percent}%)
            </p>
            <p
              className={cn(
                "mt-1 text-[13px] leading-snug",
                percent >= 80
                  ? "text-success-soft-fg/85"
                  : percent >= 50
                    ? "text-accent-soft-fg/85"
                    : "text-danger-soft-fg/85",
              )}
            >
              {percent >= 80
                ? "That counts as mastered for this level. Read the explanations for anything you got wrong before moving on."
                : percent >= 50
                  ? "Nearly there. Go back over the explanations below, then take it again — the questions are reshuffled."
                  : "Worth re-reading the lessons for this level before trying again. The explanations below tell you exactly where the gaps are."}
            </p>
          </motion.div>
        )}
      </div>

      {questions.map((q, i) => (
        <QuizCard
          key={`${seed}-${q.id}`}
          question={q}
          index={i + 1}
          compact
          onAnswered={(correct) => setAnswered((a) => ({ ...a, [q.id]: correct }))}
        />
      ))}

      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] mt-4 flex gap-2 lg:bottom-4">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={!allDone}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] text-[14px] font-semibold text-[var(--brand-fg)] shadow-md disabled:opacity-45"
          >
            <Play className="size-4 fill-current" />
            {allDone
              ? "Submit quiz"
              : `Answer all ${questions.length} questions (${answeredCount} done)`}
          </button>
        ) : (
          <button
            onClick={restart}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface text-[14px] font-semibold shadow-md"
          >
            <RotateCcw className="size-4" />
            Try again with shuffled questions
          </button>
        )}
      </div>
    </div>
  );
}
