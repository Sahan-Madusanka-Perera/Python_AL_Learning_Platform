"use client";

import { create } from "zustand";
import { get as idbGet, set as idbSet } from "idb-keyval";
import { todayKey, daysBetween } from "../utils";

/* ============================================================================
 * Local-first progress.
 *
 * No account, no server, no data leaving the device. A student on a borrowed
 * phone with no email address can still keep a streak. Everything lands in
 * IndexedDB and is exportable as a JSON file so it can move between devices.
 * ==========================================================================*/

const KEY = "al-python-progress-v1";

export interface QuizScore {
  score: number;
  total: number;
  at: string;
}

export interface ExamResult {
  id: string;
  score: number;
  total: number;
  at: string;
  durationSec: number;
}

export interface ProgressState {
  hydrated: boolean;

  xp: number;
  streak: number;
  bestStreak: number;
  lastActiveDay: string | null;
  daysActive: string[];

  /** lessonId → completed */
  lessons: Record<string, boolean>;
  /** exerciseId → best attempt */
  exercises: Record<string, { solved: boolean; attempts: number; code: string }>;
  /** moduleId → best quiz score */
  quizzes: Record<string, QuizScore>;
  /** questionId → times answered correctly / wrong (drives revision) */
  answers: Record<string, { right: number; wrong: number; lastAt: string }>;
  /** flashcardId → spaced-repetition box (1..5) and next due day */
  cards: Record<string, { box: number; due: string }>;
  exams: ExamResult[];
  badges: string[];
  tracesDone: number;

  /** UI prefs */
  theme: "light" | "dark" | "system";
  fontScale: number;
  /** Scratch code kept per playground tab. */
  playground: string;
}

const initial: ProgressState = {
  hydrated: false,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActiveDay: null,
  daysActive: [],
  lessons: {},
  exercises: {},
  quizzes: {},
  answers: {},
  cards: {},
  exams: [],
  badges: [],
  tracesDone: 0,
  theme: "system",
  fontScale: 1,
  playground: "",
};

interface Actions {
  hydrate: () => Promise<void>;
  addXp: (n: number) => void;
  touchDay: () => void;
  completeLesson: (id: string, xp?: number) => void;
  recordExercise: (id: string, solved: boolean, code: string, xp?: number) => void;
  recordQuiz: (moduleId: string, score: number, total: number, xp?: number) => void;
  recordAnswer: (questionId: string, correct: boolean) => void;
  reviewCard: (cardId: string, good: boolean) => void;
  recordExam: (r: ExamResult) => void;
  recordTrace: () => void;
  awardBadge: (id: string) => boolean;
  setTheme: (t: ProgressState["theme"]) => void;
  setFontScale: (n: number) => void;
  setPlayground: (code: string) => void;
  reset: () => Promise<void>;
  exportJson: () => string;
  importJson: (json: string) => Promise<boolean>;
}

type Store = ProgressState & Actions;

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Pull just the data out of the store.
 *
 * The store also holds action functions, and IndexedDB uses structured clone,
 * which throws DataCloneError on a function. Listing the keys explicitly is
 * what makes saving work at all — and it keeps the exported JSON stable.
 */
function pickData(state: ProgressState): Omit<ProgressState, "hydrated"> {
  return {
    xp: state.xp,
    streak: state.streak,
    bestStreak: state.bestStreak,
    lastActiveDay: state.lastActiveDay,
    daysActive: state.daysActive,
    lessons: state.lessons,
    exercises: state.exercises,
    quizzes: state.quizzes,
    answers: state.answers,
    cards: state.cards,
    exams: state.exams,
    badges: state.badges,
    tracesDone: state.tracesDone,
    theme: state.theme,
    fontScale: state.fontScale,
    playground: state.playground,
  };
}

function persist(state: ProgressState) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void idbSet(KEY, pickData(state));
  }, 250);
}

/** XP needed to finish level n (grows gently so early wins come fast). */
export function xpForLevel(level: number) {
  return 120 + (level - 1) * 90;
}

export function levelFromXp(xp: number) {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, into: remaining, need: xpForLevel(level) };
}

/** Leitner intervals in days for boxes 1..5. */
const BOX_DAYS = [0, 1, 2, 4, 8, 16];

