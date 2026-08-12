import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pct(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function plural(n: number, one: string, many = one + "s") {
  return `${n} ${n === 1 ? one : many}`;
}

/** "3 min", "1 hr 20 min" */
export function humanMinutes(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** Local calendar day key, e.g. "2026-08-13". Used for streaks. */
export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function daysBetween(a: string, b: string) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86_400_000);
}

export function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = [...arr];
  let rand: () => number;
  if (seed === undefined) {
    rand = Math.random;
  } else {
    let s = seed;
    rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: T[], n: number, seed?: number): T[] {
  return shuffle(arr, seed).slice(0, n);
}

export function groupBy<T, K extends string>(arr: T[], key: (t: T) => K) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

/** Strip a common leading indent so template literals read nicely in source. */
export function dedent(text: string) {
  const lines = text.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n");
}

/** Deterministic small hash — used for stable colours/seeds from ids. */
export function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Playful rank shown next to the numeric level. */
const LEVEL_LABELS = [
  "Beginner",
  "Learner",
  "Coder",
  "Problem Solver",
  "Algorithm Builder",
  "Debugger",
  "Data Handler",
  "Program Designer",
  "Competency Master",
];

export function levelLabel(level: number) {
  return LEVEL_LABELS[Math.min(level - 1, LEVEL_LABELS.length - 1)] ?? "Master";
}
