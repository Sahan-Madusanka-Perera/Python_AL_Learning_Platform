import type { PyError } from "./runtime";

/* ============================================================================
 * Turns CPython's error messages into something a 17-year-old can act on.
 *
 * A raw `NameError: name 'nmae' is not defined` teaches nothing. The same error
 * with "you spelled a variable differently than when you created it" plus a
 * concrete fix is the difference between a student debugging and a student
 * giving up.
 * ==========================================================================*/

export interface FriendlyError {
  /** Plain-language headline. */
  title: string;
  /** What Python was trying to do when it gave up. */
  why: string;
  /** Concrete things to check, in the order worth checking them. */
  fixes: string[];
  line: number | null;
  raw: string;
  type: string;
}

interface Rule {
  type: string;
  match?: RegExp;
  title: (m: RegExpMatchArray | null, err: PyError) => string;
  why: string;
  fixes: string[];
}

const RULES: Rule[] = [
  /* ── syntax ────────────────────────────────────────────────────────────── */
  {
    type: "SyntaxError",
    match: /expected ':'/,
    title: () => "A colon is missing",
    why: "Lines that open a block: `if`, `else`, `elif`, `for`, `while`, `def`: must end with a colon.",
    fixes: [
      "Put `:` at the end of the highlighted line.",
      "Check the whole line: `if age >= 18:` not `if age >= 18`.",
    ],
  },
  {
    type: "SyntaxError",
    match: /invalid syntax/,
    title: () => "Python could not understand this line",
    why: "Something in the line does not follow Python's grammar, so it stopped before running anything.",
    fixes: [
      "Look at the line **above** the highlighted one too: an unclosed `(` or `[` makes Python blame the next line.",
      "Check for `=` where you meant `==` in a condition.",
      "Make sure every `(`, `[`, `{` and quote mark is closed.",
    ],
  },
  {
    type: "SyntaxError",
    match: /unterminated string|EOL while scanning/,
    title: () => "A quote mark was never closed",
    why: "A text value started with `\"` or `'` but the line ended before the closing quote appeared.",
    fixes: [
      'Add the matching quote: `print("Hello")`.',
      "Use the same kind of quote at both ends.",
    ],
  },
  {
    type: "SyntaxError",
    match: /'\(' was never closed|closing parenthesis|unmatched/,
    title: () => "Brackets do not match",
    why: "Every opening bracket needs exactly one matching closing bracket of the same type.",
    fixes: [
      "Count the `(` and `)` on the line.",
      "Remember `print(\"Hi\")` needs a `)` at the very end.",
    ],
  },
  {
    type: "IndentationError",
    match: /expected an indented block/,
    title: () => "The block after this line is empty",
    why: "After a line ending in `:`, Python expects at least one indented line underneath it.",
    fixes: [
      "Indent the next line by 4 spaces.",
      "Every statement that belongs inside the `if` / `for` / `def` must be indented the same amount.",
    ],
  },
  {
    type: "IndentationError",
    title: () => "The indentation is uneven",
    why: "Python uses indentation to decide which lines belong together, so the spacing has to be consistent.",
    fixes: [
      "Use 4 spaces for each level, everywhere.",
      "Do not mix tabs and spaces: pick spaces and stay with them.",
      "Lines in the same block must start at exactly the same column.",
    ],
  },
  {
    type: "TabError",
    title: () => "Tabs and spaces are mixed up",
    why: "Some lines are indented with tabs and others with spaces. Python cannot tell how they line up.",
    fixes: ["Select all the code and re-indent using spaces only."],
  },

  /* ── names & attributes ────────────────────────────────────────────────── */
  {
    type: "NameError",
    match: /name '(.+?)' is not defined/,
    title: (m) => `Python has never heard of \`${m?.[1] ?? "that name"}\``,
    why: "You used a variable or function before creating it, or the spelling here does not match the spelling where it was created.",
    fixes: [
      "Check the spelling and capital letters. `Age`, `age` and `AGE` are three different variables.",
      "Make sure the line that creates it runs **before** this line.",
      "If it should be text, wrap it in quotes: `\"Kandy\"` not `Kandy`.",
    ],
  },
  {
    type: "AttributeError",
    match: /'(.+?)' object has no attribute '(.+?)'/,
    title: (m) => `A ${m?.[1] ?? "value"} has no \`${m?.[2] ?? "method"}\``,
    why: "You called a method that does not exist for this type of value.",
    fixes: [
      "Check the spelling of the method name.",
      "Check the type: `append()` works on a list, not on a tuple or a string.",
      "Tuples cannot be changed, so they have only `count()` and `index()`.",
    ],
  },

  /* ── types & conversion ────────────────────────────────────────────────── */
  {
    type: "TypeError",
    match: /can only concatenate str \(not "(.+?)"\) to str/,
    title: (m) => `You cannot join text to a ${m?.[1] ?? "number"} with \`+\``,
    why: "`+` means *add* for numbers and *join* for text. Python will not guess which one you meant when the two are mixed.",
    fixes: [
      'Convert the number to text: `"Age: " + str(age)`.',
      'Or let print add the space: `print("Age:", age)`.',
      'Or use an f-string: `print(f"Age: {age}")`.',
    ],
  },
  {
    type: "TypeError",
    match: /unsupported operand type\(s\) for (.+?): '(.+?)' and '(.+?)'/,
    title: (m) => `\`${m?.[1] ?? "This operator"}\` will not work between ${m?.[2]} and ${m?.[3]}`,
    why: "The two values on either side of the operator are different kinds of data.",
    fixes: [
      "Remember `input()` always gives back **text**, even when the student typed a number.",
      "Wrap it: `age = int(input(\"Age: \"))`.",
      "Use `float()` when the value can have decimals.",
    ],
  },
  {
    type: "TypeError",
    match: /'(.+?)' object is not subscriptable/,
    title: (m) => `You cannot use \`[ ]\` on a ${m?.[1] ?? "value"}`,
    why: "Square brackets pick an item out of a sequence. Numbers have no items inside them.",
    fixes: [
      "Check you are indexing the list, not a number.",
      "A common slip is `total[i]` when you meant `numbers[i]`.",
    ],
  },
  {
    type: "TypeError",
    match: /takes (\d+) positional arguments? but (\d+) (?:was|were) given/,
    title: (m) => `This function wants ${m?.[1]} argument(s), but got ${m?.[2]}`,
    why: "The number of values in the call does not match the parameters in the `def` line.",
    fixes: [
      "Count the parameters in the `def` line and the arguments in the call.",
      "Give a default value in the definition if an argument is optional: `def greet(name, greeting=\"Hello\"):`.",
    ],
  },
  {
    type: "ValueError",
    match: /invalid literal for int\(\) with base 10: '(.*?)'/,
    title: (m) => `\`${m?.[1] ?? ""}\` is not a whole number`,
    why: "`int()` can only convert text that contains digits: no letters, spaces or decimal points.",
    fixes: [
      "If the value can have decimals use `float()` instead.",
      "Check nothing extra was typed, like `18 years`.",
      "`int(\"3.5\")` fails: use `int(float(\"3.5\"))` to get `3`.",
    ],
  },

  /* ── collections ───────────────────────────────────────────────────────── */
  {
    type: "IndexError",
    match: /list index out of range/,
    title: () => "That position does not exist in the list",
    why: "Positions start at 0, so a list of 5 items has valid positions 0, 1, 2, 3 and 4, never 5.",
    fixes: [
      "The last item is at `len(mylist) - 1`.",
      "In loops use `range(len(mylist))`, which stops at the right place automatically.",
      "In bubble sort compare `L[i]` with `L[i+1]` only while `i < len(L) - 1`.",
    ],
  },
  {
    type: "KeyError",
    match: /'(.+?)'/,
    title: (m) => `The dictionary has no key \`${m?.[1] ?? ""}\``,
    why: "You asked for a key that is not in the dictionary.",
    fixes: [
      "Check spelling and capital letters of the key.",
      "Use `d.get(\"key\")` to get `None` instead of an error when the key may be missing.",
      "Check the key exists first: `if \"key\" in d:`.",
    ],
  },
  {
    type: "TypeError",
    match: /'tuple' object does not support item assignment/,
    title: () => "A tuple cannot be changed",
    why: "Tuples are immutable: that is the whole point of using one instead of a list.",
    fixes: [
      "Use a list `[ ]` if the values need to change.",
      "Or build a new tuple instead of editing the old one.",
    ],
  },

  /* ── runtime ───────────────────────────────────────────────────────────── */
  {
    type: "ZeroDivisionError",
    title: () => "You divided by zero",
    why: "Division by zero has no answer in mathematics, so Python stops.",
    fixes: [
      "Check the divisor before dividing: `if count != 0:`.",
      "This often happens when a counter is still 0 because the loop never ran.",
    ],
  },
  {
    type: "EOFError",
    title: () => "The program asked for input, but none was left",
    why: "An `input()` ran when there was nothing more to read.",
    fixes: [
      "Add another line in the Inputs box before running.",
      "Check whether a loop is calling `input()` more times than you expected.",
    ],
  },
  {
    type: "FileNotFoundError",
    match: /No such file or directory: '(.+?)'/,
    title: (m) => `There is no file called \`${m?.[1] ?? ""}\``,
    why: "Opening a file in read mode `\"r\"` requires the file to already exist.",
    fixes: [
      'Create it first with `open("name.txt", "w")` or `"a"`.',
      "Check the spelling of the file name, including `.txt`.",
      "Use the Files panel to see which files exist.",
    ],
  },
  {
    type: "RecursionError",
    title: () => "A function called itself too many times",
    why: "A recursive function needs a base case that stops the chain of calls.",
    fixes: [
      "Add an `if` that returns a value without calling the function again.",
      "Check the value you pass actually moves towards that base case.",
    ],
  },
  {
    type: "KeyboardInterrupt",
    title: () => "The program was stopped",
    why: "It ran for too long, which almost always means a loop never reaches its stopping condition.",
    fixes: [
      "Check the loop's condition can eventually become False.",
      "Make sure something inside a `while` loop actually changes the variable being tested.",
      "A missing `i = i + 1` inside a `while` loop is the classic cause.",
    ],
  },
  {
    type: "UnboundLocalError",
    match: /local variable '(.+?)'/,
    title: (m) => `\`${m?.[1] ?? "That variable"}\` is being used before it has a value here`,
    why: "Assigning to a name anywhere inside a function makes it local to that function for the whole function.",
    fixes: [
      "Give it a starting value inside the function first.",
      "If you meant to change the global one, add `global name` at the top of the function.",
    ],
  },
];

const GENERIC: Omit<Rule, "type" | "match"> = {
  title: () => "The program stopped with an error",
  why: "Python could not finish running your code.",
  fixes: [
    "Read the line number and look at that line closely.",
    "Print the values just before that line to see what they really contain.",
    "Run the Step Through tool to watch the variables change line by line.",
  ],
};

export function explainError(err: PyError): FriendlyError {
  for (const rule of RULES) {
    if (rule.type !== err.type) continue;
    if (!rule.match) {
      return {
        title: rule.title(null, err),
        why: rule.why,
        fixes: rule.fixes,
        line: err.line,
        raw: err.text,
        type: err.type,
      };
    }
    const m = err.message.match(rule.match);
    if (m) {
      return {
        title: rule.title(m, err),
        why: rule.why,
        fixes: rule.fixes,
        line: err.line,
        raw: err.text,
        type: err.type,
      };
    }
  }
  return {
    title: `${err.type}: ${err.message}`,
    why: GENERIC.why,
    fixes: GENERIC.fixes,
    line: err.line,
    raw: err.text,
    type: err.type,
  };
}
