/* ============================================================================
 * Content model.
 *
 * Everything a student sees — lessons, checks, labs, exams — is data described
 * here. One source of truth means the syllabus coverage map, the dashboard, the
 * revision deck and the exam generator all stay in sync automatically.
 * ==========================================================================*/

/* ── inline knowledge checks & exam questions ────────────────────────────── */

export interface MCQ {
  id: string;
  q: string;
  /** Optional code shown above the options (e.g. "what does this print?"). */
  code?: string;
  options: string[];
  /** Index of the correct option, or indices when `multi` is set. */
  answer: number | number[];
  multi?: boolean;
  explain: string;
  difficulty?: 1 | 2 | 3;
  /** Competency level this question assesses, e.g. "9.8". */
  level?: string;
}

export interface StructuredQuestion {
  id: string;
  level: string;
  marks: number;
  prompt: string;
  code?: string;
  /** Bullet points a marker would look for. */
  rubric: string[];
  modelAnswer: string;
}

/* ── coding labs ─────────────────────────────────────────────────────────── */

export type TestCase =
  | {
      kind: "io";
      name: string;
      stdin?: string[];
      expect: string;
      /** How strictly the printed output must match. Default "loose". */
      match?: "exact" | "loose" | "contains" | "numeric" | "regex";
      hidden?: boolean;
    }
  | {
      kind: "expr";
      name: string;
      /** Extra Python appended before evaluating (e.g. build a list). */
      setup?: string;
      expr: string;
      /** Expected `repr()` of the expression's value. */
      expect: string;
      hidden?: boolean;
    }
  | {
      kind: "source";
      name: string;
      mustUse?: string[];
      mustNotUse?: string[];
      hidden?: boolean;
    };

export interface Exercise {
  id: string;
  title: string;
  /** Markdown-ish problem statement. */
  brief: string;
  level: string;
  difficulty: 1 | 2 | 3;
  xp: number;
  starter: string;
  tests: TestCase[];
  hints: string[];
  solution: string;
  /** Concept tags used by the practice filter. */
  tags: string[];
  /** Files placed in the virtual working directory before the code runs. */
  files?: { path: string; content: string }[];
}

/* ── flow charts ─────────────────────────────────────────────────────────── */

export type FlowShape =
  | "terminal"
  | "process"
  | "io"
  | "decision"
  | "connector"
  | "subroutine";

export interface FlowNode {
  id: string;
  shape: FlowShape;
  text: string;
  /** Next node for a plain step, or the YES branch of a decision. */
  next?: string;
  /** NO branch of a decision. */
  no?: string;
  /** Label drawn on the outgoing YES/next edge. */
  edgeLabel?: string;
  noLabel?: string;
}

export interface TreeNode {
  label: string;
  note?: string;
  children?: TreeNode[];
}

/* ── lesson blocks ───────────────────────────────────────────────────────── */

export type WidgetId =
  | "problem-solving-cycle"
  | "structure-chart-builder"
  | "flowchart-builder"
  | "trace-table"
  | "paradigm-explorer"
  | "translator-lab"
  | "ide-tour"
  | "datatype-inspector"
  | "operator-precedence"
  | "bitwise-lab"
  | "control-flow-visualiser"
  | "loop-visualiser"
  | "scope-visualiser"
  | "data-structure-lab"
  | "file-lab"
  | "sql-lab"
  | "search-visualiser"
  | "sort-visualiser"
  | "generation-timeline";

export type Block =
  | { kind: "text"; md: string }
  | { kind: "heading"; text: string }
  | {
      kind: "callout";
      tone: "note" | "tip" | "warn" | "exam" | "key" | "mistake";
      title?: string;
      md: string;
    }
  | {
      kind: "code";
      code: string;
      lang?: "python" | "sql" | "text" | "pseudo";
      /** Show a Run button wired to the real Python runtime. */
      runnable?: boolean;
      stdin?: string[];
      caption?: string;
      /** Expected output shown as a static "Output" strip when not runnable. */
      output?: string;
      files?: { path: string; content: string }[];
    }
  | { kind: "table"; headers: string[]; rows: string[][]; caption?: string }
  | {
      kind: "compare";
      title?: string;
      left: { title: string; items: string[] };
      right: { title: string; items: string[] };
    }
  | { kind: "steps"; title?: string; steps: { title: string; md: string }[] }
  | { kind: "terms"; title?: string; terms: { term: string; def: string }[] }
  | { kind: "flowchart"; title?: string; nodes: FlowNode[]; caption?: string }
  | { kind: "structure"; title?: string; tree: TreeNode; caption?: string }
  | { kind: "widget"; id: WidgetId; props?: Record<string, unknown> }
  | { kind: "check"; question: MCQ }
  | { kind: "exercise"; exerciseId: string }
  | { kind: "trace"; code: string; caption?: string; stdin?: string[] }
  | {
      kind: "syntax";
      title: string;
      /** Each part is one coloured chunk of the syntax diagram. */
      parts: { text: string; label: string; tone?: "keyword" | "name" | "value" | "punct" }[];
    };

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  /** Learning outcomes from the syllabus that this lesson delivers. */
  outcomes: string[];
  blocks: Block[];
}

export interface Module {
  /** Competency level id, e.g. "9.7". */
  id: string;
  slug: string;
  title: string;
  tagline: string;
  /** Lucide icon name. */
  icon: string;
  /** Periods allocated by the syllabus. */
  periods: number;
  /** Syllabus "Learning outcomes" verbatim. */
  outcomes: string[];
  /** Syllabus "Contents" verbatim. */
  contents: string[];
  lessons: Lesson[];
  quiz: MCQ[];
  exercises: Exercise[];
  structured?: StructuredQuestion[];
}

/* ── flashcards ──────────────────────────────────────────────────────────── */

export interface Flashcard {
  id: string;
  level: string;
  front: string;
  back: string;
}

/* ── badges ──────────────────────────────────────────────────────────────── */

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Evaluated against progress state. */
  test: (s: BadgeContext) => boolean;
}

export interface BadgeContext {
  lessonsDone: number;
  exercisesDone: number;
  modulesMastered: number;
  quizzesPassed: number;
  streak: number;
  xp: number;
  perfectQuizzes: number;
  examsPassed: number;
  tracesDone: number;
}
