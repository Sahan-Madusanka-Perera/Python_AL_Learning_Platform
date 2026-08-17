import type { Module } from "../types";

export const m11: Module = {
  id: "9.11",
  slug: "files",
  title: "File Handling",
  tagline: "Data that survives after the program ends.",
  icon: "FileText",
  periods: 6,
  outcomes: ["Uses basic file operations (open, close, read write and append)"],
  contents: ["File handling", "Basic file operations"],

  lessons: [
    {
      id: "9.11.1",
      title: "Opening files and the four modes",
      summary: "Why files exist, and the mode letter that decides everything.",
      minutes: 14,
      outcomes: ["Uses basic file operations (open, close, read write and append)"],
      blocks: [
        {
          kind: "text",
          md: `Every variable you have used so far disappears the moment the program ends. **Files** let data survive.

Programs need files to read saved data (a list of students, yesterday's sales) and to store results permanently.

The key function for working with files in Python is **\`open()\`**. It takes two arguments: the **filename** and the **mode**.`,
        },
        {
          kind: "syntax",
          title: "The open() function",
          parts: [
            { text: "f", label: "the file object", tone: "name" },
            { text: " = ", label: "", tone: "punct" },
            { text: "open", label: "built-in function", tone: "keyword" },
            { text: "(", label: "", tone: "punct" },
            { text: '"n1.txt"', label: "file name", tone: "value" },
            { text: ", ", label: "", tone: "punct" },
            { text: '"r"', label: "mode", tone: "value" },
            { text: ")", label: "", tone: "punct" },
          ],
        },
        {
          kind: "table",
          headers: ["Mode", "Name", "If the file exists", "If it does not exist"],
          rows: [
            ['"r"', "Read (the default)", "Opens it for reading", "Error"],
            ['"a"', "Append", "Adds to the END of it", "Creates it"],
            ['"w"', "Write", "ERASES everything in it first", "Creates it"],
            ['"x"', "Create", "Error", "Creates it"],
          ],
        },
        {
          kind: "callout",
          tone: "warn",
          title: '"w" destroys data',
          md: `Opening an existing file in \`"w"\` mode **deletes its entire contents immediately**, before you write anything.

If you want to add to a file, the mode is \`"a"\`, not \`"w"\`. This is the single most costly mistake in this module.`,
        },
        {
          kind: "text",
          md: `You can also state whether the file is text or binary:

- \`"t"\`: **text** mode (the default)
- \`"b"\`: **binary** mode, for images and other non-text files

So \`open("n1.txt")\` is exactly the same as \`open("n1.txt", "rt")\`.`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "Always close the file",
          md: `\`f.close()\` releases the file and makes sure everything you wrote is actually saved to disk. Forgetting it can lose data.

Better still, use \`with\`, which closes the file automatically even if an error happens:

\`\`\`python
with open("n1.txt", "r") as f:
    print(f.read())
# the file is closed here, automatically
\`\`\``,
        },
        {
          kind: "check",
          question: {
            id: "q-9.11-inline-1",
            level: "9.11",
            q: 'A file `marks.txt` already contains data. What happens after `open("marks.txt", "w")`?',
            options: [
              "The data is kept and new data is added at the end",
              "The file's contents are erased",
              "An error occurs because the file exists",
              "The file is opened for reading only",
            ],
            answer: 1,
            explain:
              'Write mode truncates the file: everything in it is deleted the instant it is opened. Use "a" (append) to keep existing data.',
          },
        },
      ],
    },

    {
      id: "9.11.2",
      title: "Writing, appending and reading",
      summary: "The operations themselves, with a live file system you can inspect.",
      minutes: 18,
      outcomes: ["Uses basic file operations (open, close, read write and append)"],
      blocks: [
        {
          kind: "text",
          md: `The panel below is a real, working file system running inside your browser. Files you create in one example are still there in the next: open the **Files** tab to see them.`,
        },
        { kind: "widget", id: "file-lab" },
        { kind: "heading", text: "Creating and writing" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Create a file and put three lines in it",
          code: `f = open("n1.txt", "w")
f.write("Ravi 85\\n")
f.write("Mala 72\\n")
f.write("Kumara 64\\n")
f.close()

print("File written. Now read it back:")
print(open("n1.txt").read())`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "write() does not add a new line",
          md: `\`print()\` moves to the next line automatically. \`write()\` does **not**: you must add \`\\n\` yourself, or everything ends up on one line.`,
        },
        { kind: "heading", text: "Appending" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          files: [{ path: "n1.txt", content: "Ravi 85\nMala 72\nKumara 64\n" }],
          caption: "Append mode keeps what is already there",
          code: `f = open("n1.txt", "a")
f.write("Sanduni 91\\n")
f.close()

print(open("n1.txt").read())`,
        },
        { kind: "heading", text: "The three ways to read" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          files: [{ path: "n1.txt", content: "Ravi 85\nMala 72\nKumara 64\n" }],
          code: `# 1. read(): the whole file as one string
f = open("n1.txt", "r")
print("read():", repr(f.read()))
f.close()

# 2. read(n): only the first n characters
f = open("n1.txt", "r")
print("read(4):", repr(f.read(4)))
f.close()

# 3. readline(): one line at a time
f = open("n1.txt", "r")
print("line 1:", repr(f.readline()))
print("line 2:", repr(f.readline()))
f.close()

# readlines(): every line, as a list
f = open("n1.txt", "r")
print("readlines():", f.readlines())
f.close()`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          files: [{ path: "n1.txt", content: "Ravi 85\nMala 72\nKumara 64\n" }],
          caption: "The usual pattern: loop through a file line by line",
          code: `total = 0
count = 0

with open("n1.txt", "r") as f:
    for line in f:
        line = line.strip()          # remove the trailing newline
        if line == "":
            continue
        name, mark = line.split(" ")  # split on the space
        print(f"{name:10} {mark}")
        total = total + int(mark)
        count = count + 1

print("-" * 18)
print("Average:", round(total / count, 2))`,
        },
        { kind: "heading", text: "Deleting files" },
        {
          kind: "text",
          md: `Deleting is not part of the file object: it belongs to the **operating system**, so you import the \`os\` module.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          files: [{ path: "temp.txt", content: "delete me\n" }],
          code: `import os

# Always check first, or you get FileNotFoundError
if os.path.exists("temp.txt"):
    os.remove("temp.txt")
    print("temp.txt deleted")
else:
    print("The file does not exist")

# os.rmdir("myfolder") removes an EMPTY folder`,
        },
        {
          kind: "callout",
          tone: "exam",
          title: "The five operations to name",
          md: `**open, close, read, write, append**: these are the "basic file operations" in the learning outcome. Be ready to give the Python for each one.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.11-inline-2",
            level: "9.11",
            q: "Which method reads exactly one line from an open file?",
            options: ["read()", "readline()", "readlines()", "readall()"],
            answer: 1,
            explain:
              "`readline()` reads a single line. `read()` returns the whole file as one string, and `readlines()` returns a list of all the lines.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.11-1" },
        { kind: "exercise", exerciseId: "ex-9.11-2" },
        { kind: "exercise", exerciseId: "ex-9.11-3" },
        { kind: "exercise", exerciseId: "ex-9.11-4" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.11-3",
      title: "Rainfall report",
      level: "9.11",
      difficulty: 2,
      xp: 45,
      tags: ["files", "loops", "parsing"],
      brief: `The file \`rainfall.txt\` holds one week of readings from a weather station. Each line is a day and a rainfall figure in millimetres, separated by a space:

\`\`\`
Monday 12.5
Tuesday 0
Wednesday 43.2
...
\`\`\`

Read the file and print exactly three lines:

\`\`\`
Total: 121.4
Wettest: Wednesday 43.2
Dry days: 2
\`\`\`

A **dry day** is one with exactly \`0\` rainfall. Round the total to **1 decimal place**.

Do not retype the data into your program. Read it from the file, because next week the file will have different numbers in it.`,
      files: [
        {
          path: "rainfall.txt",
          content:
            "Monday 12.5\nTuesday 0\nWednesday 43.2\nThursday 8.1\nFriday 0\nSaturday 31.6\nSunday 26.0\n",
        },
      ],
      starter: `f = open("rainfall.txt", "r")

# Your code here
`,
      hints: [
        "Loop the file directly: `for line in f:` gives one line at a time.",
        "`line.split()` gives `['Wednesday', '43.2']`. The rainfall needs `float()`.",
        "Skip blank lines with `if line.strip() == \"\": continue` so a trailing newline cannot crash you.",
        "`round(total, 1)` fixes the total to one decimal place before printing.",
      ],
      solution: `f = open("rainfall.txt", "r")

total = 0
wettest_day = ""
wettest = -1
dry = 0

for line in f:
    if line.strip() == "":
        continue
    parts = line.split()
    day = parts[0]
    mm = float(parts[1])
    total = total + mm
    if mm > wettest:
        wettest = mm
        wettest_day = day
    if mm == 0:
        dry = dry + 1

f.close()

print("Total:", round(total, 1))
print("Wettest:", wettest_day, wettest)
print("Dry days:", dry)`,
      tests: [
        {
          kind: "io",
          name: "The weekly report",
          expect: "Total: 121.4\nWettest: Wednesday 43.2\nDry days: 2",
          match: "loose",
        },
        { kind: "source", name: "Actually opens the file", mustUse: ["open("] },
        { kind: "source", name: "Does not hard-code the answer", mustNotUse: ["121.4"] },
      ],
    },
    {
      id: "ex-9.11-4",
      title: "Append to the attendance register",
      level: "9.11",
      difficulty: 2,
      xp: 40,
      tags: ["files", "append mode", "input"],
      brief: `\`register.txt\` already contains today's attendance. Add a new name **without destroying what is there**, then show the whole register back.

Read one name, append it as a new line, then print every line in the file numbered from 1:

\`\`\`
1. Ravi
2. Mala
3. Geetha
4. Sanduni
\`\`\`

The mode letter you choose is the whole exercise. Pick the wrong one and the three existing names are gone the instant the file opens, with no error message to warn you.`,
      files: [{ path: "register.txt", content: "Ravi\nMala\nGeetha\n" }],
      starter: `name = input("New name: ")

# Open in the right mode, append, then close

# Now read the whole file back and print it numbered
`,
      hints: [
        'Append mode is `open("register.txt", "a")`. Write mode `"w"` would empty the file first.',
        'You must write the newline yourself: `f.write(name + "\\n")`.',
        "Close the file after writing, then open it again for reading.",
        "Number the lines with a counter, or use `enumerate(lines, 1)`.",
      ],
      solution: `name = input("New name: ")

f = open("register.txt", "a")
f.write(name + "\\n")
f.close()

f = open("register.txt", "r")
lines = f.readlines()
f.close()

count = 1
for line in lines:
    if line.strip() != "":
        print(str(count) + ".", line.strip())
        count = count + 1`,
      tests: [
        {
          kind: "io",
          name: "Sanduni is added at the end",
          stdin: ["Sanduni"],
          expect: "1. Ravi\n2. Mala\n3. Geetha\n4. Sanduni",
          match: "loose",
        },
        {
          kind: "io",
          name: "A different name still keeps the first three",
          stdin: ["Nimal"],
          expect: "1. Ravi\n2. Mala\n3. Geetha\n4. Nimal",
          match: "loose",
          hidden: true,
        },
        { kind: "source", name: "Uses append mode, not write mode", mustUse: ['"a"'] },
      ],
    },
    {
      id: "ex-9.11-1",
      title: "Write then read back",
      level: "9.11",
      difficulty: 1,
      xp: 30,
      tags: ["files", "write", "read"],
      brief: `Create a file called \`students.txt\` containing exactly these three lines:

\`\`\`
Ravi
Mala
Kumara
\`\`\`

Then open it again and print its contents, so the program's output is those same three lines.

Remember to close the file after writing.`,
      starter: `# Write the file


# Read it back and print it
`,
      hints: [
        'Open with `open("students.txt", "w")` to create it.',
        "`write()` does not add line breaks: end each name with `\\n`.",
        "Close the file after writing, before you read it.",
        'Read it all at once with `print(open("students.txt").read())`.',
      ],
      solution: `f = open("students.txt", "w")
f.write("Ravi\\n")
f.write("Mala\\n")
f.write("Kumara\\n")
f.close()

f = open("students.txt", "r")
print(f.read())
f.close()`,
      tests: [
        { kind: "io", name: "Prints the three names", expect: "Ravi\nMala\nKumara", match: "loose" },
        { kind: "source", name: "Actually uses a file", mustUse: ["open("] },
      ],
    },
    {
      id: "ex-9.11-2",
      title: "Highest mark in a file",
      level: "9.11",
      difficulty: 3,
      xp: 45,
      tags: ["files", "loops", "strings"],
      brief: `The file \`marks.txt\` already exists. Each line holds a name and a mark separated by one space:

\`\`\`
Ravi 85
Mala 72
Kumara 64
Sanduni 91
Nimal 58
\`\`\`

Read the file and print exactly two lines:

\`\`\`
Highest: Sanduni 91
Average: 74.0
\`\`\`

The average must be rounded to 1 decimal place.`,
      files: [
        { path: "marks.txt", content: "Ravi 85\nMala 72\nKumara 64\nSanduni 91\nNimal 58\n" },
      ],
      starter: `# marks.txt already exists: open it and process it
`,
      hints: [
        "Loop over the file directly: `for line in f:` gives you one line at a time.",
        "`line.strip()` removes the trailing newline; skip any line that is then empty.",
        "`line.split(\" \")` gives a list of two strings: the name and the mark as TEXT.",
        "Convert with `int(mark)` before comparing, or '9' will look bigger than '85'.",
      ],
      solution: `best_name = ""
best_mark = -1
total = 0
count = 0

f = open("marks.txt", "r")
for line in f:
    line = line.strip()
    if line == "":
        continue
    name, mark = line.split(" ")
    mark = int(mark)
    total = total + mark
    count = count + 1
    if mark > best_mark:
        best_mark = mark
        best_name = name
f.close()

print("Highest:", best_name, best_mark)
print("Average:", round(total / count, 1))`,
      tests: [
        {
          kind: "io",
          name: "Reports the highest and the average",
          expect: "Highest: Sanduni 91\nAverage: 74.0",
          match: "loose",
        },
        {
          kind: "source",
          name: "Finds the highest with a loop, not max()",
          mustNotUse: ["max(", "sorted("],
        },
        { kind: "source", name: "Reads the file rather than hard-coding", mustUse: ["open("] },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.11-1",
      level: "9.11",
      q: "Which mode opens a file for adding data at the end without erasing it?",
      options: ['"r"', '"w"', '"a"', '"x"'],
      answer: 2,
      explain: 'Append mode "a" adds to the end and creates the file if it does not exist.',
      difficulty: 1,
    },
    {
      id: "q-9.11-2",
      level: "9.11",
      q: 'What happens with `open("data.txt", "r")` when data.txt does not exist?',
      options: [
        "The file is created and opened",
        "An error occurs",
        "An empty string is returned",
        "The program waits for the file to appear",
      ],
      answer: 1,
      explain:
        'Read mode requires the file to exist and raises FileNotFoundError otherwise. Modes "w", "a" and "x" can create files.',
      difficulty: 1,
    },
    {
      id: "q-9.11-3",
      level: "9.11",
      q: "Why should a file be closed after use?",
      options: [
        "To delete it",
        "To release it and make sure everything written is saved",
        "To convert it into binary",
        "It is not necessary at all",
      ],
      answer: 1,
      explain:
        "Closing flushes buffered data to disk and releases the file. Data can be lost if a program ends without closing a written file.",
      difficulty: 1,
    },
    {
      id: "q-9.11-4",
      level: "9.11",
      q: "Which module must you import to delete a file?",
      options: ["file", "sys", "os", "shutil"],
      answer: 2,
      explain: "`import os`, then `os.remove(\"file.txt\")`. Deleting is an operating-system operation.",
      difficulty: 1,
    },
    {
      id: "q-9.11-5",
      level: "9.11",
      q: "What does `f.read(5)` return?",
      options: [
        "Line 5 of the file",
        "The first 5 lines",
        "The first 5 characters",
        "The 5th character only",
      ],
      answer: 2,
      explain: "Passing a number to `read()` limits it to that many characters.",
      difficulty: 2,
    },
    {
      id: "q-9.11-6",
      level: "9.11",
      q: "Why is checking `os.path.exists()` before `os.remove()` a good idea?",
      options: [
        "It makes deletion faster",
        "It avoids a FileNotFoundError if the file is not there",
        "It is required by Python syntax",
        "It creates the file if missing",
      ],
      answer: 1,
      explain:
        "Removing a file that does not exist raises FileNotFoundError. Checking first lets you handle that case cleanly.",
      difficulty: 2,
    },
    {
      id: "q-9.11-7",
      level: "9.11",
      q: "A program writes three names with `f.write(\"Ravi\")`, `f.write(\"Mala\")`, `f.write(\"Kumara\")`. What does the file contain?",
      options: [
        "Three separate lines",
        "RaviMalaKumara on one line",
        "Ravi Mala Kumara with spaces",
        "Only Kumara",
      ],
      answer: 1,
      explain:
        "`write()` adds nothing of its own, so the three strings run together. You must include `\\n` yourself to create separate lines.",
      difficulty: 2,
    },
  ],
};
