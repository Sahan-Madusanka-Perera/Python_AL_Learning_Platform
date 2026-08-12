"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  Play,
  Square,
  Trash2,
  FileCode,
  Download,
  Files,
  ChevronDown,
} from "lucide-react";
import { PyEditor, MobileKeyBar, insertAtCursor } from "@/components/python/PyEditor";
import { Terminal } from "@/components/python/Terminal";
import { ErrorPanel } from "@/components/python/ErrorPanel";
import { usePython } from "@/components/python/usePython";
import { splitStdin } from "@/lib/python/grader";
import { useProgress } from "@/lib/store/progress";
import { RuntimeBadge } from "@/components/shell/RuntimeBadge";
import { cn } from "@/lib/utils";

const SNIPPETS: { name: string; code: string }[] = [
  {
    name: "Hello",
    code: `print("My First Program")\n\nname = input("What is your name? ")\nprint("Hello,", name)`,
  },
  {
    name: "Grade",
    code: `marks = int(input("Enter marks: "))\n\nif marks >= 75:\n    grade = "A"\nelif marks >= 50:\n    grade = "B"\nelif marks >= 40:\n    grade = "C"\nelse:\n    grade = "F"\n\nprint("Grade:", grade)`,
  },
  {
    name: "Loop",
    code: `total = 0\nfor n in range(1, 101):\n    total = total + n\nprint("Sum of 1 to 100 =", total)`,
  },
  {
    name: "Pattern",
    code: `n = 5\nfor i in range(1, n + 1):\n    for j in range(i):\n        print("*", end="")\n    print()`,
  },
  {
    name: "Function",
    code: `def area_of_rectangle(length, width):\n    return length * width\n\n\nprint("Area:", area_of_rectangle(6, 4))`,
  },
  {
    name: "Bubble sort",
    code: `def bubble_sort(L):\n    swapped = True\n    while swapped:\n        swapped = False\n        for i in range(len(L) - 1):\n            if L[i] > L[i + 1]:\n                L[i], L[i + 1] = L[i + 1], L[i]\n                swapped = True\n    return L\n\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
  },
  {
    name: "File",
    code: `f = open("notes.txt", "w")\nf.write("Ravi 85\\n")\nf.write("Mala 72\\n")\nf.close()\n\nprint(open("notes.txt").read())`,
  },
  {
    name: "Database",
    code: `import sqlite3\n\ndb = sqlite3.connect(":memory:")\ncur = db.cursor()\ncur.execute("CREATE TABLE student (name TEXT, marks INTEGER)")\ncur.executemany("INSERT INTO student VALUES (?, ?)",\n                [("Ravi", 85), ("Mala", 72), ("Geetha", 91)])\ndb.commit()\n\ncur.execute("SELECT * FROM student ORDER BY marks DESC")\nfor row in cur.fetchall():\n    print(row)`,
  },
];

const DEFAULT_CODE = SNIPPETS[0].code;

export default function PlaygroundPage() {
  const savedCode = useProgress((s) => s.playground);
  const setPlayground = useProgress((s) => s.setPlayground);
  const hydrated = useProgress((s) => s.hydrated);

  const [code, setCode] = useState(DEFAULT_CODE);
  const [stdinText, setStdinText] = useState("");
  const [showInputs, setShowInputs] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const py = usePython();

  useEffect(() => {
    if (hydrated && savedCode) setCode(savedCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    py.warmUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (v: string) => {
    setCode(v);
    setPlayground(v);
  };

  const run = () => {
    void py.run(code, { stdin: splitStdin(stdinText), wantFiles: true });
  };

  const download = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "program.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100dvh-3.25rem)] flex-col lg:h-dvh">
      <header className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2">
        <FileCode className="size-4 shrink-0 text-[var(--brand)]" />
        <span className="text-[13.5px] font-semibold">Playground</span>
        <div className="scrollbar-none ml-2 flex flex-1 gap-1 overflow-x-auto">
          {SNIPPETS.map((s) => (
            <button
              key={s.name}
              onClick={() => update(s.code)}
              className="shrink-0 rounded-lg border border-line bg-sunken px-2 py-1 text-[11.5px] font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              {s.name}
            </button>
          ))}
        </div>
        <RuntimeBadge className="hidden shrink-0 sm:flex" />
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col border-line lg:border-r">
          <div className="min-h-0 flex-1 overflow-hidden">
            <PyEditor
              value={code}
              onChange={update}
              editorRef={editorRef}
              minHeight="100%"
              maxHeight="100%"
              className="h-full rounded-none border-0"
            />
          </div>
          <MobileKeyBar onInsert={(t) => insertAtCursor(editorRef.current?.view, t)} />

          <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-line px-3 py-2">
            {py.running ? (
              <button
                onClick={py.stop}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-danger-500 px-3.5 text-[13.5px] font-semibold text-white"
              >
                <Square className="size-3.5 fill-current" />
                Stop
              </button>
            ) : (
              <button
                onClick={run}
                disabled={py.booting}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3.5 text-[13.5px] font-semibold text-[var(--brand-fg)] disabled:opacity-50"
              >
                <Play className="size-3.5 fill-current" />
                {py.booting ? "Starting…" : "Run"}
              </button>
            )}

            <button
              onClick={() => setShowInputs((v) => !v)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium transition-colors",
                showInputs ? "bg-brand-soft text-brand-soft-fg" : "text-muted hover:bg-hover",
              )}
            >
              <ChevronDown className={cn("size-3.5 transition-transform", showInputs && "rotate-180")} />
              Inputs
            </button>

            <div className="flex-1" />

            <button
              onClick={py.clear}
              aria-label="Clear output"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] text-muted transition-colors hover:bg-hover hover:text-ink"
            >
              <Trash2 className="size-3.5" />
              Clear
            </button>
            <button
              onClick={download}
              aria-label="Download as .py"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] text-muted transition-colors hover:bg-hover hover:text-ink"
            >
              <Download className="size-3.5" />
              .py
            </button>
          </div>

          {showInputs && (
            <div className="shrink-0 border-t border-line px-3 py-2">
              <p className="mb-1 text-[11px] font-medium text-subtle">
                Lines fed to `input()` before it starts asking you interactively — one per line
              </p>
              <textarea
                value={stdinText}
                onChange={(e) => setStdinText(e.target.value)}
                rows={3}
                spellCheck={false}
                placeholder={"Nimal\n17"}
                className="w-full rounded-lg border border-line bg-sunken px-3 py-2 font-[family-name:var(--font-mono)] text-[12.5px] outline-none focus:border-[var(--brand)]"
              />
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:max-w-[46%]">
          <div className="flex shrink-0 items-center gap-2 border-y border-line px-3 py-2 lg:border-t-0">
            <span className="text-[11.5px] font-semibold uppercase tracking-wide text-subtle">
              Output
            </span>
            <div className="flex-1" />
            {py.ms !== null && !py.running && (
              <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-subtle">
                {py.ms} ms
              </span>
            )}
            <button
              onClick={async () => {
                setShowFiles((v) => !v);
                if (!showFiles) await py.refreshFiles();
              }}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-medium transition-colors",
                showFiles ? "bg-brand-soft text-brand-soft-fg" : "text-muted hover:bg-hover",
              )}
            >
              <Files className="size-3.5" />
              Files ({py.files.length})
            </button>
          </div>

          <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto p-3">
            <Terminal
              chunks={py.chunks}
              running={py.running}
              awaitingInput={py.awaitingInput}
              onSubmitInput={py.sendInput}
              minHeight="10rem"
              emptyHint="Press Run — output appears here"
            />

            {py.error && <ErrorPanel error={py.error} className="mt-3" />}

            {showFiles && (
              <div className="mt-3 rounded-lg border border-line">
                <p className="border-b border-line bg-sunken px-3 py-2 text-[11.5px] font-semibold">
                  /home/student
                </p>
                {py.files.length === 0 ? (
                  <p className="px-3 py-3 text-[12.5px] text-subtle">
                    No files yet. Try the File snippet.
                  </p>
                ) : (
                  <ul className="divide-y divide-[var(--border)]">
                    {py.files.map((f) => (
                      <li key={f.name} className="px-3 py-2">
                        <p className="font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
                          {f.name}{" "}
                          <span className="font-normal text-subtle">({f.size} B)</span>
                        </p>
                        <pre className="scrollbar-slim mt-1 max-h-28 overflow-auto rounded bg-[var(--bg-code)] px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11.5px] leading-relaxed text-[#d7dbf0]">
                          {f.content || "(empty)"}
                        </pre>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
