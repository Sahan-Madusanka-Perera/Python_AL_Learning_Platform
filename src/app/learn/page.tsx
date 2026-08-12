"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Clock, ArrowRight, Sparkles } from "lucide-react";
import { MODULES, SYLLABUS_MODULES } from "@/lib/content";
import { useModuleProgress, useOverallProgress } from "@/lib/store/derive";
import { ProgressBar, Chip } from "@/components/ui/primitives";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  const overall = useOverallProgress();
  const bonus = MODULES.find((m) => m.id === "9+");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-7">
        <h1 className="font-[family-name:var(--font-display)] text-[27px] font-bold leading-tight">
          Competency 9
        </h1>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
          Develops algorithms to solve problems and uses the Python programming language to encode
          algorithms.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={overall.percent} className="max-w-xs flex-1" showLabel />
          <span className="text-[12.5px] text-subtle">
            {overall.modulesMastered}/{overall.modulesTotal} levels mastered
          </span>
        </div>
      </header>

      <ol className="space-y-2.5">
        {SYLLABUS_MODULES.map((m, i) => (
          <ModuleRow key={m.id} moduleId={m.id} index={i} />
        ))}
      </ol>

      {bonus && (
        <section className="mt-7">
          <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-subtle">
            <Sparkles className="size-3" />
            Bonus — beyond the examinable syllabus
          </p>
          <ModuleRow moduleId={bonus.id} index={SYLLABUS_MODULES.length} bonus />
        </section>
      )}
    </div>
  );
}

function ModuleRow({
  moduleId,
  index,
  bonus,
}: {
  moduleId: string;
  index: number;
  bonus?: boolean;
}) {
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const p = useModuleProgress(moduleId);

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.4) }}
    >
      <Link
        href={`/learn/${mod.slug}`}
        className={cn(
          "card group block p-4 transition-shadow hover:shadow-md",
          p.mastered && "border-success-500/40",
          bonus && "border-dashed",
        )}
      >
        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl",
              p.mastered
                ? "bg-success-soft text-success-500"
                : "bg-brand-soft text-[var(--brand)]",
            )}
          >
            <ModuleIcon name={mod.icon} className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold text-subtle">
                {mod.id}
              </span>
              <h2 className="text-[15.5px] font-semibold leading-tight">{mod.title}</h2>
              {p.mastered && (
                <Chip tone="success" icon={<CheckCircle2 className="size-3" />}>
                  Mastered
                </Chip>
              )}
            </div>

            <p className="mt-1 text-[13px] leading-snug text-muted">{mod.tagline}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-subtle">
              {!bonus && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {mod.periods} periods
                </span>
              )}
              <span className="flex items-center gap-1">
                {p.lessonsDone === p.lessonsTotal && p.lessonsTotal > 0 ? (
                  <CheckCircle2 className="size-3 text-success-500" />
                ) : (
                  <Circle className="size-3" />
                )}
                {p.lessonsDone}/{p.lessonsTotal} lessons
              </span>
              {p.exercisesTotal > 0 && (
                <span className="flex items-center gap-1">
                  {p.exercisesDone === p.exercisesTotal ? (
                    <CheckCircle2 className="size-3 text-success-500" />
                  ) : (
                    <Circle className="size-3" />
                  )}
                  {p.exercisesDone}/{p.exercisesTotal} labs
                </span>
              )}
              {p.quizTotal > 0 && (
                <span className="flex items-center gap-1">
                  {p.quizScore !== null ? (
                    <CheckCircle2 className="size-3 text-success-500" />
                  ) : (
                    <Circle className="size-3" />
                  )}
                  quiz {p.quizScore !== null ? `${p.quizScore}/${p.quizTotal}` : "not taken"}
                </span>
              )}
            </div>

            <ProgressBar
              value={p.percent}
              className="mt-2.5"
              tone={p.mastered ? "success" : "brand"}
            />
          </div>

          <ArrowRight className="mt-3 size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.li>
  );
}
