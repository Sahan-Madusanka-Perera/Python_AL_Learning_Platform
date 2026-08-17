"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Target,
  Clock,
  Check,
} from "lucide-react";
import { getLesson, getModule, lessonNeighbours } from "@/lib/content";
import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { useProgress } from "@/lib/store/progress";
import { toast } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function LessonView({ slug, lessonId }: { slug: string; lessonId: string }) {
  const mod = getModule(slug)!;
  const lesson = getLesson(slug, lessonId)!;
  const { prev, next, index } = lessonNeighbours(slug, lessonId);

  const done = useProgress((s) => Boolean(s.lessons[lessonId]));
  const completeLesson = useProgress((s) => s.completeLesson);
  const [justDone, setJustDone] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonId]);

  const markDone = () => {
    if (done) return;
    completeLesson(lessonId, 20);
    setJustDone(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#6366f1", "#f59e0b", "#10b981"],
      disableForReducedMotion: true,
    });
    toast({
      title: "Lesson complete",
      body: `+20 XP: ${lesson.title}`,
      tone: "success",
      icon: <CheckCircle2 className="size-4 text-success-500" />,
    });
  };

  return (
    <>
      <motion.div
        style={{ scaleX: bar }}
        className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-[var(--brand)]"
        aria-hidden
      />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link
          href={`/learn/${mod.slug}`}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
          {mod.id} · {mod.title}
        </Link>

        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-subtle">
            <span className="font-[family-name:var(--font-mono)] font-semibold">
              Lesson {index + 1}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {lesson.minutes} min
            </span>
            {done && (
              <span className="flex items-center gap-1 font-semibold text-success-500">
                <CheckCircle2 className="size-3" />
                Completed
              </span>
            )}
          </div>

          <h1 className="mt-1.5 font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight">
            {lesson.title}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{lesson.summary}</p>

          <div className="mt-4 rounded-xl border border-line bg-sunken px-4 py-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-subtle">
              <Target className="size-3" />
              By the end you can
            </p>
            <ul className="space-y-1">
              {lesson.outcomes.map((o, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-snug text-muted">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--brand)]" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <article ref={articleRef}>
          <BlockRenderer blocks={lesson.blocks} />
        </article>

        {/* ── finish ─────────────────────────────────────────────────── */}
        <div className="mt-10 border-t border-line pt-6">
          <button
            onClick={markDone}
            disabled={done}
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14.5px] font-semibold transition-all active:scale-[0.99]",
              done
                ? "cursor-default border border-success-500/40 bg-success-soft text-success-soft-fg"
                : "bg-[var(--brand)] text-[var(--brand-fg)] shadow-md",
            )}
          >
            {done ? (
              <>
                <Check className="size-4.5" />
                {justDone ? "Nice work: lesson complete" : "Lesson completed"}
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4.5" />
                Mark this lesson complete
              </>
            )}
          </button>

          <nav className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/learn/${prev.moduleSlug}/${prev.id}`}
                className="card group flex items-center gap-3 p-3.5 transition-shadow hover:shadow-md"
              >
                <ArrowLeft className="size-4 shrink-0 text-subtle transition-transform group-hover:-translate-x-1" />
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-wide text-subtle">
                    Previous
                  </span>
                  <span className="block truncate text-[13.5px] font-medium">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/learn/${next.moduleSlug}/${next.id}`}
                className="card group flex items-center gap-3 p-3.5 text-right transition-shadow hover:shadow-md"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] uppercase tracking-wide text-subtle">
                    Next {next.moduleId !== mod.id && `· ${next.moduleId}`}
                  </span>
                  <span className="block truncate text-[13.5px] font-medium">{next.title}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/exam"
                className="card group flex items-center gap-3 p-3.5 text-right transition-shadow hover:shadow-md"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] uppercase tracking-wide text-subtle">
                    That is the last lesson
                  </span>
                  <span className="block truncate text-[13.5px] font-medium">
                    Try a full exam paper
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
