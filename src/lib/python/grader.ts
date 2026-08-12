import type { Exercise, TestCase } from "../types";
import { getRuntime, type PyError } from "./runtime";
import { explainError, type FriendlyError } from "./errors";

/* ============================================================================
 * Auto-grader.
 *
 * Each test runs the student's program in a fresh namespace, so one test can't
 * leak state into the next. Feedback names what was expected and what actually
 * happened — a bare "Wrong" teaches nothing.
 * ==========================================================================*/

export interface TestResult {
  name: string;
  passed: boolean;
  hidden: boolean;
  expected?: string;
  actual?: string;
  message?: string;
  error?: FriendlyError;
}

export interface GradeReport {
  passed: boolean;
  results: TestResult[];
  passedCount: number;
  total: number;
  /** First error encountered, for the "what went wrong" panel. */
  error?: FriendlyError;
}

/** Collapse whitespace differences students shouldn't be punished for. */
function normalise(s: string) {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter((l, i, arr) => !(l === "" && i === arr.length - 1))
    .join("\n")
    .trim();
}

function numbersIn(s: string): number[] {
  return (s.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
}

type MatchMode = NonNullable<Extract<TestCase, { kind: "io" }>["match"]>;

function compareOutput(actual: string, expect: string, mode: MatchMode | undefined) {
  switch (mode ?? "loose") {
    case "exact":
      return actual === expect;
    case "contains":
      return normalise(actual).toLowerCase().includes(normalise(expect).toLowerCase());
    case "regex":
      return new RegExp(expect, "m").test(actual);
    case "numeric": {
      const a = numbersIn(actual);
      const e = numbersIn(expect);
      return a.length === e.length && e.every((n, i) => Math.abs(n - a[i]) < 1e-6);
    }
    case "loose":
    default:
      return normalise(actual).toLowerCase() === normalise(expect).toLowerCase();
  }
}

function sourceCheck(code: string, test: Extract<TestCase, { kind: "source" }>): TestResult {
  const stripped = code
    .split("\n")
    .map((l) => l.replace(/#.*$/, ""))
    .join("\n");

  const missing = (test.mustUse ?? []).filter((t) => !stripped.includes(t));
  const banned = (test.mustNotUse ?? []).filter((t) => stripped.includes(t));

  if (missing.length) {
    return {
      name: test.name,
      passed: false,
      hidden: false,
      message: `This task must use: ${missing.map((m) => `\`${m}\``).join(", ")}`,
    };
  }
  if (banned.length) {
    return {
      name: test.name,
      passed: false,
      hidden: false,
      message: `This task must not use: ${banned.map((m) => `\`${m}\``).join(", ")}`,
    };
  }
  return { name: test.name, passed: true, hidden: false };
}

export async function gradeExercise(
  exercise: Exercise,
  code: string,
  onProgress?: (done: number, total: number) => void,
): Promise<GradeReport> {
  const rt = getRuntime();
  const results: TestResult[] = [];
  let firstError: FriendlyError | undefined;

  for (let i = 0; i < exercise.tests.length; i++) {
    const test = exercise.tests[i];
    onProgress?.(i, exercise.tests.length);

    if (test.kind === "source") {
      results.push(sourceCheck(code, test));
      continue;
    }

    if (test.kind === "io") {
      const res = await rt.run(code, {
        stdin: test.stdin,
        files: exercise.files,
        resetFs: true,
        timeoutMs: 10_000,
      });

      if (res.error) {
        const friendly = explainError(res.error as PyError);
        firstError ??= friendly;
        results.push({
          name: test.name,
          passed: false,
          hidden: Boolean(test.hidden),
          error: friendly,
          message: friendly.title,
          actual: res.output,
        });
        continue;
      }

      // `printed` excludes the echoed input lines — those are part of the
      // terminal transcript, not something the student's program produced.
      const printed = res.printed;
      const passed = compareOutput(printed, test.expect, test.match);
      results.push({
        name: test.name,
        passed,
        hidden: Boolean(test.hidden),
        expected: test.expect,
        actual: printed,
      });
      continue;
    }

    // kind === "expr"
    const source = test.setup ? `${code}\n${test.setup}` : code;
    const res = await rt.run(source, {
      files: exercise.files,
      resetFs: true,
      evalExpr: test.expr,
      timeoutMs: 10_000,
    });

    if (res.error) {
      const friendly = explainError(res.error as PyError);
      firstError ??= friendly;
      results.push({
        name: test.name,
        passed: false,
        hidden: Boolean(test.hidden),
        error: friendly,
        message: friendly.title,
      });
      continue;
    }
    if (!res.evalResult?.ok) {
      results.push({
        name: test.name,
        passed: false,
        hidden: Boolean(test.hidden),
        message: `\`${test.expr}\` could not be evaluated — is the function defined with that exact name?`,
        actual: res.evalResult?.error ?? "",
      });
      continue;
    }
    results.push({
      name: test.name,
      passed: res.evalResult.repr === test.expect,
      hidden: Boolean(test.hidden),
      expected: test.expect,
      actual: res.evalResult.repr ?? "",
    });
  }

  onProgress?.(exercise.tests.length, exercise.tests.length);
  const passedCount = results.filter((r) => r.passed).length;

  return {
    passed: passedCount === results.length && results.length > 0,
    results,
    passedCount,
    total: results.length,
    error: firstError,
  };
}

/** Runs the student's stdin against the program only — used by the Run button. */
export function splitStdin(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw.replace(/\r\n/g, "\n").split("\n");
}
