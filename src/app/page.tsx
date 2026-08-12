"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Flame,
  Play,
  Sparkles,
  Terminal,
  Wrench,
  Layers,
  FileText,
  Trophy,
  Zap,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import { SYLLABUS_MODULES, TOTAL_LESSONS, TOTAL_EXERCISES, TOTAL_PERIODS } from "@/lib/content";
import { useOverallProgress, useNextLesson, useModuleProgress } from "@/lib/store/derive";
import { useProgress, levelFromXp } from "@/lib/store/progress";
import { ProgressRing, ProgressBar, Chip } from "@/components/ui/primitives";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { levelLabel, cn } from "@/lib/utils";

export default function HomePage() {
  const overall = useOverallProgress();
  const next = useNextLesson();
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const hydrated = useProgress((s) => s.hydrated);
  const { level, into, need } = levelFromXp(xp);

  const started = overall.lessonsDone > 0 || overall.exercisesDone > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      {/* ── hero ───────────────────────────────────────────────────────── */}
      <section className="relative -mx-4 mb-8 overflow-hidden px-4 pb-8 pt-10 sm:-mx-6 sm:px-6 sm:pt-14">
        <div className="aurora" aria-hidden />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Chip tone="brand" icon={<Sparkles className="size-3" />}>
              G.C.E. A/L ICT · Competency 9
            </Chip>

            <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-[30px] font-bold leading-[1.15] sm:text-[40px]">
              Everything in Competency 9, and a{" "}
              <span className="text-emphasis">real Python</span> to run it in.
            </h1>

            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              All 13 competency levels — algorithms, flow charts, control structures, functions,
              data structures, files, databases, searching and sorting. Every example runs on this
              page. No installing anything, on any phone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mt-6 flex flex-wrap items-center gap-2.5"
          >
            <Link
              href={next ? `/learn/${next.moduleSlug}/${next.id}` : "/learn"}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-[14px] font-semibold text-[var(--brand-fg)] shadow-md transition-transform active:scale-[0.98]"
            >
              <Play className="size-4 fill-current" />
              {started ? "Continue learning" : "Start Competency 9"}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-[14px] font-medium transition-colors hover:bg-hover"
            >
              <Terminal className="size-4" />
              Open the playground
            </Link>
          </motion.div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-subtle">
            <span>{SYLLABUS_MODULES.length} competency levels</span>
            <span>{TOTAL_LESSONS} lessons</span>
            <span>{TOTAL_EXERCISES} auto-graded labs</span>
            <span>{TOTAL_PERIODS} syllabus periods covered</span>
          </div>
        </div>
      </section>

      {/* ── your progress ──────────────────────────────────────────────── */}
      {hydrated && started && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-3 sm:grid-cols-3"
        >
          <div className="card flex items-center gap-3.5 p-4">
            <ProgressRing value={overall.percent} size={54}>
              <span className="text-[13px] font-bold tabular-nums">{overall.percent}%</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">Course progress</p>
              <p className="text-[12px] text-muted">
                {overall.lessonsDone}/{overall.lessonsTotal} lessons ·{" "}
                {overall.exercisesDone}/{overall.exercisesTotal} labs
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-3.5 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft">
              <Flame className="size-5 text-accent-500" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">
                {streak} day{streak === 1 ? "" : "s"} in a row
              </p>
              <p className="text-[12px] text-muted">
                {streak === 0
                  ? "Do one lesson today to start a streak"
                  : "Come back tomorrow to keep it"}
              </p>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[13px] font-semibold">
                Level {level}
                <span className="ml-1.5 font-normal text-subtle">{levelLabel(level)}</span>
              </p>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-accent-soft-fg">
                <Zap className="size-3" />
                {xp} XP
              </span>
            </div>
            <ProgressBar value={into} max={need} className="mt-2.5" />
            <p className="mt-1.5 text-[11.5px] text-subtle">
              {need - into} XP to level {level + 1}
            </p>
          </div>
        </motion.section>
      )}

      {/* ── continue ───────────────────────────────────────────────────── */}
      {hydrated && next && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            href={`/learn/${next.moduleSlug}/${next.id}`}
            className="card group flex items-center gap-4 p-4 transition-shadow hover:shadow-md"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-[var(--brand)]">
              <BookOpen className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
                {started ? "Up next" : "Start here"} · {next.moduleId}
              </p>
              <p className="truncate text-[15px] font-semibold">{next.title}</p>
              <p className="truncate text-[12.5px] text-muted">{next.summary}</p>
            </div>
            <ArrowRight className="size-5 shrink-0 text-subtle transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.section>
      )}

      {/* ── the syllabus map ───────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-[19px] font-semibold">
            The syllabus, level by level
          </h2>
          <Link href="/learn" className="text-[13px] font-medium text-[var(--brand)]">
            See all
          </Link>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {SYLLABUS_MODULES.map((m, i) => (
            <ModuleCard key={m.id} moduleId={m.id} index={i} />
          ))}
        </div>
      </section>

      {/* ── other ways in ──────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[19px] font-semibold">
          Other ways to study
        </h2>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            href="/practice"
            icon={FlaskConical}
            title="Practice labs"
            body={`${TOTAL_EXERCISES} problems, checked automatically`}
          />
          <QuickLink
            href="/toolbox"
            icon={Wrench}
            title="Visual toolbox"
            body="Trace tables, bubble sort, bitwise and more"
          />
          <QuickLink
            href="/revise"
            icon={Layers}
            title="Revision cards"
            body={`${overall.dueCards} card${overall.dueCards === 1 ? "" : "s"} due today`}
          />
          <QuickLink
            href="/exam"
            icon={FileText}
            title="Exam room"
            body="Timed papers with structured questions"
          />
        </div>
      </section>

      {hydrated && overall.earnedBadges.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[19px] font-semibold">
            <Trophy className="size-4.5 text-accent-500" />
            Badges earned
          </h2>
          <div className="flex flex-wrap gap-2">
            {overall.earnedBadges.map((b) => (
              <span
                key={b.id}
                title={b.description}
                className="rounded-pill border border-accent-500/30 bg-accent-soft px-3 py-1.5 text-[12px] font-semibold text-accent-soft-fg"
              >
                {b.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ModuleCard({ moduleId, index }: { moduleId: string; index: number }) {
  const mod = SYLLABUS_MODULES.find((m) => m.id === moduleId)!;
  const p = useModuleProgress(moduleId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={`/learn/${mod.slug}`}
        className={cn(
          "card group flex h-full items-start gap-3 p-3.5 transition-shadow hover:shadow-md",
          p.mastered && "border-success-500/40",
        )}
      >
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            p.mastered ? "bg-success-soft text-success-500" : "bg-brand-soft text-[var(--brand)]",
          )}
        >
          <ModuleIcon name={mod.icon} className="size-4.5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-mono)] text-[11.5px] font-semibold text-subtle">
              {mod.id}
            </span>
            <span className="text-[10.5px] text-subtle">{mod.periods} periods</span>
          </div>
          <p className="truncate text-[14px] font-semibold leading-snug">{mod.title}</p>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted">{mod.tagline}</p>
          <ProgressBar
            value={p.percent}
            className="mt-2"
            tone={p.mastered ? "success" : "brand"}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  body,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="card group p-4 transition-shadow hover:shadow-md">
      <Icon className="size-5 text-[var(--brand)]" />
      <p className="mt-2.5 text-[14px] font-semibold">{title}</p>
      <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{body}</p>
    </Link>
  );
}
