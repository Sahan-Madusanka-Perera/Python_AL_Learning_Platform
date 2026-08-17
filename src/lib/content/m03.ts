import type { Module } from "../types";

export const m03: Module = {
  id: "9.3",
  slug: "algorithms",
  title: "Algorithms, Flow Charts & Hand Traces",
  tagline: "An algorithm is a plan precise enough that a machine could follow it without asking questions.",
  icon: "GitBranch",
  periods: 6,
  outcomes: [
    "Briefly describes algorithms",
    "Identifies the standard symbols used to draw flow charts",
    "Draws flow charts to illustrate solutions to a given problem",
    "Writes pseudo codes to illustrate solutions to a given problem",
    "Uses hand traces to verify the solutions",
  ],
  contents: ["Algorithms", "Flow charts", "Pseudo codes", "Hand traces"],

  lessons: [
    {
      id: "9.3.1",
      title: "What is an algorithm?",
      summary: "The definition examiners want, and the three building blocks every algorithm is made of.",
      minutes: 10,
      outcomes: ["Briefly describes algorithms"],
      blocks: [
        {
          kind: "callout",
          tone: "key",
          title: "Definition: learn this wording",
          md: `An **algorithm** is a **finite sequence** of **well-defined** instructions, typically used to solve a problem.

- **Finite**: it has a fixed number of steps and it ends.
- **Well-defined**: every step is clear and unambiguous, with only one possible meaning.`,
        },
        {
          kind: "text",
          md: `"Add some sugar" is not an algorithm: *some* is ambiguous. "Add 2 teaspoons of sugar" is. A computer cannot make judgement calls, so every step must be exact.`,
        },
        {
          kind: "heading",
          text: "The three control structures",
        },
        {
          kind: "text",
          md: `Every algorithm ever written is built from just three structures. You will meet them again in full detail in competency level 9.8.`,
        },
        {
          kind: "table",
          headers: ["Structure", "Meaning", "Everyday example"],
          rows: [
            ["Sequence", "Steps run one after another, in order", "Boil water, then add tea"],
            [
              "Selection",
              "The path splits depending on a condition",
              "If it is raining, take an umbrella",
            ],
            [
              "Repetition",
              "A group of steps repeats",
              "Keep stirring until the sugar dissolves",
            ],
          ],
        },
        {
          kind: "heading",
          text: "Two ways to write an algorithm",
        },
        {
          kind: "compare",
          left: {
            title: "Flow chart: graphical",
            items: [
              "Uses standard shapes joined by arrows",
              "Easy to see the flow of control at a glance",
              "Good for showing branches and loops",
              "Slow to draw and to change",
            ],
          },
          right: {
            title: "Pseudocode: textual",
            items: [
              "English-like statements, indented",
              "Close to real code, so it converts easily",
              "Fast to write and edit",
              "Independent of any programming language",
            ],
          },
        },
        {
          kind: "callout",
          tone: "note",
          md: `Both describe the **same** algorithm. Which one you use is a matter of convenience, and of what the exam question asks for. Many questions ask for both.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.3-inline-1",
            level: "9.3",
            q: "Which of these fails the 'well-defined' requirement of an algorithm?",
            options: [
              "Set total to 0",
              "Add a reasonable amount to the total",
              "If mark is greater than 74, display 'A'",
              "Repeat the steps 10 times",
            ],
            answer: 1,
            explain:
              "'A reasonable amount' is ambiguous: two people would do different things. Every step in an algorithm must have exactly one possible interpretation.",
          },
        },
      ],
    },

    {
      id: "9.3.2",
      title: "Flow chart symbols",
      summary: "The six standard symbols, what each one means, and the rules that make a chart correct.",
      minutes: 14,
      outcomes: [
        "Identifies the standard symbols used to draw flow charts",
        "Draws flow charts to illustrate solutions to a given problem",
      ],
      blocks: [
        {
          kind: "text",
          md: `Flow chart symbols are standard. Using the wrong shape loses marks even when the logic is right, so learn these six.`,
        },
        { kind: "widget", id: "flowchart-builder", props: { mode: "symbols" } },
        {
          kind: "table",
          headers: ["Symbol", "Name", "Used for"],
          rows: [
            ["Rounded rectangle / oval", "Terminal", "Start and End: every chart has exactly one Start"],
            ["Parallelogram", "Input / Output", "Reading data in, or displaying results"],
            ["Rectangle", "Process", "A calculation or an assignment"],
            ["Diamond", "Decision", "A question with two exits, YES and NO"],
            ["Circle", "Connector", "Joins paths, or continues the chart elsewhere"],
            ["Rectangle with double side bars", "Subroutine", "A call to a separate module"],
          ],
        },
        {
          kind: "callout",
          tone: "exam",
          title: "Rules that gain and lose marks",
          md: `- Exactly **one** Start and normally one End.
- A **decision** must have exactly two labelled outgoing arrows: **YES** and **NO**.
- Arrows always show direction, never leave a line without an arrowhead.
- Every symbol except End must have an outgoing arrow.
- Input and output both use the **same** parallelogram shape.`,
        },
        {
          kind: "heading",
          text: "The voting example",
        },
        {
          kind: "text",
          md: `The syllabus's own example: check whether a person is eligible to vote. If age is 18 or more they may vote; otherwise they may not.`,
        },
        {
          kind: "flowchart",
          title: "Eligibility to vote",
          nodes: [
            { id: "start", shape: "terminal", text: "Start", next: "in" },
            { id: "in", shape: "io", text: "Read age", next: "dec" },
            {
              id: "dec",
              shape: "decision",
              text: "age < 18 ?",
              next: "no",
              no: "yes",
              edgeLabel: "YES",
              noLabel: "NO",
            },
            { id: "no", shape: "io", text: 'Display "Not eligible to vote"', next: "end" },
            { id: "yes", shape: "io", text: 'Display "Eligible to vote"', next: "end" },
            { id: "end", shape: "terminal", text: "End" },
          ],
          caption:
            "Both branches join again before End. Notice the decision is phrased as a question with a yes/no answer.",
        },
        {
          kind: "code",
          lang: "pseudo",
          caption: "The same algorithm as pseudocode",
          code: `Begin
    Read age
    If age < 18 then
        Display "Not eligible to vote"
    Else
        Display "Eligible to vote"
    Endif
End`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["20"],
          caption: "…and finally as Python",
          code: `age = int(input("Enter your age: "))

if age < 18:
    print("Not eligible to vote")
else:
    print("Eligible to vote")`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Write the decision as a question",
          md: `Inside a diamond, write \`age < 18 ?\`, not \`check the age\`. A decision box must have a yes/no answer, otherwise you cannot label the two exits.`,
        },
        { kind: "heading", text: "Showing repetition" },
        {
          kind: "text",
          md: `Selection splits the flow in two. **Repetition sends it backwards.** There is no special "loop symbol": a loop is drawn with the symbols you already know, plus one flow line that returns to a step that has already happened.

Every loop needs three things, and dropping any one of them is where marks are lost:

- somewhere to **start** the counter or total
- a **decision** that says whether to go round again
- something inside the body that **changes** what the decision tests`,
        },
        {
          kind: "flowchart",
          title: "Pre-test loop: add the numbers 1 to 10",
          nodes: [
            { id: "s", shape: "terminal", text: "Start", next: "init" },
            { id: "init", shape: "process", text: "total = 0, n = 1", next: "d" },
            {
              id: "d",
              shape: "decision",
              text: "n <= 10 ?",
              next: "body",
              no: "out",
              edgeLabel: "YES",
              noLabel: "NO",
            },
            { id: "body", shape: "process", text: "total = total + n", next: "inc" },
            { id: "inc", shape: "process", text: "n = n + 1", next: "d" },
            { id: "out", shape: "io", text: "Display total", next: "e" },
            { id: "e", shape: "terminal", text: "End" },
          ],
          caption:
            "The return line leaves the last step of the body and joins the flow line above the diamond. The condition is tested before the body runs, so if n started at 11 the body would never run at all.",
        },
        {
          kind: "code",
          lang: "pseudo",
          caption: "The same loop as pseudocode",
          code: `Begin
    total = 0
    n = 1
    While n <= 10 do
        total = total + n
        n = n + 1
    Endwhile
    Display total
End`,
        },
        {
          kind: "text",
          md: `Now the other kind. Sometimes the body **must** run at least once: you cannot ask "is the mark negative?" before you have read a mark. Put the decision at the **bottom** and the loop becomes a **post-test** loop.`,
        },
        {
          kind: "flowchart",
          title: "Post-test loop: keep reading marks until a negative one",
          nodes: [
            { id: "s", shape: "terminal", text: "Start", next: "init" },
            { id: "init", shape: "process", text: "total = 0", next: "read" },
            { id: "read", shape: "io", text: "Read mark", next: "add" },
            { id: "add", shape: "process", text: "total = total + mark", next: "d" },
            {
              id: "d",
              shape: "decision",
              text: "mark < 0 ?",
              next: "out",
              no: "read",
              edgeLabel: "YES",
              noLabel: "NO",
            },
            { id: "out", shape: "io", text: "Display total", next: "e" },
            { id: "e", shape: "terminal", text: "End" },
          ],
          caption:
            "The diamond sits after the body, so the body always runs once. The NO branch is the one that loops back: trace it with your finger and check you end up at Read mark.",
        },
        {
          kind: "code",
          lang: "pseudo",
          caption: "A post-test loop is written Repeat … Until",
          code: `Begin
    total = 0
    Repeat
        Read mark
        total = total + mark
    Until mark < 0
    Display total
End`,
        },
        {
          kind: "compare",
          title: "Which loop shape do I draw?",
          left: {
            title: "Pre-test: While … Endwhile",
            items: [
              "Diamond goes **above** the body",
              "Body may run **zero** times",
              "Loops while the condition is **true**",
              "Use when the list might be empty",
            ],
          },
          right: {
            title: "Post-test: Repeat … Until",
            items: [
              "Diamond goes **below** the body",
              "Body always runs **at least once**",
              "Loops until the condition becomes **true**",
              "Use for menus and for reading until a sentinel",
            ],
          },
        },
        {
          kind: "text",
          md: `A **counted** loop is just a pre-test loop where the counter is set up, tested and increased in a fixed pattern. Examiners still expect all three parts drawn out.`,
        },
        {
          kind: "flowchart",
          title: "Counted loop: display the numbers 1 to 5",
          nodes: [
            { id: "s", shape: "terminal", text: "Start", next: "init" },
            { id: "init", shape: "process", text: "i = 1", next: "d" },
            {
              id: "d",
              shape: "decision",
              text: "i <= 5 ?",
              next: "body",
              no: "e",
              edgeLabel: "YES",
              noLabel: "NO",
            },
            { id: "body", shape: "io", text: "Display i", next: "inc" },
            { id: "inc", shape: "process", text: "i = i + 1", next: "d" },
            { id: "e", shape: "terminal", text: "End" },
          ],
          caption: "In pseudocode this collapses to For i = 1 to 5 … Endfor: the same three parts, written on one line.",
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "The missing arrow, and the missing counter",
          md: `Two things cost marks on every past paper:

- **No return line.** The body just runs downwards into End, so nothing repeats. A loop is only a loop because an arrow goes *back*.
- **Nothing changes inside the body.** If \`n = n + 1\` is left out, \`n <= 10\` is true forever and the chart describes a program that never stops.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.3-inline-4",
            level: "9.3",
            q: "In a flow chart, what makes a group of symbols a loop?",
            options: [
              "A special repeat symbol",
              "A flow line that returns to an earlier symbol",
              "Two diamonds in a row",
              "Drawing the symbols side by side",
            ],
            answer: 1,
            explain:
              "There is no loop symbol. Repetition is shown by a flow line that goes back to a step that has already been carried out, so the same symbols are followed again.",
          },
        },
        {
          kind: "heading",
          text: "Draw your own",
        },
        {
          kind: "text",
          md: `Use the builder to construct a flow chart for this problem: **read a mark and display "Pass" if it is 50 or more, otherwise "Fail"**. Then check it against the pseudocode you would write.

When that works, try a loop: press **Loop example**, then change one arrow so the chart counts to 10 instead of 5. Pointing any step back at an earlier one draws the return line for you.`,
        },
        { kind: "widget", id: "flowchart-builder" },
        {
          kind: "check",
          question: {
            id: "q-9.3-inline-2",
            level: "9.3",
            q: "Which symbol is used to display a result on the screen?",
            options: ["Rectangle", "Diamond", "Parallelogram", "Oval"],
            answer: 2,
            explain:
              "The parallelogram is the input/output symbol. It is used both for reading data in and for displaying results: the same shape for both.",
          },
        },
      ],
    },

    {
      id: "9.3.3",
      title: "Writing pseudocode",
      summary: "The conventions that make pseudocode readable, and how each pattern maps onto Python.",
      minutes: 12,
      outcomes: ["Writes pseudo codes to illustrate solutions to a given problem"],
      blocks: [
        {
          kind: "text",
          md: `Pseudocode is a **high-level description** of an algorithm, written in English-like statements that are close to a programming language but not tied to any particular one.

There is no single official standard, but exam answers are expected to follow the conventions below.`,
        },
        {
          kind: "table",
          headers: ["Purpose", "Pseudocode", "Python"],
          rows: [
            ["Start / end", "Begin … End", "(the file itself)"],
            ["Input", "Read age", 'age = int(input())'],
            ["Output", 'Display "Hello"', 'print("Hello")'],
            ["Assignment", "total = 0", "total = 0"],
            ["Selection", "If … then … Else … Endif", "if …: … else: …"],
            ["Multi-way", "If … then … Elseif … Else … Endif", "if …: elif …: else:"],
            ["Pre-test loop", "While … do … Endwhile", "while …:"],
            ["Post-test loop", "Repeat … Until …", "while True: … if …: break"],
            ["Counted loop", "For i = 1 to 10 … Endfor", "for i in range(1, 11):"],
          ],
        },
        {
          kind: "callout",
          tone: "key",
          title: "Three habits worth marks",
          md: `1. **Indent** everything inside an If or a loop.
2. **Close** every block: \`Endif\`, \`Endwhile\`, \`Endfor\`.
3. Use \`Read\` for input and \`Display\` for output consistently.`,
        },
        {
          kind: "heading",
          text: "Worked example: sum of 1 to 100",
        },
        {
          kind: "code",
          lang: "pseudo",
          code: `Begin
    total = 0
    For count = 1 to 100
        total = total + count
    Endfor
    Display total
End`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `total = 0
for count in range(1, 101):
    total = total + count
print(total)`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "Off by one",
          md: `\`For count = 1 to 100\` includes 100. In Python, \`range(1, 100)\` **stops at 99**: you need \`range(1, 101)\`. This single difference is the most common error when converting pseudocode to Python.`,
        },
        {
          kind: "heading",
          text: "Worked example: keep adding until the total passes 50",
        },
        {
          kind: "text",
          md: `This one needs a **while** loop, because you do not know in advance how many numbers you will add.`,
        },
        {
          kind: "code",
          lang: "pseudo",
          code: `Begin
    total = 0
    number = 1
    While total < 50 do
        total = total + number
        number = number + 1
    Endwhile
    Display total
End`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `total = 0
number = 1
while total < 50:
    total = total + number
    number = number + 1
print("Total:", total)
print("Numbers added: 1 to", number - 1)`,
        },
        { kind: "exercise", exerciseId: "ex-9.3-1" },
      ],
    },

    {
      id: "9.3.4",
      title: "Hand tracing (dry running)",
      summary:
        "Verify an algorithm on paper before you trust it: the skill that turns guessing into checking.",
      minutes: 16,
      outcomes: ["Uses hand traces to verify the solutions"],
      blocks: [
        {
          kind: "text",
          md: `A **hand trace** (or *dry run*) means working through an algorithm line by line with a chosen example, writing down the value of every variable after each step.

You do it **before** running the program, to find errors early. It is also an extremely common exam question: *"given this flow chart, what is the output?"*`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "How to build a trace table",
          md: `1. Draw one column for each **variable**, plus a column for **output**.
2. Draw one row for each **step** that changes something.
3. Choose a small input value: big enough to exercise the loop, small enough to finish.
4. Fill in the table one line at a time. **Do not skip ahead** and do not use what you *think* the answer is.`,
        },
        {
          kind: "heading",
          text: "Trace this algorithm by hand",
        },
        {
          kind: "code",
          lang: "pseudo",
          code: `Begin
    total = 0
    For i = 1 to 4
        total = total + i
    Endfor
    Display total
End`,
        },
        {
          kind: "table",
          headers: ["Step", "i", "total", "Output"],
          rows: [
            ["total = 0", "-", "0", ""],
            ["i = 1", "1", "1", ""],
            ["i = 2", "2", "3", ""],
            ["i = 3", "3", "6", ""],
            ["i = 4", "4", "10", ""],
            ["Display total", "4", "10", "10"],
          ],
          caption: "Every row shows the values AFTER that step has run.",
        },
        {
          kind: "heading",
          text: "Now let the computer trace it for you",
        },
        {
          kind: "text",
          md: `The tool below runs real Python one line at a time and shows every variable as it changes. Use it to **check** your paper trace, never to replace it, because the exam is on paper.`,
        },
        {
          kind: "trace",
          caption: "Step through and watch `total` grow. Compare it with the table above.",
          code: `total = 0
for i in range(1, 5):
    total = total + i
print(total)`,
        },
        {
          kind: "heading",
          text: "A harder trace: swapping and looping",
        },
        {
          kind: "text",
          md: `Trace this one on paper first. What does it print? Then step through it to check.`,
        },
        {
          kind: "trace",
          code: `a = 5
b = 12
if a > b:
    big = a
else:
    big = b

count = 0
while big > 0:
    big = big - 4
    count = count + 1

print("count =", count)
print("big =", big)`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "Exam technique",
          md: `When a question gives you a flow chart and asks for the output, **always draw the trace table**. Candidates who try to follow the arrows in their head get it wrong. The table takes 90 seconds and turns a hard question into an easy one.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.3-inline-3",
            level: "9.3",
            q: "What is the value of `total` when this finishes?",
            code: "total = 0\nfor i in range(1, 4):\n    total = total + i * 2",
            options: ["6", "12", "8", "18"],
            answer: 1,
            explain:
              "i takes the values 1, 2, 3 (range stops before 4). total becomes 0+2 = 2, then 2+4 = 6, then 6+6 = 12.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.3-2" },
        { kind: "exercise", exerciseId: "ex-9.3-3" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.3-3",
      title: "Reverse a number the algorithm way",
      level: "9.3",
      difficulty: 2,
      xp: 45,
      tags: ["loops", "algorithms", "modulus"],
      brief: `Reversing \`1234\` into \`4321\` is trivial with strings. Doing it with **arithmetic** is a classic exam algorithm, and it is worth understanding because it is pure loop-and-accumulate.

The idea, one digit at a time:

\`\`\`
reversed = 0
Repeat
    digit    = number MOD 10       take the last digit
    reversed = reversed * 10 + digit
    number   = number DIV 10       chop the last digit off
Until number = 0
\`\`\`

Read a positive whole number and print \`Reversed: 4321\`.

You may **not** use \`str()\`, \`[::-1]\` or \`reversed()\`. Use \`%\` and \`//\`.`,
      starter: `number = int(input("Enter a number: "))

# Your code here
`,
      hints: [
        "`number % 10` gives the last digit. `number // 10` removes it.",
        "Start with `result = 0` before the loop.",
        "Each pass: `result = result * 10 + number % 10`, then `number = number // 10`.",
        "Loop `while number > 0:`. When number reaches 0 every digit has been used.",
      ],
      solution: `number = int(input("Enter a number: "))

result = 0
while number > 0:
    digit = number % 10
    result = result * 10 + digit
    number = number // 10

print("Reversed:", result)`,
      tests: [
        { kind: "io", name: "1234 reverses", stdin: ["1234"], expect: "Reversed: 4321", match: "loose" },
        { kind: "io", name: "Single digit", stdin: ["7"], expect: "Reversed: 7", match: "loose" },
        { kind: "io", name: "Trailing zero disappears", stdin: ["1200"], expect: "Reversed: 21", match: "loose", hidden: true },
        { kind: "io", name: "Palindrome stays the same", stdin: ["1221"], expect: "Reversed: 1221", match: "loose", hidden: true },
        {
          kind: "source",
          name: "Uses arithmetic, not string tricks",
          mustUse: ["%"],
          mustNotUse: ["str(", "[::-1]", "reversed("],
        },
      ],
    },
    {
      id: "ex-9.3-1",
      title: "Convert pseudocode to Python",
      level: "9.3",
      difficulty: 1,
      xp: 30,
      tags: ["pseudocode", "loops"],
      brief: `Convert this pseudocode into working Python.

\`\`\`
Begin
    total = 0
    For number = 1 to 100
        If number MOD 2 = 0 then
            total = total + number
        Endif
    Endfor
    Display "Sum of even numbers:", total
End
\`\`\`

It should print exactly: \`Sum of even numbers: 2550\``,
      starter: `total = 0

# Your code here
`,
      hints: [
        "`For number = 1 to 100` includes 100, so in Python you need `range(1, 101)`.",
        "`MOD` is the remainder operator. In Python it is `%`.",
        "A number is even when `number % 2 == 0`. Note the double `==` for comparison.",
        "The `if` goes inside the `for` loop, so it must be indented one extra level.",
      ],
      solution: `total = 0
for number in range(1, 101):
    if number % 2 == 0:
        total = total + number
print("Sum of even numbers:", total)`,
      tests: [
        {
          kind: "io",
          name: "Prints the correct sum",
          expect: "Sum of even numbers: 2550",
          match: "loose",
        },
        {
          kind: "source",
          name: "Uses a loop rather than the formula",
          mustUse: ["for"],
        },
      ],
    },
    {
      id: "ex-9.3-2",
      title: "Triangular numbers",
      level: "9.3",
      difficulty: 2,
      xp: 35,
      tags: ["loops", "algorithms"],
      brief: `The **n-th triangular number** is the sum of all whole numbers from 1 to n. So the first five are 1, 3, 6, 10, 15.

Write a program that prints the **first ten** triangular numbers, one per line, with no extra text.

Build each total up with a **loop**. The closed-form formula and \`sum()\` are both off limits: the loop is the point.`,
      starter: `# Print the first ten triangular numbers
`,
      hints: [
        "Keep a running total outside the loop, starting at 0.",
        "Loop `n` from 1 to 10 with `range(1, 11)`.",
        "Each time round, add `n` to the running total, then print the total.",
        "Print inside the loop, not after it: you need ten lines.",
      ],
      solution: `total = 0
for n in range(1, 11):
    total = total + n
    print(total)`,
      tests: [
        {
          kind: "source",
          name: "Builds the total with a loop, not a formula",
          mustUse: ["for "],
          mustNotUse: ["sum(", "*(n + 1)", "* (n + 1)"],
        },
        {
          kind: "io",
          name: "Prints all ten values in order",
          expect: "1\n3\n6\n10\n15\n21\n28\n36\n45\n55",
          match: "loose",
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.3-1",
      level: "9.3",
      q: "Which is the best definition of an algorithm?",
      options: [
        "A program written in Python",
        "A finite sequence of well-defined instructions used to solve a problem",
        "A diagram made of standard symbols",
        "The output produced by a computer",
      ],
      answer: 1,
      explain:
        "The key words are finite (it ends) and well-defined (each step is unambiguous). A flow chart is one way to represent an algorithm; it is not the algorithm itself.",
      difficulty: 1,
    },
    {
      id: "q-9.3-2",
      level: "9.3",
      q: "Which flow chart symbol has two outgoing arrows?",
      options: ["Process (rectangle)", "Decision (diamond)", "Terminal (oval)", "Input/Output (parallelogram)"],
      answer: 1,
      explain:
        "Only the decision symbol branches. It must have exactly two labelled exits, YES and NO.",
      difficulty: 1,
    },
    {
      id: "q-9.3-3",
      level: "9.3",
      q: "What is the output of this algorithm?",
      code: "count = 0\nnum = 10\nWhile num > 0 do\n    num = num - 3\n    count = count + 1\nEndwhile\nDisplay count",
      options: ["3", "4", "5", "It loops forever"],
      answer: 1,
      explain:
        "num goes 10 → 7 → 4 → 1 → −2, so the loop body runs four times before num > 0 becomes false. count is 4.",
      difficulty: 3,
    },
    {
      id: "q-9.3-4",
      level: "9.3",
      q: "Why do programmers perform a hand trace?",
      options: [
        "To make the program run faster",
        "To check the logic of an algorithm and find errors before running it",
        "To translate pseudocode into machine code",
        "To count the number of lines in the program",
      ],
      answer: 1,
      explain:
        "A hand trace verifies the solution manually, line by line with example values, so that logic errors are caught before execution.",
      difficulty: 1,
    },
    {
      id: "q-9.3-5",
      level: "9.3",
      q: "Which pseudocode correctly displays 'Pass' for marks of 50 or above and 'Fail' otherwise?",
      options: [
        "If marks > 50 then Display \"Pass\" Else Display \"Fail\" Endif",
        "If marks >= 50 then Display \"Pass\" Else Display \"Fail\" Endif",
        "If marks = 50 then Display \"Pass\" Else Display \"Fail\" Endif",
        "If marks < 50 then Display \"Pass\" Else Display \"Fail\" Endif",
      ],
      answer: 1,
      explain:
        "'50 or above' includes 50 itself, so the condition must be `>=`. Using `>` would wrongly fail a student with exactly 50.",
      difficulty: 2,
    },
    {
      id: "q-9.3-6",
      level: "9.3",
      q: "A flow chart symbol shaped like a circle is used to:",
      options: [
        "Show the start of the algorithm",
        "Join paths together or continue the chart in another place",
        "Represent a decision",
        "Represent a calculation",
      ],
      answer: 1,
      explain:
        "The circle is the connector symbol. It keeps long charts readable by joining flow lines or continuing on another part of the page.",
      difficulty: 2,
    },
    {
      id: "q-9.3-7",
      level: "9.3",
      q: "What does this print?",
      code: "x = 3\ny = 7\nx = y\ny = x\nprint(x, y)",
      options: ["7 3", "3 7", "7 7", "3 3"],
      answer: 2,
      explain:
        "`x = y` makes x become 7, overwriting the 3. Then `y = x` makes y become 7 as well: the original 3 is lost. Swapping two values needs a third (dummy) variable, which is why bubble sort needs one.",
      difficulty: 3,
    },
    {
      id: "q-9.3-8",
      level: "9.3",
      q: "In a trace table, what should each row represent?",
      options: [
        "One variable in the algorithm",
        "One execution step, showing the values after that step",
        "One line of the final program",
        "One test case",
      ],
      answer: 1,
      explain:
        "Columns are variables (plus output); rows are steps. Each row records the state of every variable after that step has executed.",
      difficulty: 2,
    },
  ],
};
