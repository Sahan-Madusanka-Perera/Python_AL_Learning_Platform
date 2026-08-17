import type { Exercise, Lesson, MCQ, Module } from "../types";
import { m01 } from "./m01";
import { m02 } from "./m02";
import { m03 } from "./m03";
import { m04 } from "./m04";
import { m05 } from "./m05";
import { m06 } from "./m06";
import { m07 } from "./m07";
import { m08 } from "./m08";
import { m09 } from "./m09";
import { m10 } from "./m10";
import { m11 } from "./m11";
import { m12 } from "./m12";
import { m13 } from "./m13";
import { m14 } from "./m14";

export const MODULES: Module[] = [
  m01,
  m02,
  m03,
  m04,
  m05,
  m06,
  m07,
  m08,
  m09,
  m10,
  m11,
  m12,
  m13,
  m14,
];

/** The 13 examinable competency levels, excluding the bonus module. */
export const SYLLABUS_MODULES = MODULES.filter((m) => m.id !== "9+");

export const ALL_LESSONS: (Lesson & { moduleId: string; moduleSlug: string; moduleTitle: string })[] =
  MODULES.flatMap((m) =>
    m.lessons.map((l) => ({
      ...l,
      moduleId: m.id,
      moduleSlug: m.slug,
      moduleTitle: m.title,
    })),
  );

export const ALL_EXERCISES: Exercise[] = MODULES.flatMap((m) => m.exercises);

/*
 * Module slugs and lesson ids are used verbatim as URL path segments, so a
 * character the router will not round-trip (a `+` becomes a space) produces a
 * lesson that builds happily and then 404s. Fail the build instead: this is
 * cheaper to notice here than in the browser.
 */
const URL_SAFE = /^[A-Za-z0-9._-]+$/;
for (const m of MODULES) {
  if (!URL_SAFE.test(m.slug)) {
    throw new Error(`Module slug "${m.slug}" is not URL safe: it must match ${URL_SAFE}`);
  }
  for (const l of m.lessons) {
    if (!URL_SAFE.test(l.id)) {
      throw new Error(
        `Lesson id "${l.id}" (module ${m.id}) is not URL safe: it must match ${URL_SAFE}. ` +
          `Lesson ids become URL path segments.`,
      );
    }
  }
}

/** Every question in the app: module quizzes plus the inline lesson checks. */
export const ALL_QUESTIONS: MCQ[] = MODULES.flatMap((m) => [
  ...m.quiz,
  ...m.lessons.flatMap((l) =>
    l.blocks.filter((b) => b.kind === "check").map((b) => (b as { question: MCQ }).question),
  ),
]);

export const TOTAL_LESSONS = ALL_LESSONS.length;
export const TOTAL_EXERCISES = ALL_EXERCISES.length;
export const TOTAL_PERIODS = SYLLABUS_MODULES.reduce((n, m) => n + m.periods, 0);

export function getModule(slug: string) {
  return MODULES.find((m) => m.slug === slug);
}

export function getModuleById(id: string) {
  return MODULES.find((m) => m.id === id);
}

export function getLesson(moduleSlug: string, lessonId: string) {
  const mod = getModule(moduleSlug);
  return mod?.lessons.find((l) => l.id === lessonId);
}

export function getExercise(id: string) {
  return ALL_EXERCISES.find((e) => e.id === id);
}

/** Ordered walk through every lesson so "next" can cross module boundaries. */
export function lessonNeighbours(moduleSlug: string, lessonId: string) {
  const index = ALL_LESSONS.findIndex(
    (l) => l.moduleSlug === moduleSlug && l.id === lessonId,
  );
  return {
    prev: index > 0 ? ALL_LESSONS[index - 1] : null,
    next: index >= 0 && index < ALL_LESSONS.length - 1 ? ALL_LESSONS[index + 1] : null,
    index,
  };
}

/** Everything the command palette can jump to. */
export interface SearchEntry {
  kind: "module" | "lesson" | "exercise" | "tool";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}

export const SEARCH_INDEX: SearchEntry[] = [
  ...MODULES.map<SearchEntry>((m) => ({
    kind: "module",
    title: `${m.id} · ${m.title}`,
    subtitle: m.tagline,
    href: `/learn/${m.slug}`,
    keywords: `${m.id} ${m.title} ${m.tagline} ${m.contents.join(" ")}`.toLowerCase(),
  })),
  ...ALL_LESSONS.map<SearchEntry>((l) => ({
    kind: "lesson",
    title: l.title,
    subtitle: `${l.moduleId} · ${l.summary}`,
    href: `/learn/${l.moduleSlug}/${l.id}`,
    keywords: `${l.title} ${l.summary} ${l.moduleTitle} ${l.outcomes.join(" ")}`.toLowerCase(),
  })),
  ...ALL_EXERCISES.map<SearchEntry>((e) => ({
    kind: "exercise",
    title: e.title,
    subtitle: `Lab · ${e.level} · ${e.tags.join(", ")}`,
    href: `/practice#${e.id}`,
    keywords: `${e.title} ${e.tags.join(" ")} ${e.level} exercise lab practice`.toLowerCase(),
  })),
];
