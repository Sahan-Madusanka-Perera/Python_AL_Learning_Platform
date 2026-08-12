import type { StructuredQuestion } from "../types";

/**
 * Structured (essay) questions in the style of the A/L paper.
 *
 * These are self-marked against a rubric. Writing an answer and then honestly
 * comparing it to the mark scheme is a far better use of time than reading a
 * model answer, so the model is hidden until an attempt has been submitted.
 */
export const STRUCTURED_QUESTIONS: StructuredQuestion[] = [
  {
    id: "sq-1",
    level: "9.1",
    marks: 6,
    prompt:
      "A school wants a program that reads a student's three subject marks and displays the average and whether the student has passed (average of 50 or more).\n\nDescribe how you would solve this using the problem-solving process. Name each stage and state what you would do in it.",
    rubric: [
      "Names all four stages in the correct order (understanding, defining/boundaries, planning, implementation)",
      "Understanding: identifies input = three marks, output = average and pass/fail; solves an example by hand",
      "Boundaries: states what is excluded, e.g. storing results, handling more than one student, validating input",
      "Planning: gives an algorithm — read three marks, add them, divide by 3, compare with 50, display",
      "Implementation: mentions writing it in Python and testing it, including the boundary value of exactly 50",
      "Mentions that the process is cyclic — wrong results send you back to an earlier stage",
    ],
    modelAnswer:
      "**Understanding the problem.** The program is given three subject marks and must produce two things: the average of those marks, and a pass/fail decision. I checked my understanding by solving one by hand: for 60, 70 and 80 the total is 210, the average is 70, and since 70 ≥ 50 the student passes.\n\n**Defining the problem and boundaries.** Inside the problem: reading three marks, calculating the average, comparing it with 50, displaying both results. Outside the problem: storing the marks in a file or database, handling more than one student, checking that the marks typed are between 0 and 100.\n\n**Planning the solution.** The algorithm is:\n\n```\nBegin\n    Read m1, m2, m3\n    total = m1 + m2 + m3\n    average = total / 3\n    Display average\n    If average >= 50 then\n        Display \"Pass\"\n    Else\n        Display \"Fail\"\n    Endif\nEnd\n```\n\n**Implementation.** I would translate this into Python, using `int(input(...))` for each mark so that arithmetic works, and then test it. I would test with 60/70/80 (a clear pass), 10/20/30 (a clear fail) and 50/50/50, because exactly 50 is the boundary where the behaviour changes.\n\nIf the testing gave wrong results I would return to the planning or understanding stage, which is why the process is described as cyclic.",
  },
  {
    id: "sq-2",
    level: "9.3",
    marks: 8,
    prompt:
      "(a) State two ways in which an algorithm can be represented. (2 marks)\n(b) Draw a flow chart for an algorithm that reads a mark and displays the grade: A for 75 or more, B for 50 to 74, C for 40 to 49, and F below 40. (6 marks)",
    rubric: [
      "(a) Names flow chart (graphical) and pseudocode (textual)",
      "(b) Uses one Start and one End terminal symbol",
      "(b) Uses a parallelogram for reading the mark and for displaying the grade",
      "(b) Uses diamonds for the decisions, each with exactly two labelled exits",
      "(b) Conditions are tested in descending order (>= 75 first)",
      "(b) All flow lines have arrowheads and all branches reach End",
    ],
    modelAnswer:
      "**(a)** An algorithm can be represented **graphically as a flow chart**, using standard symbols joined by flow lines, or **textually as pseudocode**, using English-like statements that are independent of any particular programming language.\n\n**(b)** The flow chart:\n\n- **Start** (terminal)\n- **Read mark** (parallelogram)\n- **mark >= 75?** (diamond) — YES → *Display \"A\"* → End\n- NO → **mark >= 50?** (diamond) — YES → *Display \"B\"* → End\n- NO → **mark >= 40?** (diamond) — YES → *Display \"C\"* → End\n- NO → *Display \"F\"* → End\n- **End** (terminal)\n\nThe order of the decisions matters. Testing `mark >= 75` first means an 80 is correctly reported as A. If `mark >= 40` were tested first, every passing student would be given a C.\n\nThe equivalent pseudocode is:\n\n```\nBegin\n    Read mark\n    If mark >= 75 then\n        Display \"A\"\n    Elseif mark >= 50 then\n        Display \"B\"\n    Elseif mark >= 40 then\n        Display \"C\"\n    Else\n        Display \"F\"\n    Endif\nEnd\n```",
  },
  {
    id: "sq-3",
    level: "9.5",
    marks: 8,
    prompt:
      "(a) What is a compiler? What is an interpreter? (4 marks)\n(b) Give two differences between them. (2 marks)\n(c) Why is it necessary to use a compiler or an interpreter? (2 marks)",
    rubric: [
      "Compiler defined as translating the whole source program at once, before execution, producing object code",
      "Interpreter defined as translating and executing the source line by line at run time",
      "At least two clear differences given, covering both sides of the contrast",
      "States that computers can execute only binary machine code",
      "States that programs are written in human-readable high-level languages, so a translator bridges the gap",
      "Gives examples: C/Pascal compiled, Python/BASIC interpreted",
    ],
    modelAnswer:
      "**(a)** A **compiler** is a program that translates the whole of a source program into object code at once, before execution. It produces a permanent binary file which is then executed. Languages such as C and Pascal use this approach.\n\nAn **interpreter** is a program that translates the source code line by line at the time of execution, executing each line as it is translated. No permanent object file is produced. Languages such as Python, BASIC and FORTRAN use this approach.\n\n**(b)** Two differences:\n\n1. A compiler translates the **entire program before** execution; an interpreter translates **one line at a time during** execution.\n2. A compiler **produces a permanent object file**, so execution afterwards is fast; an interpreter produces **no object file** and must re-translate on every run, so execution is slower.\n\n**(c)** A computer's processor can execute **only binary machine code**. Programs, however, are written in high-level languages that use English-like words, because binary is impractical for humans to write and remember. A translator is therefore necessary to convert the human-readable source program into the binary form the machine can execute.",
  },
  {
    id: "sq-4",
    level: "9.9",
    marks: 10,
    prompt:
      "(a) What is a sub-program? State the two types. (3 marks)\n(b) Explain the difference between a local variable and a global variable, including their lifetime. (4 marks)\n(c) Write a Python function `area_of_rectangle(length, width)` that returns the area, and show how it would be called. (3 marks)",
    rubric: [
      "Sub-program defined as a named block of code that runs only when called",
      "Two types named: built-in and user-defined, with an example of each",
      "Local variable: created inside a function, accessible only there",
      "Global variable: created outside all functions, accessible throughout the program",
      "Lifetime explained: local exists only during the call; global exists for the whole program",
      "Function written correctly with def, parameters and return",
      "A correct call shown, storing or printing the returned value",
    ],
    modelAnswer:
      "**(a)** A **sub-program** (function) is a named block of code that only runs when it is called. It allows a program to be divided into logical components, avoids repeating code, and makes each part easier to test.\n\nThe two types are:\n- **Built-in sub-programs** — already written and stored in a library, for example `print()`, `len()` and `int()`.\n- **User-defined sub-programs** — written by the programmer with the `def` keyword when no built-in does what is needed.\n\n**(b)** A **local variable** is defined inside a function body. It can be accessed only within that function. Its **lifetime** begins when the function is called and ends when the function finishes — each new call creates a fresh copy.\n\nA **global variable** is defined outside all functions. It can be read by every function in the program. Its **lifetime** is the whole run of the program. To *change* a global from inside a function, the `global` keyword must be used; otherwise the assignment creates a new local variable instead.\n\n**(c)**\n\n```python\ndef area_of_rectangle(length, width):\n    return length * width\n\n\n# Calling the function and using the returned value\nresult = area_of_rectangle(6, 4)\nprint(\"Area:\", result)      # Area: 24\n```\n\nThe function uses `return` rather than `print` so that the calculated value is handed back to the program and can be stored, displayed, or used in further calculations.",
  },
  {
    id: "sq-5",
    level: "9.13",
    marks: 10,
    prompt:
      "(a) Explain, with the aid of a diagram, why a dummy variable is needed when swapping the values of two variables. (4 marks)\n(b) Describe the bubble sort technique. (3 marks)\n(c) The list [5, 1, 4, 2, 8] is being sorted into ascending order using bubble sort. Show the list after each of the first two passes. (3 marks)",
    rubric: [
      "Explains that a = b overwrites a, destroying the original value",
      "Shows the three steps: temp = a, a = b, b = temp, with a diagram or boxes",
      "Bubble sort described as multiple passes comparing adjacent items and exchanging those out of order",
      "States that each pass places the next largest value in its final position",
      "Pass 1 correct: [1, 4, 2, 5, 8]",
      "Pass 2 correct: [1, 2, 4, 5, 8]",
    ],
    modelAnswer:
      "**(a)** If we try to swap directly:\n\n```\na = b     a now holds b's value — a's original value is LOST\nb = a     b is given the value it already had\n```\n\nBoth variables end up holding the same value. A third **dummy (temporary) variable** is needed to hold the first value while the assignment is made:\n\n```\n  a = 5      b = 12     temp = ?\n\n1. temp = a      →   a = 5    b = 12   temp = 5\n2. a = b         →   a = 12   b = 12   temp = 5\n3. b = temp      →   a = 12   b = 5    temp = 5\n```\n\nThe original value of `a` survives in `temp` until it is safely copied into `b`.\n\n**(b)** **Bubble sort** makes multiple passes through the list. On each pass it compares **adjacent** items and exchanges any pair that is out of order. Each pass carries the next largest value to the end of the unsorted section — the value \"bubbles up\" to where it belongs. For n items, n − 1 passes are required, and each pass has one fewer comparison to make than the last. If a complete pass makes no exchanges, the list is already sorted and the algorithm can stop.\n\n**(c)** Starting list: **[5, 1, 4, 2, 8]**\n\n*Pass 1*\n- 5 vs 1 → swap → [1, 5, 4, 2, 8]\n- 5 vs 4 → swap → [1, 4, 5, 2, 8]\n- 5 vs 2 → swap → [1, 4, 2, 5, 8]\n- 5 vs 8 → no swap\n\n**After pass 1: [1, 4, 2, 5, 8]** — 8, the largest, is in place.\n\n*Pass 2*\n- 1 vs 4 → no swap\n- 4 vs 2 → swap → [1, 2, 4, 5, 8]\n- 4 vs 5 → no swap\n\n**After pass 2: [1, 2, 4, 5, 8]** — the list is now sorted.",
  },
  {
    id: "sq-6",
    level: "9.10",
    marks: 8,
    prompt:
      "(a) Name the four data structures available in Python and state one difference between a list and a tuple. (4 marks)\n(b) A shop stores item names and prices. Explain which data structure you would choose and why, and write Python code to create it and print the price of one item. (4 marks)",
    rubric: [
      "Names strings, lists, tuples and dictionaries",
      "States that a list is changeable (mutable) while a tuple is unchangeable (immutable)",
      "Chooses a dictionary and justifies it — data is paired, and lookup is by name not position",
      "Correct dictionary syntax with curly brackets and key:value pairs",
      "Correct retrieval of a value by its key",
      "Mentions get() or an `in` check to avoid KeyError on a missing key",
    ],
    modelAnswer:
      "**(a)** The four data structures are **strings**, **lists**, **tuples** and **dictionaries**.\n\nA **list** is ordered and **changeable** — items can be added, removed or replaced after it is created, and it is written with square brackets `[ ]`. A **tuple** is ordered but **unchangeable (immutable)** — once created its items cannot be modified, and it is written with round brackets `( )`. This is why a tuple supports only two methods, `count()` and `index()`.\n\n**(b)** I would choose a **dictionary**. The data is naturally in pairs — each item name has one price — and the program needs to look a price up **by the item's name**, not by its position in a list. A dictionary indexes by key, which is exactly that operation, and it is changeable so prices can be updated.\n\n```python\nprices = {\n    \"bread\": 120,\n    \"milk\": 250,\n    \"rice\": 190\n}\n\n# Look up one item safely\nitem = \"milk\"\nif item in prices:\n    print(item, \"costs Rs.\", prices[item])\nelse:\n    print(\"Item not found\")\n```\n\nUsing `if item in prices` (or `prices.get(item)`) prevents a **KeyError** if the item does not exist, which would otherwise stop the program.",
  },
];
