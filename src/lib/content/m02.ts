import type { Module } from "../types";

export const m02: Module = {
  id: "9.2",
  slug: "top-down-design",
  title: "Top-Down Design & Structure Charts",
  tagline: "Big problems are just small problems that have not been split up yet.",
  icon: "Network",
  periods: 4,
  outcomes: [
    "Uses stepwise refinement methodology to solve problems",
    "Draws structure charts to illustrate a solution for a system",
  ],
  contents: ["Modularization", "Top down design and stepwise refinement", "Structure charts"],

  lessons: [
    {
      id: "9.2.1",
      title: "Modularization: breaking the problem apart",
      summary:
        "Why splitting a system into subsystems is the single most useful design skill, and how far to split.",
      minutes: 12,
      outcomes: ["Uses stepwise refinement methodology to solve problems"],
      blocks: [
        {
          kind: "text",
          md: `**Modularization** (also called **decomposition**) means breaking a big problem into smaller logical sub-problems, solving each one, and connecting the sub-solutions to solve the original problem.

You already do this. "Clean the house" is really "clean the kitchen", "clean the bedrooms", "sweep the garden". Nobody holds the whole thing in their head at once.`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "The four steps",
          md: `1. Identify the problem
2. Identify the sub-problems (the causes or parts of the main problem)
3. Find a solution to each sub-problem
4. Connect the sub-solutions logically to solve the main problem`,
        },
        {
          kind: "heading",
          text: "An example from the syllabus",
        },
        {
          kind: "text",
          md: `**Main problem:** inefficient administration in an organization.

That is far too big to solve directly. Split it by division:`,
        },
        {
          kind: "structure",
          title: "Inefficient administration, decomposed",
          tree: {
            label: "Inefficient administration",
            children: [
              { label: "Finance division", note: "late payments, no budget control" },
              { label: "Human resource division", note: "slow recruitment, poor records" },
              { label: "Technical division", note: "old equipment, no maintenance plan" },
            ],
          },
          caption:
            "Each division is now a problem small enough for one team to actually solve.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "How small is small enough?",
          md: `Stop splitting when a sub-problem **cannot be broken down further in a way that makes sense**, and one person could solve it in one sitting. In programming terms, that is usually the point where a sub-problem becomes a single function.`,
        },
        {
          kind: "heading",
          text: "Stepwise refinement",
        },
        {
          kind: "text",
          md: `Your first attempt at splitting a problem is rarely the best one. **Stepwise refinement** means going back over your design and improving it: combining sub-problems that turned out to be the same thing, or splitting one that turned out to be too big.

This is a normal part of design, not a sign of failure. The syllabus explicitly says *"in the first attempt, we may not get the best possible modularization"*.`,
        },
        {
          kind: "compare",
          title: "Two directions of design",
          left: {
            title: "Top-down design",
            items: [
              "Start with the whole system",
              "Break it into major parts",
              "Break each part into smaller parts",
              "Keep going until each piece is simple",
              "The approach your syllabus requires",
            ],
          },
          right: {
            title: "Bottom-up design",
            items: [
              "Start with small pieces you already have",
              "Combine them into larger components",
              "Keep combining until the system is complete",
              "Useful when reusing an existing library",
            ],
          },
        },
        {
          kind: "check",
          question: {
            id: "q-9.2-inline-1",
            level: "9.2",
            q: "What does 'stepwise refinement' mean?",
            options: [
              "Running the program step by step to find errors",
              "Repeatedly improving the breakdown of a problem until each part is simple enough to solve",
              "Writing the program one line at a time",
              "Refining the output so it looks neat",
            ],
            answer: 1,
            explain:
              "Stepwise refinement is a design activity: you refine your decomposition, splitting or merging sub-problems until every piece is at a manageable level. Stepping through code to find errors is hand tracing or debugging.",
          },
        },
      ],
    },

    {
      id: "9.2.2",
      title: "Structure charts",
      summary:
        "The standard diagram for showing how a system breaks down into modules, and how to draw one that earns full marks.",
      minutes: 16,
      outcomes: ["Draws structure charts to illustrate a solution for a system"],
      blocks: [
        {
          kind: "text",
          md: `Once you have decomposed a system, you have to **document** it so other people can see the breakdown. The standard diagram for this is a **structure chart**.

A structure chart is a tree. The whole system sits at the top. Each level below shows the modules that make up the level above it, down to the lowest manageable level.`,
        },
        {
          kind: "structure",
          title: "Structure chart: a student result management system",
          tree: {
            label: "Student Result System",
            children: [
              {
                label: "Manage students",
                children: [
                  { label: "Add student" },
                  { label: "Update student" },
                  { label: "Delete student" },
                ],
              },
              {
                label: "Manage marks",
                children: [{ label: "Enter marks" }, { label: "Validate marks" }],
              },
              {
                label: "Produce reports",
                children: [
                  { label: "Calculate grade" },
                  { label: "Rank students" },
                  { label: "Print report" },
                ],
              },
            ],
          },
          caption:
            "Read it downwards: 'Produce reports' is made up of calculating grades, ranking, and printing.",
        },
        {
          kind: "callout",
          tone: "exam",
          title: "Marks come from structure, not artwork",
          md: `An examiner is checking that:
- the **whole system** is the single box at the top,
- each level is genuinely **made of** the level below it,
- modules at the same level are **at a similar size**, and
- the lowest boxes are single, simple tasks.

Neat handwriting earns nothing. A logically correct tree earns everything.`,
        },
        {
          kind: "heading",
          text: "Build one yourself",
        },
        {
          kind: "text",
          md: `Use the builder below. Start from the system name, add the major modules, then break each one down. Try it with a **library management system** before you look at any answer.`,
        },
        { kind: "widget", id: "structure-chart-builder" },
        {
          kind: "callout",
          tone: "mistake",
          title: "Common mistake",
          md: `Mixing levels of detail. If one branch says "Manage students" and the branch next to it says "Press the save button", the chart is wrong: those are not at the same level. Sibling boxes should feel like they belong in the same sentence.`,
        },
        {
          kind: "heading",
          text: "From structure chart to code",
        },
        {
          kind: "text",
          md: `A structure chart is not just a diagram for the exam. Each of the lowest boxes usually becomes one **function** in your program, and the boxes above them become functions that call those functions. That is why this topic sits right before you learn about sub-programs in 9.9.`,
        },
        {
          kind: "code",
          lang: "python",
          caption: "The bottom of the chart, sketched in Python",
          code: `def calculate_grade(marks):
    ...

def rank_students(students):
    ...

def print_report(students):
    ...

def produce_reports(students):
    """This module is made of the three below it: exactly like the chart."""
    for s in students:
        s["grade"] = calculate_grade(s["marks"])
    rank_students(students)
    print_report(students)`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.2-inline-2",
            level: "9.2",
            q: "In a structure chart, what does a box on a lower level represent?",
            options: [
              "A step that runs after the box above it",
              "A part of the module directly above it",
              "An error handler for the box above it",
              "A variable used by the box above it",
            ],
            answer: 1,
            explain:
              "Structure charts show composition, not sequence. A lower box is a component of the module above it. Order of execution is shown by flow charts, not structure charts.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.2-1" },
        { kind: "exercise", exerciseId: "ex-9.2-2" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.2-2",
      title: "Build the structure chart in code",
      level: "9.2",
      difficulty: 2,
      xp: 45,
      tags: ["decomposition", "functions", "top-down design"],
      brief: `A school canteen system was decomposed into three sub-modules. Your job is to turn that structure chart into working code, keeping each box a **separate function**.

\`\`\`
              Canteen bill
        ____________|____________
       |            |            |
  subtotal()   discount()     total()
\`\`\`

Write these three functions exactly:

- \`subtotal(price, qty)\` returns \`price * qty\`
- \`discount(amount)\` returns **10%** of the amount when it is **1000 or more**, otherwise \`0\`
- \`total(price, qty)\` uses the other two functions and returns what the customer pays

Then read a price and a quantity and print \`Total: 1800.0\`.

The point is the **shape** of the solution: \`total()\` must call the other two rather than repeat their arithmetic. That is what a structure chart is telling you to do.`,
      starter: `def subtotal(price, qty):
    pass


def discount(amount):
    pass


def total(price, qty):
    pass


price = float(input("Price: "))
qty = int(input("Quantity: "))
# Print the total here
`,
      hints: [
        "Each function must `return` its answer, not print it.",
        "`discount` decides with an `if`: `if amount >= 1000: return amount * 0.1` else `return 0`.",
        "`total` should call `subtotal(price, qty)` first, then pass that answer to `discount`.",
        "The customer pays the subtotal minus the discount.",
      ],
      solution: `def subtotal(price, qty):
    return price * qty


def discount(amount):
    if amount >= 1000:
        return amount * 0.1
    return 0


def total(price, qty):
    amount = subtotal(price, qty)
    return amount - discount(amount)


price = float(input("Price: "))
qty = int(input("Quantity: "))
print("Total:", total(price, qty))`,
      tests: [
        { kind: "io", name: "500 x 4 earns the discount", stdin: ["500", "4"], expect: "Total: 1800.0", match: "loose" },
        { kind: "io", name: "Below the threshold", stdin: ["100", "3"], expect: "Total: 300.0", match: "loose" },
        { kind: "expr", name: "subtotal() multiplies", stdin: ["1", "1"], expr: "subtotal(250, 4)", expect: "1000" },
        { kind: "expr", name: "discount() at the boundary", stdin: ["1", "1"], expr: "discount(1000)", expect: "100.0" },
        { kind: "expr", name: "discount() below the boundary", stdin: ["1", "1"], expr: "discount(999)", expect: "0", hidden: true },
        {
          kind: "source",
          name: "total() reuses the other modules",
          mustUse: ["subtotal(", "discount("],
        },
      ],
    },
    {
      id: "ex-9.2-1",
      title: "Modules as functions",
      level: "9.2",
      difficulty: 1,
      xp: 30,
      tags: ["modularization", "functions"],
      brief: `A canteen billing system was decomposed into three modules: **read the order**, **calculate the total**, and **print the bill**.

Write three functions that mirror that structure chart:

- \`calculate_total(prices)\`: takes a list of prices and **returns** their total.
- \`print_bill(total)\`: prints exactly \`Total: 250\` (using the value passed in).
- \`main()\`: calls \`calculate_total\` with the list \`[100, 50, 100]\` and passes the result to \`print_bill\`.

Then call \`main()\`.`,
      starter: `def calculate_total(prices):
    # return the total of the list
    pass


def print_bill(total):
    # print the bill line
    pass


def main():
    # connect the two modules together
    pass


main()`,
      hints: [
        "To add up a list you can use a loop with a running total, or the built-in `sum(prices)`.",
        "`calculate_total` must use `return`, not `print`: the value has to travel back to `main`.",
        "In `print_bill`, use `print(\"Total:\", total)`.",
        "In `main`, store the returned value first: `total = calculate_total([100, 50, 100])`.",
      ],
      solution: `def calculate_total(prices):
    total = 0
    for p in prices:
        total = total + p
    return total


def print_bill(total):
    print("Total:", total)


def main():
    total = calculate_total([100, 50, 100])
    print_bill(total)


main()`,
      tests: [
        { kind: "io", name: "Prints the correct bill", expect: "Total: 250", match: "loose" },
        {
          kind: "expr",
          name: "calculate_total returns a value",
          expr: "calculate_total([10, 20, 30])",
          expect: "60",
        },
        {
          kind: "expr",
          name: "calculate_total works on an empty list",
          expr: "calculate_total([])",
          expect: "0",
          hidden: true,
        },
        {
          kind: "source",
          name: "Uses three separate modules",
          mustUse: ["def calculate_total", "def print_bill", "def main"],
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.2-1",
      level: "9.2",
      q: "What is modularization?",
      options: [
        "Writing a program in one long file",
        "Breaking a big problem into smaller logical sub-problems",
        "Converting source code into object code",
        "Testing each line of a program",
      ],
      answer: 1,
      explain:
        "Modularization, also called decomposition, means splitting a large problem into smaller logical parts that can each be solved separately and then connected.",
      difficulty: 1,
    },
    {
      id: "q-9.2-2",
      level: "9.2",
      q: "Which of these best describes top-down design?",
      options: [
        "Start with small reusable pieces and combine them",
        "Start with the complete system and break it into smaller and smaller parts",
        "Start writing code and design afterwards",
        "Start from the output and work backwards to the input",
      ],
      answer: 1,
      explain:
        "Top-down design begins with the whole system and repeatedly breaks it down. Bottom-up is the opposite: starting from small components and combining them.",
      difficulty: 1,
    },
    {
      id: "q-9.2-3",
      level: "9.2",
      q: "A structure chart shows:",
      options: [
        "The order in which statements are executed",
        "How a system is broken down into modules and sub-modules",
        "The flow of data through a network",
        "Which variables are global and which are local",
      ],
      answer: 1,
      explain:
        "Structure charts show composition: what a system is made of. Execution order is shown by flow charts.",
      difficulty: 1,
    },
    {
      id: "q-9.2-4",
      level: "9.2",
      q: "During stepwise refinement you find that two sub-problems you identified are actually the same task. What should you do?",
      options: [
        "Leave them, because the design is already finished",
        "Combine them into a single module and redraw that part of the chart",
        "Delete both of them",
        "Move them to the top of the chart",
      ],
      answer: 1,
      explain:
        "Refinement means improving the decomposition. Combining duplicated sub-problems into one module is exactly the kind of improvement the process is for.",
      difficulty: 2,
    },
    {
      id: "q-9.2-5",
      level: "9.2",
      q: "Why does modularization make a large system easier to build?",
      options: [
        "It reduces the number of lines of code to zero",
        "Each small part can be understood, solved and tested on its own, and different people can work in parallel",
        "It removes the need for algorithms",
        "It makes the program run without a translator",
      ],
      answer: 1,
      explain:
        "The benefit is cognitive and organisational: small parts are easier to understand, test and divide between people. The total amount of code does not shrink.",
      difficulty: 2,
    },
    {
      id: "q-9.2-6",
      level: "9.2",
      q: "In a structure chart for a payroll system, which pair of boxes is correctly at the SAME level?",
      options: [
        "'Calculate salary' and 'Type the employee name'",
        "'Calculate salary' and 'Generate pay slip'",
        "'Payroll system' and 'Calculate salary'",
        "'Calculate salary' and 'Calculate overtime allowance for the night shift'",
      ],
      answer: 1,
      explain:
        "Sibling boxes must be at a similar level of detail. 'Calculate salary' and 'Generate pay slip' are both major modules. 'Payroll system' is the parent, and the other options are much smaller tasks.",
      difficulty: 3,
    },
  ],
};
