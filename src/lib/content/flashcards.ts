import type { Flashcard } from "../types";

/**
 * Definitions worth knowing verbatim.
 *
 * These are the one-mark recall questions: the marks that are pure profit if
 * you have the wording ready, and pure loss if you do not. They are reviewed
 * with a Leitner box schedule so the ones you keep forgetting come back sooner.
 */
export const FLASHCARDS: Flashcard[] = [
  // 9.1
  { id: "fc-1", level: "9.1", front: "The four stages of the problem-solving process", back: "1. Understanding the problem\n2. Defining the problem and boundaries\n3. Planning the solution\n4. Implementation\n\nThe process is cyclic: implementation feeds back into understanding." },
  { id: "fc-2", level: "9.1", front: "What does 'defining the boundary' of a problem mean?", back: "Stating clearly what is inside the solution and what is outside it, so the scope of the work is fixed and does not grow endlessly." },
  { id: "fc-3", level: "9.1", front: "The three parts of every program", back: "Input → Process → Output." },

  // 9.2
  { id: "fc-4", level: "9.2", front: "Define modularization (decomposition)", back: "Breaking a big problem into smaller logical sub-problems, solving each, and connecting the sub-solutions to solve the main problem." },
  { id: "fc-5", level: "9.2", front: "What is stepwise refinement?", back: "Repeatedly improving an initial decomposition: splitting or combining sub-problems: until every part is at a manageable level." },
  { id: "fc-6", level: "9.2", front: "What does a structure chart show?", back: "How a system is broken down into modules and sub-modules: composition, not execution order. The whole system is the single box at the top." },
  { id: "fc-7", level: "9.2", front: "Top-down vs bottom-up design", back: "Top-down: start with the whole system and break it into smaller parts.\nBottom-up: start with small components and combine them into a larger system." },

  // 9.3
  { id: "fc-8", level: "9.3", front: "Define an algorithm", back: "A finite sequence of well-defined instructions, typically used to solve a problem.\n\nFinite = it ends. Well-defined = every step is clear and unambiguous." },
  { id: "fc-9", level: "9.3", front: "The six standard flow chart symbols", back: "Terminal (oval): start/end\nInput/Output (parallelogram)\nProcess (rectangle)\nDecision (diamond)\nConnector (circle)\nSubroutine (rectangle with double side bars)" },
  { id: "fc-10", level: "9.3", front: "What is pseudocode?", back: "A high-level description of an algorithm, written in English-like statements that are close to a programming language but independent of any particular one." },
  { id: "fc-11", level: "9.3", front: "What is a hand trace (dry run)?", back: "Working through an algorithm manually with example values, recording every variable after each step, to verify the logic before running the program." },
  { id: "fc-12", level: "9.3", front: "How many exits does a decision symbol have?", back: "Exactly two, and both must be labelled: YES and NO." },

  // 9.4
  { id: "fc-13", level: "9.4", front: "Define a programming paradigm", back: "The specific style of programming a language supports: the way you are expected to think about and structure a solution." },
  { id: "fc-14", level: "9.4", front: "The three sub-categories of imperative languages, with examples", back: "Procedural: C\nObject oriented: Java, C++\nParallel processing: Java" },
  { id: "fc-15", level: "9.4", front: "The three sub-categories of declarative languages, with examples", back: "Logic: Prolog\nFunctional / data flow: Lisp\nDatabase: SQL" },
  { id: "fc-16", level: "9.4", front: "Imperative vs declarative in one sentence", back: "Imperative languages describe HOW to solve the problem as a sequence of commands; declarative languages describe WHAT result is wanted and let the system decide how." },
  { id: "fc-17", level: "9.4", front: "The five generations of programming languages", back: "1GL machine language (binary)\n2GL assembly (mnemonics)\n3GL high-level (C, Python)\n4GL very high-level (SQL)\n5GL constraint/AI (Prolog)" },

  // 9.5
  { id: "fc-18", level: "9.5", front: "Why is program translation necessary?", back: "Because a processor can execute only binary machine code, while programs are written in human-readable high-level languages." },
  { id: "fc-19", level: "9.5", front: "Source program vs object program", back: "Source: written by a human in a high-level language, readable, machine independent, cannot be executed directly.\nObject: binary output of a translator, not human-readable, machine dependent, executable." },
  { id: "fc-20", level: "9.5", front: "Compiler vs interpreter", back: "Compiler: translates the whole program at once, before execution, produces object code, execution is fast.\nInterpreter: translates line by line during execution, produces no object file, execution is slower." },
  { id: "fc-21", level: "9.5", front: "What is the hybrid approach?", back: "Compiling the source into an intermediate byte code, which is then interpreted at run time by a virtual machine. Java is the standard example." },
  { id: "fc-22", level: "9.5", front: "Function of a linker", back: "Connects the user's object code with the standard library functions it calls, producing one complete executable program." },
  { id: "fc-23", level: "9.5", front: "Function of a loader", back: "Loads the executable program from storage into main memory so that the processor can begin executing it." },

  // 9.6
  { id: "fc-24", level: "9.6", front: "What is an IDE and what does it contain?", back: "Integrated Development Environment: one comprehensive program containing an editor, a compiler/interpreter and a debugger." },
  { id: "fc-25", level: "9.6", front: "The three kinds of programming error", back: "Syntax: breaks the grammar; caught before running.\nRuntime: the program stops part-way through.\nLogic: no error message at all, but the answer is wrong." },
  { id: "fc-26", level: "9.6", front: "Which error type is most dangerous, and why?", back: "A logic error, because nothing reports it. The program runs and produces a wrong answer, so only testing or tracing reveals it." },

  // 9.7
  { id: "fc-27", level: "9.7", front: "The Python identifier rules", back: "Must start with a letter or underscore; then letters, digits and underscores only; no spaces; cannot be a keyword; no length limit; case sensitive." },
  { id: "fc-28", level: "9.7", front: "What does input() always return?", back: "A string: even when the user typed a number. Cast it with int() or float() before doing arithmetic." },
  { id: "fc-29", level: "9.7", front: "The four arithmetic operators beyond + - * /", back: "% modulus (remainder)\n** exponentiation\n// floor division (whole part only)\nand / which always produces a float." },
  { id: "fc-30", level: "9.7", front: "The three logical operators", back: "and: True only if both are true\nor: True if at least one is true\nnot: reverses the result" },
  { id: "fc-31", level: "9.7", front: "Bitwise & | ^ ~ with a = 60, b = 13", back: "a & b = 12 (AND: 1 only if both bits are 1)\na | b = 61 (OR: 1 if either is 1)\na ^ b = 49 (XOR: 1 if the bits differ)\n~a = -61 (NOT: inverts all bits)" },
  { id: "fc-32", level: "9.7", front: "Operator precedence, highest to lowest", back: "() → ** → ~ +x -x → * / % // → + - → << >> → & → ^ → | → comparisons → == != → assignments → is → in → not → and → or" },
  { id: "fc-33", level: "9.7", front: "Difference between = and ==", back: "= assigns a value to a variable.\n== compares two values and gives True or False." },

  // 9.8
  { id: "fc-34", level: "9.8", front: "The three control structures", back: "Sequence: statements run one after another.\nSelection: the path branches on a condition.\nRepetition: a group of statements repeats." },
  { id: "fc-35", level: "9.8", front: "Iteration vs looping", back: "Iteration: the number of repetitions is known in advance (pre-determined): use a for loop.\nLooping: the number depends on a condition and is not known in advance (post-determined): use a while loop." },
  { id: "fc-36", level: "9.8", front: "What does range(1, 10, 2) produce?", back: "1, 3, 5, 7, 9. Start at 1, step by 2, stop BEFORE 10. The stop value is never included." },
  { id: "fc-37", level: "9.8", front: "break vs continue", back: "break exits the loop entirely.\ncontinue abandons only the current repetition and carries on with the next." },
  { id: "fc-38", level: "9.8", front: "Why does Python use indentation?", back: "Indentation defines the scope of a statement: which lines belong to a block. It does the job curly brackets do in other languages, so it is part of the syntax." },

  // 9.9
  { id: "fc-39", level: "9.9", front: "Parameter vs argument", back: "A parameter is the name in the function definition.\nAn argument is the actual value passed when the function is called." },
  { id: "fc-40", level: "9.9", front: "Built-in vs user-defined sub-programs", back: "Built-in: already written and stored in a library: print(), len(), int().\nUser-defined: written by the programmer with def when no built-in does the job." },
  { id: "fc-41", level: "9.9", front: "Local vs global variables", back: "Local: created inside a function, usable only there, destroyed when the function ends.\nGlobal: created outside all functions, readable everywhere, lives for the whole program." },
  { id: "fc-42", level: "9.9", front: "What is the LIFETIME of a variable?", back: "How long it exists in memory. A local variable lives from the call until the function returns; a global lives for the whole run of the program." },
  { id: "fc-43", level: "9.9", front: "return vs print", back: "print shows a value to the user.\nreturn hands the value back to the program so it can be stored and reused. A function with no return gives back None." },
  { id: "fc-44", level: "9.9", front: "Pass by value vs pass by reference in Python", back: "Immutable values (int, float, str, tuple) behave like pass by value: the original is unchanged.\nMutable values (list, dict) behave like pass by reference: changes inside the function affect the caller's object." },

  // 9.10
  { id: "fc-45", level: "9.10", front: "The four data structures and their brackets", back: 'String " ": ordered, immutable\nList [ ]: ordered, changeable\nTuple ( ): ordered, unchangeable\nDictionary { }: key:value pairs, changeable' },
  { id: "fc-46", level: "9.10", front: "Which two methods do tuples support?", back: "count() and index() only. Because a tuple cannot be changed, there is nothing to add or remove." },
  { id: "fc-47", level: "9.10", front: "remove() vs del vs pop() on a list", back: "remove(value): deletes by value.\ndel list[i]: deletes by position.\npop(): removes the last item and returns it." },
  { id: "fc-48", level: "9.10", front: "Why use d.get(key) instead of d[key]?", back: "d[key] raises KeyError and stops the program if the key is missing. d.get(key) returns None instead, and d.get(key, default) returns a value you choose." },

  // 9.11
  { id: "fc-49", level: "9.11", front: "The four file-opening modes", back: '"r" read: error if the file does not exist\n"a" append: adds to the end, creates it if missing\n"w" write: ERASES existing contents, creates it if missing\n"x" create: error if the file already exists' },
  { id: "fc-50", level: "9.11", front: "The basic file operations", back: "open, close, read, write and append." },
  { id: "fc-51", level: "9.11", front: "read() vs readline() vs readlines()", back: "read(): the whole file as one string.\nreadline(): one line at a time.\nreadlines(): every line, as a list." },
  { id: "fc-52", level: "9.11", front: "Which module is needed to delete a file?", back: "os. Use os.remove(\"file.txt\"), and check os.path.exists() first to avoid FileNotFoundError." },

  // 9.12
  { id: "fc-53", level: "9.12", front: "The five steps of a database program", back: "1. Import the connector\n2. Create a connection\n3. Create a cursor\n4. Execute the SQL\n5. commit() and close" },
  { id: "fc-54", level: "9.12", front: "Why is commit() necessary?", back: "INSERT, UPDATE and DELETE are held in a transaction until committed. Without commit() the changes are discarded, and no error is raised. SELECT needs no commit." },
  { id: "fc-55", level: "9.12", front: "fetchall() vs fetchone()", back: "fetchall() returns all remaining rows as a list of tuples.\nfetchone() returns only the next single row." },
  { id: "fc-56", level: "9.12", front: "What do WHERE, ORDER BY and LIKE do?", back: "WHERE filters which rows are returned.\nORDER BY sorts them (add DESC for descending).\nLIKE matches a pattern, where % means any sequence of characters." },

  // 9.13
  { id: "fc-57", level: "9.13", front: "Describe sequential search", back: "Start at the first item and check each one in turn until the target is found or the end of the list is reached. Worst case: n comparisons." },
  { id: "fc-58", level: "9.13", front: "Why is a dummy variable needed to swap two values?", back: "Assigning a = b destroys the original value of a. A third variable holds the first value so it can be copied into b afterwards." },
  { id: "fc-59", level: "9.13", front: "Describe bubble sort", back: "Make multiple passes through the list, comparing adjacent items and exchanging any that are out of order. Each pass places the next largest value in its final position." },
  { id: "fc-60", level: "9.13", front: "How many passes and comparisons does bubble sort need?", back: "n − 1 passes for n items. The first pass makes n − 1 comparisons, the second n − 2, and so on. After n − 1 passes the smallest item is necessarily in place." },
];
