import type { Module } from "../types";

export const m01: Module = {
  id: "9.1",
  slug: "problem-solving",
  title: "The Problem-Solving Process",
  tagline: "Before you write a single line of code, you have to understand what you are solving.",
  icon: "Lightbulb",
  periods: 2,
  outcomes: ["Describes the steps of problem solving process", "Implements the solution"],
  contents: [
    "Understanding the problem",
    "Defining the problem and boundaries",
    "Planning solution",
    "Implementation",
  ],

  lessons: [
    {
      id: "9.1.1",
      title: "What problem solving actually means",
      summary:
        "The four-stage cycle every solution goes through — and why skipping the first stage is the most expensive mistake a programmer makes.",
      minutes: 12,
      outcomes: ["Describes the steps of problem solving process"],
      blocks: [
        {
          kind: "text",
          md: `Most students who struggle with programming are not bad at Python. They are trying to write code before they know what they are building.

Problem solving is a **process**, and it is the same process whether you are switching on an air conditioner when a room gets warm, choosing which course to follow after A/Ls, or writing a program to grade 500 students. The syllabus calls it a *cycle* because the last stage feeds back into the first.`,
        },
        { kind: "widget", id: "problem-solving-cycle" },
        {
          kind: "heading",
          text: "The four stages",
        },
        {
          kind: "steps",
          steps: [
            {
              title: "Understanding the problem",
              md: `Read the problem until you can explain it to someone else **in your own words**. Ask: what am I given? What am I asked to produce? What does a correct answer look like?

A useful test: can you solve one example by hand, on paper, without a computer? If not, you do not understand the problem yet.`,
            },
            {
              title: "Defining the problem and boundaries",
              md: `Write down exactly what is **inside** the problem and what is **outside** it. The boundary is the line between them.

If the problem says *"calculate the discount for a customer"*, is validating the customer's phone number inside or outside? Deciding this early stops the solution growing forever.`,
            },
            {
              title: "Planning the solution",
              md: `Work out the steps **before** touching a keyboard. Break the problem into smaller parts, decide the order, and write the plan as an algorithm — a flow chart or pseudocode.

This is where most of the real thinking happens. Competency levels 9.2 and 9.3 are entirely about this stage.`,
            },
            {
              title: "Implementation",
              md: `Now translate the plan into a programming language, run it, and test it with real values.

If the results are wrong, you go back around the cycle — usually to *understanding*, because a wrong answer almost always means a misunderstood problem.`,
            },
          ],
        },
        {
          kind: "callout",
          tone: "exam",
          title: "How this is examined",
          md: `You will be given a short real-world situation and asked to **write down the steps to solve it**. Marks come from naming the stages in order and applying them to *that* situation — not from generic definitions. Always mention the boundary explicitly; it is the step candidates most often forget.`,
        },
        {
          kind: "heading",
          text: "A worked example: the cup of tea",
        },
        {
          kind: "text",
          md: `The syllabus uses making a cup of tea because it makes the structure obvious. Every problem has the same shape: **input → process → output**.`,
        },
        {
          kind: "table",
          headers: ["Stage", "For a cup of tea"],
          rows: [
            [
              "Understand",
              "Someone wants a hot drink of tea. Success = a cup of tea at drinkable temperature, correctly sweetened.",
            ],
            [
              "Define & bound",
              "Inside: boiling water, adding tea, milk, sugar, stirring. Outside: growing tea, buying sugar, washing the cup afterwards.",
            ],
            [
              "Plan",
              "1. Boil water. 2. Put tea in cup. 3. Pour water. 4. Add milk and sugar. 5. Stir.",
            ],
            ["Implement", "Actually do it, taste it, and adjust the sugar next time."],
          ],
          caption: "Input = water, tea, milk, sugar. Process = boiling and mixing. Output = a cup of tea.",
        },
        {
          kind: "callout",
          tone: "key",
          title: "Input · Process · Output",
          md: `Every program you write this year has these three parts. When you are stuck on a problem, write those three headings on your page and fill them in. It works surprisingly often.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.1-inline-1",
            level: "9.1",
            q: "A shop asks you to write a program that calculates a customer's bill. During which stage do you decide that handling refunds is NOT part of this program?",
            options: [
              "Understanding the problem",
              "Defining the problem and boundaries",
              "Planning the solution",
              "Implementation",
            ],
            answer: 1,
            explain:
              "Deciding what is inside and outside the problem is exactly what 'defining the boundaries' means. Refunds are a related but separate problem, so they sit outside the boundary.",
          },
        },
      ],
    },

    {
      id: "9.1.2",
      title: "Working a problem end to end",
      summary:
        "Take one real question from the plan stage all the way to running Python, and see the cycle close.",
      minutes: 15,
      outcomes: ["Describes the steps of problem solving process", "Implements the solution"],
      blocks: [
        {
          kind: "callout",
          tone: "note",
          title: "The problem",
          md: `A shop gives a **15% discount** when a customer buys goods worth **Rs. 2,000 or more**. Write a program that reads the bill amount from the keyboard and displays the amount the customer has to pay.`,
        },
        { kind: "heading", text: "Stage 1 — Understand" },
        {
          kind: "text",
          md: `Solve one by hand first. If the bill is **Rs. 3,000**: the discount is 15% of 3,000 = **450**, so the customer pays **2,550**.

If the bill is **Rs. 1,500**: it is below 2,000, so there is no discount and the customer pays **1,500**.

Now you understand it — you produced correct answers without a computer.`,
        },
        { kind: "heading", text: "Stage 2 — Define and bound" },
        {
          kind: "compare",
          left: {
            title: "Inside the problem",
            items: [
              "Reading one bill amount from the keyboard",
              "Deciding whether the discount applies",
              "Calculating the final amount",
              "Displaying the final amount",
            ],
          },
          right: {
            title: "Outside the problem",
            items: [
              "Storing the sale in a database",
              "Printing a paper receipt",
              "Handling more than one customer",
              "Checking the amount typed is sensible",
            ],
          },
        },
        { kind: "heading", text: "Stage 3 — Plan" },
        {
          kind: "code",
          lang: "pseudo",
          caption: "The plan, written as pseudocode — no Python yet",
          code: `Begin
    Read amount
    If amount >= 2000 then
        discount = amount * 15 / 100
        final = amount - discount
    Else
        final = amount
    Endif
    Display final
End`,
        },
        { kind: "heading", text: "Stage 4 — Implement" },
        {
          kind: "text",
          md: `Only now do we write Python. Notice how each pseudocode line becomes roughly one Python line — that is the reward for planning properly.`,
        },
        {
          kind: "code",
          runnable: true,
          stdin: ["3000"],
          caption: "Press Run. Type a bill amount when it asks.",
          code: `# Read the bill amount from the keyboard
amount = float(input("Enter the bill amount (Rs.): "))

# Decide whether the discount applies
if amount >= 2000:
    discount = amount * 15 / 100
    final = amount - discount
else:
    final = amount

# Show the result
print("Amount to pay: Rs.", final)`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Test at the boundary",
          md: `Always test the exact value where behaviour changes. Here that is **2000**. Run the program with 1999, 2000 and 2001. A program that is right for 3000 and 1500 can still be wrong at 2000 — that is the classic off-by-one error, and examiners test for it.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.1-inline-2",
            level: "9.1",
            q: "The program above is run with an amount of exactly 2000. What does it display?",
            options: ["2000.0", "1700.0", "1750.0", "Nothing — it is an error"],
            answer: 1,
            explain:
              "2000 satisfies `amount >= 2000`, so the discount applies: 15% of 2000 is 300, and 2000 − 300 = 1700.0. This is exactly why you must test the boundary value itself.",
          },
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "Common mistake",
          md: `Writing \`if amount > 2000\` instead of \`if amount >= 2000\`. The problem says *"2,000 rupees or more"*, so 2000 itself must get the discount. One character changes the answer.`,
        },
        { kind: "exercise", exerciseId: "ex-9.1-1" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.1-1",
      title: "Discount with a message",
      level: "9.1",
      difficulty: 1,
      xp: 30,
      tags: ["input", "selection", "problem solving"],
      brief: `Extend the shop program.

Read the bill amount from the keyboard. If it is **2000 or more**, apply a **15%** discount and print the final amount. If it is **less than 2000**, print the message \`No discount...\` and then the amount unchanged.

Print the final amount on its own line in the form \`Amount to pay: 1700.0\`.`,
      starter: `amount = float(input("Enter the bill amount (Rs.): "))

# Your code here
`,
      hints: [
        "You need one `if` and one `else`. The `else` branch runs when the amount is below 2000.",
        "Remember `>=` means 'greater than or equal to'. The problem says 2000 counts as qualifying.",
        "To find 15% of a number: `amount * 15 / 100`. Subtract that from the amount.",
        "In the else branch, print `No discount...` first, then print the amount to pay.",
      ],
      solution: `amount = float(input("Enter the bill amount (Rs.): "))

if amount >= 2000:
    discount = amount * 15 / 100
    final = amount - discount
else:
    print("No discount...")
    final = amount

print("Amount to pay:", final)`,
      tests: [
        {
          kind: "io",
          name: "3000 gets the discount",
          stdin: ["3000"],
          expect: "Amount to pay: 2550.0",
          match: "contains",
        },
        {
          kind: "io",
          name: "Exactly 2000 gets the discount",
          stdin: ["2000"],
          expect: "Amount to pay: 1700.0",
          match: "contains",
        },
        {
          kind: "io",
          name: "1500 shows the no-discount message",
          stdin: ["1500"],
          expect: "No discount...",
          match: "contains",
        },
        {
          kind: "io",
          name: "1500 still shows the amount",
          stdin: ["1500"],
          expect: "Amount to pay: 1500.0",
          match: "contains",
          hidden: true,
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.1-1",
      level: "9.1",
      q: "What are the four stages of the problem-solving process, in the correct order?",
      options: [
        "Plan, understand, implement, define",
        "Understand the problem, define the problem and boundaries, plan the solution, implement",
        "Write code, test code, fix code, submit code",
        "Input, process, output, feedback",
      ],
      answer: 1,
      explain:
        "The syllabus order is: understanding the problem, defining the problem and boundaries, planning the solution, and implementation. The process is cyclic — implementation often sends you back to understanding.",
      difficulty: 1,
    },
    {
      id: "q-9.1-2",
      level: "9.1",
      q: "Why is defining the boundary of a problem important?",
      options: [
        "It makes the program run faster",
        "It decides which programming language to use",
        "It states clearly what is inside and outside the solution, so the work does not grow endlessly",
        "It is only needed for database problems",
      ],
      answer: 2,
      explain:
        "The boundary separates what the solution must handle from what it must not. Without it, requirements keep expanding and the problem is never finished.",
      difficulty: 1,
    },
    {
      id: "q-9.1-3",
      level: "9.1",
      q: "A student jumps straight to writing Python without planning. Which stage have they skipped, and what is the most likely result?",
      options: [
        "Implementation — the program will not compile",
        "Planning — the code is likely to solve the wrong problem or need heavy rewriting",
        "Understanding — the computer will reject the code",
        "No stage; planning is optional for small programs",
      ],
      answer: 1,
      explain:
        "Skipping planning means writing code without an algorithm. The usual result is code that half-works and has to be rewritten, because the structure was never thought through.",
      difficulty: 2,
    },
    {
      id: "q-9.1-4",
      level: "9.1",
      q: "In the 'making a cup of tea' example, which part is the PROCESS?",
      options: [
        "Tea leaves, water, milk, sugar",
        "Boiling the water and mixing the ingredients",
        "The finished cup of tea",
        "The cup itself",
      ],
      answer: 1,
      explain:
        "Input = the ingredients; process = boiling and mixing; output = the cup of tea. Every program has this same three-part shape.",
      difficulty: 1,
    },
    {
      id: "q-9.1-5",
      level: "9.1",
      q: "Why is the problem-solving process described as CYCLIC rather than a straight line?",
      options: [
        "Because programs must be run more than once",
        "Because testing the implementation often reveals a misunderstanding, sending you back to an earlier stage",
        "Because computers work in cycles of clock ticks",
        "Because each stage takes exactly the same amount of time",
      ],
      answer: 1,
      explain:
        "When the implemented solution gives wrong results, you return to understanding or planning and go round again. That feedback loop is what makes it a cycle.",
      difficulty: 2,
    },
    {
      id: "q-9.1-6",
      level: "9.1",
      q: "A problem states: 'apply a 30% discount for all purchases of MORE THAN Rs. 400,000'. Which condition is correct?",
      code: "purchase = float(input())",
      options: [
        "if purchase >= 400000:",
        "if purchase > 400000:",
        "if purchase < 400000:",
        "if purchase == 400000:",
      ],
      answer: 1,
      explain:
        "'More than' excludes the value itself, so `>` is correct. Exactly Rs. 400,000 would get no discount. Read the wording carefully — 'or more' would need `>=`.",
      difficulty: 2,
    },
  ],
};
