"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  FileText,
  Timer,
  Play,
  Flag,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  PenLine,
  Eye,
} from "lucide-react";
import { ALL_QUESTIONS, MODULES } from "@/lib/content";
import { STRUCTURED_QUESTIONS } from "@/lib/content/structured";
import type { MCQ } from "@/lib/types";
import { useProgress } from "@/lib/store/progress";
import { Markdown, Inline } from "@/components/ui/Markdown";
import { ProgressBar, Segmented } from "@/components/ui/primitives";
import { cn, sample } from "@/lib/utils";

/* ============================================================================
 * Exam room.
 *
 * MCQ papers are auto-marked. Structured questions are self-marked against the
 * rubric, and the model answer stays hidden until an attempt is written —
 * reading a model answer without attempting it teaches almost nothing.
 * ==========================================================================*/

type Mode = "mcq" | "structured";

const PAPERS = [
  { id: "quick", name: "Quick test", count: 15, minutes: 15 },
  { id: "half", name: "Half paper", count: 25, minutes: 30 },
  { id: "full", name: "Full paper", count: 40, minutes: 50 },
];

export default function ExamPage() {
  const [mode, setMode] = useState<Mode>("mcq");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight">
          <FileText className="size-6 text-[var(--brand)]" />
          Exam room
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          Sit a timed paper drawn from every competency level, or write out a structured answer and
          mark it against the scheme.
        </p>
      </header>

      <Segmented
        value={mode}
        onChange={setMode}
        className="mb-5"
        options={[
          { value: "mcq", label: <><Timer className="size-3.5" />Timed MCQ paper</> },
          { value: "structured", label: <><PenLine className="size-3.5" />Structured questions</> },
        ]}
      />

      {mode === "mcq" ? <McqExam /> : <StructuredPractice />}
    </div>
  );
}

/* ── timed MCQ paper ─────────────────────────────────────────────────────── */

