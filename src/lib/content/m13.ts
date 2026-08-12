import type { Module } from "../types";

export const m13: Module = {
  id: "9.13",
  slug: "search-sort",
  title: "Searching & Sorting",
  tagline: "Two classic algorithms you must be able to write from memory.",
  icon: "ArrowUpDown",
  periods: 4,
  outcomes: [
    "Uses sequential searching technique appropriately",
    "Implements bubble sort technique appropriately",
  ],
  contents: ["Searching techniques — sequential search", "Sorting techniques — bubble sort"],

  lessons: [
    {
      id: "9.13.1",
      title: "Sequential search",
      summary: "Check every item until you find it — or run out of items.",
      minutes: 14,
      outcomes: ["Uses sequential searching technique appropriately"],
      blocks: [
        {
          kind: "text",
          md: `**Searching** is the process of finding a particular item in a collection. A search answers either *"yes, here it is"* or *"no, it is not here"*.

In a **sequential search** (also called a *linear search*) you start at the first item and check each one in turn until you either find what you want or reach the end.`,
        },
        { kind: "widget", id: "search-visualiser" },
        {
          kind: "code",
          lang: "pseudo",
          caption: "The algorithm",
          code: `Begin
    found = False
    position = -1
    For i = 0 to length(L) - 1
        If L[i] = target then
            found = True
            position = i
            Break
        Endif
    Endfor
    If found then
        Display "Found at position", position
    Else
        Display "Not found"
    Endif
End`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Sequential search in Python",
          code: `def sequential_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i          # found — give back the position
    return -1                 # ran out of items — not found


numbers = [34, 12, 89, 5, 67, 23]

print("Searching for 89 →", sequential_search(numbers, 89))
print("Searching for 50 →", sequential_search(numbers, 50))

pos = sequential_search(numbers, 5)
if pos != -1:
    print("Found 5 at position", pos)
else:
    print("5 is not in the list")`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Python's shortcut",
          md: `Python has a very easy way to ask whether an item is in a list — the **\`in\`** operator:

\`\`\`python
if 89 in numbers:
    print("Found it")
\`\`\`

This is convenient, but when a question says *"using the sequential search technique"* you must write the loop out, because that is what is being assessed.`,
        },
        {
          kind: "table",
          headers: ["Case", "Comparisons needed"],
          rows: [
            ["Best case — the item is first", "1"],
            ["Worst case — the item is last, or missing", "n (every item)"],
            ["Average case", "about n / 2"],
          ],
          caption: "n is the number of items in the list.",
        },
        {
          kind: "callout",
          tone: "key",
          title: "Why sorting helps searching",
          md: `The syllabus makes this point with a classroom activity: give students random numbers and ask someone to find a particular one. It is slow, because there is no order.

Sorting the data first makes searching dramatically faster — which is exactly why the two topics are taught together.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.13-inline-1",
            level: "9.13",
            q: "In the worst case, how many comparisons does a sequential search of 100 items need?",
            options: ["1", "50", "100", "10"],
            answer: 2,
            explain:
              "The worst case is when the item is last or absent — every one of the 100 items has to be checked.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.13-1" },
      ],
    },

    {
      id: "9.13.2",
      title: "Swapping and bubble sort",
      summary:
        "Why you need a third variable to swap two values, and how repeated swapping sorts a whole list.",
      minutes: 20,
      outcomes: ["Implements bubble sort technique appropriately"],
      blocks: [
        {
          kind: "heading",
          text: "First: how do you swap two values?",
        },
        {
          kind: "text",
          md: `This looks obvious and is not. To exchange the contents of two variables you need a **third, temporary variable** — the syllabus calls it a **dummy variable**.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The wrong way and the right way",
          code: `# WRONG — the original value of a is destroyed
a = 5
b = 12
a = b
b = a
print("Wrong :", a, b)      # 12 12 — the 5 is gone forever

# RIGHT — keep a copy in a dummy variable first
a = 5
b = 12
temp = a      # 1. save a
a = b         # 2. copy b into a
b = temp      # 3. copy the saved value into b
print("Right :", a, b)      # 12 5

# Python also has a shortcut, but understand the three-step version first
a, b = 5, 12
a, b = b, a
print("Python:", a, b)`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "Draw the three steps",
          md: `Questions often ask you to explain swapping *with the aid of a diagram*. Show three boxes — a, b and temp — and the three arrows in order. State clearly that without the dummy variable one of the values is lost.`,
        },
        { kind: "heading", text: "Bubble sort" },
        {
          kind: "text",
          md: `Bubble sort makes **multiple passes** through a list. On each pass it compares **adjacent** items and exchanges those that are out of order.

Each pass pushes the next largest value into its final place at the end — the value "bubbles up", which is where the name comes from.`,
        },
        { kind: "widget", id: "sort-visualiser" },
        {
          kind: "steps",
          title: "Sorting into ascending order",
          steps: [
            { title: "Compare the 1st and 2nd elements", md: "If the 1st is larger than the 2nd, swap them." },
            { title: "Compare the 2nd and 3rd", md: "Swap if necessary. Keep moving along the list." },
            {
              title: "Continue to the last pair",
              md: "At the end of this pass the largest element is in the final position.",
            },
            {
              title: "Repeat from the beginning",
              md: "Each new pass has one fewer element to check, because the end of the list is already sorted.",
            },
            {
              title: "Stop when no swaps happen",
              md: "A complete pass with no swaps means the list is already in order.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "key",
          title: "The counting facts",
          md: `For a list of **n** items:
- The first pass makes **n − 1** comparisons.
- At the start of the second pass the largest value is already in place, so there are **n − 2** pairs left.
- The total number of passes needed is **n − 1**. After those, the smallest item must already be in the right position, so no more work is needed.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Bubble sort exactly as written in your notes",
          code: `def bubble_sort(L):
    swapped = True                     # set flag to True to start sorting
    while swapped:
        swapped = False
        for i in range(len(L) - 1):
            if L[i] > L[i + 1]:
                # Swap the elements
                L[i], L[i + 1] = L[i + 1], L[i]
                # Set the flag so we loop again
                swapped = True


numbers = [64, 34, 25, 12, 22, 11, 90]
print("Before:", numbers)
bubble_sort(numbers)
print("After :", numbers)`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The same sort, printing every pass so you can see the bubbling",
          code: `def bubble_sort_verbose(L):
    n = len(L)
    for p in range(n - 1):                 # n-1 passes
        swapped = False
        for i in range(n - 1 - p):         # one fewer comparison each pass
            if L[i] > L[i + 1]:
                temp = L[i]                # the dummy variable
                L[i] = L[i + 1]
                L[i + 1] = temp
                swapped = True
        print(f"After pass {p + 1}: {L}")
        if not swapped:
            print("No swaps — the list is already sorted.")
            break


numbers = [5, 1, 4, 2, 8]
print("Start       :", numbers)
bubble_sort_verbose(numbers)`,
        },
        {
          kind: "trace",
          caption: "Step through one pass and watch the largest value move to the end.",
          code: `L = [5, 1, 4, 2]
for i in range(len(L) - 1):
    if L[i] > L[i + 1]:
        temp = L[i]
        L[i] = L[i + 1]
        L[i + 1] = temp
print(L)`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "The IndexError trap",
          md: `The inner loop compares \`L[i]\` with \`L[i + 1]\`. If \`i\` reaches the last position, \`L[i + 1]\` is off the end of the list.

That is why the loop is \`range(len(L) - 1)\` and not \`range(len(L))\`.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.13-inline-2",
            level: "9.13",
            q: "After ONE complete pass of bubble sort (ascending), what is guaranteed?",
            options: [
              "The list is fully sorted",
              "The smallest value is at the start",
              "The largest value is at the end",
              "Nothing is guaranteed",
            ],
            answer: 2,
            explain:
              "Each pass carries the largest remaining value to the end of the unsorted section — that is exactly what 'bubbling up' means.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.13-2" },
        { kind: "exercise", exerciseId: "ex-9.13-3" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.13-1",
      title: "Sequential search with a report",
      level: "9.13",
      difficulty: 2,
      xp: 35,
      tags: ["searching", "loops", "functions"],
      brief: `Write a function \`search(items, target)\` that performs a **sequential search** and returns the **position** of the target, or \`-1\` if it is not there.

Then read a number from the keyboard and search this list:
\`numbers = [34, 12, 89, 5, 67, 23]\`

Print either \`Found at position 2\` or \`Not found\`.

You must write the loop yourself — do not use \`in\`, \`index()\` or \`find()\`.`,
      starter: `numbers = [34, 12, 89, 5, 67, 23]


def search(items, target):
    pass


target = int(input("Number to find: "))
# Print the result here
`,
      hints: [
        "Loop over positions, not values: `for i in range(len(items)):`.",
        "Compare `items[i] == target`, and `return i` the moment it matches.",
        "`return -1` goes AFTER the loop — it only runs if nothing was found.",
        "Positions start at 0, so 89 is at position 2.",
      ],
      solution: `numbers = [34, 12, 89, 5, 67, 23]


def search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1


target = int(input("Number to find: "))
pos = search(numbers, target)

if pos != -1:
    print("Found at position", pos)
else:
    print("Not found")`,
      tests: [
        { kind: "io", name: "Finds 89", stdin: ["89"], expect: "Found at position 2", match: "contains" },
        { kind: "io", name: "Finds the first item", stdin: ["34"], expect: "Found at position 0", match: "contains" },
        { kind: "io", name: "Finds the last item", stdin: ["23"], expect: "Found at position 5", match: "contains" },
        { kind: "io", name: "Reports a missing item", stdin: ["50"], expect: "Not found", match: "contains" },
        { kind: "expr", name: "Returns -1 when absent", expr: "search([1, 2, 3], 9)", expect: "-1", hidden: true },
        {
          kind: "source",
          name: "Does not use built-in searching",
          mustNotUse: [".index(", ".find("],
        },
      ],
    },
    {
      id: "ex-9.13-2",
      title: "Swap two values",
      level: "9.13",
      difficulty: 1,
      xp: 25,
      tags: ["swapping"],
      brief: `Write a function \`swap_first_last(L)\` that exchanges the **first** and **last** items of a list, using a **dummy (temporary) variable**, and returns the list.

\`swap_first_last([1, 2, 3, 4])\` must return \`[4, 2, 3, 1]\`.

Then print \`swap_first_last([5, 1, 4, 2, 8])\`.`,
      starter: `def swap_first_last(L):
    pass


print(swap_first_last([5, 1, 4, 2, 8]))`,
      hints: [
        "The last item is at position `len(L) - 1`, or simply `-1`.",
        "Save the first item in a temporary variable before you overwrite it.",
        "Three steps: `temp = L[0]`, then `L[0] = L[-1]`, then `L[-1] = temp`.",
        "Do not forget `return L` at the end.",
      ],
      solution: `def swap_first_last(L):
    temp = L[0]
    L[0] = L[len(L) - 1]
    L[len(L) - 1] = temp
    return L


print(swap_first_last([5, 1, 4, 2, 8]))`,
      tests: [
        { kind: "io", name: "Swaps correctly", expect: "[8, 1, 4, 2, 5]", match: "contains" },
        { kind: "expr", name: "Four-item list", expr: "swap_first_last([1, 2, 3, 4])", expect: "[4, 2, 3, 1]" },
        { kind: "expr", name: "Two-item list", expr: "swap_first_last([1, 2])", expect: "[2, 1]", hidden: true },
      ],
    },
    {
      id: "ex-9.13-3",
      title: "Bubble sort from scratch",
      level: "9.13",
      difficulty: 3,
      xp: 50,
      tags: ["sorting", "nested loops", "swapping"],
      brief: `Write a function \`bubble_sort(L)\` that sorts a list into **ascending** order using the bubble sort technique, and returns it.

You must implement the algorithm yourself — \`sort()\` and \`sorted()\` are not allowed.

Then print \`bubble_sort([64, 34, 25, 12, 22, 11, 90])\`.`,
      starter: `def bubble_sort(L):
    pass


print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
      hints: [
        "You need two loops: an outer one for the passes and an inner one that walks along the list.",
        "The inner loop must stop at `len(L) - 1`, otherwise `L[i + 1]` goes off the end.",
        "Swap with a dummy variable, or with `L[i], L[i+1] = L[i+1], L[i]`.",
        "The `swapped` flag version is shortest: repeat `while swapped`, setting it False at the start of each pass and True whenever you swap.",
      ],
      solution: `def bubble_sort(L):
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(L) - 1):
            if L[i] > L[i + 1]:
                L[i], L[i + 1] = L[i + 1], L[i]
                swapped = True
    return L


print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
      tests: [
        {
          kind: "io",
          name: "Sorts the sample list",
          expect: "[11, 12, 22, 25, 34, 64, 90]",
          match: "contains",
        },
        { kind: "expr", name: "Sorts a short list", expr: "bubble_sort([3, 1, 2])", expect: "[1, 2, 3]" },
        {
          kind: "expr",
          name: "Already sorted stays sorted",
          expr: "bubble_sort([1, 2, 3, 4])",
          expect: "[1, 2, 3, 4]",
        },
        {
          kind: "expr",
          name: "Reversed list is handled",
          expr: "bubble_sort([5, 4, 3, 2, 1])",
          expect: "[1, 2, 3, 4, 5]",
          hidden: true,
        },
        {
          kind: "expr",
          name: "Duplicates are handled",
          expr: "bubble_sort([3, 1, 3, 1])",
          expect: "[1, 1, 3, 3]",
          hidden: true,
        },
        {
          kind: "source",
          name: "Does not use built-in sorting",
          mustNotUse: [".sort(", "sorted("],
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.13-1",
      level: "9.13",
      q: "In a sequential search, where does the search begin?",
      options: [
        "In the middle of the list",
        "At the first item, checking each in turn",
        "At the last item, working backwards",
        "At a random position",
      ],
      answer: 1,
      explain:
        "A sequential (linear) search starts at the first element and examines each item in order until it finds the target or reaches the end.",
      difficulty: 1,
    },
    {
      id: "q-9.13-2",
      level: "9.13",
      q: "Why is a dummy (temporary) variable needed when swapping two values?",
      options: [
        "To make the program run faster",
        "Because assigning one variable to the other destroys the original value",
        "Because Python does not allow two assignments on one line",
        "It is not actually needed",
      ],
      answer: 1,
      explain:
        "`a = b` overwrites a, so the original value of a is lost. Saving it in a third variable first preserves it for the second assignment.",
      difficulty: 1,
    },
    {
      id: "q-9.13-3",
      level: "9.13",
      q: "How many passes are needed to bubble sort a list of n items in the worst case?",
      options: ["n", "n − 1", "n / 2", "n²"],
      answer: 1,
      explain:
        "n − 1 passes are enough. After those, the smallest item is necessarily in the correct position with no further processing required.",
      difficulty: 2,
    },
    {
      id: "q-9.13-4",
      level: "9.13",
      q: "What is the list after ONE complete pass of ascending bubble sort on [5, 1, 4, 2, 8]?",
      options: ["[1, 2, 4, 5, 8]", "[1, 4, 2, 5, 8]", "[1, 5, 4, 2, 8]", "[5, 4, 2, 1, 8]"],
      answer: 1,
      explain:
        "Compare 5,1 → swap [1,5,4,2,8]. Compare 5,4 → swap [1,4,5,2,8]. Compare 5,2 → swap [1,4,2,5,8]. Compare 5,8 → no swap. The largest value, 8, is now at the end.",
      difficulty: 3,
    },
    {
      id: "q-9.13-5",
      level: "9.13",
      q: "In bubble sort, why does the inner loop run to `len(L) - 1` rather than `len(L)`?",
      options: [
        "To make it faster",
        "Because the comparison uses L[i + 1], which would go past the end of the list",
        "Because the last item is always sorted",
        "It is a mistake and should be len(L)",
      ],
      answer: 1,
      explain:
        "The algorithm compares adjacent pairs, so the loop counter must stop one position early or `L[i + 1]` raises IndexError.",
      difficulty: 2,
    },
    {
      id: "q-9.13-6",
      level: "9.13",
      q: "What does the `swapped` flag achieve in bubble sort?",
      options: [
        "It counts how many items were sorted",
        "It lets the algorithm stop early when a complete pass makes no swaps",
        "It reverses the list",
        "It stores the temporary value during a swap",
      ],
      answer: 1,
      explain:
        "If a whole pass completes without a single swap, the list must already be in order, so the algorithm can stop instead of doing pointless passes.",
      difficulty: 2,
    },
    {
      id: "q-9.13-7",
      level: "9.13",
      q: "Why does sorting data help searching?",
      options: [
        "Sorted data uses less memory",
        "Order makes it possible to find items far more quickly and to stop early",
        "Sorting removes duplicates",
        "It does not help at all",
      ],
      answer: 1,
      explain:
        "When data is in order you can stop as soon as you pass where the item would be, and much faster search methods become possible. This is why the syllabus teaches searching and sorting together.",
      difficulty: 2,
    },
  ],
};
