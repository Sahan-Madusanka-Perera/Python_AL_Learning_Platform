"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Ruler,
  ListOrdered,
  Hammer,
  ArrowRight,
  Play,
  FileCode,
  Binary,
  Cpu,
  Bug,
  Save,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Shell = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="my-5 overflow-hidden rounded-xl border border-line bg-surface">
    <header className="border-b border-line bg-sunken px-4 py-2.5">
      <p className="text-[13px] font-semibold">{title}</p>
      <p className="text-[11.5px] text-subtle">{subtitle}</p>
    </header>
    <div className="p-4">{children}</div>
  </div>
);

/* ── problem-solving cycle ───────────────────────────────────────────────── */

const CYCLE = [
  {
    icon: Search,
    title: "Understand the problem",
    body: "Read it until you can explain it in your own words. What are you given? What must you produce? Solve one example by hand: if you cannot, you do not understand it yet.",
    ask: "Can I solve one case on paper?",
  },
  {
    icon: Ruler,
    title: "Define the problem & boundaries",
    body: "Write down what is inside the solution and what is outside it. The boundary stops the work growing forever.",
    ask: "What am I deliberately NOT doing?",
  },
  {
    icon: ListOrdered,
    title: "Plan the solution",
    body: "Break it into parts and write the steps as an algorithm: a flow chart or pseudocode. This is where the real thinking happens.",
    ask: "What are the steps, in order?",
  },
  {
    icon: Hammer,
    title: "Implement",
    body: "Translate the plan into code, run it, and test it: including the boundary values. Wrong results send you back around the cycle.",
    ask: "Does it work for the tricky cases too?",
  },
];

