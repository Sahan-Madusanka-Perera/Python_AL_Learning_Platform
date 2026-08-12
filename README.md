# Competency 9 — A/L Python Learning Platform

A complete, self-contained learning platform for **G.C.E. A/L ICT Competency 9**:
*"Develops algorithms to solve problems and uses python programming language to encode algorithms."*

It covers all 13 competency levels (9.1 – 9.13), and every Python example in it
runs for real — in the browser, on a phone, with no installation and no server.

---

## The one design decision everything follows from

A student who can only study on a borrowed Android phone, on patchy mobile data,
must be able to do **everything**: read the lessons, run the code, get their work
marked, and keep their streak.

That ruled out a server-side code runner and a login wall. So:

- **Python runs in the browser.** Real CPython 3.14 compiled to WebAssembly
  (Pyodide), self-hosted in `public/pyodide/`, executing in a Web Worker.
- **No accounts.** Progress lives in IndexedDB on the device, and can be
  exported/imported as a JSON file to move between devices.
- **Offline after first visit.** A service worker caches the app and the Python
  runtime, so lessons already opened still work with no signal.

## What is inside

| Area | What it does |
| --- | --- |
| **44 lessons** across 14 modules | Every content bullet and learning outcome from the syllabus, plus a bonus module for recursion, comprehensions, error handling and number bases |
| **26 coding labs** | Auto-graded against visible **and hidden** test cases, including the boundary values an examiner would try |
| **~100 questions** | Inline knowledge checks, module quizzes, and a timed exam room |
| **6 structured questions** | Full A/L-style essay questions with mark schemes and model answers |
| **60 revision cards** | Definitions worth knowing verbatim, scheduled by a Leitner spaced-repetition box system |
| **18 interactive tools** | Flow chart builder, structure chart builder, step-through tracer, bitwise lab, precedence resolver, bubble sort and sequential search animators, SQL console, virtual file system, and more |

### Things worth knowing about

**The step-through tracer.** *"Uses hand traces to verify the solutions"* is an
explicit learning outcome and a recurring exam question. The tracer runs the real
program one line at a time using `sys.settrace`, records every variable at every
step, and renders it as both a variable panel and a **trace table** — the exact
artefact students have to produce on paper.

**Interactive `input()`.** The program genuinely pauses and waits. This uses
`SharedArrayBuffer` + `Atomics.wait` to block the worker thread, which is why the
app sets COOP/COEP headers (see `next.config.ts`) and self-hosts every asset,
including fonts. Where cross-origin isolation is unavailable it degrades to
supplying inputs up front rather than breaking.

**Errors in plain English.** `NameError: name 'nmae' is not defined` teaches a
beginner nothing. `src/lib/python/errors.ts` maps ~25 common failures onto a
plain-language cause plus an ordered list of things to check, with the raw
traceback one tap away.

**Databases.** MySQL cannot run in a browser, so the runnable examples use
`sqlite3` from the Python standard library. The DB-API steps, cursor, `execute`,
`fetchall` and `commit` are identical, and every example shows the MySQL version
the syllabus expects alongside the one that runs.

**Mobile code entry.** Python needs `:` `_` `(` and four-space indents
constantly, and all of them are buried two taps deep on an Android keyboard.
There is a dedicated symbol bar above the soft keyboard.

## Running it

```bash
cd app
npm install
npm run dev       # http://localhost:3000
```

```bash
npm run build && npm start    # production
```

Requires Node 20+. The Python runtime (~13 MB) is committed in
`app/public/pyodide/`, so there is no download step and no CDN dependency.

### Deploying

Any host that runs a Node server works (Vercel, Netlify, Railway, a VPS). The
only requirement beyond a normal Next.js app is that these response headers
survive, or interactive `input()` and the stop button will silently degrade:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

They are set in `next.config.ts`. On hosts that ignore that, add them to the
platform's own header config.

## Layout

```
app/
├── public/
│   ├── pyodide/            # self-hosted CPython 3.14 (WASM)
│   ├── pyodide-worker.js   # the worker: stdin, interrupts, tracing, virtual FS
│   └── sw.js               # offline caching
└── src/
    ├── app/                # routes: learn, practice, playground, toolbox, revise, exam, progress
    ├── components/
    │   ├── lesson/         # block renderer, quiz cards, exercise cards
    │   ├── python/         # editor, terminal, runner, friendly error panel
    │   ├── tools/          # flow charts, structure charts, tracer, 18 widgets
    │   ├── shell/          # nav, command palette, theme, PWA
    │   └── ui/             # primitives, markdown
    └── lib/
        ├── content/        # ← the whole course, as typed data (m01…m14)
        ├── python/         # runtime client, auto-grader, error explainer
        ├── store/          # local-first progress + derived stats
        └── types.ts        # the content model
```

### Editing the course

All content is typed data in `src/lib/content/`. One module per file. Adding a
lesson means adding an object to a `lessons` array — the module page, the search
index, the exam question pool, the progress calculations and the syllabus
coverage panel all pick it up automatically.

Blocks available to a lesson: `text`, `heading`, `callout`, `code` (runnable),
`table`, `compare`, `steps`, `terms`, `flowchart`, `structure`, `syntax`,
`widget`, `check`, `trace`, `exercise`.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Pyodide (CPython 3.14 WASM) ·
CodeMirror 6 · Motion · Zustand + IndexedDB

## Known limits

- **Cross-origin isolation is required** for blocking `input()` and for the stop
  button. Without it the app still works, but inputs must be supplied before
  running and a runaway loop restarts the worker instead of raising
  `KeyboardInterrupt`.
- **MySQL examples are not executable** — they are shown as reference code beside
  a runnable SQLite equivalent, as described above.
- **Structured questions are self-marked.** They are graded against a visible
  rubric rather than automatically; the model answer unlocks once an attempt has
  been written.
- The Sinhala-language half of the source notes is not reproduced; all content
  here is in English.
