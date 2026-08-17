"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  Play,
  Square,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Eye,
  RotateCcw,
  Loader2,
  FlaskConical,
  Lock,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { Exercise } from "@/lib/types";
import { PyEditor, MobileKeyBar, insertAtCursor } from "@/components/python/PyEditor";
import { Terminal } from "@/components/python/Terminal";
import { ErrorPanel } from "@/components/python/ErrorPanel";
import { usePython } from "@/components/python/usePython";
import { gradeExercise, splitStdin, type GradeReport } from "@/lib/python/grader";
import { Markdown, Inline } from "@/components/ui/Markdown";
import { useProgress } from "@/lib/store/progress";
import { toast } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* ============================================================================
 * A coding lab: problem, editor, run, and an auto-graded check.
 *
 * Hints are revealed one at a time and the solution stays locked until at
 * least one real attempt has been submitted: the struggle before the answer
 * is where the learning is.
 * ==========================================================================*/

const DIFFICULTY = ["", "Easy", "Medium", "Hard"];

export function ExerciseCard({
  exercise,
  defaultOpen = true,
}: {
  exercise: Exercise;
  defaultOpen?: boolean;
}) {
  const saved = useProgress((s) => s.exercises[exercise.id]);
  const recordExercise = useProgress((s) => s.recordExercise);

  const [code, setCode] = useState(saved?.code || exercise.starter);
  const [stdinText, setStdinText] = useState("");
  const [report, setReport] = useState<GradeReport | null>(null);
  const [grading, setGrading] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [attempted, setAttempted] = useState(Boolean(saved?.attempts));
  const [open, setOpen] = useState(defaultOpen);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const py = usePython();

  // Restore a saved attempt once the store has hydrated.
  const hydrated = useProgress((s) => s.hydrated);
  useEffect(() => {
    if (hydrated && saved?.code) setCode(saved.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const solved = Boolean(saved?.solved);

  const visibleTests = useMemo(
    () => exercise.tests.filter((t) => !t.hidden).length,
    [exercise.tests],
  );

  const handleRun = () => {
    void py.run(code, {
      stdin: splitStdin(stdinText),
      files: exercise.files,
      resetFs: true,
    });
  };

  const handleCheck = async () => {
    setGrading(true);
    setReport(null);
    py.clear();
    const result = await gradeExercise(exercise, code);
    setReport(result);
    setGrading(false);
    setAttempted(true);
    recordExercise(exercise.id, result.passed, code, exercise.xp);

    if (result.passed && !solved) {
      confetti({
        particleCount: 90,
        spread: 68,
        origin: { y: 0.72 },
        colors: ["#6366f1", "#f59e0b", "#10b981", "#a855f7"],
        disableForReducedMotion: true,
      });
      toast({
        title: "Solved!",
        body: `+${exercise.xp} XP: ${exercise.title}`,
        tone: "success",
        icon: <Trophy className="size-4 text-accent-500" />,
      });
    }
  };

  return (
    <div
      className={cn(
        "my-5 overflow-hidden rounded-xl border bg-surface",
        solved ? "border-success-500/40" : "border-line",
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 border-b border-line bg-sunken px-4 py-3 text-left"
      >
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-lg",
            solved ? "bg-success-soft text-success-500" : "bg-brand-soft text-[var(--brand)]",
          )}
        >
          {solved ? <CheckCircle2 className="size-4" /> : <FlaskConical className="size-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold">{exercise.title}</span>
          <span className="block text-[11.5px] text-subtle">
            Coding lab · {DIFFICULTY[exercise.difficulty]} · {exercise.xp} XP ·{" "}
            {visibleTests} visible test{visibleTests === 1 ? "" : "s"}
          </span>
        </span>
        {solved && (
          <span className="shrink-0 rounded-pill bg-success-soft px-2 py-1 text-[10.5px] font-bold text-success-soft-fg">
            SOLVED
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-b border-line px-4 py-3">
              <Markdown className="text-[13.5px] leading-relaxed">{exercise.brief}</Markdown>
            </div>

            <PyEditor
              value={code}
              onChange={setCode}
              editorRef={editorRef}
              minHeight="150px"
              maxHeight="420px"
              className="rounded-none border-0 border-b"
            />
            <MobileKeyBar onInsert={(t) => insertAtCursor(editorRef.current?.view, t)} />

            <div className="flex flex-wrap items-center gap-2 px-3 py-2">
              {py.running ? (
                <button
                  onClick={py.stop}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-danger-500 px-3 text-[13px] font-medium text-white"
                >
                  <Square className="size-3.5 fill-current" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleRun}
                  disabled={py.booting || grading}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-[13px] font-medium text-ink transition-colors hover:bg-hover disabled:opacity-50"
                >
                  <Play className="size-3.5 fill-current" />
                  Run
                </button>
              )}

              <button
                onClick={handleCheck}
                disabled={grading || py.running}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 text-[13px] font-medium text-[var(--brand-fg)] disabled:opacity-50"
              >
                {grading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-3.5" />
                )}
                {grading ? "Checking…" : "Check my answer"}
              </button>

              <div className="flex-1" />

              {exercise.hints.length > 0 && hintsShown < exercise.hints.length && (
                <button
                  onClick={() => setHintsShown((n) => n + 1)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-accent-soft-fg transition-colors hover:bg-accent-soft"
                >
                  <Lightbulb className="size-3.5" />
                  Hint {hintsShown + 1}/{exercise.hints.length}
                </button>
              )}

              <button
                onClick={() => {
                  setCode(exercise.starter);
                  setReport(null);
                  py.clear();
                }}
                aria-label="Reset code"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] text-muted transition-colors hover:bg-hover hover:text-ink"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            </div>

            <div className="px-3 pb-3">
              <details className="group">
                <summary className="cursor-pointer list-none text-[11.5px] font-medium text-subtle transition-colors hover:text-muted">
                  Inputs for `input()`: one per line
                </summary>
                <textarea
                  value={stdinText}
                  onChange={(e) => setStdinText(e.target.value)}
                  rows={2}
                  placeholder={"3000\n"}
                  spellCheck={false}
                  className="mt-1.5 w-full rounded-lg border border-line bg-sunken px-3 py-2 font-[family-name:var(--font-mono)] text-[12.5px] outline-none focus:border-[var(--brand)]"
                />
              </details>
            </div>

            {hintsShown > 0 && (
              <div className="mx-3 mb-3 rounded-lg border border-accent-500/30 bg-accent-soft px-3.5 py-2.5">
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent-soft-fg">
                  <Lightbulb className="size-3" />
                  Hints
                </p>
                <ol className="space-y-1">
                  {exercise.hints.slice(0, hintsShown).map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2 text-[13px] leading-snug text-accent-soft-fg"
                    >
                      <span className="opacity-50">{i + 1}.</span>
                      <span>
                        <Inline text={h} />
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            )}

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

            {py.error && !report && (
              <div className="px-3 pb-3">
                <ErrorPanel error={py.error} />
              </div>
            )}

            {report && <ReportPanel report={report} />}

            <div className="border-t border-line px-3 py-2.5">
              {showSolution ? (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
                    One correct solution
                  </p>
                  <PyEditor value={exercise.solution} readOnly minHeight="60px" />
                </div>
              ) : (
                <button
                  onClick={() => setShowSolution(true)}
                  disabled={!attempted}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted transition-colors hover:text-ink disabled:opacity-45"
                >
                  {attempted ? <Eye className="size-3.5" /> : <Lock className="size-3.5" />}
                  {attempted
                    ? "Show a solution"
                    : "Solution unlocks after you check an attempt"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportPanel({ report }: { report: GradeReport }) {
  return (
    <div className="px-3 pb-3">
      <div
        className={cn(
          "overflow-hidden rounded-lg border",
          report.passed ? "border-success-500/40 bg-success-soft" : "border-line bg-sunken",
        )}
      >
        <div className="flex items-center gap-2 px-3.5 py-2.5">
          {report.passed ? (
            <CheckCircle2 className="size-4 shrink-0 text-success-500" />
          ) : (
            <XCircle className="size-4 shrink-0 text-danger-500" />
          )}
          <p
            className={cn(
              "text-[13.5px] font-semibold",
              report.passed ? "text-success-soft-fg" : "text-ink",
            )}
          >
            {report.passed
              ? "All tests passed"
              : `${report.passedCount} of ${report.total} tests passed`}
          </p>
        </div>

        <ul className="divide-y divide-[var(--border)] border-t border-line">
          {report.results.map((r, i) => (
            <li key={i} className="px-3.5 py-2">
              <div className="flex items-start gap-2">
                {r.passed ? (
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success-500" />
                ) : (
                  <XCircle className="mt-0.5 size-3.5 shrink-0 text-danger-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">
                    {r.name}
                    {r.hidden && (
                      <span className="ml-1.5 rounded bg-sunken px-1.5 py-0.5 text-[10px] font-normal text-subtle">
                        hidden
                      </span>
                    )}
                  </p>
                  {r.message && (
                    <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
                      <Inline text={r.message} />
                    </p>
                  )}
                  {!r.passed && r.expected !== undefined && (
                    <div className="mt-1.5 grid gap-1 sm:grid-cols-2">
                      <Compare label="Expected" value={r.expected} tone="ok" />
                      <Compare label="Your output" value={r.actual ?? ""} tone="bad" />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {report.error && <ErrorPanel error={report.error} className="mt-2" />}
    </div>
  );
}

function Compare({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "bad";
}) {
  return (
    <div>
      <p className="mb-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-subtle">
        {label}
      </p>
      <pre
        className={cn(
          "scrollbar-slim max-h-24 overflow-auto rounded-md px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed",
          tone === "ok"
            ? "bg-success-soft text-success-soft-fg"
            : "bg-danger-soft text-danger-soft-fg",
        )}
      >
        {value || "(nothing)"}
      </pre>
    </div>
  );
}