export const useProgress = create<Store>((set, get) => ({
  ...initial,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const saved = (await idbGet(KEY)) as Partial<ProgressState> | undefined;
      set({ ...initial, ...(saved ?? {}), hydrated: true });
    } catch {
      set({ hydrated: true });
    }
    get().touchDay();
  },

  addXp: (n) => {
    set((s) => {
      const next = { ...s, xp: s.xp + n };
      persist(next);
      return { xp: next.xp };
    });
  },

  /** Call on any meaningful activity — keeps the streak alive. */
  touchDay: () => {
    set((s) => {
      const today = todayKey();
      if (s.lastActiveDay === today) return s;

      let streak = 1;
      if (s.lastActiveDay) {
        const gap = daysBetween(s.lastActiveDay, today);
        streak = gap === 1 ? s.streak + 1 : gap === 0 ? s.streak : 1;
      }
      const daysActive = s.daysActive.includes(today)
        ? s.daysActive
        : [...s.daysActive, today].slice(-400);

      const next = {
        ...s,
        streak,
        bestStreak: Math.max(s.bestStreak, streak),
        lastActiveDay: today,
        daysActive,
      };
      persist(next);
      return {
        streak: next.streak,
        bestStreak: next.bestStreak,
        lastActiveDay: next.lastActiveDay,
        daysActive: next.daysActive,
      };
    });
  },

  completeLesson: (id, xp = 20) => {
    const already = get().lessons[id];
    set((s) => {
      const next = {
        ...s,
        lessons: { ...s.lessons, [id]: true },
        xp: already ? s.xp : s.xp + xp,
      };
      persist(next);
      return { lessons: next.lessons, xp: next.xp };
    });
    get().touchDay();
  },

  recordExercise: (id, solved, code, xp = 30) => {
    const prev = get().exercises[id];
    const firstSolve = solved && !prev?.solved;
    set((s) => {
      const next = {
        ...s,
        exercises: {
          ...s.exercises,
          [id]: {
            solved: solved || Boolean(prev?.solved),
            attempts: (prev?.attempts ?? 0) + 1,
            code,
          },
        },
        xp: firstSolve ? s.xp + xp : s.xp,
      };
      persist(next);
      return { exercises: next.exercises, xp: next.xp };
    });
    get().touchDay();
  },

  recordQuiz: (moduleId, score, total, xp = 25) => {
    const prev = get().quizzes[moduleId];
    const improved = !prev || score > prev.score;
    set((s) => {
      const next = {
        ...s,
        quizzes: improved
          ? { ...s.quizzes, [moduleId]: { score, total, at: new Date().toISOString() } }
          : s.quizzes,
        xp: s.xp + (improved ? xp : Math.round(xp / 4)),
      };
      persist(next);
      return { quizzes: next.quizzes, xp: next.xp };
    });
    get().touchDay();
  },

  recordAnswer: (questionId, correct) => {
    set((s) => {
      const prev = s.answers[questionId] ?? { right: 0, wrong: 0, lastAt: "" };
      const next = {
        ...s,
        answers: {
          ...s.answers,
          [questionId]: {
            right: prev.right + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
            lastAt: new Date().toISOString(),
          },
        },
      };
      persist(next);
      return { answers: next.answers };
    });
  },

  reviewCard: (cardId, good) => {
    set((s) => {
      const prev = s.cards[cardId] ?? { box: 1, due: todayKey() };
      const box = good ? Math.min(5, prev.box + 1) : 1;
      const due = new Date();
      due.setDate(due.getDate() + BOX_DAYS[box]);
      const next = {
        ...s,
        cards: { ...s.cards, [cardId]: { box, due: todayKey(due) } },
        xp: s.xp + (good ? 3 : 1),
      };
      persist(next);
      return { cards: next.cards, xp: next.xp };
    });
    get().touchDay();
  },

  recordExam: (r) => {
    set((s) => {
      const next = { ...s, exams: [...s.exams, r].slice(-50), xp: s.xp + 60 };
      persist(next);
      return { exams: next.exams, xp: next.xp };
    });
    get().touchDay();
  },

  recordTrace: () => {
    set((s) => {
      const next = { ...s, tracesDone: s.tracesDone + 1, xp: s.xp + 5 };
      persist(next);
      return { tracesDone: next.tracesDone, xp: next.xp };
    });
  },

  /** Returns true when the badge is newly earned (so the UI can celebrate). */
  awardBadge: (id) => {
    if (get().badges.includes(id)) return false;
    set((s) => {
      const next = { ...s, badges: [...s.badges, id], xp: s.xp + 40 };
      persist(next);
      return { badges: next.badges, xp: next.xp };
    });
    return true;
  },

  setTheme: (theme) => {
    set((s) => {
      const next = { ...s, theme };
      persist(next);
      return { theme };
    });
  },

  setFontScale: (fontScale) => {
    set((s) => {
      const next = { ...s, fontScale };
      persist(next);
      return { fontScale };
    });
  },

  setPlayground: (playground) => {
    set((s) => {
      const next = { ...s, playground };
      persist(next);
      return { playground };
    });
  },

  reset: async () => {
    await idbSet(KEY, undefined);
    set({ ...initial, hydrated: true });
  },

  exportJson: () => JSON.stringify(pickData(get()), null, 2),

  importJson: async (json) => {
    try {
      const parsed = JSON.parse(json) as Partial<ProgressState>;
      if (typeof parsed !== "object" || parsed === null) return false;
      const merged = { ...initial, ...parsed, hydrated: true };
      set(merged);
      await idbSet(KEY, pickData(merged));
      return true;
    } catch {
      return false;
    }
  },
}));
