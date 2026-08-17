import type { Module } from "../types";

export const m12: Module = {
  id: "9.12",
  slug: "databases",
  title: "Databases from Python",
  tagline: "Connect, query, and change data: SQL embedded inside a program.",
  icon: "Database",
  periods: 4,
  outcomes: [
    "Embeds SQL statements in programming languages to retrieve, add, modify and delete data",
  ],
  contents: ["Connecting to a database", "Retrieve data", "Add, modify and delete data"],

  lessons: [
    {
      id: "9.12.1",
      title: "Connecting to a database",
      summary: "The five steps every database program follows, whatever the database is.",
      minutes: 14,
      outcomes: [
        "Embeds SQL statements in programming languages to retrieve, add, modify and delete data",
      ],
      blocks: [
        {
          kind: "text",
          md: `Files are fine for small amounts of data. Once you have thousands of records that must be searched, sorted and updated safely, you need a **database**.

Python talks to a database through a **driver**. For MySQL: the database in your syllabus: that driver is **MySQL Connector**, installed with:

\`\`\`
pip install mysql-connector-python
\`\`\`

**PIP** is the package manager for Python packages and modules.`,
        },
        {
          kind: "callout",
          tone: "note",
          title: "About the code you run here",
          md: `MySQL is a **server**: it cannot run inside a web browser. So the runnable examples in this module use **SQLite**, which is built into Python itself.

This matters less than it sounds: the five steps, the cursor, \`execute()\`, \`fetchall()\`, \`commit()\` and the SQL statements themselves are **the same**. Each example shows the MySQL version you must write in the exam alongside the runnable version.`,
        },
        {
          kind: "steps",
          title: "The five steps",
          steps: [
            { title: "Import the connector", md: "`import mysql.connector`" },
            {
              title: "Create a connection",
              md: "Supply the host, user, password and database name. This opens the line of communication.",
            },
            {
              title: "Create a cursor",
              md: "A **cursor** is the object that carries SQL statements to the database and brings results back.",
            },
            {
              title: "Execute SQL",
              md: "`cursor.execute(\"SELECT ...\")`: the SQL is written as a Python string.",
            },
            {
              title: "Commit and close",
              md: "`connection.commit()` saves changes permanently. Without it, inserts and updates are lost. Then close the connection.",
            },
          ],
        },
        {
          kind: "code",
          lang: "python",
          caption: "MySQL: the version to write in an exam answer",
          code: `import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="school"
)

mycursor = mydb.cursor()
mycursor.execute("SELECT * FROM student")

for row in mycursor.fetchall():
    print(row)

mydb.close()`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "The same five steps, running for real with SQLite",
          code: `import sqlite3

# 2. connect  (a file, or ":memory:" for a temporary database)
mydb = sqlite3.connect("school.db")

# 3. cursor
mycursor = mydb.cursor()

# 4. execute
mycursor.execute("CREATE TABLE IF NOT EXISTS student (regNo TEXT, name TEXT)")
mycursor.execute("INSERT INTO student VALUES ('r001', 'Ravi')")

# 5. commit, without this the insert is thrown away
mydb.commit()

mycursor.execute("SELECT * FROM student")
print(mycursor.fetchall())

mydb.close()`,
        },
        {
          kind: "callout",
          tone: "warn",
          title: "Forgetting commit() is the classic bug",
          md: `\`INSERT\`, \`UPDATE\` and \`DELETE\` change data. Those changes are held in a transaction until you call \`commit()\`. If the program ends without committing, **nothing is saved**, and there is no error message to tell you.

\`SELECT\` does not need a commit, because it changes nothing.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.12-inline-1",
            level: "9.12",
            q: "What is the purpose of a cursor?",
            options: [
              "To show where the mouse is pointing",
              "To carry SQL statements to the database and fetch results back",
              "To create the database file",
              "To store the password",
            ],
            answer: 1,
            explain:
              "The cursor is the object you call `execute()` on and from which you fetch result rows.",
          },
        },
      ],
    },

    {
      id: "9.12.2",
      title: "Creating tables and adding data",
      summary: "CREATE, INSERT, and inserting many rows at once.",
      minutes: 14,
      outcomes: [
        "Embeds SQL statements in programming languages to retrieve, add, modify and delete data",
      ],
      blocks: [
        { kind: "widget", id: "sql-lab" },
        { kind: "heading", text: "Creating a database and a table" },
        {
          kind: "code",
          lang: "sql",
          caption: "The SQL, in MySQL form",
          code: `CREATE DATABASE school;

CREATE TABLE student (
    regNo     VARCHAR(10),
    name      VARCHAR(50),
    address   VARCHAR(100),
    contactNo VARCHAR(15)
);

ALTER TABLE student ADD COLUMN dob DATE;   -- add a new field

DROP TABLE student;                        -- delete the whole table`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "Building the student table for real",
          code: `import sqlite3

db = sqlite3.connect(":memory:")   # temporary database
cur = db.cursor()

cur.execute("""
    CREATE TABLE student (
        regNo     TEXT,
        name      TEXT,
        address   TEXT,
        contactNo TEXT,
        dob       TEXT
    )
""")

print("Table created.")
cur.execute("PRAGMA table_info(student)")
for col in cur.fetchall():
    print(" -", col[1], col[2])`,
        },
        { kind: "heading", text: "Inserting one row" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.execute("CREATE TABLE student (regNo TEXT, name TEXT, address TEXT, contactNo TEXT, dob TEXT)")

sql = "INSERT INTO student VALUES (?, ?, ?, ?, ?)"
val = ("r001", "Ravi", "Colombo 5", "0715874510", "2000-10-21")

cur.execute(sql, val)
db.commit()

print(cur.rowcount, "record inserted.")
cur.execute("SELECT * FROM student")
print(cur.fetchall())`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Placeholders keep you safe",
          md: `Notice the \`?\` marks instead of gluing values into the SQL string. In MySQL Connector the placeholder is \`%s\`:

\`\`\`python
sql = "INSERT INTO student VALUES (%s, %s, %s, %s, %s)"
mycursor.execute(sql, val)
\`\`\`

Building SQL by joining strings together is how databases get broken into. Always pass the values separately.`,
        },
        { kind: "heading", text: "Inserting many rows: executemany()" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.execute("CREATE TABLE student (regNo TEXT, name TEXT, address TEXT, contactNo TEXT, dob TEXT)")

sql = "INSERT INTO student VALUES (?, ?, ?, ?, ?)"
vals = [
    ("r001", "Ravi",   "Colombo 5",     "0715874510", "2000-10-21"),
    ("r002", "Mala",   "Anuradhapura",  "0715874510", "2001-06-14"),
    ("r003", "Geetha", "Kandy",         "0775857410", "2001-02-12"),
    ("r004", "Kumara", "Vavuniya",      "0710055210", "2000-08-13"),
]

cur.executemany(sql, vals)     # a LIST OF TUPLES
db.commit()

print(cur.rowcount, "records were inserted.")`,
        },
      ],
    },

    {
      id: "9.12.3",
      title: "Retrieving, updating and deleting",
      summary: "SELECT with filters and sorting, then UPDATE and DELETE.",
      minutes: 16,
      outcomes: [
        "Embeds SQL statements in programming languages to retrieve, add, modify and delete data",
      ],
      blocks: [
        {
          kind: "text",
          md: `Once the data is in, four operations cover almost everything: **select**, **select with a filter**, **update** and **delete**.

\`fetchall()\` returns **all** the remaining rows as a list of tuples. \`fetchone()\` returns just the next row.`,
        },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          caption: "All the SELECT variants in one program",
          code: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.execute("CREATE TABLE student (regNo TEXT, name TEXT, address TEXT, contactNo TEXT, dob TEXT)")
cur.executemany("INSERT INTO student VALUES (?, ?, ?, ?, ?)", [
    ("r001", "Ravi",   "Colombo 5",    "0715874510", "2000-10-21"),
    ("r002", "Mala",   "Anuradhapura", "0715874510", "2001-06-14"),
    ("r003", "Geetha", "Kandy",        "0775857410", "2001-02-12"),
    ("r004", "Kumara", "Vavuniya",     "0710055210", "2000-08-13"),
])
db.commit()

def show(title, sql, params=()):
    print("\\n" + title)
    cur.execute(sql, params)
    for row in cur.fetchall():
        print("  ", row)

show("1. All records", "SELECT * FROM student")

show("2. Only some columns", "SELECT regNo, name, address FROM student")

show("3. Filter with WHERE", "SELECT * FROM student WHERE dob = ?", ("2001-06-14",))

show("4. Pattern matching with LIKE", "SELECT * FROM student WHERE contactNo LIKE '071%'")

show("5. Sorted by name", "SELECT * FROM student ORDER BY name")

show("6. Sorted by date, newest first", "SELECT * FROM student ORDER BY dob DESC")`,
        },
        {
          kind: "callout",
          tone: "key",
          title: "The SQL keywords to remember",
          md: `- \`SELECT ... FROM table\`: retrieve
- \`WHERE condition\`: filter which rows
- \`LIKE '071%'\`: pattern match; \`%\` means "any characters"
- \`ORDER BY column\`: sort ascending (the default)
- \`ORDER BY column DESC\`: sort descending`,
        },
        { kind: "heading", text: "UPDATE and DELETE" },
        {
          kind: "code",
          lang: "python",
          runnable: true,
          code: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.execute("CREATE TABLE student (regNo TEXT, name TEXT, address TEXT)")
cur.executemany("INSERT INTO student VALUES (?, ?, ?)", [
    ("r001", "Ravi",   "Colombo 5"),
    ("r002", "Mala",   "Anuradhapura"),
    ("r003", "Geetha", "Kandy"),
])
db.commit()

# UPDATE: change Ravi to Sami
cur.execute("UPDATE student SET name = ? WHERE name = ?", ("Sami", "Ravi"))
db.commit()
print(cur.rowcount, "record(s) updated")

# DELETE: remove anyone from Kandy
cur.execute("DELETE FROM student WHERE address = ?", ("Kandy",))
db.commit()
print(cur.rowcount, "record(s) deleted")

cur.execute("SELECT * FROM student")
for row in cur.fetchall():
    print("  ", row)`,
        },
        {
          kind: "callout",
          tone: "warn",
          title: "Never forget the WHERE clause",
          md: `\`DELETE FROM student\` with no \`WHERE\` deletes **every record in the table**.
\`UPDATE student SET name = 'Sami'\` with no \`WHERE\` renames **every student**.

Write the \`WHERE\` clause before you write the rest of the statement.`,
        },
        {
          kind: "check",
          question: {
            id: "q-9.12-inline-2",
            level: "9.12",
            q: "Which method fetches every row returned by the last executed SELECT?",
            options: ["fetch()", "fetchone()", "fetchall()", "getall()"],
            answer: 2,
            explain:
              "`fetchall()` returns all remaining rows as a list of tuples. `fetchone()` returns only the next single row.",
          },
        },
        { kind: "exercise", exerciseId: "ex-9.12-3" },
        { kind: "exercise", exerciseId: "ex-9.12-1" },
        { kind: "exercise", exerciseId: "ex-9.12-2" },
      ],
    },
  ],

  exercises: [
    {
      id: "ex-9.12-3",
      title: "Your first SELECT",
      level: "9.12",
      difficulty: 1,
      xp: 30,
      tags: ["database", "sql", "select"],
      brief: `The smallest complete database program: create a table, put rows in it, read them back.

1. Create a table \`teacher\` with two columns, \`name\` and \`subject\`.
2. Insert these three rows:

\`\`\`
("Nimal",   "ICT")
("Kamala",  "Maths")
("Sunil",   "Science")
\`\`\`

3. Select **every** row and print one line per teacher in the form \`Nimal ICT\`.

Expected output:

\`\`\`
Nimal ICT
Kamala Maths
Sunil Science
\`\`\`

Rows come back in the order they were inserted, so no \`ORDER BY\` is needed here.`,
      starter: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()

# 1. Create the table

# 2. Insert the three rows

# 3. Select them all and print each one
`,
      hints: [
        '`cur.execute("CREATE TABLE teacher (name TEXT, subject TEXT)")` makes the table.',
        "Insert with placeholders: `cur.execute(\"INSERT INTO teacher VALUES (?, ?)\", (\"Nimal\", \"ICT\"))`.",
        '`cur.execute("SELECT * FROM teacher")` then `cur.fetchall()` gives a list of tuples.',
        "Each row is a tuple, so `print(row[0], row[1])` prints both columns.",
      ],
      solution: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()

cur.execute("CREATE TABLE teacher (name TEXT, subject TEXT)")

teachers = [("Nimal", "ICT"), ("Kamala", "Maths"), ("Sunil", "Science")]
cur.executemany("INSERT INTO teacher VALUES (?, ?)", teachers)
db.commit()

cur.execute("SELECT * FROM teacher")
for row in cur.fetchall():
    print(row[0], row[1])`,
      tests: [
        {
          kind: "io",
          name: "All three teachers, in order",
          expect: "Nimal ICT\nKamala Maths\nSunil Science",
          match: "loose",
        },
        { kind: "source", name: "Creates the table in SQL", mustUse: ["CREATE TABLE"] },
        { kind: "source", name: "Reads the rows back with SELECT", mustUse: ["SELECT"] },
        { kind: "source", name: "Does not just print the answer", mustNotUse: ['print("Nimal ICT'] },
      ],
    },
    {
      id: "ex-9.12-2",
      title: "Bus timetable: filtering and sorting in SQL",
      level: "9.12",
      difficulty: 2,
      xp: 45,
      tags: ["database", "sql", "select"],
      brief: `Build an in-memory bus timetable and query it. The work belongs in the **SQL**, not in Python: no sorting or filtering with Python loops.

1. Create a table \`bus\` with columns \`route\`, \`destination\`, \`departs\` and \`fare\`.
2. Insert these five services with \`executemany()\`:

\`\`\`
("138", "Kottawa",     "06:15", 45)
("177", "Kaduwela",    "06:40", 60)
("120", "Horana",      "07:05", 95)
("138", "Kottawa",     "07:30", 45)
("187", "Katunayake",  "08:00", 180)
\`\`\`

3. Select the \`destination\` and \`departs\` of every service with a fare **under 100**, ordered by \`departs\` **earliest first**.
4. Print one line per row in the form \`Kottawa 06:15\`.

Expected output:

\`\`\`
Kottawa 06:15
Kaduwela 06:40
Horana 07:05
Kottawa 07:30
\`\`\``,
      starter: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()

# 1. Create the table

# 2. Insert the five services

# 3. Select fare < 100, ordered by departs

# 4. Print each row
`,
      hints: [
        "Times stored as `HH:MM` text sort correctly, so `ORDER BY departs` is enough.",
        "`WHERE fare < 100` does the filtering. Do not filter with an `if` in Python.",
        "`cur.executemany(sql, rows)` takes a list of tuples.",
        "Each row you fetch is a tuple, so `print(row[0], row[1])` prints the two columns.",
      ],
      solution: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()

cur.execute("CREATE TABLE bus (route TEXT, destination TEXT, departs TEXT, fare INTEGER)")

buses = [
    ("138", "Kottawa", "06:15", 45),
    ("177", "Kaduwela", "06:40", 60),
    ("120", "Horana", "07:05", 95),
    ("138", "Kottawa", "07:30", 45),
    ("187", "Katunayake", "08:00", 180),
]
cur.executemany("INSERT INTO bus VALUES (?, ?, ?, ?)", buses)
db.commit()

cur.execute("SELECT destination, departs FROM bus WHERE fare < 100 ORDER BY departs")
for row in cur.fetchall():
    print(row[0], row[1])`,
      tests: [
        {
          kind: "io",
          name: "Cheap services in time order",
          expect: "Kottawa 06:15\nKaduwela 06:40\nHorana 07:05\nKottawa 07:30",
          match: "loose",
        },
        { kind: "source", name: "Filters in SQL", mustUse: ["WHERE"] },
        { kind: "source", name: "Sorts in SQL", mustUse: ["ORDER BY"] },
        { kind: "source", name: "Inserts many rows at once", mustUse: ["executemany"] },
      ],
    },
    {
      id: "ex-9.12-1",
      title: "Build and query a student table",
      level: "9.12",
      difficulty: 3,
      xp: 45,
      tags: ["database", "sql"],
      brief: `Using \`sqlite3\` and an in-memory database:

1. Create a table \`student\` with columns \`regNo\`, \`name\` and \`marks\`.
2. Insert these four records:
   \`("r001", "Ravi", 85)\`, \`("r002", "Mala", 72)\`, \`("r003", "Geetha", 91)\`, \`("r004", "Kumara", 64)\`
3. Select **only** the students with marks above 70, **sorted by marks in descending order**.
4. Print one line per student in the form \`Geetha 91\`.

Expected output:
\`\`\`
Geetha 91
Ravi 85
Mala 72
\`\`\``,
      starter: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()

# 1. create the table


# 2. insert the records


# 3. select marks above 70, highest first


# 4. print each row
`,
      hints: [
        "`CREATE TABLE student (regNo TEXT, name TEXT, marks INTEGER)`.",
        "Insert all four at once with `cur.executemany(sql, list_of_tuples)`, then `db.commit()`.",
        "The query needs both a filter and a sort: `SELECT name, marks FROM student WHERE marks > 70 ORDER BY marks DESC`.",
        "Loop over `cur.fetchall()`; each row is a tuple, so `print(row[0], row[1])`.",
      ],
      solution: `import sqlite3

db = sqlite3.connect(":memory:")
cur = db.cursor()

cur.execute("CREATE TABLE student (regNo TEXT, name TEXT, marks INTEGER)")

cur.executemany("INSERT INTO student VALUES (?, ?, ?)", [
    ("r001", "Ravi", 85),
    ("r002", "Mala", 72),
    ("r003", "Geetha", 91),
    ("r004", "Kumara", 64),
])
db.commit()

cur.execute("SELECT name, marks FROM student WHERE marks > 70 ORDER BY marks DESC")

for row in cur.fetchall():
    print(row[0], row[1])`,
      tests: [
        {
          kind: "io",
          name: "Correct students, correct order",
          expect: "Geetha 91\nRavi 85\nMala 72",
          match: "loose",
        },
        { kind: "source", name: "Uses a WHERE clause", mustUse: ["WHERE"] },
        { kind: "source", name: "Uses ORDER BY ... DESC", mustUse: ["ORDER BY", "DESC"] },
      ],
    },
  ],

  quiz: [
    {
      id: "q-9.12-1",
      level: "9.12",
      q: "Which statement is used to retrieve data from a table?",
      options: ["GET", "SELECT", "FETCH", "READ"],
      answer: 1,
      explain: "`SELECT` retrieves rows. `fetchall()` is the Python method that collects those rows.",
      difficulty: 1,
    },
    {
      id: "q-9.12-2",
      level: "9.12",
      q: "Why must `commit()` be called after an INSERT?",
      options: [
        "To close the connection",
        "To make the change permanent, without it the insert is discarded",
        "To create the cursor",
        "To convert the data into SQL",
      ],
      answer: 1,
      explain:
        "Changes sit in a transaction until committed. If the program ends without a commit, the data is never saved and no error is raised.",
      difficulty: 2,
    },
    {
      id: "q-9.12-3",
      level: "9.12",
      q: "Which clause filters which records a SELECT returns?",
      options: ["ORDER BY", "WHERE", "FROM", "LIMIT"],
      answer: 1,
      explain: "`WHERE` filters rows by a condition. `ORDER BY` sorts the rows that come back.",
      difficulty: 1,
    },
    {
      id: "q-9.12-4",
      level: "9.12",
      q: "What does `SELECT * FROM student ORDER BY dob DESC` do?",
      options: [
        "Deletes students by date of birth",
        "Returns all students sorted by date of birth, newest first",
        "Returns all students sorted by date of birth, oldest first",
        "Returns only the student with the latest birthday",
      ],
      answer: 1,
      explain:
        "`ORDER BY` sorts ascending by default; `DESC` reverses it, so the largest (latest) dates come first.",
      difficulty: 2,
    },
    {
      id: "q-9.12-5",
      level: "9.12",
      q: "Which method is used to insert several rows in one call?",
      options: ["execute()", "executemany()", "insertall()", "commitmany()"],
      answer: 1,
      explain:
        "`executemany()` takes the SQL plus a list of tuples and inserts every one of them.",
      difficulty: 1,
    },
    {
      id: "q-9.12-6",
      level: "9.12",
      q: "What does `DELETE FROM student` do if the WHERE clause is left out?",
      options: [
        "Nothing: it is invalid SQL",
        "Deletes only the first record",
        "Deletes every record in the table",
        "Deletes the table itself",
      ],
      answer: 2,
      explain:
        "Without a WHERE clause the operation applies to every row, wiping the table's contents. `DROP TABLE` is what removes the table itself.",
      difficulty: 2,
    },
    {
      id: "q-9.12-7",
      level: "9.12",
      q: "In MySQL Connector, `SELECT * FROM student WHERE contactNo LIKE '071%'` returns:",
      options: [
        "Records where the contact number is exactly 071",
        "Records where the contact number starts with 071",
        "Records where the contact number ends with 071",
        "All records",
      ],
      answer: 1,
      explain:
        "`%` is the wildcard meaning 'any sequence of characters', so '071%' matches anything beginning with 071.",
      difficulty: 2,
    },
  ],
};
