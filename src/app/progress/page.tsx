"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Flame,
  Zap,
  Trophy,
  Download,
  Upload,
  Trash2,
  Lock,
  BarChart3,
  Type,
} from "lucide-react";
import { SYLLABUS_MODULES } from "@/lib/content";
import { BADGES } from "@/lib/content/badges";
import { useOverallProgress } from "@/lib/store/derive";
import { useProgress, levelFromXp } from "@/lib/store/progress";
import { ProgressBar, ProgressRing, Sheet, toast } from "@/components/ui/primitives";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { levelLabel, cn, todayKey, daysBetween } from "@/lib/utils";

export default function ProgressPage() {
  const overall = useOverallProgress();
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const bestStreak = useProgress((s) => s.bestStreak);
  const daysActive = useProgress((s) => s.daysActive);
  const fontScale = useProgress((s) => s.fontScale);
  const setFontScale = useProgress((s) => s.setFontScale);
  const exportJson = useProgress((s) => s.exportJson);
  const importJson = useProgress((s) => s.importJson);
  const reset = useProgress((s) => s.reset);

  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { level, into, need } = levelFromXp(xp);

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `competency9-progress-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Progress exported", body: "Keep this file to move to another device." });
  };

  const doImport = async (file: File) => {
    const ok = await importJson(await file.text());
    toast({
      title: ok ? "Progress restored" : "Could not read that file",
      tone: ok ? "success" : "danger",
    });
  };

  const applyFontScale = useCallback(
    (n: number) => {
      setFontScale(n);
      // Mirrored into localStorage so ThemeScript can apply it before paint.
      document.documentElement.style.fontSize = `${16 * n}px`;
      localStorage.setItem("al-font-scale", String(n));
    },
    [setFontScale],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight">
          <BarChart3 className="size-6 text-[var(--brand)]" />
          Your progress
        </h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Everything is stored on this device only. Nothing is uploaded anywhere.
        </p>
      </header>

      {/* headline stats */}
      <section className="mb-6 grid gap-3 sm:grid-cols-4">
        <div className="card flex flex-col items-center gap-2 p-4">
          <ProgressRing value={overall.percent} size={62}>
            <span className="text-[14px] font-bold tabular-nums">{overall.percent}%</span>
          </ProgressRing>
          <p className="text-[12px] font-medium text-muted">Course complete</p>
        </div>
        <Stat icon={Zap} value={xp} label={`XP · Level ${level}`} tone="brand" />
        <Stat icon={Flame} value={streak} label={`Day streak · best ${bestStreak}`} tone="accent" />
        <Stat
          icon={Trophy}
          value={overall.earnedBadges.length}
          label={`of ${BADGES.length} badges`}
          tone="success"
        />
      </section>

      <section className="card mb-6 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[13.5px] font-semibold">
            Level {level} · {levelLabel(level)}
          </p>
          <span className="text-[12px] text-subtle">
            {into}/{need} XP
          </span>
        </div>
        <ProgressBar value={into} max={need} className="mt-2.5" />
      </section>

      {/* activity heat strip */}
      <section className="card mb-6 p-4">
        <p className="mb-3 text-[13.5px] font-semibold">Last 8 weeks</p>
        <ActivityStrip days={daysActive} />
      </section>

      {/* per-module */}
      <section className="mb-6">
        <h2 className="mb-3 text-[16px] font-semibold">Competency levels</h2>
        <ul className="card divide-y divide-[var(--border)]">
          {overall.perModule.map(({ module: m, mastered }) => (
            <li key={m.id}>
                <Link
                  href={`/learn/${m.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-hover"
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg",
                      mastered
                        ? "bg-success-soft text-success-500"
                        : "bg-sunken text-subtle",
                    )}
                  >
                    <ModuleIcon name={m.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium">
                      <span className="mr-1.5 font-[family-name:var(--font-mono)] text-subtle">
                        {m.id}
                      </span>
                      {m.title}
                    </span>
                  </span>
                  <ModuleBar moduleId={m.id} />
                </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* badges */}
      <section className="mb-6">
        <h2 className="mb-3 text-[16px] font-semibold">Badges</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {BADGES.map((b) => {
            const earned = b.test(overall.badgeContext);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "card flex flex-col gap-1 p-3",
                  earned ? "border-accent-500/40 bg-accent-soft" : "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg",
                    earned ? "bg-accent-500/20 text-accent-600" : "bg-sunken text-subtle",
                  )}
                >
                  {earned ? (
                    <ModuleIcon name={b.icon} className="size-4" />
                  ) : (
                    <Lock className="size-3.5" />
                  )}
                </span>
                <p
                  className={cn(
                    "text-[12.5px] font-semibold leading-tight",
                    earned && "text-accent-soft-fg",
                  )}
                >
                  {b.name}
                </p>
                <p
                  className={cn(
                    "text-[11px] leading-tight",
                    earned ? "text-accent-soft-fg/80" : "text-subtle",
                  )}
                >
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* settings */}
      <section className="card p-4">
        <h2 className="mb-3 text-[16px] font-semibold">Settings & data</h2>

        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium">
            <Type className="size-3.5" />
            Text size
          </p>
          <div className="flex gap-1.5">
            {[
              { v: 0.9, label: "Small" },
              { v: 1, label: "Normal" },
              { v: 1.12, label: "Large" },
              { v: 1.25, label: "Largest" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => applyFontScale(o.v)}
                className={cn(
                  "flex-1 rounded-lg border px-2 py-1.5 text-[12.5px] font-medium transition-colors",
                  Math.abs(fontScale - o.v) < 0.01
                    ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                    : "border-line bg-sunken text-muted",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={doExport}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-[12.5px] font-medium transition-colors hover:bg-hover"
          >
            <Download className="size-3.5" />
            Export progress
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-[12.5px] font-medium transition-colors hover:bg-hover"
          >
            <Upload className="size-3.5" />
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-medium text-danger-500 transition-colors hover:bg-danger-soft"
          >
            <Trash2 className="size-3.5" />
            Reset everything
          </button>
        </div>
      </section>

      <Sheet open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset all progress?">
        <div className="p-5">
          <p className="text-[13.5px] leading-relaxed text-muted">
            This permanently deletes your XP, streak, completed lessons, solved labs, quiz scores
            and revision schedule from this device. It cannot be undone.
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Export your progress first if you might want it back.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setConfirmReset(false)}
              className="h-10 flex-1 rounded-xl border border-line-strong text-[13.5px] font-medium"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await reset();
                setConfirmReset(false);
                toast({ title: "Progress reset", tone: "danger" });
              }}
              className="h-10 flex-1 rounded-xl bg-danger-500 text-[13.5px] font-semibold text-white"
            >
              Delete everything
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  tone: "brand" | "accent" | "success";
}) {
  const bg = {
    brand: "bg-brand-soft text-[var(--brand)]",
    accent: "bg-accent-soft text-accent-500",
    success: "bg-success-soft text-success-500",
  }[tone];
  return (
    <div className="card flex flex-col items-center justify-center gap-1.5 p-4 text-center">
      <span className={cn("grid size-9 place-items-center rounded-lg", bg)}>
        <Icon className="size-4.5" />
      </span>
      <p className="text-[20px] font-bold tabular-nums leading-none">{value}</p>
      <p className="text-[11.5px] leading-tight text-muted">{label}</p>
    </div>
  );
}

