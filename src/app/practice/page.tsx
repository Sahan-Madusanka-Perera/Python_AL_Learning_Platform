"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, FlaskConical, Filter, Shuffle } from "lucide-react";
import { ALL_EXERCISES, SYLLABUS_MODULES, MODULES } from "@/lib/content";
import { ExerciseCard } from "@/components/lesson/ExerciseCard";
import { useProgress } from "@/lib/store/progress";
import { ProgressBar, Segmented } from "@/components/ui/primitives";
import { cn, sample } from "@/lib/utils";

type Filterr = "all" | "todo" | "solved";

export default function PracticePage() {
  const solvedMap = useProgress((s) => s.exercises);
  const [level, setLevel] = useState<string>("all");
  const [status, setStatus] = useState<Filterr>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const solvedCount = ALL_EXERCISES.filter((e) => solvedMap[e.id]?.solved).length;

  const list = useMemo(() => {
    return ALL_EXERCISES.filter((e) => {
      if (level !== "all" && e.level !== level) return false;
      const solved = Boolean(solvedMap[e.id]?.solved);
      if (status === "todo" && solved) return false;
      if (status === "solved" && !solved) return false;
      return true;
    });
  }, [level, status, solvedMap]);

  const surpriseMe = () => {
    const unsolved = ALL_EXERCISES.filter((e) => !solvedMap[e.id]?.solved);
    const pick = sample(unsolved.length ? unsolved : ALL_EXERCISES, 1)[0];
    if (pick) {
      setLevel("all");
      setStatus("all");
      setOpenId(pick.id);
      setTimeout(
        () => document.getElementById(pick.id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60,
      );
    }
  };

  const levels = ["all", ...MODULES.filter((m) => m.exercises.length).map((m) => m.id)];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight">
          Practice labs
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          Every problem is checked automatically against hidden test cases — including the boundary
          values an examiner would try.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <ProgressBar
            value={solvedCount}
            max={ALL_EXERCISES.length}
            className="flex-1"
            tone={solvedCount === ALL_EXERCISES.length ? "success" : "brand"}
          />
          <span className="shrink-0 text-[12.5px] font-medium text-muted">
            {solvedCount}/{ALL_EXERCISES.length} solved
          </span>
        </div>
      </header>

      <div className="mb-4 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            value={status}
            onChange={setStatus}
            size="sm"
            options={[
              { value: "all", label: "All" },
              { value: "todo", label: "To do" },
              { value: "solved", label: "Solved" },
            ]}
          />
          <button
            onClick={surpriseMe}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong px-2.5 text-[12.5px] font-medium transition-colors hover:bg-hover"
          >
            <Shuffle className="size-3.5" />
            Surprise me
          </button>
        </div>

        <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-1">
          <Filter className="mt-1.5 size-3.5 shrink-0 text-subtle" />
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "shrink-0 rounded-pill border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[12px] font-medium transition-colors",
                level === l
                  ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                  : "border-line bg-sunken text-muted hover:border-line-strong",
              )}
            >
              {l === "all" ? "All levels" : l}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center">
          <CheckCircle2 className="size-8 text-success-500" />
          <p className="text-[15px] font-semibold">Nothing left here</p>
          <p className="max-w-sm text-[13px] text-muted">
            {status === "todo"
              ? "You have solved every lab matching this filter."
              : "No labs match this filter yet."}
          </p>
        </div>
      ) : (
        list.map((ex, i) => (
          <motion.div
            key={ex.id}
            id={ex.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.25) }}
          >
            <ExerciseCard exercise={ex} defaultOpen={openId === ex.id} />
          </motion.div>
        ))
      )}

      <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-subtle">
        <FlaskConical className="size-3.5" />
        {SYLLABUS_MODULES.filter((m) => m.exercises.length).length} of the 13 competency levels have
        practical labs
      </p>
    </div>
  );
}
