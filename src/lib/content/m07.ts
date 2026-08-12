import type { Module } from "../types";

export const m07: Module = {
  id: "9.7",
  slug: "python-basics",
  title: "Python Fundamentals",
  tagline: "Variables, data types, operators and I/O — the vocabulary of every program you will write.",
  icon: "Braces",
  periods: 10,
  outcomes: [
    "Identifies the structure of a program",
    "Uses comments to identify the usage of code for future reference",
    "Uses constants and variables in a program appropriately",
    "Identifies the primitive data types of a given program language",
    "Identifies and uses operators in a program",
    "Identifies precedence of operators",
    "Writes programs with the facilities of input from keyboard and output to standard devices",
  ],
  contents: [
    "Structure of a program",
    "Comments",
    "Constants and Variables",
    "Primitive data types",
    "Operator categories: arithmetical, relational, logical, bitwise",
    "Operator precedence",
    "Input from keyboard",
    "Output to standard devices",
  ],

  lessons: [
    {
      id: "9.7.1",
      title: "Program structure & comments",
      summary: "Every program follows the same skeleton — and why comments are written for humans.",
      minutes: 10,
      outcomes: [
        "Identifies the structure of a program",
        "Uses comments to identify the usage of code for future reference",
      ],
      blocks: [
        {
          kind: "text",
          md: `Just like a letter has a heading, a body and a conclusion, a program has a standard structure. Following it makes your code readable and gains marks in structured questions.`,
        },
        {
          kind: "code",
          lang: "pseudo",
          caption: "The standard structure of a program",
          code: `Start
    Importing essential libraries
    Declaration of variables / constants
    Input data
    Processing
    Output results
End`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["5"],
          caption: "The same structure in a real Python program",
          code: `# ── Import libraries ──────────────────────────────
import math

# ── Constants and variables ───────────────────────
PI = 3.14159          # a constant — by convention, CAPITALS

# ── Input ─────────────────────────────────────────
radius = float(input("Enter the radius: "))

# ── Processing ────────────────────────────────────
area = PI * radius * radius
circumference = 2 * PI * radius

# ── Output ────────────────────────────────────────
print("Area:", area)
print("Circumference:", circumference)`,
        },
        {
          kind: "heading",
          text: "Comments",
        },
        {
          kind: "text",
          md: `A **comment** is a note in the source code that the translator ignores completely. In Python, anything after a \`#\` on a line is a comment.

Comments exist for one reason: so that a **human** — your teacher, a classmate, or you in six months — can understand what the code does.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `age = 26                              # store the person's age

if age >= 18:
    print("You are eligible to vote")  # eligibility message

# This whole line is ignored by Python
# print("I am switched off")`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Comment the WHY, not the WHAT",
          md: `\`x = x + 1   # add 1 to x\` is useless — anyone can see that.

\`x = x + 1   # move to the next student in the list\` is valuable, because it explains *why*.`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "Marks for comments",
          md: `Practical questions often award marks for **appropriate** comments. Put one comment above each section (input, processing, output) and one on any line whose purpose is not obvious.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.7-inline-1",
            level: "9.7",
            q: "What happens to a comment when the program runs?",
            options: [
              "It is displayed on the screen",
              "It is completely ignored by the translator",
              "It is converted into machine code",
              "It causes a syntax error",
            ],
            answer: 1,
            explain:
              "Comments are non-executable statements. The translator skips them entirely; they exist purely for human readers.",
          },
        },
      ],
    },

    {
      id: "9.7.2",
      title: "Identifiers, variables & constants",
      summary: "Naming rules that Python enforces, and the difference between a value that changes and one that does not.",
      minutes: 12,
      outcomes: ["Uses constants and variables in a program appropriately"],
      blocks: [
        {
          kind: "text",
          md: `A **variable** is a symbolic name for a place in the computer's memory where a value is stored. The value can be changed while the program runs — that is what makes it *variable*.

An **identifier** is the name you give to any object: a variable, a function, or a class.`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "Python identifier rules",
          md: `- Must **start** with a letter or an underscore \`_\`
- After that: letters, digits and underscores only (A–z, 0–9, _)
- **No spaces** and no other symbols
- **Cannot** be a Python keyword (\`if\`, \`for\`, \`class\`, \`print\` is allowed but unwise…)
- There is **no limit** on length
- Identifiers are **case sensitive**: \`age\`, \`Age\` and \`AGE\` are three different variables`,
        },
        {
          kind: "table",
          headers: ["Identifier", "Valid?", "Why"],
          rows: [
            ["student_name", "Valid", "Letters and underscore"],
            ["_total", "Valid", "May start with an underscore"],
            ["mark1", "Valid", "Digits allowed after the first character"],
            ["1mark", "Invalid", "Cannot start with a digit"],
            ["student name", "Invalid", "Spaces are not allowed"],
            ["total-marks", "Invalid", "A hyphen is the minus operator"],
            ["for", "Invalid", "`for` is a Python keyword"],
          ],
        },
        {
          kind: "heading",
          text: "Creating variables in Python",
        },
        {
          kind: "text",
          md: `Unlike C or Pascal, Python has **no command for declaring a variable**. A variable is created at the moment you assign a value to it.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `name = "Nimal"      # created now, holds text
age = 17            # created now, holds a whole number
height = 1.68       # holds a decimal number

print(name, age, height)

age = 18            # the same variable now holds a different value
print("Next year:", age)`,
        },
        {
          kind: "heading",
          text: "Variables vs constants",
        },
        {
          kind: "text",
          md: `A **constant** is a value that does not change while the program runs.

Python has no keyword to enforce this, so programmers follow a **convention**: constants are written in CAPITAL LETTERS. Everyone then knows not to change them.`,
        },
        {
          kind: "callout",
          tone: "note",
          title: "The syllabus example",
          md: `In the straight-line equation **y = mx + c**:
- \`m\` (the gradient) and \`c\` (the intercept) are **constants**
- \`x\` is the **independent variable** — you choose it
- \`y\` is the **dependent variable** — its value depends on x, m and c`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["4"],
          caption: "y = mx + c in Python",
          code: `M = 2        # constant: gradient
C = 5        # constant: intercept

x = float(input("Enter x: "))    # independent variable
y = M * x + C                    # dependent variable

print("y =", y)`,
        },
        {
          kind: "heading",
          text: "Concatenation",
        },
        {
          kind: "text",
          md: `The \`+\` operator **joins** two strings together. This is called **concatenation**.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `first = "Kumara"
last = "Perera"
full = first + " " + last      # the " " adds the space
print(full)

# But + between text and a number is an error:
age = 17
# print("Age: " + age)         # TypeError — uncomment to see it
print("Age: " + str(age))      # convert the number to text first
print("Age:", age)             # or just let print handle it`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.7-inline-2",
            level: "9.7",
            q: "Which of these is a VALID Python identifier?",
            options: ["2nd_mark", "total marks", "_average", "class"],
            answer: 2,
            explain:
              "`_average` is valid — identifiers may begin with an underscore. `2nd_mark` starts with a digit, `total marks` contains a space, and `class` is a reserved keyword.",
          },
        },
      ],
    },

    {
      id: "9.7.3",
      title: "Data types & casting",
      summary: "The standard data types of Python, and how to convert between them.",
      minutes: 14,
      outcomes: ["Identifies the primitive data types of a given program language"],
      blocks: [
        {
          kind: "text",
          md: `Every value in Python has a **type**, and the type decides what you can do with it. Python works out the type automatically from the value you assign.`,
        },
        {
          kind: "table",
          headers: ["Category", "Types", "Example"],
          rows: [
            ["Numbers — integral", "Integer (int), Boolean (bool)", "x = 1 · flag = True"],
            ["Numbers — real", "Floating point (float)", "y = 2.8"],
            ["Numbers — complex", "Complex (complex)", "z = 1j"],
            ["Sequences — immutable", "String (str), Tuple, Bytes", 'name = "Ravi" · t = (1, 2)'],
            ["Sequences — mutable", "List, Byte array", "nums = [1, 2, 3]"],
            ["Set types", "Set, Frozen set", "s = {1, 2, 3}"],
            ["Mappings", "Dictionary (dict)", 'd = {"a": 1}'],
          ],
        },
        { kind: "widget", id: "datatype-inspector" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Ask Python what type something is",
          code: `x = 1
y = 2.8
z = 1j
name = "Ravi"
passed = True
marks = [65, 72]
point = (3, 4)
person = {"name": "Ravi", "age": 17}

for value in [x, y, z, name, passed, marks, point, person]:
    print(repr(value), "→", type(value).__name__)`,
        },
        {
          kind: "heading",
          text: "Casting — converting between types",
        },
        {
          kind: "text",
          md: `Python uses **classes** to define data types, so converting a value means calling the type as if it were a function. This is called **casting** or type conversion.`,
        },
        {
          kind: "syntax",
          title: "The three casting functions you must know",
          parts: [
            { text: "int(", label: "make a whole number", tone: "keyword" },
            { text: '"25"', label: "from this value", tone: "value" },
            { text: ")", label: "", tone: "punct" },
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `# int() — from an int, a float or a text literal
print(int(7), int(7.9), int("25"))     # 7 7 25   (note: 7.9 is cut, not rounded)

# float() — decimals
print(float(3), float("3.5"))          # 3.0 3.5

# str() — text from almost anything
print(str(99) + " bottles")            # 99 bottles

# Careful: this one fails
# print(int("3.5"))                    # ValueError
print(int(float("3.5")))               # 3  — convert twice`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "The single most important rule in this module",
          md: `**\`input()\` always returns a string** — even when the user typed a number.

If you need to do arithmetic with it, you *must* cast it:
- \`age = int(input("Age: "))\` for whole numbers
- \`price = float(input("Price: "))\` for decimals`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["10", "20"],
          caption: "Run this and watch what goes wrong",
          code: `a = input("First number: ")
b = input("Second number: ")

print("Without casting:", a + b)          # joins the text!
print("With casting:   ", int(a) + int(b))  # adds the numbers`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "The classic bug",
          md: `Typing 10 and 20 and getting **1020** instead of **30**. The \`+\` joined two strings instead of adding two numbers. Always cast the result of \`input()\`.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.7-inline-3",
            level: "9.7",
            q: "What does `int(9.8)` return?",
            options: ["10", "9", "9.8", "An error"],
            answer: 1,
            explain:
              "`int()` truncates towards zero — it cuts off the decimal part rather than rounding. To round properly use `round(9.8)`, which gives 10.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.7-1" },
      ],
    },

    {
      id: "9.7.4",
      title: "Operators",
      summary: "Arithmetic, assignment, relational, logical and bitwise — all five categories.",
      minutes: 18,
      outcomes: ["Identifies and uses operators in a program"],
      blocks: [
        {
          kind: "text",
          md: `Operators perform operations on variables and values. The syllabus groups them into categories, and you must be able to name and use each one.`,
        },
        { kind: "heading", text: "1. Arithmetic operators" },
        {
          kind: "table",
          headers: ["Operator", "Name", "Example", "Result"],
          rows: [
            ["+", "Addition", "7 + 2", "9"],
            ["-", "Subtraction", "7 - 2", "5"],
            ["*", "Multiplication", "7 * 2", "14"],
            ["/", "Division", "7 / 2", "3.5  (always a float)"],
            ["%", "Modulus (remainder)", "7 % 2", "1"],
            ["**", "Exponentiation (power)", "7 ** 2", "49"],
            ["//", "Floor division", "7 // 2", "3  (decimal discarded)"],
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `a = 7
b = 2
print("a + b  =", a + b)
print("a - b  =", a - b)
print("a * b  =", a * b)
print("a / b  =", a / b)     # 3.5  — true division
print("a % b  =", a % b)     # 1    — the remainder
print("a ** b =", a ** b)    # 49   — 7 squared
print("a // b =", a // b)    # 3    — whole part only`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Why % matters",
          md: `The modulus operator is how you test divisibility:
- \`n % 2 == 0\` → n is **even**
- \`n % 3 == 0\` → n is a multiple of 3
- \`n % 10\` → the **last digit** of n

Almost every "even numbers" or "digits" question uses it.`,
        },
        { kind: "heading", text: "2. Assignment operators" },
        {
          kind: "table",
          headers: ["Operator", "Example", "Same as"],
          rows: [
            ["=", "c = 5", "c = 5"],
            ["+=", "m += 3", "m = m + 3"],
            ["-=", "m -= 3", "m = m - 3"],
            ["*=", "m *= 3", "m = m * 3"],
            ["/=", "m /= 3", "m = m / 3"],
            ["//=", "m //= 3", "m = m // 3"],
            ["%=", "m %= 3", "m = m % 3"],
            ["**=", "m **= 3", "m = m ** 3"],
          ],
        },
        { kind: "heading", text: "3. Relational (comparison) operators" },
        {
          kind: "text",
          md: `These compare two values and always produce a **Boolean** result: \`True\` or \`False\`.`,
        },
        {
          kind: "table",
          headers: ["Operator", "Meaning", "Example", "Result"],
          rows: [
            ["==", "Equal to", "5 == 5", "True"],
            ["!=", "Not equal to", "5 != 3", "True"],
            [">", "Greater than", "5 > 8", "False"],
            ["<", "Less than", "5 < 8", "True"],
            [">=", "Greater than or equal to", "5 >= 5", "True"],
            ["<=", "Less than or equal to", "5 <= 3", "False"],
          ],
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "= is not ==",
          md: `\`=\` **assigns** a value. \`==\` **compares** two values.

\`if age = 18:\` is a syntax error. It must be \`if age == 18:\`. This is the single most common beginner mistake in the whole subject.`,
        },
        { kind: "heading", text: "4. Logical operators" },
        {
          kind: "text",
          md: `Logical operators combine conditional statements.`,
        },
        {
          kind: "table",
          headers: ["Operator", "Description", "Example"],
          rows: [
            ["and", "True only if BOTH statements are true", "a < 5 and b < 10"],
            ["or", "True if AT LEAST ONE statement is true", "a < 5 or b < 4"],
            ["not", "Reverses the result", "not(a < 5 and b < 10)"],
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `a = 3
b = 8

print(a < 5 and b < 10)    # True and True   → True
print(a < 5 and b < 4)     # True and False  → False
print(a < 5 or  b < 4)     # True or False   → True
print(not (a < 5))         # not True        → False

# A real use: is this a valid exam mark?
mark = 85
print("Valid mark?", mark >= 0 and mark <= 100)`,
        },
        { kind: "heading", text: "5. Bitwise operators" },
        {
          kind: "text",
          md: `Bitwise operators compare numbers **bit by bit** in their binary form. The syllabus uses a = 60 and b = 13 as the standard example.`,
        },
        { kind: "widget", id: "bitwise-lab" },
        {
          kind: "table",
          headers: ["Operator", "Name", "Rule", "a=60, b=13"],
          rows: [
            ["&", "AND", "1 only if BOTH bits are 1", "a & b = 12  (0000 1100)"],
            ["|", "OR", "1 if EITHER bit is 1", "a | b = 61  (0011 1101)"],
            ["^", "XOR", "1 if the bits are DIFFERENT", "a ^ b = 49  (0011 0001)"],
            ["~", "NOT", "Inverts all the bits", "~a = -61  (2's complement)"],
            ["<<", "Left shift", "Move bits left, multiply by 2 each time", "a << 1 = 120"],
            [">>", "Right shift", "Move bits right, divide by 2 each time", "a >> 1 = 30"],
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The syllabus example, checked by the computer",
          code: `a = 60      # 0011 1100
b = 13      # 0000 1101

print("a      =", format(a, '08b'), a)
print("b      =", format(b, '08b'), b)
print("a & b  =", format(a & b, '08b'), a & b)
print("a | b  =", format(a | b, '08b'), a | b)
print("a ^ b  =", format(a ^ b, '08b'), a ^ b)
print("~a     =", ~a)
print("a << 1 =", a << 1)
print("a >> 1 =", a >> 1)`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.7-inline-4",
            level: "9.7",
            q: "What is the value of `12 & 10`?",
            options: ["8", "14", "22", "2"],
            answer: 0,
            explain:
              "12 is 1100 and 10 is 1010. AND keeps a 1 only where both have a 1: 1000, which is 8.",
          },
        },
      ],
    },

    {
      id: "9.7.5",
      title: "Operator precedence & input/output",
      summary: "Which operator runs first, and how data gets into and out of your program.",
      minutes: 14,
      outcomes: [
        "Identifies precedence of operators",
        "Writes programs with the facilities of input from keyboard and output to standard devices",
      ],
      blocks: [
        {
          kind: "text",
          md: `When an expression contains several operators, the order they are applied in changes the answer. **Precedence** is the standard rule that decides that order.

\`2 + 3 * 4\` is **14**, not 20, because \`*\` has higher precedence than \`+\`.`,
        },
        { kind: "widget", id: "operator-precedence" },
        {
          kind: "table",
          headers: ["Precedence", "Operators", "Description"],
          rows: [
            ["Highest", "()", "Parentheses — always evaluated first"],
            ["", "**", "Exponentiation"],
            ["", "~  +x  -x", "Complement, unary plus and minus"],
            ["", "*  /  %  //", "Multiply, divide, modulo, floor division"],
            ["", "+  -", "Addition and subtraction"],
            ["", "<<  >>", "Bitwise shifts"],
            ["", "&", "Bitwise AND"],
            ["", "^", "Bitwise XOR"],
            ["", "|", "Bitwise OR"],
            ["", "<  <=  >  >=", "Comparison operators"],
            ["", "==  !=", "Equality operators"],
            ["", "=  +=  -=  *=  /=  //=  %=  **=", "Assignment operators"],
            ["", "is,  is not", "Identity operators"],
            ["", "in,  not in", "Membership operators"],
            ["", "not", "Logical NOT"],
            ["", "and", "Logical AND"],
            ["Lowest", "or", "Logical OR"],
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Same numbers, different brackets, different answers",
          code: `print(2 + 3 * 4)        # 14 — * happens first
print((2 + 3) * 4)      # 20 — brackets force + first

print(10 - 4 - 2)       # 4  — left to right
print(2 ** 3 ** 2)      # 512 — ** goes RIGHT to left: 2**(3**2)

print(10 / 2 * 5)       # 25.0 — same precedence, left to right
print(True or False and False)   # True — 'and' binds tighter than 'or'`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "When in doubt, use brackets",
          md: `Examiners ask you to *"use brackets where the compiler cannot identify the precedence by default"*. Extra brackets are never wrong and always make your intention clear. \`(a + b) / 2\` beats \`a + b / 2\` every time.`,
        },
        {
          kind: "heading",
          text: "Input from the keyboard",
        },
        {
          kind: "syntax",
          title: "The input() function",
          parts: [
            { text: "name", label: "variable that receives the value", tone: "name" },
            { text: " = ", label: "assignment", tone: "punct" },
            { text: "input", label: "built-in function", tone: "keyword" },
            { text: "(", label: "", tone: "punct" },
            { text: '"Enter name: "', label: "prompt shown to the user (optional)", tone: "value" },
            { text: ")", label: "", tone: "punct" },
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          stdin: ["Sanduni", "17"],
          caption: "Run it — the program pauses and waits for you",
          code: `name = input("What is your name? ")
age = int(input("How old are you? "))

print("Hello,", name)
print("Next year you will be", age + 1)`,
        },
        {
          kind: "heading",
          text: "Output to the screen",
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `name = "Ravi"
marks = 87

# Several values, separated by commas — print adds a space between them
print("Student:", name, "Marks:", marks)

# Joining strings with +  (everything must be a string)
print("Student: " + name + " Marks: " + str(marks))

# f-string — the modern, readable way
print(f"Student: {name} scored {marks} marks")

# Controlling the separator and the line ending
print("a", "b", "c", sep="-")
print("no newline here...", end=" ")
print("...continues on the same line")`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Three ways to print — pick one and be consistent",
          md: `- \`print("Age:", age)\` — simplest, adds a space automatically
- \`print("Age: " + str(age))\` — needs casting, full control of spacing
- \`print(f"Age: {age}")\` — clearest for complex messages`,
        },
        { kind: "exercise", exerciseId: "ex-9.7-2" },
        { kind: "exercise", exerciseId: "ex-9.7-3" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.7-1",
      title: "Fahrenheit to Centigrade",
      level: "9.7",
      difficulty: 1,
      xp: 30,
      tags: ["input", "casting", "arithmetic"],
      brief: `Using the formula **C = (F − 32) × 5 / 9**, read a temperature in Fahrenheit from the keyboard and display the temperature in Centigrade.

Print the result in the form \`Centigrade: 37.0\`.

Add comments identifying the input, processing and output sections.`,
      starter: `# Input


# Processing


# Output
`,
      hints: [
        "Temperatures can have decimals, so read with `float(input(...))`, not `int`.",
        "Follow the formula exactly: subtract 32 FIRST, so it needs brackets: `(f - 32) * 5 / 9`.",
        "Without the brackets you would calculate `f - (32 * 5 / 9)`, which is wrong.",
        "Print with `print(\"Centigrade:\", c)`.",
      ],
      solution: `# Input
f = float(input("Enter temperature in Fahrenheit: "))

# Processing
c = (f - 32) * 5 / 9

# Output
print("Centigrade:", c)`,
      tests: [
        {
          kind: "io",
          name: "98.6 F is 37 C",
          stdin: ["98.6"],
          expect: "37.0",
          match: "contains",
        },
        {
          kind: "io",
          name: "32 F is 0 C (freezing point)",
          stdin: ["32"],
          expect: "0.0",
          match: "contains",
        },
        {
          kind: "io",
          name: "212 F is 100 C (boiling point)",
          stdin: ["212"],
          expect: "100.0",
          match: "contains",
          hidden: true,
        },
      ],
    },
    {
      id: "ex-9.7-2",
      title: "Area and perimeter",
      level: "9.7",
      difficulty: 1,
      xp: 30,
      tags: ["input", "arithmetic", "output"],
      brief: `Read the **length** and **width** of a rectangle from the keyboard (in that order) and display both its area and its perimeter.

Output must be exactly two lines:
\`\`\`
Area: 24.0
Perimeter: 20.0
\`\`\``,
      starter: `length = float(input("Length: "))
width = float(input("Width: "))

# Your code here
`,
      hints: [
        "Area of a rectangle = length × width.",
        "Perimeter = 2 × (length + width). The brackets matter — without them you would get 2 × length + width.",
        "Print each on its own line with two separate print statements.",
      ],
      solution: `length = float(input("Length: "))
width = float(input("Width: "))

area = length * width
perimeter = 2 * (length + width)

print("Area:", area)
print("Perimeter:", perimeter)`,
      tests: [
        {
          kind: "io",
          name: "6 by 4",
          stdin: ["6", "4"],
          expect: "Area: 24.0\nPerimeter: 20.0",
          match: "loose",
        },
        {
          kind: "io",
          name: "A square: 5 by 5",
          stdin: ["5", "5"],
          expect: "Area: 25.0\nPerimeter: 20.0",
          match: "loose",
          hidden: true,
        },
      ],
    },
    {
      id: "ex-9.7-3",
      title: "Split a three-digit number",
      level: "9.7",
      difficulty: 2,
      xp: 35,
      tags: ["arithmetic", "modulus", "floor division"],
      brief: `Read a **three-digit** whole number and display its hundreds, tens and units digits on three separate lines.

For the input \`472\` the output must be:
\`\`\`
Hundreds: 4
Tens: 7
Units: 2
\`\`\`

You must use only arithmetic — \`//\` and \`%\`. Do not convert the number to a string.`,
      starter: `n = int(input("Enter a three-digit number: "))

# Your code here
`,
      hints: [
        "`n % 10` gives the last digit — the remainder after dividing by 10.",
        "`n // 100` gives the hundreds digit, because floor division throws away the rest.",
        "For the tens digit: first do `n // 10` to remove the units, then `% 10` on that result.",
        "So the tens digit is `(n // 10) % 10`.",
      ],
      solution: `n = int(input("Enter a three-digit number: "))

hundreds = n // 100
tens = (n // 10) % 10
units = n % 10

print("Hundreds:", hundreds)
print("Tens:", tens)
print("Units:", units)`,
      tests: [
        {
          kind: "io",
          name: "472 splits correctly",
          stdin: ["472"],
          expect: "Hundreds: 4\nTens: 7\nUnits: 2",
          match: "loose",
        },
        {
          kind: "io",
          name: "100 splits correctly",
          stdin: ["100"],
          expect: "Hundreds: 1\nTens: 0\nUnits: 0",
          match: "loose",
          hidden: true,
        },
        {
          kind: "io",
          name: "999 splits correctly",
          stdin: ["999"],
          expect: "Hundreds: 9\nTens: 9\nUnits: 9",
          match: "loose",
          hidden: true,
        },
        {
          kind: "source",
          name: "Uses arithmetic, not string slicing",
          mustNotUse: ["str(", "[0]", "[1]", "[2]"],
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.7-1",
      level: "9.7",
      q: "What does `input()` always return?",
      options: ["An integer", "A float", "A string", "The type that was typed"],
      answer: 2,
      explain:
        "`input()` always returns a string. To do arithmetic with it you must cast using `int()` or `float()`.",
      difficulty: 1,
    },
    {
      id: "q-9.7-2",
      level: "9.7",
      q: "What is the output of `print(2 + 3 * 4 ** 2)`?",
      options: ["80", "50", "400", "26"],
      answer: 1,
      explain:
        "`**` first: 4**2 = 16. Then `*`: 3 × 16 = 48. Then `+`: 2 + 48 = 50.",
      difficulty: 2,
    },
    {
      id: "q-9.7-3",
      level: "9.7",
      q: "What is the result of `17 // 5` and `17 % 5`?",
      options: ["3.4 and 2", "3 and 2", "2 and 3", "3.4 and 3.4"],
      answer: 1,
      explain:
        "`//` is floor division and gives the whole part, 3. `%` is modulus and gives the remainder, 2.",
      difficulty: 1,
    },
    {
      id: "q-9.7-4",
      level: "9.7",
      q: "Which of these is NOT a valid Python identifier?",
      options: ["_marks", "marks2", "2marks", "student_marks"],
      answer: 2,
      explain:
        "An identifier cannot begin with a digit. It must start with a letter or an underscore.",
      difficulty: 1,
    },
    {
      id: "q-9.7-5",
      level: "9.7",
      q: "What is printed?",
      code: 'a = "5"\nb = "3"\nprint(a + b)',
      options: ["8", "53", "15", "An error"],
      answer: 1,
      explain:
        "Both values are strings, so `+` concatenates them into \"53\". To add them numerically you would need `int(a) + int(b)`.",
      difficulty: 2,
    },
    {
      id: "q-9.7-6",
      level: "9.7",
      q: "Given a = 60 and b = 13, what is `a | b`?",
      options: ["12", "49", "61", "73"],
      answer: 2,
      explain:
        "60 is 0011 1100 and 13 is 0000 1101. OR puts a 1 wherever either bit is 1: 0011 1101 = 61.",
      difficulty: 3,
    },
    {
      id: "q-9.7-7",
      level: "9.7",
      q: "Which operator has the HIGHEST precedence in Python?",
      options: ["*", "**", "+", "and"],
      answer: 1,
      explain:
        "Ignoring parentheses, exponentiation `**` has the highest precedence of the operators listed. Logical `and` is near the bottom.",
      difficulty: 2,
    },
    {
      id: "q-9.7-8",
      level: "9.7",
      q: "What is the value of `not (5 > 3 and 2 > 4)`?",
      options: ["True", "False", "An error", "None"],
      answer: 0,
      explain:
        "5 > 3 is True, 2 > 4 is False. True and False = False. `not False` = True.",
      difficulty: 2,
    },
    {
      id: "q-9.7-9",
      level: "9.7",
      q: "Why are constants written in CAPITAL LETTERS in Python?",
      options: [
        "Python refuses to change capitalised variables",
        "It is only a naming convention that tells other programmers not to change the value",
        "Capital letters make the program run faster",
        "It is required by the syntax",
      ],
      answer: 1,
      explain:
        "Python has no mechanism to enforce constants. Capitals are a widely-followed convention that communicates intent to human readers.",
      difficulty: 2,
    },
    {
      id: "q-9.7-10",
      level: "9.7",
      q: "What is printed by `print(int(-7.8))`?",
      options: ["-8", "-7", "7", "8"],
      answer: 1,
      explain:
        "`int()` truncates towards zero, cutting off the decimal part, so -7.8 becomes -7. It does not round.",
      difficulty: 3,
    },
  ],
};
