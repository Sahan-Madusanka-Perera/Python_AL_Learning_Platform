"use client";

import { useMemo } from "react";
import { MODULES, SYLLABUS_MODULES, ALL_LESSONS, ALL_EXERCISES } from "../content";
import { BADGES } from "../content/badges";
import { FLASHCARDS } from "../content/flashcards";
import { useProgress } from "./progress";
import { todayKey } from "../utils";
import type { BadgeContext } from "../types";

export interface ModuleProgress {
  lessonsDone: number;
  lessonsTotal: number;
  exercisesDone: number;
  exercisesTotal: number;
  quizScore: number | null;
  quizTotal: number;
  /** 0–100. Lessons, labs and the quiz each carry a third of the weight. */
  percent: number;
  mastered: boolean;
}

/**
 * "Mastered" deliberately requires all three kinds of work: reading the
 * lessons, solving the labs, and scoring at least 80% on the quiz. Reading
 * alone should never look like competence.
 */
export function useModuleProgress(moduleId: string): ModuleProgress {
  const lessons = useProgress((s) => s.lessons);
  const exercises = useProgress((s) => s.exercises);
  const quizzes = useProgress((s) => s.quizzes);

  return useMemo(() => {
    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod) {
      return {
        lessonsDone: 0,
        lessonsTotal: 0,
        exercisesDone: 0,
        exercisesTotal: 0,
        quizScore: null,
        quizTotal: 0,
        percent: 0,
        mastered: false,
      };
    }

    const lessonsDone = mod.lessons.filter((l) => lessons[l.id]).length;
    const exercisesDone = mod.exercises.filter((e) => exercises[e.id]?.solved).length;
    const quiz = quizzes[mod.id];

    const parts: number[] = [];
    if (mod.lessons.length) parts.push(lessonsDone / mod.lessons.length);
    if (mod.exercises.length) parts.push(exercisesDone / mod.exercises.length);
    if (mod.quiz.length) parts.push(quiz ? quiz.score / quiz.total : 0);

    const percent = parts.length
      ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100)
      : 0;

    const quizOk = mod.quiz.length === 0 || (quiz ? quiz.score / quiz.total >= 0.8 : false);

    return {
      lessonsDone,
      lessonsTotal: mod.lessons.length,
      exercisesDone,
      exercisesTotal: mod.exercises.length,
      quizScore: quiz?.score ?? null,
      quizTotal: mod.quiz.length,
      percent,
      mastered:
        lessonsDone === mod.lessons.length &&
        exercisesDone === mod.exercises.length &&
        quizOk,
    };
  }, [moduleId, lessons, exercises, quizzes]);
}

/** Course-wide roll-up used by the dashboard and progress page. */
export function useOverallProgress() {
  const lessons = useProgress((s) => s.lessons);
  const exercises = useProgress((s) => s.exercises);
  const quizzes = useProgress((s) => s.quizzes);
  const exams = useProgress((s) => s.exams);
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);
  const tracesDone = useProgress((s) => s.tracesDone);
  const cards = useProgress((s) => s.cards);

  return useMemo(() => {
    const lessonsDone = ALL_LESSONS.filter((l) => lessons[l.id]).length;
    const exercisesDone = ALL_EXERCISES.filter((e) => exercises[e.id]?.solved).length;

    const perModule = SYLLABUS_MODULES.map((m) => {
      const ld = m.lessons.filter((l) => lessons[l.id]).length;
      const ed = m.exercises.filter((e) => exercises[e.id]?.solved).length;
      const q = quizzes[m.id];
      const quizOk = m.quiz.length === 0 || (q ? q.score / q.total >= 0.8 : false);
      return {
        module: m,
        mastered: ld === m.lessons.length && ed === m.exercises.length && quizOk,
      };
    });

    const modulesMastered = perModule.filter((p) => p.mastered).length;
    const quizzesPassed = Object.values(quizzes).filter((q) => q.score / q.total >= 0.8).length;
    const perfectQuizzes = Object.values(quizzes).filter((q) => q.score === q.total).length;

    const today = todayKey();
    const dueCards = FLASHCARDS.filter((c) => {
      const state = cards[c.id];
      return !state || state.due <= today;
    }).length;

    const ctx: BadgeContext = {
      lessonsDone,
      exercisesDone,
      modulesMastered,
      quizzesPassed,
      streak,
      xp,
      perfectQuizzes,
      examsPassed: exams.length,
      tracesDone,
    };

    return {
      lessonsDone,
      lessonsTotal: ALL_LESSONS.length,
      exercisesDone,
      exercisesTotal: ALL_EXERCISES.length,
      modulesMastered,
      modulesTotal: SYLLABUS_MODULES.length,
      quizzesPassed,
      perfectQuizzes,
      dueCards,
      cardsTotal: FLASHCARDS.length,
      examsTaken: exams.length,
      percent: Math.round(
        ((lessonsDone / ALL_LESSONS.length) * 0.45 +
          (exercisesDone / ALL_EXERCISES.length) * 0.35 +
          (modulesMastered / SYLLABUS_MODULES.length) * 0.2) *
          100,
      ),
      earnedBadges: BADGES.filter((b) => b.test(ctx)),
      badgeContext: ctx,
      perModule,
    };
  }, [lessons, exercises, quizzes, exams, streak, xp, tracesDone, cards]);
}

/** The next unfinished lesson, for the "continue where you left off" card. */
export function useNextLesson() {
  const lessons = useProgress((s) => s.lessons);
  return useMemo(() => ALL_LESSONS.find((l) => !lessons[l.id]) ?? null, [lessons]);
}