export function ProblemSolvingCycle() {
  const [active, setActive] = useState(0);
  const Icon = CYCLE[active].icon;

  return (
    <Shell
      title="The problem-solving cycle"
      subtitle="Tap each stage: notice that stage 4 leads back to stage 1"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {CYCLE.map((stage, i) => (
          <div key={stage.title} className="flex items-center gap-1.5">
            <button
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                i === active
                  ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                  : "border-line bg-sunken text-muted hover:border-line-strong",
              )}
            >
              <span className="grid size-4 place-items-center rounded-full bg-[var(--brand)] text-[9px] font-bold text-[var(--brand-fg)]">
                {i + 1}
              </span>
              <span className="hidden sm:inline">{stage.title}</span>
              <span className="sm:hidden">{stage.title.split(" ")[0]}</span>
            </button>
            <ArrowRight
              className={cn(
                "size-3 shrink-0 text-subtle",
                i === CYCLE.length - 1 && "rotate-180 opacity-40",
              )}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="mt-4 rounded-lg border border-line bg-sunken p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-[var(--brand)]">
              <Icon className="size-4.5" />
            </span>
            <div>
              <p className="text-[14px] font-semibold">{CYCLE[active].title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{CYCLE[active].body}</p>
              <p className="mt-2 rounded-md bg-accent-soft px-2.5 py-1.5 text-[12.5px] font-medium text-accent-soft-fg">
                Ask yourself: {CYCLE[active].ask}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

/* ── generations timeline ────────────────────────────────────────────────── */

const GENERATIONS = [
  { gen: "1GL", name: "Machine language", sample: "10110000 01100001", note: "Binary only. Runs directly on the hardware: no translation needed. Impossible for humans to write reliably.", era: "1940s" },
  { gen: "2GL", name: "Assembly language", sample: "MOV AL, 61h", note: "Mnemonics replace binary patterns. Needs an assembler. Still tied to one specific processor.", era: "1950s" },
  { gen: "3GL", name: "High-level languages", sample: 'print("Hello")', note: "English-like and machine independent. Needs a compiler or interpreter. C, Pascal, Java, Python.", era: "1957 onwards" },
  { gen: "4GL", name: "Very high-level", sample: "SELECT name FROM student;", note: "You state WHAT you want, not the steps. SQL and report generators.", era: "1970s" },
  { gen: "5GL", name: "Constraint / AI", sample: "grandparent(X,Y) :- parent(X,Z), parent(Z,Y).", note: "Describe the problem and its constraints; the system finds the solution. Prolog.", era: "1980s" },
];

export function GenerationTimeline() {
  const [active, setActive] = useState(2);
  const g = GENERATIONS[active];

  return (
    <Shell
      title="Generations of programming languages"
      subtitle="Higher generation = easier for humans, more translation needed"
    >
      <div className="relative">
        <div className="absolute inset-x-0 top-[15px] h-0.5 bg-[var(--border)]" />
        <div className="relative flex justify-between">
          {GENERATIONS.map((gen, i) => (
            <button
              key={gen.gen}
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full border-2 text-[11px] font-bold transition-colors",
                  i === active
                    ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-fg)]"
                    : "border-line-strong bg-surface text-muted",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  i === active ? "text-[var(--brand)]" : "text-subtle",
                )}
              >
                {gen.gen}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="mt-5 rounded-lg border border-line bg-sunken p-3.5"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[14px] font-semibold">{g.name}</p>
            <span className="shrink-0 text-[11px] text-subtle">{g.era}</span>
          </div>
          <pre className="scrollbar-slim mt-2 overflow-x-auto rounded-md bg-[var(--bg-code)] px-3 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[#d7dbf0]">
            {g.sample}
          </pre>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{g.note}</p>
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}

/* ── paradigm explorer ───────────────────────────────────────────────────── */

const PARADIGMS = [
  {
    id: "procedural",
    family: "Imperative",
    name: "Procedural",
    example: "C",
    idea: "Organise the program into procedures that run in sequence. You specify every step.",
    code: "total = 0\nfor m in marks:\n    total = total + m\nprint(total)",
  },
  {
    id: "oop",
    family: "Imperative",
    name: "Object oriented",
    example: "Java, C++",
    idea: "Bundle data and the operations on it into objects. A class is the blueprint; an object is one thing built from it.",
    code: 'class Student:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return "Hi " + self.name',
  },
  {
    id: "parallel",
    family: "Imperative",
    name: "Parallel processing",
    example: "Java",
    idea: "Parts of the program run at the same time on different processors.",
    code: "# two tasks running side by side\nthread1.start()\nthread2.start()",
  },
  {
    id: "logic",
    family: "Declarative",
    name: "Logic",
    example: "Prolog",
    idea: "State facts and rules. Ask a question and the system works out the answer.",
    code: "parent(ravi, mala).\nparent(mala, nimal).\ngrandparent(X, Y) :- parent(X, Z), parent(Z, Y).",
  },
  {
    id: "functional",
    family: "Declarative",
    name: "Functional / data flow",
    example: "Lisp",
    idea: "Everything is a function applied to values. No changing state, no fixed sequence.",
    code: "(defun total (marks)\n  (reduce #'+ marks))",
  },
  {
    id: "database",
    family: "Declarative",
    name: "Database",
    example: "SQL",
    idea: "Describe the data you want. The database decides how to fetch it.",
    code: "SELECT SUM(marks)\nFROM student\nWHERE grade = 'A';",
  },
];

export function ParadigmExplorer() {
  const [active, setActive] = useState("procedural");
  const p = PARADIGMS.find((x) => x.id === active)!;

  return (
    <Shell title="Paradigm explorer" subtitle="The same idea expressed six different ways">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,180px)_1fr]">
        <div className="space-y-3">
          {(["Imperative", "Declarative"] as const).map((family) => (
            <div key={family}>
              <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-subtle">
                {family}
              </p>
              <div className="space-y-1">
                {PARADIGMS.filter((x) => x.family === family).map((x) => (
                  <button
                    key={x.id}
                    onClick={() => setActive(x.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                      active === x.id
                        ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                        : "border-line bg-sunken text-muted hover:border-line-strong",
                    )}
                  >
                    <span className="font-medium">{x.name}</span>
                    <span className="shrink-0 text-[10.5px] opacity-70">{x.example}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="rounded-lg border border-line bg-sunken p-3"
          >
            <p className="text-[13.5px] font-semibold">
              {p.name}
              <span className="ml-2 rounded bg-brand-soft px-1.5 py-0.5 text-[10.5px] font-medium text-brand-soft-fg">
                {p.example}
              </span>
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{p.idea}</p>
            <pre className="scrollbar-slim mt-2.5 overflow-x-auto rounded-md bg-[var(--bg-code)] px-3 py-2 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-[#d7dbf0]">
              {p.code}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>
    </Shell>
  );
}

/* ── translator lab ──────────────────────────────────────────────────────── */

const SOURCE_LINES = [
  'print("Line 1")',
  'print("Line 2")',
  "x = 10 / 0",
  'print("Line 4")',
];

export function TranslatorLab() {
  const [mode, setMode] = useState<"compiler" | "interpreter">("interpreter");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const play = () => {
    setRunning(true);
    setStep(-1);
    let i = 0;
    const id = setInterval(() => {
      setStep(i);
      i++;
      if (i > SOURCE_LINES.length) {
        clearInterval(id);
        setRunning(false);
      }
    }, 700);
  };

  const failLine = 2;
  const compilerBlocked = mode === "compiler";

  return (
    <Shell
      title="Compiler vs interpreter"
      subtitle="The same program, translated two different ways"
    >
      <div className="mb-3 flex gap-1 rounded-lg bg-sunken p-1">
        {(["interpreter", "compiler"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setStep(-1);
            }}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-[12.5px] font-medium capitalize transition-colors",
              mode === m ? "bg-surface text-[var(--brand)] shadow-sm" : "text-subtle",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
            <FileCode className="size-3" />
            Source program
          </p>
          <div className="space-y-0.5 rounded-lg border border-line bg-sunken p-2">
            {SOURCE_LINES.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "rounded px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] transition-colors",
                  mode === "interpreter" && step === i && "bg-accent-soft text-accent-soft-fg",
                  mode === "compiler" && step >= 0 && "bg-brand-soft/50",
                  i === failLine && step >= i && "ring-1 ring-danger-500",
                )}
              >
                <span className="mr-2 select-none text-subtle">{i + 1}</span>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
            <Binary className="size-3" />
            What happens
          </p>
          <div className="min-h-32 rounded-lg bg-[var(--bg-code)] px-3 py-2 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-[#d7dbf0]">
            {step < 0 && <span className="text-[#6b7194]">Press Run to see</span>}

            {mode === "interpreter" && step >= 0 && (
              <>
                {step >= 0 && <div>Line 1</div>}
                {step >= 1 && <div>Line 2</div>}
                {step >= 2 && (
                  <div className="text-[#fda4af]">
                    ZeroDivisionError on line 3: execution stops here
                  </div>
                )}
                {step >= 3 && <div className="text-[#6b7194]">line 4 never runs</div>}
              </>
            )}

            {compilerBlocked && step >= 0 && (
              <>
                <div className="text-[#7dd3fc]">Compiling whole program…</div>
                {step >= 1 && <div className="text-[#7dd3fc]">Checking every line first</div>}
                {step >= 2 && (
                  <div className="text-[#fda4af]">
                    Problem found on line 3: no object code produced
                  </div>
                )}
                {step >= 3 && (
                  <div className="text-[#6b7194]">
                    Nothing was executed. Not even line 1 printed.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={play}
        disabled={running}
        className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 text-[13px] font-medium text-[var(--brand-fg)] disabled:opacity-50"
      >
        <Play className="size-3.5 fill-current" />
        Run as {mode}
      </button>

      <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-[12.5px] leading-snug text-brand-soft-fg">
        {mode === "interpreter"
          ? "An interpreter translates and executes one line at a time, so lines 1 and 2 produce output before the error on line 3 is even noticed."
          : "A compiler translates the whole program before execution. It finds the problem first, produces no object code, and nothing runs at all."}
      </p>
    </Shell>
  );
}

/* ── IDE tour ────────────────────────────────────────────────────────────── */

const IDE_PARTS = [
  {
    id: "editor",
    icon: FileCode,
    name: "Editor",
    what: "Where you type the source code.",
    detail:
      "Provides syntax highlighting, auto-indent, line numbers and auto-completion. Its three basic operations are creating a new file, saving a file and opening a saved file. Python files must be saved with the .py extension.",
  },
  {
    id: "compiler",
    icon: Cpu,
    name: "Compiler / interpreter",
    what: "Translates your source into object code so it can run.",
    detail:
      "Reports syntax errors: mistakes in the grammar of the language: before or during execution. In IDLE you run a program with Run → Run Module, or by pressing F5.",
  },
  {
    id: "debugger",
    icon: Bug,
    name: "Debugger",
    what: "Helps you find and remove errors.",
    detail:
      "Lets you pause the program, execute one line at a time, and inspect the value of every variable while it is stopped. This is how logic errors: the ones with no error message: are located.",
  },
  {
    id: "files",
    icon: FolderOpen,
    name: "File operations",
    what: "New, Open and Save.",
    detail:
      "File → New File creates a program. File → Save stores it (remember .py). File → Open reopens a saved program. Saving before running is a habit worth building.",
  },
];

export function IdeTour() {
  const [active, setActive] = useState("editor");
  const part = IDE_PARTS.find((p) => p.id === active)!;
  const Icon = part.icon;

  return (
    <Shell title="Inside an IDE" subtitle="Three tools bundled into one program">
      <div className="flex flex-wrap gap-1.5">
        {IDE_PARTS.map((p) => {
          const PIcon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                active === p.id
                  ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                  : "border-line bg-sunken text-muted hover:border-line-strong",
              )}
            >
              <PIcon className="size-3.5" />
              {p.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="mt-3 flex items-start gap-3 rounded-lg border border-line bg-sunken p-3.5"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-[var(--brand)]">
            <Icon className="size-4.5" />
          </span>
          <div>
            <p className="text-[13.5px] font-semibold">{part.what}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{part.detail}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-subtle">
        <Save className="size-3" />
        IDLE ships with Python. VS Code, PyCharm and Eclipse with PyDev are other common IDEs.
      </p>
    </Shell>
  );
}
