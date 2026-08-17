import type { Module } from "../types";

export const m10: Module = {
  id: "9.10",
  slug: "data-structures",
  title: "Data Structures",
  tagline: "Strings, lists, tuples and dictionaries: choosing the right container for the job.",
  icon: "Boxes",
  periods: 8,
  outcomes: [
    "Briefly explains the use of data structures",
    "Uses relevant data structures in programming",
  ],
  contents: ["Data structures", "Strings", "Lists", "Tuples", "Dictionaries"],

  lessons: [
    {
      id: "9.10.1",
      title: "Why data structures, and how to choose",
      summary: "Four containers, three questions that tell you which one to use.",
      minutes: 10,
      outcomes: ["Briefly explains the use of data structures"],
      blocks: [
        {
          kind: "text",
          md: `A single variable holds one value. Real problems have many: 40 students' marks, a shopping list, a table of prices.

A **data structure** is a way of organising several values so a program can work with them as one thing. Different problems need different structures, so Python gives you four.`,
        },
        {
          kind: "table",
          headers: ["Structure", "Brackets", "Ordered?", "Changeable?", "Duplicates?", "Best for"],
          rows: [
            ["String", '" "', "Yes", "No", "Yes", "Text"],
            ["List", "[ ]", "Yes", "Yes", "Yes", "A collection that changes"],
            ["Tuple", "( )", "Yes", "No", "Yes", "Fixed data that must not change"],
            ["Dictionary", "{ }", "Yes*", "Yes", "Keys unique", "Pairs: a label and its value"],
          ],
          caption:
            "*Dictionaries preserve insertion order in modern Python. The syllabus describes them as unordered because you access them by key, not by position.",
        },
        {
          kind: "callout",
          tone: "key",
          title: "Three questions that pick the structure",
          md: `1. **Will the data change?** No → tuple. Yes → list.
2. **Do I look things up by a name rather than a position?** Yes → dictionary.
3. **Is it text?** → string.`,
        },
        { kind: "widget", id: "data-structure-lab" },
        {
          kind: "callout",
          tone: "exam",
          title: "Indexing starts at 0: in all of them",
          md: `The first item is at position **0**, so a collection of 5 items uses positions 0, 1, 2, 3, 4. The last item is at \`len(x) - 1\`, or more simply at \`x[-1]\`.

Asking for \`x[5]\` in a 5-item list raises **IndexError**.`,
        },
      ],
    },

    {
      id: "9.10.2",
      title: "Strings",
      summary: "Text as a sequence of characters, and the operations you are expected to know.",
      minutes: 14,
      outcomes: ["Uses relevant data structures in programming"],
      blocks: [
        {
          kind: "text",
          md: `String literals are surrounded by **single** or **double** quotation marks: \`'hello'\` is the same as \`"hello"\`. A string is a *sequence* of characters, so it can be indexed and looped through.

Strings are **immutable**: you cannot change one character in place. Operations return a **new** string.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `text = "Information Technology"

print("Length      :", len(text))
print("First char  :", text[0])
print("Last char   :", text[-1])
print("Slice 0-11  :", text[0:11])
print("Upper       :", text.upper())
print("Lower       :", text.lower())
print("Replace     :", text.replace("Technology", "Systems"))
print("Split       :", text.split(" "))
print("Find 'Tech' :", text.find("Tech"))
print("Count 'o'   :", text.count("o"))
print("Strip spaces:", "   padded   ".strip())`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Looping through, joining, and checking membership",
          code: `word = "PYTHON"

for letter in word:
    print(letter, end=" ")
print()

print("Repeat  :", word * 2)
print("Join    :", word + " rocks")
print("'THO' in:", "THO" in word)

# Strings are immutable: this line would fail:
# word[0] = "J"    # TypeError`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Slicing",
          md: `\`text[start:stop]\` takes characters from \`start\` up to **but not including** \`stop\`: the same rule as \`range()\`.

- \`text[:5]\`: from the beginning to position 4
- \`text[5:]\`: from position 5 to the end
- \`text[::-1]\`: the whole string reversed`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.10-inline-1",
            level: "9.10",
            q: 'What does `"COMPUTER"[2:5]` give?',
            options: ["MPU", "OMP", "MPUT", "PUT"],
            answer: 0,
            explain:
              "Positions: C=0, O=1, M=2, P=3, U=4, T=5. It takes 2, 3 and 4: M, P, U, and stops before 5.",
          },
        },
      ],
    },

    {
      id: "9.10.3",
      title: "Lists",
      summary: "The workhorse: ordered, changeable, and full of useful methods.",
      minutes: 18,
      outcomes: ["Uses relevant data structures in programming"],
      blocks: [
        {
          kind: "text",
          md: `A **list** is a collection which is **ordered** and **changeable**. Lists are written with **square brackets**.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Creating, reading and changing",
          code: `mylist = ["cat", "dog", "bird"]

print("The list       :", mylist)
print("Second item    :", mylist[1])
print("How many items :", len(mylist))

mylist[1] = "ant"                 # change the second item
print("After change   :", mylist)

print("Is 'cat' there?:", "cat" in mylist)

for animal in mylist:             # print every item, one by one
    print(" -", animal)`,
        },
        {
          kind: "heading",
          text: "Adding and removing",
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `mylist = ["cat", "dog", "bird"]

mylist.append("ant")              # add to the END
print("append :", mylist)

mylist.insert(1, "fish")          # add at a POSITION
print("insert :", mylist)

mylist.remove("dog")              # remove by VALUE
print("remove :", mylist)

del mylist[0]                     # remove by POSITION
print("del [0]:", mylist)

popped = mylist.pop()             # remove and return the last item
print("pop    :", popped, "→", mylist)

mylist.clear()                    # empty it completely
print("clear  :", mylist)`,
        },
        {
          kind: "table",
          headers: ["Method", "What it does"],
          rows: [
            ["append()", "Adds an element at the end of the list"],
            ["clear()", "Removes all the elements from the list"],
            ["copy()", "Returns a copy of the list"],
            ["count()", "Returns the number of elements with the specified value"],
            ["extend()", "Adds the elements of another list to the end of this one"],
            ["index()", "Returns the index of the first element with the specified value"],
            ["insert()", "Adds an element at the specified position"],
            ["pop()", "Removes the element at the specified position"],
            ["remove()", "Removes the item with the specified value"],
            ["reverse()", "Reverses the order of the list"],
            ["sort()", "Sorts the list"],
          ],
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Working with a list of marks",
          code: `marks = [65, 72, 58, 90, 45]

print("Total  :", sum(marks))
print("Average:", sum(marks) / len(marks))
print("Highest:", max(marks))
print("Lowest :", min(marks))

marks.sort()
print("Sorted :", marks)

marks.reverse()
print("Reverse:", marks)

print("Index of 90:", marks.index(90))
print("Count of 65:", marks.count(65))`,
        },
        {
          kind: "callout",
          tone: "mistake",
          title: "remove() vs del vs pop()",
          md: `- \`mylist.remove("dog")\`: removes by **value**
- \`del mylist[0]\`: removes by **position**
- \`mylist.pop()\`: removes the **last** item and gives it back to you

Mixing these up is a common exam error.`,
        },
        { kind: "exercise", exerciseId: "ex-9.10-1" },
      ],
    },

    {
      id: "9.10.4",
      title: "Tuples",
      summary: "Like lists, but locked, and that is the whole point.",
      minutes: 10,
      outcomes: ["Uses relevant data structures in programming"],
      blocks: [
        {
          kind: "text",
          md: `A **tuple** is a collection which is **ordered** and **unchangeable** (*immutable*). Tuples are written with **round brackets**.

Use a tuple when the data must not change: the days of the week, the subjects in a stream, coordinates on a map.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `subjects = ("ICT", "Maths", "Physics")

print("The tuple    :", subjects)
print("Position 1   :", subjects[1])
print("How many     :", len(subjects))
print("Is ICT there?:", "ICT" in subjects)

for s in subjects:
    print(" -", s)

# Tuples cannot be changed:
# subjects[0] = "Biology"      # TypeError
print("Count of ICT :", subjects.count("ICT"))
print("Index of Maths:", subjects.index("Maths"))`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "Tuples have only two methods",
          md: `Because a tuple cannot change, it only supports:
- \`count()\`: how many times a value occurs
- \`index()\`: the position where a value was found

You cannot remove an item from a tuple. You **can** delete the whole tuple with \`del\`.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "A one-item tuple needs a trailing comma: a classic trap",
          code: `not_a_tuple = ("ICT")      # just a string in brackets
real_tuple  = ("ICT",)     # the comma makes it a tuple

print(type(not_a_tuple).__name__, not_a_tuple)
print(type(real_tuple).__name__, real_tuple)`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.10-inline-2",
            level: "9.10",
            q: "Which operation is NOT possible on a tuple?",
            options: ["Reading an item by index", "Looping through it", "Changing an item", "Finding its length"],
            answer: 2,
            explain:
              "Tuples are immutable. You can read, loop and measure them, but assigning to an element raises a TypeError.",
          },
        },
      ],
    },

    {
      id: "9.10.5",
      title: "Dictionaries",
      summary: "Store a value against a label instead of a position.",
      minutes: 16,
      outcomes: ["Uses relevant data structures in programming"],
      blocks: [
        {
          kind: "text",
          md: `A **dictionary** stores data as **key : value** pairs. It is **changeable** and **indexed by key** rather than by position. Dictionaries are written with **curly brackets**.

Use one whenever "position 3" is meaningless but "the student's name" is meaningful.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `student = {
    "name": "Ravi",
    "Country": "Sri Lanka",
    "year": 2019
}

print("Whole dict :", student)
print("By key     :", student["name"])
print("With get() :", student.get("Country"))
print("Missing key:", student.get("school"))     # None instead of an error

student["year"] = 2018                            # change a value
student["school"] = "ABC"                         # add a NEW pair
print("Updated    :", student)

print("Keys       :", list(student.keys()))
print("Values     :", list(student.values()))
print("Is Country there?", "Country" in student)
print("How many pairs  :", len(student))`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Looping through keys and values together",
          code: `marks = {"ICT": 85, "Maths": 72, "Physics": 64}

for subject in marks:                    # loops over the KEYS
    print(subject, "→", marks[subject])

print()

for subject, mark in marks.items():      # keys AND values at once
    print(f"{subject:10} {mark}")

print()
print("Best subject:", max(marks, key=marks.get))
print("Average     :", sum(marks.values()) / len(marks))`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Removing items",
          code: `d = {"name": "Ravi", "Country": "Sri Lanka", "year": 2019, "school": "ABC"}

d.pop("Country")          # remove by key
print("after pop     :", d)

d.popitem()               # remove the LAST inserted pair
print("after popitem :", d)

del d["year"]             # remove by key with del
print("after del     :", d)

d.clear()                 # empty it
print("after clear   :", d)`,
        },
        {
          kind: "table",
          headers: ["Method", "What it does"],
          rows: [
            ["clear()", "Removes all the elements from the dictionary"],
            ["fromkeys()", "Returns a dictionary with the specified keys and values"],
            ["get()", "Returns the value of the specified key"],
            ["items()", "Returns a list containing a tuple for each key-value pair"],
            ["keys()", "Returns a list containing the dictionary's keys"],
            ["pop()", "Removes the element with the specified key"],
            ["popitem()", "Removes the last inserted key-value pair"],
            ["update()", "Updates the dictionary with the specified key-value pairs"],
            ["values()", "Returns a list of all the values in the dictionary"],
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "get() saves you from crashes",
          md: `\`d["missing"]\` raises **KeyError** and stops the program.
\`d.get("missing")\` quietly returns \`None\`.
\`d.get("missing", 0)\` returns \`0\`: a default you choose.`,
        },
        { kind: "exercise", exerciseId: "ex-9.10-2" },
        { kind: "exercise", exerciseId: "ex-9.10-3" },
        { kind: "exercise", exerciseId: "ex-9.10-4" },
        { kind: "exercise", exerciseId: "ex-9.10-5" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.10-4",
      title: "Cricket scorecard",
      level: "9.10",
      difficulty: 2,
      xp: 45,
      tags: ["dictionaries", "lists", "loops"],
      brief: `A dictionary of batters and their scores is in the starter. Produce a scorecard summary.

Print exactly four lines:

\`\`\`
Total: 287
Highest: Sangakkara 121
Ducks: 1
Fifties: 2
\`\`\`

- **Total** is every score added together.
- **Highest** is the batter with the most runs, then their score.
- **Ducks** counts batters who scored exactly **0**.
- **Fifties** counts scores of **50 or more** (a century counts as a fifty too).

Do not hard-code any of the answers. Change a number in the dictionary and your program should still be right.

Work all four out inside **one loop**, without \`sum()\`, \`max()\` or \`sorted()\`. Tracking a running best is the pattern the exam expects.`,
      starter: `scores = {
    "Karunaratne": 43,
    "Mendis": 0,
    "Sangakkara": 121,
    "Mathews": 67,
    "Chandimal": 31,
    "Perera": 25,
}

# Your code here
`,
      hints: [
        "`for name in scores:` gives you each key. `scores[name]` is that batter's runs.",
        "Or loop over pairs directly with `for name, runs in scores.items():`.",
        "Track the best as you go: start `best = \"\"` and `most = -1`, and replace them when `runs > most`.",
        "Ducks and fifties are just two counters incremented inside the same loop.",
      ],
      solution: `scores = {
    "Karunaratne": 43,
    "Mendis": 0,
    "Sangakkara": 121,
    "Mathews": 67,
    "Chandimal": 31,
    "Perera": 25,
}

total = 0
best = ""
most = -1
ducks = 0
fifties = 0

for name, runs in scores.items():
    total = total + runs
    if runs > most:
        most = runs
        best = name
    if runs == 0:
        ducks = ducks + 1
    if runs >= 50:
        fifties = fifties + 1

print("Total:", total)
print("Highest:", best, most)
print("Ducks:", ducks)
print("Fifties:", fifties)`,
      tests: [
        {
          kind: "source",
          name: "Totals and compares with a loop",
          mustNotUse: ["sum(", "max(", "sorted("],
        },
        {
          kind: "io",
          name: "The full scorecard",
          expect: "Total: 287\nHighest: Sangakkara 121\nDucks: 1\nFifties: 2",
          match: "loose",
        },
        { kind: "source", name: "Reads the dictionary rather than hard-coding", mustUse: ["scores"] },
        { kind: "source", name: "Uses a loop", mustUse: ["for "] },
      ],
    },
    {
      id: "ex-9.10-5",
      title: "The class register",
      level: "9.10",
      difficulty: 1,
      xp: 25,
      tags: ["lists", "indexing", "append"],
      brief: `A list of names is already in the starter. A new student joins the class.

Read one name, add it to the **end** of the list, then print exactly three lines:

\`\`\`
Count: 5
First: Ravi
Last: Sanduni
\`\`\`

- **Count** is how many names are now in the list.
- **First** is the name at the front.
- **Last** is the name at the back.

Everything here is one built-in list operation. Find the right one rather than writing a loop.`,
      starter: `names = ["Ravi", "Mala", "Geetha", "Nimal"]
new_name = input("New student: ")

# Your code here
`,
      hints: [
        "`names.append(new_name)` adds to the end of the list.",
        "`len(names)` gives how many items there are.",
        "The first item is `names[0]`.",
        "The last item is `names[-1]`, which is easier than `names[len(names) - 1]`.",
      ],
      solution: `names = ["Ravi", "Mala", "Geetha", "Nimal"]
new_name = input("New student: ")

names.append(new_name)

print("Count:", len(names))
print("First:", names[0])
print("Last:", names[-1])`,
      tests: [
        {
          kind: "io",
          name: "Sanduni joins",
          stdin: ["Sanduni"],
          expect: "Count: 5\nFirst: Ravi\nLast: Sanduni",
          match: "loose",
        },
        {
          kind: "io",
          name: "A different new student",
          stdin: ["Kumara"],
          expect: "Count: 5\nFirst: Ravi\nLast: Kumara",
          match: "loose",
          hidden: true,
        },
        { kind: "source", name: "Adds to the end of the list", mustUse: ["append("] },
      ],
    },
    {
      id: "ex-9.10-1",
      title: "Marks statistics",
      level: "9.10",
      difficulty: 2,
      xp: 35,
      tags: ["lists", "loops"],
      brief: `Given \`marks = [65, 72, 58, 90, 45, 88]\`, print exactly four lines:

\`\`\`
Highest: 90
Lowest: 45
Total: 418
Above average: 3
\`\`\`

"Above average" is how many marks are **strictly greater than** the average.`,
      starter: `marks = [65, 72, 58, 90, 45, 88]

# Your code here
`,
      hints: [
        "`max(marks)`, `min(marks)` and `sum(marks)` handle the first three lines.",
        "The average is `sum(marks) / len(marks)`.",
        "Count with a loop: start at 0 and add 1 whenever `m > average`.",
        "Calculate the average ONCE before the loop, not inside it.",
      ],
      solution: `marks = [65, 72, 58, 90, 45, 88]

print("Highest:", max(marks))
print("Lowest:", min(marks))
print("Total:", sum(marks))

average = sum(marks) / len(marks)
count = 0
for m in marks:
    if m > average:
        count = count + 1

print("Above average:", count)`,
      tests: [
        {
          kind: "io",
          name: "All four lines correct",
          expect: "Highest: 90\nLowest: 45\nTotal: 418\nAbove average: 3",
          match: "loose",
        },
      ],
    },
    {
      id: "ex-9.10-2",
      title: "Phone book",
      level: "9.10",
      difficulty: 2,
      xp: 35,
      tags: ["dictionaries", "input"],
      brief: `A phone book is stored as a dictionary:

\`\`\`python
book = {"Ravi": "0715874510", "Mala": "0775857410", "Kumara": "0710055210"}
\`\`\`

Read **one name** from the keyboard and print:

- \`Ravi: 0715874510\` if the name is in the book
- \`Not found\` if it is not

The lookup must **not crash** when the name is missing.`,
      starter: `book = {"Ravi": "0715874510", "Mala": "0775857410", "Kumara": "0710055210"}

name = input("Name: ")
# Your code here
`,
      hints: [
        "`book[name]` raises KeyError when the name is missing: that is a crash.",
        "Either check first with `if name in book:` or use `book.get(name)`.",
        "`book.get(name)` returns `None` when the key is absent, which you can test with `if result is None:`.",
        "Print with `print(name + \": \" + book[name])` or `print(f\"{name}: {book[name]}\")`.",
      ],
      solution: `book = {"Ravi": "0715874510", "Mala": "0775857410", "Kumara": "0710055210"}

name = input("Name: ")

if name in book:
    print(name + ": " + book[name])
else:
    print("Not found")`,
      tests: [
        { kind: "io", name: "Existing name", stdin: ["Ravi"], expect: "Ravi: 0715874510", match: "loose" },
        { kind: "io", name: "Another existing name", stdin: ["Kumara"], expect: "Kumara: 0710055210", match: "loose" },
        { kind: "io", name: "Missing name does not crash", stdin: ["Nimal"], expect: "Not found", match: "loose" },
      ],
    },
    {
      id: "ex-9.10-3",
      title: "Count the letters",
      level: "9.10",
      difficulty: 3,
      xp: 45,
      tags: ["strings", "dictionaries", "loops"],
      brief: `Write a function \`count_letters(text)\` that returns a **dictionary** counting how many times each character appears in \`text\`.

Ignore spaces, and treat upper and lower case as the **same** (count everything in lower case).

\`count_letters("Hi Ha")\` must return \`{'h': 2, 'i': 1, 'a': 1}\`.

Then print \`count_letters("ICT is ICT")\`.`,
      starter: `def count_letters(text):
    pass


print(count_letters("ICT is ICT"))`,
      hints: [
        "Start with an empty dictionary: `counts = {}`.",
        "Loop through the text one character at a time, and `continue` (or skip) when the character is a space.",
        "Convert with `ch = ch.lower()` before counting.",
        "Use `counts[ch] = counts.get(ch, 0) + 1`: get returns 0 the first time a letter appears.",
      ],
      solution: `def count_letters(text):
    counts = {}
    for ch in text:
        if ch == " ":
            continue
        ch = ch.lower()
        counts[ch] = counts.get(ch, 0) + 1
    return counts


print(count_letters("ICT is ICT"))`,
      tests: [
        {
          kind: "expr",
          name: "Simple example",
          expr: "count_letters('Hi Ha')",
          expect: "{'h': 2, 'i': 1, 'a': 1}",
        },
        {
          kind: "expr",
          name: "Spaces are ignored",
          expr: "' ' in count_letters('a b c')",
          expect: "False",
        },
        {
          kind: "expr",
          name: "Case is folded together",
          expr: "count_letters('AaA')",
          expect: "{'a': 3}",
        },
        {
          kind: "expr",
          name: "Empty text gives an empty dictionary",
          expr: "count_letters('')",
          expect: "{}",
          hidden: true,
        },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.10-1",
      level: "9.10",
      q: "Which brackets are used to create a tuple?",
      options: ["[ ]", "{ }", "( )", "< >"],
      answer: 2,
      explain: "Tuples use round brackets, lists use square brackets, dictionaries use curly brackets.",
      difficulty: 1,
    },
    {
      id: "q-9.10-2",
      level: "9.10",
      q: "Which data structure is ordered but CANNOT be changed?",
      options: ["List", "Tuple", "Dictionary", "Set"],
      answer: 1,
      explain: "A tuple is ordered and immutable. Lists and dictionaries are both changeable.",
      difficulty: 1,
    },
    {
      id: "q-9.10-3",
      level: "9.10",
      q: "What does `mylist.insert(1, 'ant')` do to `['cat', 'dog']`?",
      options: [
        "Replaces 'dog' with 'ant'",
        "Adds 'ant' at the end",
        "Adds 'ant' at position 1, moving 'dog' along",
        "Raises an error",
      ],
      answer: 2,
      explain:
        "`insert(position, value)` places the value at that position and shifts the existing items to the right, giving `['cat', 'ant', 'dog']`.",
      difficulty: 2,
    },
    {
      id: "q-9.10-4",
      level: "9.10",
      q: "What is printed?",
      code: 'd = {"a": 1, "b": 2}\nprint(d.get("c", 0))',
      options: ["None", "0", "KeyError", "c"],
      answer: 1,
      explain:
        "`get()` returns the second argument as a default when the key is missing, so it prints 0 instead of raising KeyError.",
      difficulty: 2,
    },
    {
      id: "q-9.10-5",
      level: "9.10",
      q: 'What does `"PROGRAM"[1:4]` return?',
      options: ["ROG", "PRO", "ROGR", "RGA"],
      answer: 0,
      explain:
        "Positions 1, 2 and 3 are R, O and G. Slicing stops before the second index, so position 4 is not included.",
      difficulty: 2,
    },
    {
      id: "q-9.10-6",
      level: "9.10",
      q: "Which method removes an item from a list by its VALUE?",
      options: ["pop()", "del", "remove()", "clear()"],
      answer: 2,
      explain:
        "`remove(value)` deletes the first item matching that value. `del` and `pop()` work by position.",
      difficulty: 2,
    },
    {
      id: "q-9.10-7",
      level: "9.10",
      q: "A program needs to store the days of the week, which must never be modified. Which structure is most appropriate?",
      options: ["List", "Tuple", "Dictionary", "String"],
      answer: 1,
      explain:
        "A tuple is the right choice for fixed data. Its immutability prevents accidental modification, which is exactly the guarantee wanted here.",
      difficulty: 2,
    },
    {
      id: "q-9.10-8",
      level: "9.10",
      q: "What happens when you run `t = (1, 2, 3)` then `t[0] = 9`?",
      options: [
        "t becomes (9, 2, 3)",
        "A TypeError occurs because tuples do not support item assignment",
        "A new tuple is created automatically",
        "Nothing happens",
      ],
      answer: 1,
      explain:
        "Tuples are immutable, so assigning to an element raises `TypeError: 'tuple' object does not support item assignment`.",
      difficulty: 2,
    },
  ],
};
