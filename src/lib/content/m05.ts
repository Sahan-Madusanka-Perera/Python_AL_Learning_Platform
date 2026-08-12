import type { Module } from "../types";

export const m05: Module = {
  id: "9.5",
  slug: "translators",
  title: "Translators, Linkers & Loaders",
  tagline: "A computer only runs binary. Everything you write has to be translated first.",
  icon: "RefreshCw",
  periods: 2,
  outcomes: [
    "Describes the need of translation of a program",
    "Compares the source and object program",
    "Lists and briefly describes the types of program translators",
    "Briefly describes the function of linkers",
  ],
  contents: [
    "Need of program translation",
    "Source program",
    "Object program",
    "Program translators",
    "Interpreters",
    "Compilers",
    "Hybrid approach",
    "Linkers",
  ],

  lessons: [
    {
      id: "9.5.1",
      title: "Source code, object code, and why translation is needed",
      summary: "The gap between what humans can write and what a processor can execute.",
      minutes: 10,
      outcomes: [
        "Describes the need of translation of a program",
        "Compares the source and object program",
      ],
      blocks: [
        {
          kind: "text",
          md: `A processor understands **one** thing: binary machine instructions. Nothing else.

Humans cannot realistically write in binary — the sequences are enormous and a single wrong digit breaks everything. So we write in a high-level language and use an intermediate program to convert it.`,
        },
        {
          kind: "compare",
          title: "The two forms of a program",
          left: {
            title: "Source program (source code)",
            items: [
              "Written by a human in a high-level language",
              "Readable by anyone who knows the language",
              "Stored as a text file, e.g. hello.py",
              "Cannot be executed directly by the CPU",
              "Machine independent",
            ],
          },
          right: {
            title: "Object program (object code)",
            items: [
              "Produced by a translator",
              "Made of binary machine instructions",
              "Not readable by humans",
              "Can be executed by the CPU",
              "Machine dependent",
            ],
          },
        },
        {
          kind: "callout",
          tone: "key",
          title: "The one-line answer",
          md: `**Why is translation necessary?** Because computers can execute only binary machine code, while programs are written in human-readable high-level languages. A translator bridges that gap.`,
        },
        {
          kind: "text",
          md: `The layers below show where each language sits. Everything above the machine language layer must be translated downwards before it can run.`,
        },
        {
          kind: "table",
          headers: ["Layer", "Example", "Who understands it"],
          rows: [
            ["High-level language", "Python, C, Java", "Humans"],
            ["Assembly language", "MOV AL, 61h", "Humans, with effort"],
            ["Machine language", "10110000 01100001", "The processor"],
            ["Hardware", "Transistors and logic gates", "Physics"],
          ],
        },
        {
          kind: "check",
          question: {
            id: "q-9.5-inline-1",
            level: "9.5",
            q: "Which statement about object code is correct?",
            options: [
              "It is written directly by the programmer",
              "It is in binary form and can be executed by the processor",
              "It is easier for humans to read than source code",
              "It is machine independent",
            ],
            answer: 1,
            explain:
              "Object code is the binary output of a translator. It is machine dependent and not meant for humans to read.",
          },
        },
      ],
    },

    {
      id: "9.5.2",
      title: "Compilers, interpreters and the hybrid approach",
      summary:
        "Two ways of translating, the trade-off between them, and the middle path most modern languages take.",
      minutes: 14,
      outcomes: ["Lists and briefly describes the types of program translators"],
      blocks: [
        {
          kind: "text",
          md: `There are two ways to translate a program, and the difference is simply **how much** you translate before you start running.`,
        },
        { kind: "widget", id: "translator-lab" },
        {
          kind: "heading",
          text: "Compiler",
        },
        {
          kind: "text",
          md: `A **compiler** translates the **whole** source program into object code **at once**, before execution. The result is a permanent binary file.

Every time the program runs afterwards, the object code executes directly — so **execution is fast**. If you change the source, you must **compile again** to produce new object code.

Languages that use this approach: **C, Pascal**.`,
        },
        {
          kind: "heading",
          text: "Interpreter",
        },
        {
          kind: "text",
          md: `An **interpreter** translates the source **line by line, at the time of execution**, and executes each line as it goes. No permanent object file is produced.

Because translation happens every time you run the program, **execution is slower**. The advantage is that you can run code the moment you write it, which makes prototyping and testing fast.

Languages that use this approach: **Python, BASIC, FORTRAN**.`,
        },
        {
          kind: "table",
          headers: ["", "Compiler", "Interpreter"],
          rows: [
            ["Translates", "The whole program at once", "One line at a time"],
            ["When", "Before execution", "During execution"],
            ["Object file produced", "Yes, permanent", "No"],
            ["Execution speed", "Fast", "Slower"],
            ["Errors reported", "All together, after compiling", "One at a time, when that line is reached"],
            ["Re-translation needed", "Every time the source changes", "Every time the program runs"],
            ["Examples", "C, Pascal", "Python, BASIC"],
          ],
        },
        {
          kind: "callout",
          tone: "exam",
          title: "The classic exam distinction",
          md: `Compiler = **whole program, before running, produces object code, faster execution**.
Interpreter = **line by line, while running, no object file, slower execution**.

Write both halves of the contrast. Answers that describe only one side lose marks.`,
        },
        {
          kind: "heading",
          text: "Hybrid approach",
        },
        {
          kind: "text",
          md: `When there are two ways of doing something, each with advantages, the usual engineering answer is to **combine** them.

In the hybrid approach the source is first **compiled** into an intermediate form (often called *byte code*), which is then **interpreted** by a virtual machine at run time.

This gives portability — the byte code runs on any machine that has the virtual machine — while still being faster than interpreting raw source every time. **Java** is the standard example, and Python does this internally too (that is what \`.pyc\` files are).`,
        },
        {
          kind: "callout",
          tone: "note",
          title: "The analogy in your notes",
          md: `A hybrid electric car uses a battery in town and an engine outside town — each where it works best. Hybrid translation is the same idea applied to compiling and interpreting.`,
        },
        {
          kind: "heading",
          text: "See it happen",
        },
        {
          kind: "text",
          md: `The Python you run in this app is genuinely interpreted, line by line. Run the code below — notice that the first two lines produce output **before** the error on line 3 is discovered. A compiler would have refused to produce any output at all, because it checks the whole program first.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `print("Line 1 ran")
print("Line 2 ran")
print("Line 3:", 10 / 0)
print("Line 4 never runs")`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.5-inline-2",
            level: "9.5",
            q: "Why does an interpreted program usually run more slowly than a compiled one?",
            options: [
              "Interpreted languages have fewer features",
              "Translation happens every time the program runs, not once beforehand",
              "Interpreters do not use the processor",
              "Interpreted programs are always longer",
            ],
            answer: 1,
            explain:
              "A compiled program is translated once and then the binary runs directly. An interpreted program is re-translated line by line on every run, and that translation work costs time.",
          },
        },
      ],
    },

    {
      id: "9.5.3",
      title: "Linkers and loaders",
      summary: "How your program gets joined to the library code it depends on.",
      minutes: 8,
      outcomes: ["Briefly describes the function of linkers"],
      blocks: [
        {
          kind: "text",
          md: `Your program is never alone. When you write \`print(...)\`, you did not write the printing code — it lives in a standard library.

A **linker** is the program that connects your compiled code with the standard library functions it uses, producing one complete executable program.`,
        },
        {
          kind: "steps",
          title: "From typing to running",
          steps: [
            {
              title: "Edit",
              md: "You write the source program in an editor and save it, e.g. `main.c` or `hello.py`.",
            },
            {
              title: "Translate",
              md: "A compiler or interpreter converts the source into object code, reporting any syntax errors.",
            },
            {
              title: "Link",
              md: "The **linker** joins your object code to the library routines it calls (input/output, maths, and so on) and produces a single executable file.",
            },
            {
              title: "Load",
              md: "The **loader** copies that executable from storage into main memory and hands control to the processor so it can start executing.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "key",
          title: "One line each",
          md: `**Linker** — connects user code with standard library functions to make one executable program.
**Loader** — loads the executable program into main memory so that it can run.`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "Do not confuse them",
          md: `The linker works **before** the program runs and joins pieces of code together. The loader works **as** the program starts and moves it into memory. Candidates regularly swap these two definitions.`,
        },
      ],
    },
  ],

  exercises: [],

  quiz: [
    {
      id: "q-9.5-1",
      level: "9.5",
      q: "Why is a translator necessary?",
      options: [
        "To make programs shorter",
        "Because the processor can execute only binary machine code, while programs are written in high-level languages",
        "To remove logic errors from a program",
        "To connect the program to the internet",
      ],
      answer: 1,
      explain:
        "Translation bridges the gap between human-readable high-level source code and the binary machine code that hardware executes.",
      difficulty: 1,
    },
    {
      id: "q-9.5-2",
      level: "9.5",
      q: "Which is a correct statement about compilers?",
      options: [
        "They translate and execute one line at a time",
        "They translate the entire program at once and produce object code",
        "They do not report syntax errors",
        "They are used by Python but not by C",
      ],
      answer: 1,
      explain:
        "A compiler processes the whole source program before execution and produces a permanent object (executable) file.",
      difficulty: 1,
    },
    {
      id: "q-9.5-3",
      level: "9.5",
      q: "A program is changed and must be run again. What has to happen with a COMPILED language?",
      options: [
        "Nothing — the old object code still works",
        "The source must be compiled again to produce new object code",
        "The interpreter re-reads the file automatically",
        "The linker must be removed",
      ],
      answer: 1,
      explain:
        "Object code is a fixed translation of the source at the moment of compiling. Any change to the source requires recompilation.",
      difficulty: 2,
    },
    {
      id: "q-9.5-4",
      level: "9.5",
      q: "What is the main function of a linker?",
      options: [
        "To load the program into main memory",
        "To connect the program with standard library functions to form one executable",
        "To translate source code line by line",
        "To detect logic errors",
      ],
      answer: 1,
      explain:
        "The linker resolves references to library routines and combines them with your object code into a single executable program.",
      difficulty: 1,
    },
    {
      id: "q-9.5-5",
      level: "9.5",
      q: "In the hybrid approach used by Java, what happens first?",
      options: [
        "The source is interpreted line by line",
        "The source is compiled into an intermediate byte code, which is then interpreted",
        "The source is loaded into memory without translation",
        "The linker runs before the compiler",
      ],
      answer: 1,
      explain:
        "Hybrid translation compiles to a machine-independent byte code first; a virtual machine then interprets that byte code at run time. This gives both portability and reasonable speed.",
      difficulty: 2,
    },
    {
      id: "q-9.5-6",
      level: "9.5",
      q: "A Python program prints two lines and then stops with an error on the third line. What does this tell you?",
      options: [
        "Python is a compiled language",
        "Python translates and executes line by line, so earlier lines had already run",
        "The error was in the first line",
        "The linker failed",
      ],
      answer: 1,
      explain:
        "Because interpretation happens line by line during execution, statements before the faulty line have already produced their output. A compiler would have rejected the whole program before any output appeared.",
      difficulty: 3,
    },
    {
      id: "q-9.5-7",
      level: "9.5",
      q: "Which pair correctly matches the tool to its job?",
      options: [
        "Loader — joins library code to your program",
        "Linker — copies the executable into main memory",
        "Loader — copies the executable into main memory",
        "Compiler — copies the executable into main memory",
      ],
      answer: 2,
      explain:
        "The loader loads the executable into main memory so it can run. Joining library code to your program is the linker's job.",
      difficulty: 2,
    },
  ],
};