function McqExam() {
  const recordExam = useProgress((s) => s.recordExam);
  const exams = useProgress((s) => s.exams);

  const [paper, setPaper] = useState<(typeof PAPERS)[number] | null>(null);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!paper || finished) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paper, finished]);

  const start = useCallback((p: (typeof PAPERS)[number]) => {
    setQuestions(sample(ALL_QUESTIONS, Math.min(p.count, ALL_QUESTIONS.length)));
    setPaper(p);
    setAnswers({});
    setFlagged(new Set());
    setCurrent(0);
    setFinished(false);
    setSecondsLeft(p.minutes * 60);
    startedAt.current = Date.now();
  }, []);

  const score = useMemo(
    () =>
      questions.filter((q) => {
        const correct = Array.isArray(q.answer) ? q.answer[0] : q.answer;
        return answers[q.id] === correct;
      }).length,
    [questions, answers],
  );

  const submit = () => {
    setFinished(true);
    const durationSec = Math.round((Date.now() - startedAt.current) / 1000);
    recordExam({
      id: `${paper?.id}-${Date.now()}`,
      score,
      total: questions.length,
      at: new Date().toISOString(),
      durationSec,
    });
    if (score / questions.length >= 0.65) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#6366f1", "#f59e0b", "#10b981"],
        disableForReducedMotion: true,
      });
    }
  };

  if (!paper) {
    return (
      <div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {PAPERS.map((p) => (
            <button
              key={p.id}
              onClick={() => start(p)}
              className="card group p-4 text-left transition-shadow hover:shadow-md"
            >
              <Timer className="size-5 text-[var(--brand)]" />
              <p className="mt-2.5 text-[15px] font-semibold">{p.name}</p>
              <p className="mt-0.5 text-[12.5px] text-muted">
                {p.count} questions · {p.minutes} minutes
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--brand)]">
                <Play className="size-3 fill-current" />
                Start
              </span>
            </button>
          ))}
        </div>

        {exams.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2.5 text-[15px] font-semibold">Past attempts</h2>
            <ul className="card divide-y divide-[var(--border)]">
              {[...exams].reverse().slice(0, 8).map((e) => {
                const pct = Math.round((e.score / e.total) * 100);
                return (
                  <li key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-lg text-[12px] font-bold tabular-nums",
                        pct >= 65
                          ? "bg-success-soft text-success-soft-fg"
                          : "bg-danger-soft text-danger-soft-fg",
                      )}
                    >
                      {pct}%
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium">
                        {e.score}/{e.total} correct
                      </span>
                      <span className="block text-[11.5px] text-subtle">
                        {new Date(e.at).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        · {Math.round(e.durationSec / 60)} min
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "card mb-5 p-6 text-center",
            pct >= 65 ? "border-success-500/40" : "border-line",
          )}
        >
          <p className="text-[13px] font-medium uppercase tracking-wide text-subtle">
            {paper.name} complete
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-[38px] font-bold tabular-nums">
            {score}
            <span className="text-[22px] text-subtle">/{questions.length}</span>
          </p>
          <p
            className={cn(
              "text-[15px] font-semibold",
              pct >= 65 ? "text-success-500" : pct >= 45 ? "text-accent-500" : "text-danger-500",
            )}
          >
            {pct}%
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
            {pct >= 80
              ? "Strong paper. Work through anything you got wrong below, then move on to the structured questions."
              : pct >= 65
                ? "A solid pass. The explanations below show exactly which topics to go back to."
                : "Below a comfortable pass. Read every explanation below, then redo the module quiz for the levels you slipped on."}
          </p>

          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setPaper(null)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-[13.5px] font-semibold text-[var(--brand-fg)]"
            >
              <RotateCcw className="size-4" />
              Another paper
            </button>
          </div>
        </motion.div>

        <h2 className="mb-3 text-[15px] font-semibold">Every question, with the reasoning</h2>
        <ul className="space-y-2.5">
          {questions.map((q, i) => {
            const correct = Array.isArray(q.answer) ? q.answer[0] : q.answer;
            const picked = answers[q.id];
            const right = picked === correct;
            return (
              <li key={q.id} className="card p-4">
                <div className="flex items-start gap-2">
                  {right ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success-500" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-danger-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium leading-snug">
                      <span className="mr-1.5 text-subtle">{i + 1}.</span>
                      <Inline text={q.q} />
                    </p>
                    {q.code && (
                      <pre className="scrollbar-slim mt-2 overflow-x-auto rounded-lg bg-[var(--bg-code)] px-3 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[#d7dbf0]">
                        {q.code}
                      </pre>
                    )}
                    <p className="mt-1.5 text-[12.5px] text-muted">
                      Correct: <strong className="text-success-500">{q.options[correct]}</strong>
                      {picked !== undefined && !right && (
                        <>
                          {" · "}You chose:{" "}
                          <span className="text-danger-500">{q.options[picked]}</span>
                        </>
                      )}
                      {picked === undefined && " · You left this blank"}
                    </p>
                    <Markdown className="mt-1.5 text-[12.5px] leading-relaxed text-muted" bare>
                      {q.explain}
                    </Markdown>
                    {q.level && (
                      <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[11px] text-subtle">
                        Revise: {q.level} ·{" "}
                        {MODULES.find((m) => m.id === q.level)?.title ?? ""}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const q = questions[current];
  const correctIndex = Array.isArray(q.answer) ? q.answer[0] : q.answer;
  const answeredCount = Object.keys(answers).length;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const low = secondsLeft < 60;

  return (
    <div>
      <div className="card sticky top-14 z-20 mb-4 flex items-center gap-3 p-3 lg:top-4">
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[14px] font-bold tabular-nums",
            low ? "bg-danger-soft text-danger-soft-fg" : "bg-sunken text-ink",
          )}
        >
          <Timer className="size-3.5" />
          {mins}:{String(secs).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <ProgressBar value={answeredCount} max={questions.length} />
          <p className="mt-1 text-[11px] text-subtle">
            {answeredCount}/{questions.length} answered
          </p>
        </div>
        <button
          onClick={submit}
          className="shrink-0 rounded-lg bg-[var(--brand)] px-3 py-2 text-[12.5px] font-semibold text-[var(--brand-fg)]"
        >
          Submit
        </button>
      </div>

      <div className="scrollbar-none mb-4 flex gap-1 overflow-x-auto pb-1">
        {questions.map((qq, i) => (
          <button
            key={qq.id}
            onClick={() => setCurrent(i)}
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold transition-colors",
              i === current
                ? "bg-[var(--brand)] text-[var(--brand-fg)]"
                : flagged.has(qq.id)
                  ? "bg-accent-soft text-accent-soft-fg"
                  : answers[qq.id] !== undefined
                    ? "bg-brand-soft text-brand-soft-fg"
                    : "bg-sunken text-subtle",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.15 }}
          className="card p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[14.5px] font-medium leading-snug">
              <span className="mr-1.5 text-subtle">{current + 1}.</span>
              <Inline text={q.q} />
            </p>
            <button
              onClick={() =>
                setFlagged((f) => {
                  const n = new Set(f);
                  if (n.has(q.id)) n.delete(q.id);
                  else n.add(q.id);
                  return n;
                })
              }
              aria-label="Flag for review"
              className={cn(
                "shrink-0 rounded-lg p-1.5 transition-colors",
                flagged.has(q.id)
                  ? "bg-accent-soft text-accent-500"
                  : "text-subtle hover:bg-hover",
              )}
            >
              <Flag className="size-3.5" />
            </button>
          </div>

          {q.code && (
            <pre className="scrollbar-slim mt-2.5 overflow-x-auto rounded-lg bg-[var(--bg-code)] px-3 py-2.5 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[#d7dbf0]">
              {q.code}
            </pre>
          )}

          <ul className="mt-3 space-y-1.5">
            {q.options.map((opt, i) => (
              <li key={i}>
                <button
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-[13.5px] leading-snug transition-colors",
                    answers[q.id] === i
                      ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                      : "border-line bg-sunken hover:border-line-strong",
                  )}
                >
                  <span
                    className={cn(
                      "mt-px grid size-5 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                      answers[q.id] === i
                        ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-fg)]"
                        : "border-line-strong text-subtle",
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Inline text={opt} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {/* correctIndex is deliberately unused until submission */}
          <span className="hidden">{correctIndex}</span>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line-strong text-[13.5px] font-medium disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
          disabled={current === questions.length - 1}
          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--brand)] text-[13.5px] font-semibold text-[var(--brand-fg)] disabled:opacity-40"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ── structured questions ────────────────────────────────────────────────── */

function StructuredPractice() {
  const [openId, setOpenId] = useState<string | null>(STRUCTURED_QUESTIONS[0].id);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-3">
      {STRUCTURED_QUESTIONS.map((sq) => {
        const open = openId === sq.id;
        const draft = drafts[sq.id] ?? "";
        const attempted = draft.trim().length > 40;
        const shown = revealed.has(sq.id);

        return (
          <div key={sq.id} className="card overflow-hidden">
            <button
              onClick={() => setOpenId(open ? null : sq.id)}
              className="flex w-full items-center gap-3 border-b border-line bg-sunken px-4 py-3 text-left"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-[12px] font-bold text-brand-soft-fg">
                {sq.marks}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold">
                  {sq.level} · {sq.marks} marks
                </span>
                <span className="block truncate text-[12px] text-subtle">
                  {sq.prompt.split("\n")[0]}
                </span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3">
                    <Markdown className="whitespace-pre-line text-[13.5px] leading-relaxed">
                      {sq.prompt}
                    </Markdown>

                    {sq.code && (
                      <pre className="scrollbar-slim mt-2.5 overflow-x-auto rounded-lg bg-[var(--bg-code)] px-3 py-2.5 font-[family-name:var(--font-mono)] text-[12.5px] text-[#d7dbf0]">
                        {sq.code}
                      </pre>
                    )}

                    <p className="mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-wide text-subtle">
                      Your answer
                    </p>
                    <textarea
                      value={draft}
                      onChange={(e) => setDrafts((d) => ({ ...d, [sq.id]: e.target.value }))}
                      rows={7}
                      placeholder="Write your full answer here, as you would on the paper…"
                      className="w-full rounded-lg border border-line bg-sunken px-3 py-2.5 text-[13.5px] leading-relaxed outline-none focus:border-[var(--brand)]"
                    />
                    <p className="mt-1 text-[11.5px] text-subtle">
                      {draft.trim().split(/\s+/).filter(Boolean).length} words
                    </p>

                    <div className="mt-3 rounded-lg border border-line bg-sunken p-3">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
                        Mark scheme — tick what your answer contains
                      </p>
                      <ul className="space-y-1.5">
                        {sq.rubric.map((r, i) => (
                          <li key={i} className="flex gap-2 text-[13px] leading-snug text-muted">
                            <input
                              type="checkbox"
                              className="mt-0.5 size-3.5 shrink-0 accent-[var(--brand)]"
                              aria-label={`Rubric point ${i + 1}`}
                            />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {shown ? (
                      <div className="mt-3 rounded-lg border border-success-500/30 bg-success-soft p-3.5">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-success-soft-fg">
                          Model answer
                        </p>
                        <Markdown className="whitespace-pre-line text-[13.5px] leading-relaxed text-success-soft-fg [&_code:not(pre_code)]:bg-black/10 [&_code:not(pre_code)]:text-current">
                          {sq.modelAnswer}
                        </Markdown>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevealed((s) => new Set(s).add(sq.id))}
                        disabled={!attempted}
                        className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong px-4 text-[13.5px] font-medium disabled:opacity-45"
                      >
                        <Eye className="size-4" />
                        {attempted
                          ? "Show the model answer"
                          : "Write your attempt first, then compare"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
