"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  ListChecks,
  FlaskConical,
  BookOpen,
  Trophy,
} from "lucide-react";
import { getModule } from "@/lib/content";
import { useModuleProgress } from "@/lib/store/derive";
import { useProgress } from "@/lib/store/progress";
import { ProgressBar, Chip, Segmented } from "@/components/ui/primitives";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { ExerciseCard } from "@/components/lesson/ExerciseCard";
import { ModuleQuiz } from "@/components/lesson/ModuleQuiz";
import { cn, humanMinutes } from "@/lib/utils";

type Tab = "lessons" | "labs" | "quiz";

export function ModuleView({ slug }: { slug: string }) {
  const mod = getModule(slug)!;
  const progress = useModuleProgress(mod.id);
  const lessons = useProgress((s) => s.lessons);
  const [tab, setTab] = useState<Tab>("lessons");

  const totalMinutes = mod.lessons.reduce((n, l) => n + l.minutes, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        All competency levels
      </Link>

      <header className="mb-6">
        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-xl",
              progress.mastered
                ? "bg-success-soft text-success-500"
                : "bg-brand-soft text-[var(--brand)]",
            )}
          >
            <ModuleIcon name={mod.icon} className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-subtle">
                {mod.id}
              </span>
              {progress.mastered && (
                <Chip tone="success" icon={<Trophy className="size-3" />}>
                  Mastered
                </Chip>
              )}
            </div>
            <h1 className="mt-0.5 font-[family-name:var(--font-display)] text-[24px] font-bold leading-tight">
              {mod.title}
            </h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{mod.tagline}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ProgressBar
            value={progress.percent}
            className="flex-1"
            tone={progress.mastered ? "success" : "brand"}
            showLabel
          />
          {mod.periods > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-[12px] text-subtle">
              <Clock className="size-3" />
              {mod.periods} periods · {humanMinutes(totalMinutes)} of reading
            </span>
          )}
        </div>
      </header>

      {/* syllabus coverage — students should be able to verify nothing is missing */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="mb-2 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-subtle">
            <Target className="size-3.5" />
            Learning outcomes
          </p>
          <ul className="space-y-1.5">
            {mod.outcomes.map((o, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-muted">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--brand)]" />
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <p className="mb-2 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-subtle">
            <ListChecks className="size-3.5" />
            Syllabus contents
          </p>
          <ul className="space-y-1.5">
            {mod.contents.map((c, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-muted">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Segmented
        value={tab}
        onChange={setTab}
        className="mb-4"
        options={[
          {
            value: "lessons",
            label: (
              <>
                <BookOpen className="size-3.5" />
                Lessons ({mod.lessons.length})
              </>
            ),
          },
          {
            value: "labs",
            label: (
              <>
                <FlaskConical className="size-3.5" />
                Labs ({mod.exercises.length})
              </>
            ),
          },
          {
            value: "quiz",
            label: (
              <>
                <ListChecks className="size-3.5" />
                Quiz ({mod.quiz.length})
              </>
            ),
          },
        ]}
      />

      {tab === "lessons" && (
        <ol className="space-y-2.5">
          {mod.lessons.map((lesson, i) => {
            const done = Boolean(lessons[lesson.id]);
            return (
              <motion.li
                key={lesson.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/learn/${mod.slug}/${lesson.id}`}
                  className={cn(
                    "card group flex items-start gap-3 p-4 transition-shadow hover:shadow-md",
                    done && "border-success-500/30",
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success-500" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-subtle" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold leading-snug">{lesson.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
                      {lesson.summary}
                    </p>
                    <p className="mt-1.5 text-[11.5px] text-subtle">{lesson.minutes} min</p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      )}

      {tab === "labs" &&
        (mod.exercises.length ? (
          mod.exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} defaultOpen={false} />
          ))
        ) : (
          <p className="card p-6 text-center text-[13.5px] text-muted">
            This competency level is theory only — its marks come from written answers, so revise it
            with the quiz and the revision cards.
          </p>
        ))}

      {tab === "quiz" && <ModuleQuiz module={mod} />}
    </div>
  );
}
