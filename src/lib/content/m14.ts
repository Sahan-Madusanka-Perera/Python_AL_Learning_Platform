import type { Module } from "../types";

/**
 * Beyond the mandatory syllabus.
 *
 * The Competency 9 teacher notes cover a few topics that sit just outside the
 * examinable content: recursion, list comprehension, exception handling and
 * number-base conversion. They appear in past papers as "extra credit" style
 * questions and they make the core topics easier, so they are included here as
 * clearly-labelled bonus material.
 */
export const m14: Module = {
  id: "9+",
  slug: "beyond",
  title: "Beyond the Syllabus",
  tagline: "Recursion, comprehensions, error handling and number bases: the bonus round.",
  icon: "Sparkles",
  periods: 0,
  outcomes: [
    "Writes simple recursive functions with a correct base case",
    "Uses list comprehension as a compact alternative to a loop",
    "Handles runtime errors with try / except",
    "Converts between number bases using built-in functions",
  ],
  contents: [
    "Recursive functions",
    "List comprehension",
    "Error handling",
    "Number conversion and built-in functions",
  ],

  lessons: [
    {
      id: "9plus.1",
      title: "Recursion",
      summary: "A function that calls itself, and the base case that stops it.",
      minutes: 12,
      outcomes: ["Writes simple recursive functions with a correct base case"],
      blocks: [
        {
          kind: "text",
          md: `A **recursive function** is one that calls itself. Every recursive function needs two parts:

1. A **base case**: a condition where it returns an answer *without* calling itself. This is what stops the chain.
2. A **recursive case**: where it calls itself with a value that moves *towards* the base case.

Miss either one and you get a \`RecursionError\`.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Factorial: 5! = 5 × 4 × 3 × 2 × 1",
          code: `def factorial(n):
    if n <= 1:              # base case: stop here
        return 1
    return n * factorial(n - 1)   # recursive case: n gets smaller


for i in range(1, 7):
    print(i, "! =", factorial(i))`,
        },
        {
          kind: "trace",
          caption: "Step through and watch the calls stack up, then unwind.",
          code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(4))`,
        },
        {
          kind: "compare",
          left: {
            title: "Recursive",
            items: ["Shorter for naturally nested problems", "Mirrors the mathematical definition", "Uses more memory (one frame per call)", "Can hit a recursion limit"],
          },
          right: {
            title: "Iterative (a loop)",
            items: ["Uses constant memory", "Usually faster", "Sometimes harder to read", "No recursion limit"],
          },
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The same job with a loop",
          code: `def factorial_loop(n):
    result = 1
    for i in range(2, n + 1):
        result = result * i
    return result

print(factorial_loop(5))`,
        },
        { kind: "exercise", exerciseId: "ex-9+.1" },
      ],
    },

    {
      id: "9plus.2",
      title: "List comprehension",
      summary: "Build a list in one readable line.",
      minutes: 10,
      outcomes: ["Uses list comprehension as a compact alternative to a loop"],
      blocks: [
        {
          kind: "syntax",
          title: "The pattern",
          parts: [
            { text: "[", label: "", tone: "punct" },
            { text: "n * 2", label: "what to put in the list", tone: "value" },
            { text: " for n in numbers", label: "where the values come from", tone: "keyword" },
            { text: " if n > 5", label: "optional filter", tone: "name" },
            { text: "]", label: "", tone: "punct" },
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `marks = [45, 82, 67, 91, 38]

# The long way
doubled = []
for m in marks:
    doubled.append(m * 2)
print("Loop         :", doubled)

# The same thing as a comprehension
print("Comprehension:", [m * 2 for m in marks])

# With a filter
print("Passes only  :", [m for m in marks if m >= 50])

# Building a list of squares
print("Squares 1-10 :", [n * n for n in range(1, 11)])

# Working with strings
names = ["ravi", "mala", "geetha"]
print("Capitalised  :", [n.title() for n in names])`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "When not to use it",
          md: `A comprehension is for **building a list**. If you are just printing things, or the logic needs more than one \`if\`, an ordinary loop is clearer. Readability wins.`,
        },
      ],
    },

    {
      id: "9plus.3",
      title: "Error handling with try / except",
      summary: "Catch a runtime error instead of letting the program crash.",
      minutes: 12,
      outcomes: ["Handles runtime errors with try / except"],
      blocks: [
        {
          kind: "text",
          md: `A **runtime error** normally stops the program dead. \`try\` / \`except\` lets you catch it and carry on gracefully: essential when the user might type something unexpected.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["abc"],
          caption: "Try typing letters instead of a number",
          code: `try:
    age = int(input("Enter your age: "))
    print("Next year you will be", age + 1)
except ValueError:
    print("That was not a whole number. Please type digits only.")`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Catching different errors differently",
          code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"
    except TypeError:
        return "Both values must be numbers"

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, "x"))`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["7", "abc", "12"],
          caption: "The validation loop: keep asking until the input is valid",
          code: `while True:
    try:
        n = int(input("Enter a whole number: "))
        break                       # valid: leave the loop
    except ValueError:
        print("  Not a number, try again.")

print("You entered", n)`,
        },
        {
          kind: "table",
          headers: ["Block", "When it runs"],
          rows: [
            ["try", "Always: this is the code being watched"],
            ["except", "Only if a matching error occurred"],
            ["else", "Only if NO error occurred"],
            ["finally", "Always, error or not: used for closing files"],
          ],
        },
      ],
    },

    {
      id: "9plus.4",
      title: "Number bases & useful built-ins",
      summary: "Converting between decimal, binary, octal and hexadecimal.",
      minutes: 10,
      outcomes: ["Converts between number bases using built-in functions"],
      blocks: [
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Decimal to other bases",
          code: `n = 60

print("Decimal    :", n)
print("Binary     :", bin(n))        # 0b111100
print("Octal      :", oct(n))        # 0o74
print("Hexadecimal:", hex(n))        # 0x3c

# Without the prefix, padded to 8 digits: useful for bitwise questions
print("Binary (8) :", format(n, '08b'))`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Other bases back to decimal: int() takes a base",
          code: `print(int("111100", 2))    # binary  → 60
print(int("74", 8))        # octal   → 60
print(int("3c", 16))       # hex     → 60
print(int("3C", 16))       # case does not matter`,
        },
        {
          kind: "table",
          headers: ["Function", "What it does", "Example"],
          rows: [
            ["abs(x)", "Absolute value", "abs(-7) → 7"],
            ["round(x, n)", "Round to n decimal places", "round(3.567, 2) → 3.57"],
            ["pow(x, y)", "x to the power y", "pow(2, 10) → 1024"],
            ["divmod(a, b)", "Quotient and remainder together", "divmod(17, 5) → (3, 2)"],
            ["sum(list)", "Total of a list", "sum([1,2,3]) → 6"],
            ["sorted(list)", "A NEW sorted list", "sorted([3,1,2]) → [1,2,3]"],
            ["type(x)", "The type of a value", "type(5) → int"],
            ["chr(n) / ord(c)", "Character code conversions", "ord('A') → 65 · chr(65) → 'A'"],
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `print(abs(-17), round(3.567, 2), pow(2, 10))
print(divmod(17, 5))
print(sorted([3, 1, 2]), "original list is untouched")
print(ord("A"), chr(65), ord("a"), chr(97))`,
        },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9+.1",
      title: "Recursive sum",
      level: "9+",
      difficulty: 3,
      xp: 45,
      tags: ["recursion", "functions"],
      brief: `Write a **recursive** function \`rsum(n)\` that returns the sum of all whole numbers from 1 to n.

\`rsum(5)\` must return 15 (1+2+3+4+5), and \`rsum(0)\` must return 0.

Then print \`rsum(10)\`. You must not use a loop.`,
      starter: `def rsum(n):
    pass


print(rsum(10))`,
      hints: [
        "The base case is the smallest input: when n is 0 there is nothing to add, so return 0.",
        "For any other n, the answer is n plus the sum of everything below it.",
        "That gives `return n + rsum(n - 1)`.",
        "Check the base case is reachable: each call must make n smaller.",
      ],
      solution: `def rsum(n):
    if n <= 0:
        return 0
    return n + rsum(n - 1)


print(rsum(10))`,
      tests: [
        { kind: "io", name: "rsum(10) is 55", expect: "55", match: "loose" },
        { kind: "expr", name: "rsum(5) is 15", expr: "rsum(5)", expect: "15" },
        { kind: "expr", name: "rsum(0) is 0", expr: "rsum(0)", expect: "0" },
        { kind: "expr", name: "rsum(1) is 1", expr: "rsum(1)", expect: "1", hidden: true },
        { kind: "source", name: "Uses recursion, not a loop", mustUse: ["rsum("], mustNotUse: ["for ", "while "] },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9+-1",
      level: "9+",
      q: "What must every recursive function have to avoid a RecursionError?",
      options: [
        "A loop inside it",
        "A base case that returns without calling itself",
        "A global variable",
        "At least two parameters",
      ],
      answer: 1,
      explain:
        "The base case terminates the chain of calls. Without one, the function calls itself forever until Python's recursion limit is reached.",
      difficulty: 2,
    },
    {
      id: "q-9+-2",
      level: "9+",
      q: "What does `[n * n for n in range(1, 4)]` produce?",
      options: ["[1, 2, 3]", "[1, 4, 9]", "[2, 4, 6]", "[1, 4, 9, 16]"],
      answer: 1,
      explain: "range(1, 4) gives 1, 2, 3, and each is squared: 1, 4, 9.",
      difficulty: 2,
    },
    {
      id: "q-9+-3",
      level: "9+",
      q: "Which block always runs, whether or not an error occurred?",
      options: ["try", "except", "else", "finally"],
      answer: 3,
      explain:
        "`finally` always executes, which makes it the right place to close files or database connections.",
      difficulty: 2,
    },
    {
      id: "q-9+-4",
      level: "9+",
      q: "What does `int('1010', 2)` return?",
      options: ["1010", "10", "2", "An error"],
      answer: 1,
      explain:
        "The second argument is the base. '1010' read as binary is 8 + 0 + 2 + 0 = 10.",
      difficulty: 2,
    },
  ],
};
