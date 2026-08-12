"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, File, FolderOpen, RefreshCw, Database } from "lucide-react";
import type { FlowNode, FlowShape } from "@/lib/types";
import { FlowchartView } from "../FlowchartView";
import { StepThrough } from "../StepThrough";
import { CodeRunner } from "@/components/python/CodeRunner";
import { getRuntime, type VirtualFile } from "@/lib/python/runtime";
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

/** Row of preset buttons shared by the "pick an example" widgets. */
function PresetTabs<T extends { id: string; label: string }>({
  items,
  active,
  onChange,
}: {
  items: T[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="scrollbar-none mb-3 flex gap-1.5 overflow-x-auto">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "shrink-0 rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
            active === item.id
              ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
              : "border-line bg-sunken text-muted hover:border-line-strong",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ── control flow / loops / scope: presets driving the tracer ────────────── */

const CONTROL_EXAMPLES = [
  {
    id: "sequence",
    label: "Sequence",
    note: "Statements simply run one after another, top to bottom.",
    code: `a = 5
b = 3
total = a + b
print("Total is", total)`,
  },
  {
    id: "if",
    label: "Selection: if",
    note: "The indented line runs only when the condition is True.",
    code: `age = 20
if age >= 18:
    print("Eligible to vote")
print("Finished")`,
  },
  {
    id: "ifelse",
    label: "if-else",
    note: "Exactly one of the two branches runs — never both, never neither.",
    code: `marks = 42
if marks >= 50:
    result = "Pass"
else:
    result = "Fail"
print(result)`,
  },
  {
    id: "elif",
    label: "if-elif-else",
    note: "Python takes the FIRST condition that is true and skips all the rest.",
    code: `marks = 80
if marks >= 75:
    grade = "A"
elif marks >= 50:
    grade = "B"
elif marks >= 40:
    grade = "C"
else:
    grade = "F"
print(grade)`,
  },
  {
    id: "nested",
    label: "Nested",
    note: "An if inside another if — the inner one is only reached if the outer condition passed.",
    code: `age = 19
registered = True
if age >= 18:
    if registered:
        print("May vote today")
    else:
        print("Must register first")
else:
    print("Too young")`,
  },
];

export function ControlFlowVisualiser() {
  const [active, setActive] = useState("sequence");
  const ex = CONTROL_EXAMPLES.find((e) => e.id === active)!;

  return (
    <Shell title="Control structures in motion" subtitle="Pick a structure and step through it">
      <PresetTabs items={CONTROL_EXAMPLES} active={active} onChange={setActive} />
      <p className="mb-2 rounded-lg bg-brand-soft px-3 py-2 text-[12.5px] text-brand-soft-fg">
        {ex.note}
      </p>
      <StepThrough key={active} code={ex.code} className="my-0" />
    </Shell>
  );
}

const LOOP_EXAMPLES = [
  {
    id: "for-range",
    label: "for + range",
    note: "Iteration: the number of repetitions is known in advance. range(1, 5) stops BEFORE 5.",
    code: `total = 0
for i in range(1, 5):
    total = total + i
print(total)`,
  },
  {
    id: "for-list",
    label: "for over a list",
    note: "A for loop can walk through any sequence, not just numbers.",
    code: `marks = [65, 72, 58]
best = 0
for m in marks:
    if m > best:
        best = m
print("Highest:", best)`,
  },
  {
    id: "while",
    label: "while",
    note: "Looping: repeats while the condition stays true. Something inside MUST change the variable.",
    code: `i = 1
while i <= 4:
    print(i)
    i = i + 1
print("Done")`,
  },
  {
    id: "while-cond",
    label: "while (unknown count)",
    note: "Use while when you cannot know the number of repetitions in advance.",
    code: `total = 0
number = 1
while total < 20:
    total = total + number
    number = number + 1
print(total, number - 1)`,
  },
  {
    id: "nested",
    label: "Nested loops",
    note: "The inner loop completes ALL its passes for every single pass of the outer loop.",
    code: `count = 0
for i in range(1, 4):
    for j in range(1, 3):
        count = count + 1
print("Inner body ran", count, "times")`,
  },
  {
    id: "break",
    label: "break / continue",
    note: "break leaves the loop entirely; continue skips only the current pass.",
    code: `for i in range(1, 7):
    if i == 3:
        continue
    if i == 5:
        break
    print(i)`,
  },
];

export function LoopVisualiser() {
  const [active, setActive] = useState("for-range");
  const ex = LOOP_EXAMPLES.find((e) => e.id === active)!;

  return (
    <Shell title="Loop laboratory" subtitle="Watch the counter change on every pass">
      <PresetTabs items={LOOP_EXAMPLES} active={active} onChange={setActive} />
      <p className="mb-2 rounded-lg bg-brand-soft px-3 py-2 text-[12.5px] text-brand-soft-fg">
        {ex.note}
      </p>
      <StepThrough key={active} code={ex.code} className="my-0" />
    </Shell>
  );
}

const SCOPE_EXAMPLES = [
  {
    id: "local",
    label: "Local variable",
    note: "`result` exists only while add() is running. Watch it appear and then vanish.",
    code: `def add(a, b):
    result = a + b
    return result

x = add(3, 4)
print(x)`,
  },
  {
    id: "shadow",
    label: "Shadowing a global",
    note: "Assigning inside the function creates a NEW local. The global is untouched.",
    code: `count = 5

def change():
    count = 99

change()
print(count)`,
  },
  {
    id: "global",
    label: "Using global",
    note: "`global count` says 'I mean the one outside', so the assignment updates it.",
    code: `count = 5

def change():
    global count
    count = 99

change()
print(count)`,
  },
  {
    id: "lifetime",
    label: "Lifetime",
    note: "Each call creates a fresh local. Nothing survives between the two calls.",
    code: `def counter():
    n = 0
    n = n + 1
    return n

print(counter())
print(counter())`,
  },
  {
    id: "byref",
    label: "Value vs reference",
    note: "The number is unchanged; the list IS changed. Mutable objects are passed by reference.",
    code: `def change_num(n):
    n = n + 100

def change_list(items):
    items.append(99)

num = 5
marks = [10, 20]
change_num(num)
change_list(marks)
print(num, marks)`,
  },
];

export function ScopeVisualiser() {
  const [active, setActive] = useState("local");
  const ex = SCOPE_EXAMPLES.find((e) => e.id === active)!;

  return (
    <Shell title="Scope & lifetime" subtitle="See exactly when a variable exists">
      <PresetTabs items={SCOPE_EXAMPLES} active={active} onChange={setActive} />
      <p className="mb-2 rounded-lg bg-brand-soft px-3 py-2 text-[12.5px] text-brand-soft-fg">
        {ex.note}
      </p>
      <StepThrough key={active} code={ex.code} className="my-0" />
    </Shell>
  );
}

/* ── data structure lab ──────────────────────────────────────────────────── */

const DS_EXAMPLES = [
  {
    id: "string",
    label: "String",
    code: `text = "Information Technology"

print(len(text))
print(text[0], text[-1])
print(text[0:11])
print(text.upper())
print(text.split(" "))
print("Tech" in text)`,
  },
  {
    id: "list",
    label: "List",
    code: `mylist = ["cat", "dog", "bird"]

mylist.append("ant")
mylist.insert(1, "fish")
mylist.remove("dog")
print(mylist)
print(len(mylist), mylist[0], mylist[-1])

mylist.sort()
print("sorted:", mylist)`,
  },
  {
    id: "tuple",
    label: "Tuple",
    code: `subjects = ("ICT", "Maths", "Physics")

print(subjects[1], len(subjects))
print("ICT" in subjects)
print(subjects.index("Maths"), subjects.count("ICT"))

# Uncomment to see why tuples are called immutable:
# subjects[0] = "Biology"`,
  },
  {
    id: "dict",
    label: "Dictionary",
    code: `marks = {"ICT": 85, "Maths": 72, "Physics": 64}

print(marks["ICT"])
print(marks.get("Chemistry", "not taken"))

marks["Chemistry"] = 58
for subject, mark in marks.items():
    print(subject, "->", mark)

print(list(marks.keys()))
print(sum(marks.values()) / len(marks))`,
  },
  {
    id: "compare",
    label: "Compare all four",
    code: `s = "abc"
l = [1, 2, 3]
t = (1, 2, 3)
d = {"a": 1}

for name, value in [("string", s), ("list", l), ("tuple", t), ("dict", d)]:
    print(f"{name:8} {type(value).__name__:6} len={len(value)}  {value}")`,
  },
];

export function DataStructureLab() {
  const [active, setActive] = useState("list");
  const ex = DS_EXAMPLES.find((e) => e.id === active)!;

  return (
    <Shell title="Data structure lab" subtitle="Edit any line and run it — nothing here can break">
      <PresetTabs items={DS_EXAMPLES} active={active} onChange={setActive} />
      <CodeRunner key={active} code={ex.code} className="my-0" />
    </Shell>
  );
}

/* ── file lab ────────────────────────────────────────────────────────────── */

const FILE_STARTER = `# Everything here runs against a real file system in your browser.
f = open("notes.txt", "w")
f.write("Ravi 85\\n")
f.write("Mala 72\\n")
f.close()

f = open("notes.txt", "a")
f.write("Kumara 64\\n")
f.close()

print(open("notes.txt").read())`;

export function FileLab() {
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      setFiles(await getRuntime().listFiles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const remove = async (name: string) => {
    setFiles(await getRuntime().deleteFile(name));
    if (open === name) setOpen(null);
  };

  const current = files.find((f) => f.name === open);

  return (
    <Shell
      title="File system"
      subtitle="Files your programs create really are stored — check them here"
    >
      <CodeRunner code={FILE_STARTER} className="my-0 mb-3" />

      <div className="rounded-lg border border-line">
        <header className="flex items-center gap-2 border-b border-line bg-sunken px-3 py-2">
          <FolderOpen className="size-3.5 text-subtle" />
          <span className="flex-1 text-[12px] font-semibold">
            /home/student{" "}
            <span className="font-normal text-subtle">
              ({files.length} file{files.length === 1 ? "" : "s"})
            </span>
          </span>
          <button
            onClick={refresh}
            className="flex items-center gap-1 rounded px-1.5 py-1 text-[11.5px] text-muted transition-colors hover:bg-hover hover:text-ink"
          >
            <RefreshCw className={cn("size-3", loading && "animate-spin")} />
            Refresh
          </button>
        </header>

        {files.length === 0 ? (
          <p className="px-3 py-4 text-center text-[12.5px] text-subtle">
            No files yet. Run the program above to create one.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {files.map((f) => (
              <li key={f.name}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <File className="size-3.5 shrink-0 text-subtle" />
                  <button
                    onClick={() => setOpen(open === f.name ? null : f.name)}
                    className="min-w-0 flex-1 truncate text-left font-[family-name:var(--font-mono)] text-[12.5px] hover:text-[var(--brand)]"
                  >
                    {f.name}
                  </button>
                  <span className="shrink-0 text-[11px] tabular-nums text-subtle">
                    {f.size} B
                  </span>
                  <button
                    onClick={() => remove(f.name)}
                    aria-label={`Delete ${f.name}`}
                    className="rounded p-1 text-subtle transition-colors hover:bg-danger-soft hover:text-danger-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                {open === f.name && current && (
                  <motion.pre
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="scrollbar-slim overflow-x-auto bg-[var(--bg-code)] px-3 py-2 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-[#d7dbf0]"
                  >
                    {current.content || "(empty file)"}
                  </motion.pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Shell>
  );
}

/* ── SQL lab ─────────────────────────────────────────────────────────────── */

const SQL_SETUP = `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.execute("CREATE TABLE student (regNo TEXT, name TEXT, address TEXT, marks INTEGER)")
cur.executemany("INSERT INTO student VALUES (?, ?, ?, ?)", [
    ("r001", "Ravi",   "Colombo 5",    85),
    ("r002", "Mala",   "Anuradhapura", 72),
    ("r003", "Geetha", "Kandy",        91),
    ("r004", "Kumara", "Vavuniya",     64),
])
db.commit()
`;

const SQL_QUERIES = [
  { id: "all", label: "SELECT *", sql: "SELECT * FROM student" },
  { id: "cols", label: "Some columns", sql: "SELECT regNo, name FROM student" },
  { id: "where", label: "WHERE", sql: "SELECT * FROM student WHERE marks > 70" },
  { id: "like", label: "LIKE", sql: "SELECT * FROM student WHERE name LIKE 'K%'" },
  { id: "order", label: "ORDER BY", sql: "SELECT name, marks FROM student ORDER BY marks DESC" },
  { id: "update", label: "UPDATE", sql: "UPDATE student SET marks = 95 WHERE name = 'Ravi'" },
  { id: "delete", label: "DELETE", sql: "DELETE FROM student WHERE address = 'Kandy'" },
];

export function SqlLab() {
  const [active, setActive] = useState("all");
  const q = SQL_QUERIES.find((x) => x.id === active)!;
  const isWrite = ["update", "delete"].includes(active);

  const code = `${SQL_SETUP}
sql = "${q.sql}"
cur.execute(sql)
${
  isWrite
    ? `db.commit()          # changes need a commit
print(cur.rowcount, "row(s) affected")

cur.execute("SELECT * FROM student")`
    : ""
}
for row in cur.fetchall():
    print(row)`;

  return (
    <Shell
      title="SQL console"
      subtitle="A real database, running in your browser. The SQL is identical to MySQL."
    >
      <PresetTabs items={SQL_QUERIES} active={active} onChange={setActive} />
      <p className="mb-2 flex items-start gap-2 rounded-lg bg-brand-soft px-3 py-2 text-[12.5px] text-brand-soft-fg">
        <Database className="mt-0.5 size-3.5 shrink-0" />
        <span>
          <code className="font-[family-name:var(--font-mono)]">{q.sql}</code>
          {isWrite && " — note the commit(), without which nothing is saved."}
        </span>
      </p>
      <CodeRunner key={active} code={code} className="my-0" />
    </Shell>
  );
}

/* ── flow chart builder ──────────────────────────────────────────────────── */

const SHAPES: { value: FlowShape; label: string }[] = [
  { value: "terminal", label: "Terminal (Start/End)" },
  { value: "io", label: "Input / Output" },
  { value: "process", label: "Process" },
  { value: "decision", label: "Decision" },
  { value: "connector", label: "Connector" },
  { value: "subroutine", label: "Subroutine" },
];

const SYMBOL_DEMO: FlowNode[] = [
  { id: "a", shape: "terminal", text: "Terminal — Start / End", next: "b" },
  { id: "b", shape: "io", text: "Input / Output", next: "c" },
  { id: "c", shape: "process", text: "Process — a calculation", next: "d" },
  { id: "d", shape: "decision", text: "Decision?", next: "e", no: "f", edgeLabel: "YES", noLabel: "NO" },
  { id: "e", shape: "subroutine", text: "Subroutine", next: "g" },
  { id: "f", shape: "connector", text: "•", next: "g" },
  { id: "g", shape: "terminal", text: "End" },
];

const BUILDER_START: FlowNode[] = [
  { id: "n1", shape: "terminal", text: "Start", next: "n2" },
  { id: "n2", shape: "io", text: "Read mark", next: "n3" },
  { id: "n3", shape: "decision", text: "mark >= 50 ?", next: "n4", no: "n5", edgeLabel: "YES", noLabel: "NO" },
  { id: "n4", shape: "io", text: 'Display "Pass"', next: "n6" },
  { id: "n5", shape: "io", text: 'Display "Fail"', next: "n6" },
  { id: "n6", shape: "terminal", text: "End" },
];

export function FlowchartBuilder({ mode }: { mode?: string }) {
  const [nodes, setNodes] = useState<FlowNode[]>(BUILDER_START);
  const [text, setText] = useState("");
  const [shape, setShape] = useState<FlowShape>("process");

  if (mode === "symbols") {
    return (
      <Shell title="The six standard symbols" subtitle="Learn the shape and what it is used for">
        <FlowchartView nodes={SYMBOL_DEMO} className="my-0" />
      </Shell>
    );
  }

  const addNode = () => {
    const label = text.trim();
    if (!label) return;
    const id = `n${Date.now()}`;
    setNodes((cur) => {
      const copy = cur.map((n) => ({ ...n }));
      // Insert just before the final End terminal so the chart stays connected.
      const endIndex = copy.findIndex((n, i) => i > 0 && !n.next && !n.no);
      const end = endIndex >= 0 ? copy[endIndex] : null;
      const feeders = copy.filter((n) => n.next === end?.id || n.no === end?.id);
      const node: FlowNode =
        shape === "decision"
          ? { id, shape, text: label, next: end?.id, no: end?.id, edgeLabel: "YES", noLabel: "NO" }
          : { id, shape, text: label, next: end?.id };
      feeders.forEach((f) => {
        if (f.next === end?.id) f.next = id;
        if (f.no === end?.id) f.no = id;
      });
      const insertAt = endIndex >= 0 ? endIndex : copy.length;
      copy.splice(insertAt, 0, node);
      return copy;
    });
    setText("");
  };

  return (
    <Shell
      title="Flow chart builder"
      subtitle="Add a step and it is inserted before End — then check the shapes"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNode();
        }}
        className="mb-3 flex flex-wrap gap-2"
      >
        <select
          value={shape}
          onChange={(e) => setShape(e.target.value as FlowShape)}
          className="rounded-lg border border-line bg-surface px-2 py-1.5 text-[12.5px]"
        >
          {SHAPES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={shape === "decision" ? "e.g. age < 18 ?" : "e.g. total = total + n"}
          className="min-w-40 flex-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] outline-none focus:border-[var(--brand)]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-[var(--brand)] px-3 text-[13px] font-medium text-[var(--brand-fg)] disabled:opacity-40"
        >
          <Plus className="size-3.5" />
          Add
        </button>
        <button
          type="button"
          onClick={() => setNodes(BUILDER_START)}
          className="inline-flex h-8 items-center rounded-lg px-2.5 text-[12.5px] text-muted transition-colors hover:bg-hover hover:text-ink"
        >
          Reset
        </button>
      </form>

      <FlowchartView nodes={nodes} className="my-0" />

      <p className="mt-2 text-[11.5px] text-subtle">
        A decision you add gets both YES and NO pointing at the next step — edit the branches on
        paper to make them go different ways.
      </p>
    </Shell>
  );
}
