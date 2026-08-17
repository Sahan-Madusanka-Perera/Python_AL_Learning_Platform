import type { Module } from "../types";

export const m08: Module = {
  id: "9.8",
  slug: "control-structures",
  title: "Control Structures",
  tagline: "Sequence, selection and repetition: three ideas that can express any program ever written.",
  icon: "Split",
  periods: 12,
  outcomes: [
    "Briefly describes control structures",
    "Lists and briefly describes the types of control structures",
    "Uses control structures appropriately in programming",
    "Applies nested control structures in programs",
  ],
  contents: [
    "Control Structures",
    "Sequence",
    "Selection",
    "Repetition: iteration and looping",
  ],

  lessons: [
    {
      id: "9.8.1",
      title: "The three control structures & indentation",
      summary: "How Python decides which lines belong together, and why spacing is part of the language.",
      minutes: 12,
      outcomes: [
        "Briefly describes control structures",
        "Lists and briefly describes the types of control structures",
      ],
      blocks: [
        {
          kind: "text",
          md: `The **flow of control** is the order in which statements are executed. It is managed with exactly three structures.`,
        },
        {
          kind: "table",
          headers: ["Structure", "What it does", "Python"],
          rows: [
            ["Sequence", "Statements execute one after another, top to bottom", "(the default)"],
            ["Selection", "Chooses between two or more paths using a condition", "if · if-else · if-elif-else"],
            ["Repetition", "Repeats a group of statements", "while · for"],
          ],
        },
        { kind: "widget", id: "control-flow-visualiser" },
        {
          kind: "heading",
          text: "Indentation is syntax in Python",
        },
        {
          kind: "text",
          md: `Most languages use curly brackets \`{ }\` to show which statements belong to an \`if\` or a loop. **Python uses indentation**: the spaces at the start of the line.

This means spacing is not decoration. It changes what the program does.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The SAME lines, indented differently: completely different meaning",
          code: `print("--- Version A: print is INSIDE the if ---")
marks = 30
if marks >= 50:
    print("Pass")
    print("Well done")      # indented → only runs when marks >= 50

print("--- Version B: print is OUTSIDE the if ---")
marks = 30
if marks >= 50:
    print("Pass")
print("Well done")          # not indented → always runs`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "Indentation rules",
          md: `- Use **4 spaces** per level. Be consistent.
- Every line in the same block must start at **exactly** the same column.
- **Never mix tabs and spaces**: Python raises a \`TabError\`.
- The line that opens a block ends with \`:\` and the next line must be indented.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.8-inline-1",
            level: "9.8",
            q: "What are the three types of control structure?",
            options: [
              "Input, process, output",
              "Sequence, selection, repetition",
              "Compile, link, load",
              "Variable, constant, literal",
            ],
            answer: 1,
            explain:
              "Sequence (one after another), selection (branching on a condition) and repetition (looping) are the three control structures. Any algorithm can be built from just these.",
          },
        },
      ],
    },

    {
      id: "9.8.2",
      title: "Selection: if, if-else, if-elif-else",
      summary: "Making decisions, from a single condition up to a full grading system.",
      minutes: 18,
      outcomes: ["Uses control structures appropriately in programming"],
      blocks: [
        { kind: "heading", text: "Simple if" },
        {
          kind: "syntax",
          title: "if statement",
          parts: [
            { text: "if", label: "keyword", tone: "keyword" },
            { text: " age >= 18", label: "condition: must be True or False", tone: "value" },
            { text: ":", label: "colon is compulsory", tone: "punct" },
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["20"],
          code: `age = int(input("Enter your age: "))

if age >= 18:
    print("You are eligible to vote")

print("Program finished")`,
        },
        { kind: "heading", text: "if-else: two paths" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["15"],
          code: `age = int(input("Enter your age: "))

if age >= 18:
    print("You are eligible to vote")
else:
    print("You are not eligible to vote")`,
        },
        { kind: "heading", text: "if-elif-else: many paths" },
        {
          kind: "text",
          md: `When there are more than two possibilities, use \`elif\` (short for *else if*). Python checks each condition **in order** and runs the **first** one that is true, then skips all the rest.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["68"],
          caption: "The grading system from your syllabus: A ≥ 75, B 50–74, C 40–49, F below 40",
          code: `marks = int(input("Enter marks: "))

if marks >= 75:
    grade = "A"
elif marks >= 50:
    grade = "B"
elif marks >= 40:
    grade = "C"
else:
    grade = "F"

print("Grade:", grade)`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "Why the order matters so much",
          md: `A mark of 80 satisfies \`marks >= 75\`, \`marks >= 50\` **and** \`marks >= 40\`. Because Python takes the **first** match and stops, putting the conditions in descending order gives the right answer.

If you wrote \`if marks >= 40\` first, **every** passing student would get a C.`,
        },
        {
          kind: "trace",
          caption: "Step through with marks = 80 and watch which branch is taken.",
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
          kind: "heading",
          text: "Nested selection",
        },
        {
          kind: "text",
          md: `An \`if\` can be placed **inside** another \`if\`. This is a **nested** control structure.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["19", "yes"],
          code: `age = int(input("Age: "))

if age >= 18:
    registered = input("Are you registered? (yes/no): ")
    if registered == "yes":
        print("You may vote today")
    else:
        print("You must register first")
else:
    print("Too young to vote")`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "Common mistakes in selection",
          md: `- Using \`=\` instead of \`==\` in the condition
- Forgetting the \`:\` at the end of the \`if\` line
- Putting the conditions of an \`elif\` chain in the wrong order
- Using \`>\` when the question says "or more" (which needs \`>=\`)`,
        },
        { kind: "exercise", exerciseId: "ex-9.8-1" },
      ],
    },

    {
      id: "9.8.3",
      title: "Repetition: while and for",
      summary: "The difference between looping a known number of times and looping until something happens.",
      minutes: 20,
      outcomes: ["Uses control structures appropriately in programming"],
      blocks: [
        {
          kind: "text",
          md: `Repetition means executing a group of statements more than once. The syllabus distinguishes two situations:

- **Iteration**: the number of repetitions is **known in advance** (a *pre-determined* count). Use a **for** loop.
- **Looping**: the number of repetitions depends on a condition and is **not known in advance** (*post-determined*). Use a **while** loop.`,
        },
        { kind: "widget", id: "loop-visualiser" },
        { kind: "heading", text: "The for loop" },
        {
          kind: "syntax",
          title: "for statement",
          parts: [
            { text: "for", label: "keyword", tone: "keyword" },
            { text: " count", label: "loop variable", tone: "name" },
            { text: " in ", label: "keyword", tone: "keyword" },
            { text: "range(1, 11)", label: "the sequence to walk through", tone: "value" },
            { text: ":", label: "", tone: "punct" },
          ],
        },
        {
          kind: "callout",
          tone: "key",
          title: "How range() works: learn all three forms",
          md: `- \`range(5)\` → 0, 1, 2, 3, 4: starts at 0, **stops before** 5
- \`range(1, 6)\` → 1, 2, 3, 4, 5: starts at 1, **stops before** 6
- \`range(1, 10, 2)\` → 1, 3, 5, 7, 9: steps by 2
- \`range(10, 0, -1)\` → 10, 9, 8 … 1: counts backwards

**The stop value is never included.** To count 1 to 100 you need \`range(1, 101)\`.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Add the numbers from 1 to 100",
          code: `total = 0
for count in range(1, 101):
    total = total + count
print("Sum of 1 to 100 =", total)`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "A for loop can walk through any sequence, not just numbers",
          code: `for animal in ["cat", "dog", "bird"]:
    print("I have a", animal)

for letter in "ICT":
    print(letter)`,
        },
        {
          kind: "flowchart",
          title: "What a for loop looks like as a flow chart",
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
          caption:
            "range() hides all three parts inside one line: i = 1 is the start, i <= 5 is the test, i = i + 1 is the step. Python writes them for you, but the exam may ask you to draw them.",
        },
        { kind: "heading", text: "The while loop" },
        {
          kind: "text",
          md: `A \`while\` loop repeats **as long as a condition stays true**. It checks the condition *before* each pass, so if the condition is false at the start the body never runs at all.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Print 1 to 5",
          code: `i = 1
while i <= 5:
    print(i)
    i = i + 1        # ← without this line the loop never ends`,
        },
        {
          kind: "flowchart",
          title: "The same while loop, drawn out",
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
          caption:
            "Identical to the for loop above, because a for loop IS a while loop with the counting written for you. The diamond sits above the body, so the test happens first.",
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "The infinite loop",
          md: `Every \`while\` loop needs three things:
1. A variable **initialised** before the loop
2. A **condition** that can become false
3. Something **inside** the loop that changes the variable

Leave out step 3 and the program runs forever. Try it below, then press **Stop**.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "This never ends. Press Stop to interrupt it: that is the Ctrl-C an IDE gives you.",
          code: `i = 1
while i <= 5:
    print("i is still", i)
    # i = i + 1  ← the missing line`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "When you genuinely do not know the count: add numbers until the total reaches 50",
          code: `total = 0
number = 1
while total < 50:
    total = total + number
    number = number + 1

print("Total is", total)
print("Added the numbers 1 to", number - 1)`,
        },
        { kind: "heading", text: "Repeat-Until: when the body must run first" },
        {
          kind: "text",
          md: `Both loops so far test the condition **before** the body, so the body can run zero times. Some problems need the opposite: you cannot ask *"was the password correct?"* until you have asked for a password once.

Pseudocode calls this **Repeat … Until**, and the flow chart puts the diamond **below** the body.`,
        },
        {
          kind: "flowchart",
          title: "Post-test loop: ask until the answer is right",
          nodes: [
            { id: "s", shape: "terminal", text: "Start", next: "read" },
            { id: "read", shape: "io", text: "Read guess", next: "d" },
            {
              id: "d",
              shape: "decision",
              text: "guess = 7 ?",
              next: "out",
              no: "read",
              edgeLabel: "YES",
              noLabel: "NO",
            },
            { id: "out", shape: "io", text: 'Display "Correct"', next: "e" },
            { id: "e", shape: "terminal", text: "End" },
          ],
          caption:
            "Read guess always happens at least once. The NO branch is the return line: it goes back up to the input, not to the diamond.",
        },
        {
          kind: "code",
          lang: "pseudo",
          caption: "In pseudocode the condition is the exit condition, not the continue condition",
          code: `Begin
    Repeat
        Read guess
    Until guess = 7
    Display "Correct"
End`,
        },
        {
          kind: "text",
          md: `**Python has no \`repeat\` keyword.** You build a post-test loop with \`while True\` and a \`break\`: the body runs, then the test decides whether to leave.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["3", "9", "7"],
          caption: "Repeat … Until guess = 7, written the Python way",
          code: `while True:
    guess = int(input("Guess the number: "))
    if guess == 7:
        break                 # ← Until guess = 7
    print("Not that one, try again")

print("Correct!")`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "Watch the direction of the condition",
          md: `\`Repeat … Until guess = 7\` loops while the condition is **false** and stops when it becomes **true**. \`While\` is the other way round.

So when you translate, the condition **flips**: \`Until guess = 7\` becomes \`if guess == 7: break\`, or equivalently \`while guess != 7:\`. Writing \`while guess == 7\` is the classic slip.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.8-inline-4",
            level: "9.8",
            q: "A Repeat … Until loop is used instead of a While loop when…",
            options: [
              "the loop must run a fixed number of times",
              "the body must be carried out at least once",
              "the condition can never become true",
              "you are walking through a list",
            ],
            answer: 1,
            explain:
              "The test sits after the body, so the body always runs at least once. A While loop tests first and so may run its body zero times.",
          },
        },
        {
          kind: "compare",
          title: "Choosing between them",
          left: {
            title: "Use for when…",
            items: [
              "You know how many times to repeat",
              "You are walking through a list or string",
              "Counting 1 to 100",
              "Processing every item in a collection",
            ],
          },
          right: {
            title: "Use while when…",
            items: [
              "The count depends on the data",
              "Waiting for valid input from the user",
              "Repeating until a total is reached",
              "Bubble sort's 'keep going until no swaps'",
            ],
          },
        },
        {
          kind: "check",
          question: {
            id: "q-9.8-inline-2",
            level: "9.8",
            q: "How many times does the body of this loop execute?",
            code: "for i in range(2, 10, 3):\n    print(i)",
            options: ["2 times", "3 times", "8 times", "10 times"],
            answer: 1,
            explain:
              "It produces 2, 5 and 8. The next value would be 11, which is not less than 10, so the loop stops. That is 3 repetitions.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.8-2" },
      ],
    },

    {
      id: "9.8.4",
      title: "break, continue & nested loops",
      summary: "Escaping a loop early, skipping one pass, and putting loops inside loops.",
      minutes: 16,
      outcomes: ["Applies nested control structures in programs"],
      blocks: [
        { kind: "heading", text: "break: leave the loop immediately" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `i = 1
while i <= 10:
    if i == 4:
        break            # stop the whole loop now
    print(i)
    i = i + 1

print("Loop ended at i =", i)`,
        },
        { kind: "heading", text: "continue: skip to the next pass" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `for i in range(1, 7):
    if i == 3:
        continue         # skip the rest of THIS pass only
    print(i)`,
        },
        {
          kind: "table",
          headers: ["", "break", "continue"],
          rows: [
            ["Effect", "Exits the loop entirely", "Skips the rest of the current pass"],
            ["Loop continues?", "No", "Yes, with the next value"],
            ["Typical use", "Item found: stop searching", "Ignore invalid data and carry on"],
          ],
        },
        { kind: "heading", text: "Nested loops" },
        {
          kind: "text",
          md: `A loop placed inside another loop is a **nested loop**. The inner loop completes **all** of its passes for **every single** pass of the outer loop.

If the outer loop runs 3 times and the inner runs 4 times, the inner body executes 3 × 4 = **12** times.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The multiplication pattern: outer row, inner column",
          code: `for row in range(1, 4):
    for col in range(1, 5):
        print(row, "x", col, "=", row * col)
    print("--- end of row", row, "---")`,
        },
        {
          kind: "heading",
          text: "Drawing patterns with nested loops",
        },
        {
          kind: "text",
          md: `This is a favourite exam question. The trick is always the same: the **outer** loop controls the number of **lines**, the **inner** loop controls what appears **on** each line.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "A triangle of stars",
          code: `n = 5
for i in range(1, n + 1):
    for j in range(i):
        print("*", end="")   # end="" keeps everything on one line
    print()                  # empty print() moves to the next line`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "The two print tricks for patterns",
          md: `- \`print("*", end="")\` prints without moving to a new line
- \`print()\` on its own prints nothing but **does** move to a new line

Every star-pattern question is solved with these two.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "A triangular number drawn graphically",
          code: `n = int("6")
count = 0
for i in range(1, n + 1):
    print("o " * i)          # a string times a number repeats it
    count = count + i

print("Triangular number", n, "is", count)`,
        },
        {
          kind: "trace",
          caption: "Step through a nested loop and watch both counters move.",
          code: `total = 0
for i in range(1, 4):
    for j in range(1, 3):
        total = total + 1
print("Inner body ran", total, "times")`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.8-inline-3",
            level: "9.8",
            q: "How many lines does this print?",
            code: 'for i in range(3):\n    for j in range(4):\n        print("*", end="")\n    print()',
            options: ["3", "4", "12", "7"],
            answer: 0,
            explain:
              "The inner loop prints 4 stars on one line without a newline. `print()` at the end of the outer loop body moves to the next line, and the outer loop runs 3 times, so there are 3 lines of 4 stars.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.8-3" },
        { kind: "exercise", exerciseId: "ex-9.8-4" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.8-1",
      title: "Tiered discount",
      level: "9.8",
      difficulty: 2,
      xp: 35,
      tags: ["selection", "elif"],
      brief: `A shop gives discounts based on the purchase amount:

- More than **400,000** → 30%
- More than **300,000** → 20%
- More than **100,000** → 10%
- **100,000 or less** → no discount

Read the purchase amount and print the discount **percentage** only, in the form \`Discount: 20%\`.`,
      starter: `amount = float(input("Purchase amount: "))

# Your code here
`,
      hints: [
        "Use `if` / `elif` / `elif` / `else`: four branches in total.",
        "Order matters. Test the LARGEST amount first, or every big purchase will match the 10% rule.",
        "The question says 'more than', so use `>` and not `>=`.",
        "Print with `print(\"Discount: \", discount, \"%\", sep=\"\")` or build the string yourself.",
      ],
      solution: `amount = float(input("Purchase amount: "))

if amount > 400000:
    discount = 30
elif amount > 300000:
    discount = 20
elif amount > 100000:
    discount = 10
else:
    discount = 0

print("Discount: ", discount, "%", sep="")`,
      tests: [
        { kind: "io", name: "500,000 gets 30%", stdin: ["500000"], expect: "Discount: 30%", match: "loose" },
        { kind: "io", name: "350,000 gets 20%", stdin: ["350000"], expect: "Discount: 20%", match: "loose" },
        { kind: "io", name: "150,000 gets 10%", stdin: ["150000"], expect: "Discount: 10%", match: "loose" },
        { kind: "io", name: "50,000 gets nothing", stdin: ["50000"], expect: "Discount: 0%", match: "loose" },
        {
          kind: "io",
          name: "Exactly 100,000 gets nothing ('more than')",
          stdin: ["100000"],
          expect: "Discount: 0%",
          match: "loose",
          hidden: true,
        },
      ],
    },
    {
      id: "ex-9.8-2",
      title: "Sum of even numbers",
      level: "9.8",
      difficulty: 1,
      xp: 30,
      tags: ["loops", "modulus"],
      brief: `Compute the sum of all **even** numbers from 1 to 100 inclusive, and print it in the form \`Sum: 2550\`.

Use a loop, not a formula.`,
      starter: `total = 0

# Your code here
`,
      hints: [
        "`range(1, 101)` gives every number from 1 to 100 inclusive.",
        "A number is even when `n % 2 == 0`.",
        "Alternatively `range(2, 101, 2)` steps through only the even numbers: no `if` needed.",
      ],
      solution: `total = 0
for n in range(2, 101, 2):
    total = total + n
print("Sum:", total)`,
      tests: [
        { kind: "io", name: "Correct sum", expect: "Sum: 2550", match: "loose" },
        { kind: "source", name: "Uses a loop", mustUse: ["for"] },
      ],
    },
    {
      id: "ex-9.8-3",
      title: "Sum between two numbers",
      level: "9.8",
      difficulty: 2,
      xp: 35,
      tags: ["loops", "input"],
      brief: `Read **two** whole numbers from the keyboard and display the sum of all the integers between them, **including both** numbers.

Inputs \`3\` then \`7\` must print \`Sum: 25\` (3+4+5+6+7).

The program must also work when the **first number is larger** than the second: inputs \`7\` then \`3\` must also print \`Sum: 25\`.

Add the numbers up with a **loop**, not with \`sum()\`.`,
      starter: `a = int(input("First number: "))
b = int(input("Second number: "))

# Your code here
`,
      hints: [
        "To include both ends, loop with `range(start, end + 1)`.",
        "If `a` is bigger than `b`, `range(a, b + 1)` produces nothing at all.",
        "Work out the smaller and larger first: `min(a, b)` and `max(a, b)` do this in one step.",
        "Or use an `if` to swap them before looping.",
      ],
      solution: `a = int(input("First number: "))
b = int(input("Second number: "))

low = min(a, b)
high = max(a, b)

total = 0
for n in range(low, high + 1):
    total = total + n

print("Sum:", total)`,
      tests: [
        {
          kind: "source",
          name: "Adds them up with a loop",
          mustUse: ["for "],
          mustNotUse: ["sum("],
        },
        { kind: "io", name: "3 to 7", stdin: ["3", "7"], expect: "Sum: 25", match: "loose" },
        { kind: "io", name: "Reversed: 7 to 3", stdin: ["7", "3"], expect: "Sum: 25", match: "loose" },
        { kind: "io", name: "1 to 100", stdin: ["1", "100"], expect: "Sum: 5050", match: "loose", hidden: true },
        { kind: "io", name: "Same number twice", stdin: ["5", "5"], expect: "Sum: 5", match: "loose", hidden: true },
      ],
    },
    {
      id: "ex-9.8-4",
      title: "Star triangle",
      level: "9.8",
      difficulty: 2,
      xp: 40,
      tags: ["nested loops", "patterns"],
      brief: `Read a number **n** and print a triangle of stars with n rows, where row 1 has one star, row 2 has two stars, and so on.

For \`n = 4\`:
\`\`\`
*
**
***
****
\`\`\`

Use a **nested loop**: an inner loop that prints the stars for one row.`,
      starter: `n = int(input("Enter n: "))

# Your code here
`,
      hints: [
        "The outer loop controls the rows: `for i in range(1, n + 1)`.",
        "The inner loop prints the stars for the current row: `for j in range(i)`.",
        "Use `print(\"*\", end=\"\")` inside the inner loop so the stars stay on one line.",
        "After the inner loop finishes, a bare `print()` moves to the next row.",
      ],
      solution: `n = int(input("Enter n: "))

for i in range(1, n + 1):
    for j in range(i):
        print("*", end="")
    print()`,
      tests: [
        { kind: "io", name: "n = 4", stdin: ["4"], expect: "*\n**\n***\n****", match: "loose" },
        { kind: "io", name: "n = 1", stdin: ["1"], expect: "*", match: "loose", hidden: true },
        { kind: "io", name: "n = 6", stdin: ["6"], expect: "*\n**\n***\n****\n*****\n******", match: "loose", hidden: true },
        { kind: "source", name: "Uses a nested loop", mustUse: ["for", "range"] },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.8-1",
      level: "9.8",
      q: "Which values does `range(1, 10, 3)` produce?",
      options: ["1, 3, 10", "1, 4, 7", "1, 4, 7, 10", "3, 6, 9"],
      answer: 1,
      explain:
        "Start at 1, step by 3, stop before 10: 1, 4, 7. The next would be 10, which is not less than 10, so it is excluded.",
      difficulty: 2,
    },
    {
      id: "q-9.8-2",
      level: "9.8",
      q: "What is the output?",
      code: 'for i in range(3):\n    if i == 1:\n        continue\n    print(i)',
      options: ["0 1 2", "0 2", "1", "0 1"],
      answer: 1,
      explain:
        "`continue` skips the rest of that pass, so when i is 1 nothing is printed. 0 and 2 are printed.",
      difficulty: 2,
    },
    {
      id: "q-9.8-3",
      level: "9.8",
      q: "Can the body of a `for` loop ever fail to execute at all?",
      options: [
        "No, a for loop always runs at least once",
        "Yes, if the sequence is empty: for example range(0)",
        "Only if there is a break in it",
        "Only in a while loop",
      ],
      answer: 1,
      explain:
        "If the sequence has no items: `range(0)`, or an empty list: the body never runs. This is a standard exam question.",
      difficulty: 2,
    },
    {
      id: "q-9.8-4",
      level: "9.8",
      q: "What causes an infinite while loop?",
      options: [
        "Using a for loop instead",
        "The condition never becomes False, usually because the loop variable is never changed",
        "Using too many elif branches",
        "Forgetting to import a library",
      ],
      answer: 1,
      explain:
        "A while loop stops only when its condition becomes false. If nothing inside the loop moves the variable towards that, it repeats forever.",
      difficulty: 1,
    },
    {
      id: "q-9.8-5",
      level: "9.8",
      q: "How many times does the inner statement execute?",
      code: "for i in range(4):\n    for j in range(3):\n        print(i, j)",
      options: ["7", "12", "4", "3"],
      answer: 1,
      explain:
        "The inner loop completes fully for each pass of the outer loop: 4 × 3 = 12.",
      difficulty: 2,
    },
    {
      id: "q-9.8-6",
      level: "9.8",
      q: "A student gets 80 marks. What grade does this code give?",
      code: 'if marks >= 40:\n    grade = "C"\nelif marks >= 50:\n    grade = "B"\nelif marks >= 75:\n    grade = "A"\nelse:\n    grade = "F"',
      options: ["A", "B", "C", "F"],
      answer: 2,
      explain:
        "80 satisfies the FIRST condition (>= 40), so grade becomes 'C' and the remaining branches are skipped. The conditions are in the wrong order: they must go from highest to lowest.",
      difficulty: 3,
    },
    {
      id: "q-9.8-7",
      level: "9.8",
      q: "What is the difference between `break` and `continue`?",
      options: [
        "They do the same thing",
        "`break` exits the loop entirely; `continue` skips to the next repetition",
        "`break` skips one repetition; `continue` exits the loop",
        "`break` works only in for loops; `continue` only in while loops",
      ],
      answer: 1,
      explain:
        "`break` ends the loop immediately. `continue` abandons only the current pass and carries on with the next one.",
      difficulty: 1,
    },
    {
      id: "q-9.8-8",
      level: "9.8",
      q: "Why does Python use indentation instead of curly brackets?",
      options: [
        "To make files smaller",
        "Indentation defines the scope of a statement: which lines belong to the block",
        "It is only a style preference and has no effect",
        "To make the program run faster",
      ],
      answer: 1,
      explain:
        "In Python, indentation is part of the syntax. It determines which statements belong to an if, loop or function: the job curly brackets do in other languages.",
      difficulty: 1,
    },
    {
      id: "q-9.8-9",
      level: "9.8",
      q: "What does this print?",
      code: "i = 10\nwhile i > 0:\n    i = i - 3\nprint(i)",
      options: ["0", "1", "-2", "It never ends"],
      answer: 2,
      explain:
        "i goes 10 → 7 → 4 → 1 → -2. At -2 the condition i > 0 is false, so the loop stops and -2 is printed.",
      difficulty: 3,
    },
  ],
};
