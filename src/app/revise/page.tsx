"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, RotateCcw, Check, X, Sparkles } from "lucide-react";
import { FLASHCARDS } from "@/lib/content/flashcards";
import { MODULES } from "@/lib/content";
import { useProgress } from "@/lib/store/progress";
import { ProgressBar } from "@/components/ui/primitives";
import { todayKey, cn, shuffle } from "@/lib/utils";

/* ============================================================================
 * Spaced-repetition revision.
 *
 * A Leitner box schedule: cards you get right move to a longer interval, cards
 * you get wrong drop straight back to box 1. Over a term this concentrates
 * effort on exactly the definitions you keep forgetting.
 * ==========================================================================*/

const BOX_LABEL = ["", "Learning", "1 day", "2 days", "4 days", "Known"];

export default function RevisePage() {
  const cards = useProgress((s) => s.cards);
  const reviewCard = useProgress((s) => s.reviewCard);
  const hydrated = useProgress((s) => s.hydrated);

  const [level, setLevel] = useState("all");
  const [seed, setSeed] = useState(1);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);

  const today = todayKey();

  const deck = useMemo(() => {
    if (!hydrated) return [];
    const pool = FLASHCARDS.filter((c) => level === "all" || c.level === level);
    const due = pool.filter((c) => {
      const state = cards[c.id];
      return !state || state.due <= today;
    });
    return shuffle(due.length ? due : pool, seed);
    // `cards` is read through the closure on purpose: re-shuffling the deck
    // every time a card is graded would move the ground under the student.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, seed, hydrated]);

  const card = deck[index];

  const answer = (good: boolean) => {
    if (!card) return;
    reviewCard(card.id, good);
    setSessionDone((n) => n + 1);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const levels = ["all", ...MODULES.map((m) => m.id)].filter(
    (l) => l === "all" || FLASHCARDS.some((c) => c.level === l),
  );

  const knownCount = FLASHCARDS.filter((c) => (cards[c.id]?.box ?? 0) >= 5).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight">
          <Layers className="size-6 text-[var(--brand)]" />
          Revision cards
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          The definitions worth knowing word for word. Cards you get wrong come back sooner.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar
            value={knownCount}
            max={FLASHCARDS.length}
            className="flex-1"
            tone={knownCount === FLASHCARDS.length ? "success" : "brand"}
          />
          <span className="shrink-0 text-[12.5px] text-muted">
            {knownCount}/{FLASHCARDS.length} known
          </span>
        </div>
      </header>

      <div className="scrollbar-none mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => {
              setLevel(l);
              setIndex(0);
              setFlipped(false);
              setSeed(Date.now() % 10000);
            }}
            className={cn(
              "shrink-0 rounded-pill border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[12px] font-medium transition-colors",
              level === l
                ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                : "border-line bg-sunken text-muted hover:border-line-strong",
            )}
          >
            {l === "all" ? "All" : l}
          </button>
        ))}
      </div>

      {!hydrated ? (
        <div className="card min-h-56 animate-pulse" />
      ) : !card ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <Sparkles className="size-9 text-accent-500" />
          <p className="text-[16px] font-semibold">
            {sessionDone > 0 ? "Session finished" : "Nothing due right now"}
          </p>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-muted">
            {sessionDone > 0
              ? `You reviewed ${sessionDone} card${sessionDone === 1 ? "" : "s"}. Cards you answered correctly will come back in a few days.`
              : "Every card in this filter is scheduled for later. Pick another competency level, or shuffle to review anyway."}
          </p>
          <button
            onClick={() => {
              setSeed(Date.now() % 10000);
              setIndex(0);
              setSessionDone(0);
            }}
            className="mt-1 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-[13.5px] font-semibold text-[var(--brand-fg)]"
          >
            <RotateCcw className="size-4" />
            Review anyway
          </button>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between text-[12px] text-subtle">
            <span>
              Card {index + 1} of {deck.length}
            </span>
            <span>
              {card.level} ·{" "}
              {BOX_LABEL[cards[card.id]?.box ?? 1] ?? "Learning"}
            </span>
          </div>

          <button
            onClick={() => setFlipped((f) => !f)}
            className="card flex min-h-56 w-full flex-col items-center justify-center gap-3 p-6 text-center transition-shadow hover:shadow-md"
          >
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.div
                  key="front"
                  initial={{ opacity: 0, rotateX: -25 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  exit={{ opacity: 0, rotateX: 25 }}
                  transition={{ duration: 0.18 }}
                >
                  <p className="text-[17px] font-semibold leading-snug">{card.front}</p>
                  <p className="mt-4 text-[12px] text-subtle">Tap to reveal</p>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ opacity: 0, rotateX: -25 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  exit={{ opacity: 0, rotateX: 25 }}
                  transition={{ duration: 0.18 }}
                  className="w-full"
                >
                  <p className="mb-2 text-[12.5px] font-medium text-subtle">{card.front}</p>
                  <div className="whitespace-pre-line text-left text-[14px] leading-relaxed">
                    {card.back}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 grid grid-cols-2 gap-2.5"
            >
              <button
                onClick={() => answer(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-danger-500/40 bg-danger-soft text-[14px] font-semibold text-danger-soft-fg"
              >
                <X className="size-4" />
                Still learning
              </button>
              <button
                onClick={() => answer(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-success-500/40 bg-success-soft text-[14px] font-semibold text-success-soft-fg"
              >
                <Check className="size-4" />
                Got it
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
