import type { Module } from "../types";

export const m09: Module = {
  id: "9.9",
  slug: "functions",
  title: "Sub-programs & Functions",
  tagline: "Write it once, name it well, use it everywhere.",
  icon: "Package",
  periods: 10,
  outcomes: [
    "Briefly describes the functions",
    "Lists and briefly describes the types of functions",
    "Identifies the structure of a function",
    "Compares local and global variables",
    "Identifies the behavior of a variable in terms of life time",
    "Identifies the need of return values and writes functions to obtain the appropriate return value",
    "Writes functions using relevant parameters and arguments",
    "Uses user defined functions",
  ],
  contents: [
    "Types of subprograms: built in, user defined",
    "Structure",
    "Parameter passing",
    "Return values",
    "Default values",
    "Scope of variables",
  ],

  lessons: [
    {
      id: "9.9.1",
      title: "Built-in and user-defined sub-programs",
      summary: "Why programs are made of parts, and the two sources those parts come from.",
      minutes: 12,
      outcomes: ["Briefly describes the functions", "Lists and briefly describes the types of functions"],
      blocks: [
        {
          kind: "text",
          md: `A **function** (or sub-program) is a block of code that only runs when it is **called**. It is the direct code equivalent of a box on a structure chart from level 9.2.

There are two types.`,
        },
        {
          kind: "compare",
          left: {
            title: "Built-in sub-programs",
            items: [
              "Already written and stored in a library",
              "Available to every program",
              "Examples: print(), input(), len(), int(), range(), sum(), max(), min(), abs(), round()",
              "You call them without defining them",
            ],
          },
          right: {
            title: "User-defined sub-programs",
            items: [
              "Written by the programmer",
              "Used when no built-in does what you need",
              "Created with the def keyword",
              "Can also be stored in a library for later reuse",
            ],
          },
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Built-in functions you already use",
          code: `marks = [65, 72, 58, 90, 45]

print("How many :", len(marks))
print("Total    :", sum(marks))
print("Highest  :", max(marks))
print("Lowest   :", min(marks))
print("Average  :", round(sum(marks) / len(marks), 2))
print("Absolute :", abs(-17))`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "Why use functions at all?",
          md: `- **Avoid repetition**: write the code once instead of five times
- **Divide the work**: each module of your structure chart becomes a function
- **Easier to test**: you can check one function on its own
- **Easier to read**: \`calculate_grade(marks)\` explains itself
- **Reusable**: store it and use it in another program`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.9-inline-1",
            level: "9.9",
            q: "Which of these is a built-in Python function?",
            options: ["calculate_total()", "len()", "main()", "grade()"],
            answer: 1,
            explain:
              "`len()` is built into Python and always available. The others are names a programmer would have to define themselves.",
          },
        },
      ],
    },

    {
      id: "9.9.2",
      title: "Structure, parameters and arguments",
      summary: "How to define a function, and how data travels into it.",
      minutes: 16,
      outcomes: [
        "Identifies the structure of a function",
        "Writes functions using relevant parameters and arguments",
      ],
      blocks: [
        {
          kind: "syntax",
          title: "Defining a function",
          parts: [
            { text: "def", label: "keyword that starts a definition", tone: "keyword" },
            { text: " greet", label: "function name (an identifier)", tone: "name" },
            { text: "(", label: "", tone: "punct" },
            { text: "fname", label: "parameter", tone: "value" },
            { text: "):", label: "colon, then an indented body", tone: "punct" },
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `def my_function():
    print("This is my first function")

# Nothing happens until we CALL it
my_function()
my_function()      # calling it twice runs it twice`,
        },
        {
          kind: "heading",
          text: "Parameters and arguments",
        },
        {
          kind: "callout",
          tone: "key",
          title: "The difference: a favourite exam question",
          md: `- A **parameter** is the name in the function **definition**: the placeholder.
- An **argument** is the actual value passed in when the function is **called**.

\`def greet(name):\`: \`name\` is the parameter.
\`greet("Nimal")\`: \`"Nimal"\` is the argument.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `def greet(fname):              # fname is the PARAMETER
    print("Hello,", fname)

greet("Nimal")                 # "Nimal" is the ARGUMENT
greet("Kamala")
greet("Sanduni")`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Several parameters: separate them with commas, and order matters",
          code: `def student_details(name, age, grade):
    print(name, "is", age, "years old and is in grade", grade)

student_details("Ravi", 17, 12)
student_details("Mala", 16, 11)`,
        },
        {
          kind: "heading",
          text: "Default parameter values",
        },
        {
          kind: "text",
          md: `A parameter can be given a **default value**. If the caller does not supply an argument, the default is used.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `def greet(name, greeting="Hello"):
    print(greeting + ",", name)

greet("Nimal")                    # uses the default → Hello, Nimal
greet("Nimal", "Good morning")    # overrides it     → Good morning, Nimal`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "Order rule",
          md: `Parameters **with** defaults must come **after** parameters without them.
\`def f(a, b=2)\` is fine. \`def f(a=1, b)\` is a syntax error.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.9-inline-2",
            level: "9.9",
            q: "In `def area(length, width=5):`, what is `width=5`?",
            options: [
              "An argument",
              "A parameter with a default value",
              "A global variable",
              "A return value",
            ],
            answer: 1,
            explain:
              "`width` is a parameter, and `= 5` gives it a default value used whenever the caller does not supply one.",
          },
        },
      ],
    },

    {
      id: "9.9.3",
      title: "Return values",
      summary: "Sending a result back to whoever called the function, and why print is not the same thing.",
      minutes: 14,
      outcomes: [
        "Identifies the need of return values and writes functions to obtain the appropriate return value",
      ],
      blocks: [
        {
          kind: "text",
          md: `A function that only prints is a dead end: the value is on the screen but the program cannot use it.

The \`return\` statement sends a value **back to the caller**, where it can be stored, printed, or passed to another function.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Compare the two carefully",
          code: `def add_print(a, b):
    print(a + b)          # shows the answer, gives back nothing

def add_return(a, b):
    return a + b          # hands the answer back

add_print(3, 4)                  # 7 appears, but we cannot use it
result = add_return(3, 4)        # the 7 is stored
print("Stored result:", result)
print("Used again   :", result * 10)

# What does the printing version actually give back?
x = add_print(3, 4)
print("add_print returned:", x)   # None: nothing came back`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "return vs print",
          md: `- \`print\` shows a value **to the user**.
- \`return\` gives a value **to the program**.

A function that calculates something should almost always \`return\` its answer, not print it. Let the caller decide what to do with it.`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "return ends the function immediately",
          md: `Any lines after a \`return\` that runs will never execute. This is often a bug, and occasionally exactly what you want, to leave a function early.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Building a function that mirrors a structure chart module",
          code: `def calculate_grade(marks):
    if marks >= 75:
        return "A"
    elif marks >= 50:
        return "B"
    elif marks >= 40:
        return "C"
    else:
        return "F"

def perimeter_of_circle(radius):
    return 2 * 3.14159 * radius

def area_of_square(side):
    return side * side

print("82 marks →", calculate_grade(82))
print("45 marks →", calculate_grade(45))
print("Perimeter of r=7 circle:", round(perimeter_of_circle(7), 2))
print("Area of 6 cm square    :", area_of_square(6))`,
        },
        { kind: "exercise", exerciseId: "ex-9.9-1" },
      ],
    },

    {
      id: "9.9.4",
      title: "Scope & lifetime of variables",
      summary: "Local vs global, why a function cannot see another function's variables, and what 'lifetime' means.",
      minutes: 16,
      outcomes: [
        "Compares local and global variables",
        "Identifies the behavior of a variable in terms of life time",
      ],
      blocks: [
        {
          kind: "text",
          md: `The **scope** of a variable is the part of the program where you can access it. Where you create a variable decides its scope.`,
        },
        {
          kind: "compare",
          left: {
            title: "Local variable",
            items: [
              "Created INSIDE a function",
              "Can be used only inside that function",
              "Created when the function is called",
              "Destroyed when the function ends",
              "Two functions can each have their own 'total' with no clash",
            ],
          },
          right: {
            title: "Global variable",
            items: [
              "Created OUTSIDE all functions",
              "Can be read by every function in the program",
              "Created when the program starts",
              "Lives until the program ends",
              "Changing one from inside a function needs the global keyword",
            ],
          },
        },
        { kind: "widget", id: "scope-visualiser" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "A local variable does not exist outside its function",
          code: `def my_function():
    local_var = "I live inside the function"
    print("Inside :", local_var)

my_function()

# This line fails: local_var does not exist out here.
# Remove the # to see the NameError.
# print("Outside:", local_var)`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Global variables can be READ from inside a function",
          code: `school = "Royal College"       # global

def show():
    print("Reading the global:", school)

show()
print("Still available outside:", school)`,
        },
        {
          kind: "heading",
          text: "Changing a global from inside a function",
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `count = 0        # global

def wrong_increase():
    count = 10       # creates a NEW local variable: the global is untouched

def right_increase():
    global count     # "I mean the global one"
    count = 10

wrong_increase()
print("After wrong_increase:", count)   # still 0

right_increase()
print("After right_increase:", count)   # now 10`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "Lifetime",
          md: `**Lifetime** is *how long* a variable exists in memory:

- A **local** variable is born when the function is called and dies when the function returns. Call the function again and you get a brand new one.
- A **global** variable exists for the whole run of the program.`,
        },
        {
          kind: "trace",
          caption: "Step through and watch locals appear and disappear as functions are called.",
          code: `total = 0

def add_marks(a, b):
    result = a + b
    return result

x = add_marks(30, 45)
y = add_marks(10, 20)
total = x + y
print(total)`,
        },
        {
          kind: "heading",
          text: "Passing by value and by reference",
        },
        {
          kind: "text",
          md: `When you pass an argument, what actually travels into the function depends on the type of data.

- **Immutable** values (int, float, string, tuple) behave like **pass by value**: the function gets a copy, and changes inside do not affect the original.
- **Mutable** values (list, dictionary) behave like **pass by reference**: the function gets access to the same object, so changes inside **do** affect the original.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Run this and compare the two results",
          code: `def change_number(n):
    n = n + 100
    print("  inside :", n)

def change_list(items):
    items.append(99)
    print("  inside :", items)

num = 5
print("Number before:", num)
change_number(num)
print("Number after :", num, "← unchanged (like pass by value)")

print()

marks = [10, 20]
print("List before:", marks)
change_list(marks)
print("List after :", marks, "← changed! (like pass by reference)")`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "This catches people out",
          md: `A function that receives a **list** and modifies it changes the caller's list too. If you do not want that, pass a copy: \`change_list(marks[:])\`.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.9-inline-3",
            level: "9.9",
            q: "What is printed?",
            code: 'x = 5\n\ndef f():\n    x = 20\n\nf()\nprint(x)',
            options: ["20", "5", "None", "An error"],
            answer: 1,
            explain:
              "Assigning to `x` inside the function creates a new LOCAL variable that shadows the global. The global `x` is untouched, so 5 is printed. Adding `global x` would make it print 20.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.9-2" },
        { kind: "exercise", exerciseId: "ex-9.9-3" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.9-1",
      title: "Circle calculations",
      level: "9.9",
      difficulty: 1,
      xp: 30,
      tags: ["functions", "return"],
      brief: `Write two functions that **return** (not print) their answers. Use **3.14159** for π.

- \`circle_area(radius)\` → returns π × r²
- \`circle_perimeter(radius)\` → returns 2 × π × r

Then read a radius from the keyboard and print both values, each rounded to 2 decimal places:
\`\`\`
Area: 153.94
Perimeter: 43.98
\`\`\``,
      starter: `PI = 3.14159


def circle_area(radius):
    pass


def circle_perimeter(radius):
    pass


r = float(input("Radius: "))
# Print the two lines here
`,
      hints: [
        "Use `return`, not `print`, inside the two functions.",
        "`radius ** 2` or `radius * radius` both work for r².",
        "`round(value, 2)` rounds to 2 decimal places.",
        "Print with `print(\"Area:\", round(circle_area(r), 2))`.",
      ],
      solution: `PI = 3.14159


def circle_area(radius):
    return PI * radius * radius


def circle_perimeter(radius):
    return 2 * PI * radius


r = float(input("Radius: "))
print("Area:", round(circle_area(r), 2))
print("Perimeter:", round(circle_perimeter(r), 2))`,
      tests: [
        {
          kind: "io",
          name: "radius 7",
          stdin: ["7"],
          expect: "Area: 153.94\nPerimeter: 43.98",
          match: "loose",
        },
        { kind: "expr", name: "circle_area returns a value", stdin: ["1"], expr: "round(circle_area(1), 5)", expect: "3.14159" },
        {
          kind: "expr",
          name: "circle_perimeter returns a value",
          stdin: ["1"],
          expr: "round(circle_perimeter(1), 5)",
          expect: "6.28318",
        },
      ],
    },
    {
      id: "ex-9.9-2",
      title: "Grade function with a default",
      level: "9.9",
      difficulty: 2,
      xp: 35,
      tags: ["functions", "defaults", "selection"],
      brief: `Write a function \`grade(marks, pass_mark=40)\` that **returns**:

- \`"A"\` if marks are 75 or more
- \`"B"\` if marks are 50 or more
- \`"C"\` if marks are at least the **pass_mark**
- \`"F"\` otherwise

Then print the results of these four calls, one per line:
\`grade(80)\`, \`grade(55)\`, \`grade(42)\`, \`grade(42, 45)\``,
      starter: `def grade(marks, pass_mark=40):
    pass


print(grade(80))
print(grade(55))
print(grade(42))
print(grade(42, 45))`,
      hints: [
        "Use `if` / `elif` / `elif` / `else`, testing from the highest mark downwards.",
        "The third branch compares against the parameter: `elif marks >= pass_mark:`.",
        "`grade(42)` uses the default pass mark of 40, so 42 passes → C.",
        "`grade(42, 45)` sets pass_mark to 45, so 42 is below it → F.",
      ],
      solution: `def grade(marks, pass_mark=40):
    if marks >= 75:
        return "A"
    elif marks >= 50:
        return "B"
    elif marks >= pass_mark:
        return "C"
    else:
        return "F"


print(grade(80))
print(grade(55))
print(grade(42))
print(grade(42, 45))`,
      tests: [
        { kind: "io", name: "All four calls", expect: "A\nB\nC\nF", match: "loose" },
        { kind: "expr", name: "Boundary: exactly 75", expr: "grade(75)", expect: "'A'" },
        { kind: "expr", name: "Boundary: exactly 40 with default", expr: "grade(40)", expect: "'C'" },
        { kind: "expr", name: "Custom pass mark is honoured", expr: "grade(60, 65)", expect: "'B'", hidden: true },
      ],
    },
    {
      id: "ex-9.9-3",
      title: "Local or global?",
      level: "9.9",
      difficulty: 3,
      xp: 40,
      tags: ["scope", "global"],
      brief: `A shop keeps a running \`total\` as a **global** variable.

Write two functions:

- \`add_item(price)\`: adds the price to the **global** \`total\` (it returns nothing)
- \`get_total()\`: returns the current value of \`total\`

Then call \`add_item(100)\`, \`add_item(250)\`, \`add_item(50)\` and print \`get_total()\`.

The output must be exactly \`400\`.`,
      starter: `total = 0


def add_item(price):
    pass


def get_total():
    pass


add_item(100)
add_item(250)
add_item(50)
print(get_total())`,
      hints: [
        "Inside `add_item` you are CHANGING the global, so you need `global total` as the first line.",
        "Without `global`, `total = total + price` would create a new local variable and fail.",
        "`get_total` only READS the global, so it does not need the `global` keyword.",
        "`get_total` must use `return total`, not `print(total)`.",
      ],
      solution: `total = 0


def add_item(price):
    global total
    total = total + price


def get_total():
    return total


add_item(100)
add_item(250)
add_item(50)
print(get_total())`,
      tests: [
        { kind: "io", name: "Total is 400", expect: "400", match: "loose" },
        {
          kind: "expr",
          name: "get_total() returns the running total",
          expr: "get_total()",
          expect: "400",
        },
        {
          kind: "expr",
          name: "add_item() really changes the global",
          setup: "add_item(600)",
          expr: "get_total()",
          expect: "1000",
          hidden: true,
        },
        { kind: "source", name: "Uses the global keyword", mustUse: ["global"] },
        { kind: "source", name: "get_total returns rather than prints", mustUse: ["return total"] },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.9-1",
      level: "9.9",
      q: "What is the difference between a parameter and an argument?",
      options: [
        "They mean exactly the same thing",
        "A parameter is the name in the definition; an argument is the value passed when calling",
        "A parameter is the value passed; an argument is the name in the definition",
        "Parameters are global; arguments are local",
      ],
      answer: 1,
      explain:
        "In `def greet(name):` the parameter is `name`. In `greet(\"Nimal\")` the argument is `\"Nimal\"`.",
      difficulty: 1,
    },
    {
      id: "q-9.9-2",
      level: "9.9",
      q: "What does a function return if it has no `return` statement?",
      options: ["0", "An empty string", "None", "An error occurs"],
      answer: 2,
      explain:
        "A function without an explicit return gives back `None`. That is why storing the result of a print-only function gives None.",
      difficulty: 2,
    },
    {
      id: "q-9.9-3",
      level: "9.9",
      q: "Which keyword is used to define a function in Python?",
      options: ["function", "define", "def", "func"],
      answer: 2,
      explain: "Python uses `def`, followed by the function name and parentheses.",
      difficulty: 1,
    },
    {
      id: "q-9.9-4",
      level: "9.9",
      q: "What is the LIFETIME of a local variable?",
      options: [
        "From the start of the program until it ends",
        "From when the function is called until the function ends",
        "Until the variable is printed",
        "Forever, once created",
      ],
      answer: 1,
      explain:
        "A local variable is created when the function is called and destroyed when the function finishes. Each call creates a fresh one.",
      difficulty: 2,
    },
    {
      id: "q-9.9-5",
      level: "9.9",
      q: "What is printed?",
      code: 'def f(a, b=10):\n    return a * b\n\nprint(f(3), f(3, 2))',
      options: ["30 6", "6 30", "30 30", "An error"],
      answer: 0,
      explain:
        "`f(3)` uses the default b=10 giving 30. `f(3, 2)` overrides b with 2, giving 6.",
      difficulty: 2,
    },
    {
      id: "q-9.9-6",
      level: "9.9",
      q: "A function receives a list and appends an item to it. What happens to the caller's list?",
      options: [
        "Nothing: the function works on a copy",
        "It is also changed, because lists are mutable and are passed by reference",
        "The program raises an error",
        "The list becomes empty",
      ],
      answer: 1,
      explain:
        "Mutable objects such as lists are passed by reference, so the function operates on the same object the caller holds. Immutable values like integers behave like pass by value.",
      difficulty: 3,
    },
    {
      id: "q-9.9-7",
      level: "9.9",
      q: "Which keyword lets a function CHANGE a variable defined outside all functions?",
      options: ["extern", "public", "global", "outer"],
      answer: 2,
      explain:
        "`global name` tells Python that assignments to `name` inside the function should affect the global variable rather than creating a local one.",
      difficulty: 2,
    },
    {
      id: "q-9.9-8",
      level: "9.9",
      q: "Why is `return` usually better than `print` inside a calculating function?",
      options: [
        "`return` is faster",
        "`return` gives the value back to the program so it can be stored and reused",
        "`print` does not work inside functions",
        "There is no difference",
      ],
      answer: 1,
      explain:
        "`print` only displays a value. `return` hands it back to the caller, which can then store it, use it in further calculations, or pass it to another function.",
      difficulty: 2,
    },
  ],
};
