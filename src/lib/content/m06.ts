import type { Module } from "../types";

export const m06: Module = {
  id: "9.6",
  slug: "ide",
  title: "The IDE & Debugging",
  tagline: "Your workshop: editor, translator and debugger in one place.",
  icon: "MonitorSmartphone",
  periods: 4,
  outcomes: [
    "Identifies the basic features of IDE",
    "Practices the instructions to open and save files, compile and execute programs",
    "Uses the debugging facilities in IDE",
  ],
  contents: [
    "Basic features of IDE",
    "Opening and saving files",
    "Compiling, executing programs",
    "Debugging facilities",
  ],

  lessons: [
    {
      id: "9.6.1",
      title: "What an IDE is made of",
      summary: "Three separate tools, bundled into one program.",
      minutes: 10,
      outcomes: ["Identifies the basic features of IDE"],
      blocks: [
        {
          kind: "text",
          md: `To write programs you need at least three things: somewhere to type the code, something to translate it, and something to help you find mistakes. Historically these were three separate programs.

An **Integrated Development Environment (IDE)** is one comprehensive program that contains all of them.`,
        },
        {
          kind: "steps",
          title: "The three core components",
          steps: [
            {
              title: "Editor",
              md: `Where you type the source code. An editor is essentially word-processing software with minimal formatting but programming-specific help: **syntax highlighting**, **auto-indent**, **line numbers** and **auto-completion**.

Its three basic operations are **create a new file**, **save a file**, and **open a saved file**.`,
            },
            {
              title: "Compiler / interpreter",
              md: `Translates the source into object code so it can run. In the process it reports **syntax errors** — mistakes in the grammar of the language.`,
            },
            {
              title: "Debugger",
              md: `Helps you find and remove errors. It lets you pause the program, run it one line at a time, and inspect the values of variables while it is stopped.`,
            },
          ],
        },
        { kind: "widget", id: "ide-tour" },
        {
          kind: "callout",
          tone: "note",
          title: "Examples of IDEs",
          md: `**IDLE** ships with Python itself. **Microsoft Visual Studio**, **Eclipse with the PyDev plugin**, **VS Code** and **PyCharm** are other common IDEs. There are also many online IDEs — including the editor built into this app, which runs Python entirely inside your browser.`,
        },
        {
          kind: "table",
          headers: ["Task", "In IDLE / most IDEs"],
          rows: [
            ["Create a new file", "File → New File"],
            ["Save the file", "File → Save (Python files must end in .py)"],
            ["Open a saved file", "File → Open"],
            ["Run the program", "Run → Run Module, or press F5"],
            ["See output", "The shell / console window"],
          ],
        },
        {
          kind: "callout",
          tone: "exam",
          title: "Remember the file extension",
          md: `A Python source file must be saved with the **.py** extension, for example \`hello.py\`. This is a favourite one-mark question.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.6-inline-1",
            level: "9.6",
            q: "Which set of tools does an IDE bundle together?",
            options: [
              "Editor, compiler, debugger",
              "Linker, loader, printer",
              "Keyboard, monitor, mouse",
              "Database, spreadsheet, browser",
            ],
            answer: 0,
            explain:
              "An IDE integrates an editor for typing code, a compiler or interpreter for translating it, and a debugger for finding errors.",
          },
        },
      ],
    },

    {
      id: "9.6.2",
      title: "Three kinds of error — and how to find each one",
      summary:
        "Syntax, runtime and logic errors need completely different hunting techniques.",
      minutes: 16,
      outcomes: ["Uses the debugging facilities in IDE"],
      blocks: [
        {
          kind: "text",
          md: `**Debugging** is the process of finding and removing errors ("bugs"). Before you can fix an error you have to know **which kind** it is, because each kind is found in a different way.`,
        },
        {
          kind: "table",
          headers: ["Type", "When it appears", "What happens", "How to find it"],
          rows: [
            [
              "Syntax error",
              "Before the program runs",
              "The translator refuses to run the program at all",
              "Read the message and the line number",
            ],
            [
              "Runtime error",
              "While the program is running",
              "The program stops part-way with an error message",
              "Look at the line named in the traceback",
            ],
            [
              "Logic error",
              "Never reported",
              "The program runs happily and gives the WRONG answer",
              "Hand trace, or step through with a debugger",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "key",
          title: "The dangerous one",
          md: `Logic errors are the most dangerous, because nothing tells you they exist. The program runs, produces an answer, and the answer is wrong. Only testing and tracing will catch them.`,
        },
        {
          kind: "heading",
          text: "1. Syntax error",
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Run this — nothing executes at all, not even the first line",
          code: `print("This line looks fine")
if 5 > 3
    print("Missing something on the line above")`,
        },
        {
          kind: "heading",
          text: "2. Runtime error",
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The first two lines DO run — then it fails",
          code: `numbers = [10, 20, 30]
print("The list has", len(numbers), "items")
print("The fourth item is", numbers[3])`,
        },
        {
          kind: "heading",
          text: "3. Logic error",
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption:
            "No error message at all. But the average of 10, 20 and 30 is 20, not 40.",
          code: `numbers = [10, 20, 30]
total = 0
for n in numbers:
    total = total + n

average = total / 3
print("Average:", average + 20)   # something here is wrong`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "The debugging toolkit",
          md: `1. **Read the error message.** It names the error type and the line. Most students skip this and guess instead.
2. **Print the values.** Add \`print()\` just before the failing line to see what the variables really contain.
3. **Step through it.** Watch every variable change, one line at a time.
4. **Check the boundaries.** Test the first item, the last item, and the empty case.`,
        },
        {
          kind: "heading",
          text: "Use the step-through debugger",
        },
        {
          kind: "text",
          md: `This is the same facility a full IDE gives you. Step forward one line at a time and watch the variable panel — the moment a value stops matching what you expected, you have found your bug.`,
        },
        {
          kind: "trace",
          caption: "Where does this go wrong? Step until `average` is calculated.",
          code: `numbers = [10, 20, 30, 40]
total = 0
count = 0

for n in numbers:
    total = total + n
    count = count + 1

average = total / count
print("Average:", average)`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.6-inline-2",
            level: "9.6",
            q: "A program to calculate the area of a rectangle runs without any error message, but always gives an answer that is twice too big. What kind of error is this?",
            options: ["Syntax error", "Runtime error", "Logic error", "Linker error"],
            answer: 2,
            explain:
              "The program runs successfully, so it is grammatically valid and does not crash — but the result is wrong. That is the definition of a logic error. Most likely `(l + w) * 2` was used instead of `l * w`.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.6-1" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.6-1",
      title: "Fix all three bugs",
      level: "9.6",
      difficulty: 2,
      xp: 35,
      tags: ["debugging", "errors"],
      brief: `The program below is supposed to read three marks, find their **average**, and print whether the student passed (average of 50 or more).

It contains **one syntax error, one runtime error and one logic error**. Find and fix all three.

With inputs \`60\`, \`70\`, \`80\` it must print exactly:
\`\`\`
Average: 70.0
Pass
\`\`\``,
      starter: `m1 = int(input("Mark 1: "))
m2 = int(input("Mark 2: "))
m3 = input("Mark 3: ")

total = m1 + m2 + m3
average = total / 2

print("Average:", average)

if average >= 50
    print("Pass")
else:
    print("Fail")`,
      hints: [
        "Start with the syntax error — Python will not run anything until that is fixed. Look at the `if` line.",
        "The runtime error comes from adding a string to numbers. Which input line is missing `int(...)`?",
        "The logic error is the division. Three marks means dividing by 3, not 2.",
        "After fixing all three, test with 60/70/80 — the average should be exactly 70.0.",
      ],
      solution: `m1 = int(input("Mark 1: "))
m2 = int(input("Mark 2: "))
m3 = int(input("Mark 3: "))

total = m1 + m2 + m3
average = total / 3

print("Average:", average)

if average >= 50:
    print("Pass")
else:
    print("Fail")`,
      tests: [
        {
          kind: "io",
          name: "Average is correct",
          stdin: ["60", "70", "80"],
          expect: "Average: 70.0",
          match: "contains",
        },
        {
          kind: "io",
          name: "Pass is reported",
          stdin: ["60", "70", "80"],
          expect: "Pass",
          match: "contains",
        },
        {
          kind: "io",
          name: "Fail is reported for low marks",
          stdin: ["10", "20", "30"],
          expect: "Fail",
          match: "contains",
        },
        {
          kind: "io",
          name: "Boundary: average of exactly 50 passes",
          stdin: ["50", "50", "50"],
          expect: "Pass",
          match: "contains",
          hidden: true,
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.6-1",
      level: "9.6",
      q: "What does IDE stand for?",
      options: [
        "Internal Data Editor",
        "Integrated Development Environment",
        "Interpreted Debugging Engine",
        "Interface Design Editor",
      ],
      answer: 1,
      explain: "IDE = Integrated Development Environment.",
      difficulty: 1,
    },
    {
      id: "q-9.6-2",
      level: "9.6",
      q: "A missing colon after an `if` condition produces which kind of error?",
      options: ["Logic error", "Runtime error", "Syntax error", "No error"],
      answer: 2,
      explain:
        "It breaks the grammar of the language, so the translator detects it before the program runs. That is a syntax error.",
      difficulty: 1,
    },
    {
      id: "q-9.6-3",
      level: "9.6",
      q: "Which error type produces NO error message at all?",
      options: ["Syntax error", "Runtime error", "Logic error", "Tab error"],
      answer: 2,
      explain:
        "A logic error is grammatically valid and does not crash — the program simply computes the wrong answer. Only testing or tracing reveals it.",
      difficulty: 2,
    },
    {
      id: "q-9.6-4",
      level: "9.6",
      q: "Which extension must a Python source file be saved with?",
      options: [".pt", ".py", ".pyt", ".python"],
      answer: 1,
      explain: "Python source files use the .py extension, for example hello.py.",
      difficulty: 1,
    },
    {
      id: "q-9.6-5",
      level: "9.6",
      q: "What is the main purpose of a debugger's step-through facility?",
      options: [
        "To make the program run faster",
        "To execute the program one line at a time so variable values can be inspected",
        "To translate the program into machine code",
        "To save the file automatically",
      ],
      answer: 1,
      explain:
        "Stepping executes a single line at a time and lets you watch the variables, which is how logic errors are located.",
      difficulty: 1,
    },
    {
      id: "q-9.6-6",
      level: "9.6",
      q: "A program divides by a variable that happens to be 0 when it runs. This is an example of:",
      options: ["A syntax error", "A runtime error", "A logic error", "A linker error"],
      answer: 1,
      explain:
        "The code is grammatically correct, so it starts running; it fails part-way through with ZeroDivisionError. Errors that appear during execution are runtime errors.",
      difficulty: 2,
    },
  ],
};