function ModuleBar({ moduleId }: { moduleId: string }) {
  const lessons = useProgress((s) => s.lessons);
  const exercises = useProgress((s) => s.exercises);
  const quizzes = useProgress((s) => s.quizzes);
  const mod = SYLLABUS_MODULES.find((m) => m.id === moduleId)!;

  const parts: number[] = [];
  if (mod.lessons.length)
    parts.push(mod.lessons.filter((l) => lessons[l.id]).length / mod.lessons.length);
  if (mod.exercises.length)
    parts.push(mod.exercises.filter((e) => exercises[e.id]?.solved).length / mod.exercises.length);
  if (mod.quiz.length) {
    const q = quizzes[mod.id];
    parts.push(q ? q.score / q.total : 0);
  }
  const pct = parts.length
    ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100)
    : 0;

  return (
    <span className="hidden w-24 shrink-0 sm:block">
      <ProgressBar value={pct} tone={pct === 100 ? "success" : "brand"} />
    </span>
  );
}

/** Eight weeks of activity, most recent on the right. */
function ActivityStrip({ days }: { days: string[] }) {
  const today = todayKey();
  const set = new Set(days);
  const cells: { key: string; active: boolean }[] = [];

  for (let i = 55; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    cells.push({ key, active: set.has(key) });
  }

  return (
    <div className="flex flex-wrap gap-1">
      {cells.map((c) => (
        <span
          key={c.key}
          title={c.key}
          className={cn(
            "size-3.5 rounded-[3px] transition-colors",
            c.active ? "bg-[var(--brand)]" : "bg-sunken",
            c.key === today && "ring-1 ring-accent-500 ring-offset-1 ring-offset-[var(--bg-elevated)]",
          )}
        />
      ))}
      <p className="mt-2 w-full text-[11px] text-subtle">
        {days.length} active day{days.length === 1 ? "" : "s"} recorded
        {days.length > 0 &&
          ` · last studied ${
            daysBetween(days[days.length - 1], today) === 0
              ? "today"
              : `${daysBetween(days[days.length - 1], today)} day(s) ago`
          }`}
      </p>
    </div>
  );
}
