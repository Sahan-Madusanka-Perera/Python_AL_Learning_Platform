import type { Module } from "../types";

export const m04: Module = {
  id: "9.4",
  slug: "paradigms",
  title: "Programming Languages & Paradigms",
  tagline: "Five generations of languages, and the three styles of thinking behind them.",
  icon: "Languages",
  periods: 2,
  outcomes: [
    "Describes the evolution of programming language in terms of generations",
    "Compares and contrasts imperative, declarative, object oriented languages",
  ],
  contents: [
    "Evolution of programming languages",
    "Programming paradigms",
    "Imperative languages",
    "Declarative languages",
    "Object oriented languages",
  ],

  lessons: [
    {
      id: "9.4.1",
      title: "The generations of programming languages",
      summary:
        "From raw binary to languages that describe what you want rather than how to get it.",
      minutes: 12,
      outcomes: ["Describes the evolution of programming language in terms of generations"],
      blocks: [
        {
          kind: "text",
          md: `A **programming language** is a set of commands written in a specific format and grammar. Like any language, it has to be learnt.

Languages are grouped into **generations**. Each generation moved further away from the machine and closer to human thinking.`,
        },
        { kind: "widget", id: "generation-timeline" },
        {
          kind: "table",
          headers: ["Generation", "Name", "What it looks like", "Examples"],
          rows: [
            ["1GL", "Machine language", "Binary digits only — 10110000 01100001", "Machine code"],
            [
              "2GL",
              "Assembly language",
              "Short mnemonics for machine instructions — MOV AL, 61h",
              "Assembly",
            ],
            [
              "3GL",
              "High-level / procedural",
              "English-like statements, machine independent",
              "C, Pascal, Java, Python",
            ],
            [
              "4GL",
              "Very high-level",
              "State what you want, not the steps to get it",
              "SQL, report generators",
            ],
            [
              "5GL",
              "Constraint / AI languages",
              "Describe the problem and constraints; the system finds a solution",
              "Prolog, Mercury",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "key",
          title: "The pattern to remember",
          md: `As the generation number goes **up**:
- the language gets **easier for humans**,
- it becomes **more machine independent**,
- but it needs **more translation** to run.

1GL runs directly on the hardware. Everything above it must be translated.`,
        },
        {
          kind: "callout",
          tone: "note",
          title: "Where Python sits",
          md: `Python is a **third generation**, high-level language, created by **Guido van Rossum** and released in **1991**. It is machine independent — the same \`.py\` file runs on Windows, Mac, Linux and a Raspberry Pi.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.4-inline-1",
            level: "9.4",
            q: "Which generation of language is SQL usually classified as?",
            options: ["1GL", "2GL", "3GL", "4GL"],
            answer: 3,
            explain:
              "SQL is a fourth-generation language. You write `SELECT name FROM student` — describing what you want, not the steps to fetch it.",
          },
        },
      ],
    },

    {
      id: "9.4.2",
      title: "Programming paradigms",
      summary:
        "Imperative, declarative and object-oriented — the three styles the syllabus asks you to compare.",
      minutes: 14,
      outcomes: ["Compares and contrasts imperative, declarative, object oriented languages"],
      blocks: [
        {
          kind: "callout",
          tone: "key",
          title: "Definition",
          md: `A **programming paradigm** is the specific *style* of programming a language supports — the way you are expected to think about a problem when you use it.`,
        },
        { kind: "widget", id: "paradigm-explorer" },
        {
          kind: "heading",
          text: "Imperative languages",
        },
        {
          kind: "text",
          md: `The most common type. You solve the problem by writing a **sequence of commands** (imperatives) that tell the computer *how* to do the job, step by step.

The syllabus divides imperative languages into three kinds:

- **Procedural** — organised into procedures/functions. Example: **C**
- **Object-oriented** — organised into objects that hold data and behaviour. Examples: **Java, C++**
- **Parallel processing** — designed to run parts simultaneously. Example: **Java**`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Imperative: I say exactly HOW to find the total",
          code: `marks = [65, 72, 58, 90]

total = 0
for m in marks:          # step 1: look at each mark
    total = total + m    # step 2: add it on
print("Total:", total)`,
        },
        {
          kind: "heading",
          text: "Declarative languages",
        },
        {
          kind: "text",
          md: `Less common. There is **no specific sequence** of commands. You write **declarations** describing what is true or what you want, and the language works out how to produce it.

The syllabus divides declarative languages into three kinds:

- **Logic** — facts and rules. Example: **Prolog**
- **Functional / data flow** — everything is a function applied to values. Example: **Lisp**
- **Database** — query languages. Example: **SQL**`,
        },
        {
          kind: "code",
          lang: "sql",
          caption: "Declarative: I say WHAT I want; the database decides how",
          code: `SELECT SUM(marks) FROM student WHERE grade = 'A';`,
        },
        {
          kind: "compare",
          title: "The core difference",
          left: {
            title: "Imperative — HOW",
            items: [
              "A sequence of commands in a fixed order",
              "The programmer controls every step",
              "State changes as the program runs",
              "C, Pascal, Python, Java",
            ],
          },
          right: {
            title: "Declarative — WHAT",
            items: [
              "Statements need not run in a fixed order",
              "The system decides how to get the result",
              "Describes relationships and goals",
              "SQL, Prolog, Lisp",
            ],
          },
        },
        {
          kind: "heading",
          text: "Object-oriented languages",
        },
        {
          kind: "text",
          md: `Object-oriented programming organises a program around **objects** — bundles of data together with the operations that work on that data. A **class** is the blueprint; an **object** is one thing built from it.

It is a sub-category of imperative programming, but it is important enough that the syllabus lists it separately.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Python supports the object-oriented style too",
          code: `class Student:
    def __init__(self, name, marks):
        self.name = name       # data belonging to this object
        self.marks = marks

    def grade(self):           # behaviour belonging to this object
        if self.marks >= 75:
            return "A"
        elif self.marks >= 50:
            return "B"
        return "F"

s1 = Student("Nimal", 82)
s2 = Student("Kamala", 47)
print(s1.name, "got", s1.grade())
print(s2.name, "got", s2.grade())`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "The comparison question",
          md: `You are usually asked to compare the three paradigms and **give at least one language for each**. Memorise one clean example per category:

- Imperative / procedural → **C**
- Object oriented → **Java** (or C++)
- Declarative / logic → **Prolog**
- Declarative / functional → **Lisp**
- Declarative / database → **SQL**`,
        },
        {
          kind: "callout",
          tone: "note",
          title: "Python is multi-paradigm",
          md: `Python can be used in a procedural way, an object-oriented way, **or** a functional way. That flexibility is one reason it is used for teaching.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.4-inline-2",
            level: "9.4",
            q: "Prolog belongs to which paradigm and sub-category?",
            options: [
              "Imperative — procedural",
              "Imperative — object oriented",
              "Declarative — logic",
              "Declarative — database",
            ],
            answer: 2,
            explain:
              "Prolog is the standard example of a logic language, which is a sub-category of the declarative paradigm. Lisp is functional and SQL is the database example.",
          },
        },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.4-1",
      title: "Same job, two styles",
      level: "9.4",
      difficulty: 2,
      xp: 30,
      tags: ["paradigms", "lists", "functions"],
      brief: `Write the **same task** twice to feel the difference between the two styles.

The task: from the list \`marks = [45, 82, 67, 91, 38]\`, count how many marks are 50 or more.

1. Write a function \`count_pass_imperative(marks)\` that uses an explicit \`for\` loop and a counter, and **returns** the count.
2. Write a function \`count_pass_declarative(marks)\` that produces the same answer **without a for statement** — use a comprehension with \`len()\` or \`sum()\`.

Then print both results, one per line.`,
      starter: `marks = [45, 82, 67, 91, 38]


def count_pass_imperative(marks):
    pass


def count_pass_declarative(marks):
    pass


print(count_pass_imperative(marks))
print(count_pass_declarative(marks))`,
      hints: [
        "For the imperative version: start `count = 0`, loop over the list, and add 1 whenever `m >= 50`.",
        "Do not forget to `return count` at the end — outside the loop.",
        "For the declarative version, `[m for m in marks if m >= 50]` builds a list of just the passes.",
        "`len([...])` gives its length. `sum(1 for m in marks if m >= 50)` also works.",
      ],
      solution: `marks = [45, 82, 67, 91, 38]


def count_pass_imperative(marks):
    count = 0
    for m in marks:
        if m >= 50:
            count = count + 1
    return count


def count_pass_declarative(marks):
    return len([m for m in marks if m >= 50])


print(count_pass_imperative(marks))
print(count_pass_declarative(marks))`,
      tests: [
        { kind: "io", name: "Both print 3", expect: "3\n3", match: "loose" },
        {
          kind: "expr",
          name: "Imperative version works on other data",
          expr: "count_pass_imperative([10, 50, 99])",
          expect: "2",
        },
        {
          kind: "expr",
          name: "Declarative version works on other data",
          expr: "count_pass_declarative([10, 50, 99])",
          expect: "2",
        },
        {
          kind: "source",
          name: "Declarative version avoids a for statement",
          mustUse: ["def count_pass_declarative"],
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.4-1",
      level: "9.4",
      q: "What is a programming paradigm?",
      options: [
        "A tool that converts source code to machine code",
        "The specific style of programming that a language supports",
        "The speed at which a language executes",
        "A standard for naming variables",
      ],
      answer: 1,
      explain:
        "A paradigm is the style of programming — the way you are expected to structure your thinking and your code in that language.",
      difficulty: 1,
    },
    {
      id: "q-9.4-2",
      level: "9.4",
      q: "Which set contains ONLY declarative languages?",
      options: ["C, Java, Python", "Prolog, Lisp, SQL", "C++, Pascal, C", "Java, SQL, C"],
      answer: 1,
      explain:
        "Prolog (logic), Lisp (functional data flow) and SQL (database) are the three declarative examples given in the syllabus.",
      difficulty: 2,
    },
    {
      id: "q-9.4-3",
      level: "9.4",
      q: "Second generation languages are:",
      options: [
        "Machine languages written in binary",
        "Assembly languages using mnemonic codes",
        "High-level languages like C",
        "Query languages like SQL",
      ],
      answer: 1,
      explain:
        "1GL is machine code in binary; 2GL is assembly, which replaces binary patterns with short mnemonics such as MOV and ADD.",
      difficulty: 1,
    },
    {
      id: "q-9.4-4",
      level: "9.4",
      q: "Which statement best contrasts imperative with declarative programming?",
      options: [
        "Imperative is faster; declarative is slower",
        "Imperative describes HOW to solve the problem step by step; declarative describes WHAT result is wanted",
        "Imperative is only for databases; declarative is for calculations",
        "Imperative needs no translator; declarative does",
      ],
      answer: 1,
      explain:
        "The defining difference is control: in imperative code the programmer specifies the sequence of steps; in declarative code the system decides how to produce the requested result.",
      difficulty: 2,
    },
    {
      id: "q-9.4-5",
      level: "9.4",
      q: "Java is usually classified under which sub-categories of imperative languages?",
      options: [
        "Procedural and logic",
        "Object oriented and parallel processing",
        "Functional and database",
        "Machine and assembly",
      ],
      answer: 1,
      explain:
        "The syllabus lists Java as an example of both object-oriented and parallel-processing imperative languages. C is the procedural example.",
      difficulty: 2,
    },
    {
      id: "q-9.4-6",
      level: "9.4",
      q: "As you move from 1GL towards 5GL, which statement is TRUE?",
      options: [
        "Languages become harder for humans and need less translation",
        "Languages become easier for humans and need more translation",
        "Languages become machine dependent",
        "Languages stop needing any translator",
      ],
      answer: 1,
      explain:
        "Higher generations are closer to human language and further from the hardware, so they are easier to write but require more translation before the machine can execute them.",
      difficulty: 2,
    },
  ],
};
