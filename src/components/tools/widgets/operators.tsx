"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ============================================================================
 * Operator tools: bitwise bit-by-bit, precedence resolution, type inspection.
 * ==========================================================================*/

const Shell = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="my-5 overflow-hidden rounded-xl border border-line bg-surface">
    <header className="border-b border-line bg-sunken px-4 py-2.5">
      <p className="text-[13px] font-semibold">{title}</p>
      <p className="text-[11.5px] text-subtle">{subtitle}</p>
    </header>
    <div className="p-4">{children}</div>
  </div>
);

/* ── bitwise ─────────────────────────────────────────────────────────────── */

type BitOp = "&" | "|" | "^" | "<<" | ">>";

const BIT_OPS: { op: BitOp; name: string; rule: string }[] = [
  { op: "&", name: "AND", rule: "1 only when BOTH bits are 1" },
  { op: "|", name: "OR", rule: "1 when EITHER bit is 1" },
  { op: "^", name: "XOR", rule: "1 when the bits are DIFFERENT" },
  { op: "<<", name: "Left shift", rule: "bits move left — multiplies by 2 each place" },
  { op: ">>", name: "Right shift", rule: "bits move right — divides by 2 each place" },
];

const bits = (n: number, width = 8) =>
  (n < 0 ? (n >>> 0).toString(2).slice(-width) : n.toString(2).padStart(width, "0")).split("");

/** One labelled row of bits. Defined at module scope so the bit cells keep
 *  their identity — and their layout animation — between renders. */
function BitRow({
  label,
  value,
  bitList,
  highlight,
}: {
  label: string;
  value: number;
  bitList: string[];
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-right font-[family-name:var(--font-mono)] text-[12px] text-muted">
        {label}
      </span>
      <div className="flex gap-0.5">
        {bitList.map((bit, i) => (
          <motion.span
            key={i}
            layout
            className={cn(
              "grid size-6 place-items-center rounded font-[family-name:var(--font-mono)] text-[12px] font-semibold sm:size-7",
              bit === "1"
                ? highlight
                  ? "bg-[var(--brand)] text-[var(--brand-fg)]"
                  : "bg-brand-soft text-brand-soft-fg"
                : "bg-sunken text-subtle",
            )}
          >
            {bit}
          </motion.span>
        ))}
      </div>
      <span className="ml-1 font-[family-name:var(--font-mono)] text-[12.5px] font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function BitwiseLab() {
  const [a, setA] = useState(60);
  const [b, setB] = useState(13);
  const [op, setOp] = useState<BitOp>("&");

  const shiftBy = Math.min(b, 7);
  const result = useMemo(() => {
    switch (op) {
      case "&":
        return a & b;
      case "|":
        return a | b;
      case "^":
        return a ^ b;
      case "<<":
        return a << shiftBy;
      case ">>":
        return a >> shiftBy;
    }
  }, [a, b, op, shiftBy]);

  const isShift = op === "<<" || op === ">>";
  const width = op === "<<" ? 12 : 8;
  const aBits = bits(a, width);
  const bBits = bits(b, width);
  const rBits = bits(result, width);
  const meta = BIT_OPS.find((o) => o.op === op)!;

  return (
    <Shell
      title="Bitwise operator lab"
      subtitle="Change the numbers and watch every bit"
    >
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-subtle">a</span>
          <input
            type="number"
            value={a}
            min={0}
            max={255}
            onChange={(e) => setA(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
            className="w-20 rounded-lg border border-line bg-surface px-2 py-1.5 font-[family-name:var(--font-mono)] text-[13px] outline-none focus:border-[var(--brand)]"
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-subtle">operator</span>
          <div className="flex gap-1 rounded-lg bg-sunken p-1">
            {BIT_OPS.map((o) => (
              <button
                key={o.op}
                onClick={() => setOp(o.op)}
                className={cn(
                  "rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[12.5px] font-semibold transition-colors",
                  op === o.op ? "bg-surface text-[var(--brand)] shadow-sm" : "text-subtle",
                )}
              >
                {o.op}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-subtle">{isShift ? "places" : "b"}</span>
          <input
            type="number"
            value={b}
            min={0}
            max={255}
            onChange={(e) => setB(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
            className="w-20 rounded-lg border border-line bg-surface px-2 py-1.5 font-[family-name:var(--font-mono)] text-[13px] outline-none focus:border-[var(--brand)]"
          />
        </label>
      </div>

      <div className="scrollbar-slim space-y-2 overflow-x-auto">
        <BitRow label="a =" value={a} bitList={aBits} />
        {!isShift && <BitRow label="b =" value={b} bitList={bBits} />}
        <div className="ml-16 border-t border-line-strong pt-2">
          <BitRow
            label={isShift ? `a ${op} ${shiftBy}` : `a ${op} b`}
            value={result}
            bitList={rBits}
            highlight
          />
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-[12.5px] text-brand-soft-fg">
        <strong className="font-semibold">{meta.name}</strong> — {meta.rule}
      </p>
      <p className="mt-2 font-[family-name:var(--font-mono)] text-[12px] text-subtle">
        Python: <span className="text-ink">print({a} {op} {isShift ? shiftBy : b})</span> → {result}
      </p>
    </Shell>
  );
}

/* ── operator precedence ─────────────────────────────────────────────────── */

const PRESETS = [
  "2 + 3 * 4",
  "(2 + 3) * 4",
  "2 + 3 * 4 ** 2",
  "10 - 4 - 2",
  "2 ** 3 ** 2",
  "10 / 2 * 5",
  "5 + 3 > 6 and 2 < 1",
  "not True or True",
];

/** Precedence levels, highest number binds tightest. */
const LEVELS: { tokens: string[]; name: string; rank: number; rightAssoc?: boolean }[] = [
  { tokens: ["**"], name: "exponentiation", rank: 8, rightAssoc: true },
  { tokens: ["*", "/", "//", "%"], name: "multiply / divide", rank: 7 },
  { tokens: ["+", "-"], name: "add / subtract", rank: 6 },
  { tokens: ["<", "<=", ">", ">="], name: "comparison", rank: 5 },
  { tokens: ["==", "!="], name: "equality", rank: 4 },
  { tokens: ["not"], name: "logical not", rank: 3 },
  { tokens: ["and"], name: "logical and", rank: 2 },
  { tokens: ["or"], name: "logical or", rank: 1 },
];

function tokenise(expr: string): string[] {
  return expr.match(/\*\*|\/\/|<=|>=|==|!=|and|or|not|True|False|[()+\-*/%<>]|\d+\.?\d*/g) ?? [];
}

/** Explain evaluation order without actually evaluating — the reasoning is the point. */
function explainOrder(expr: string) {
  const tokens = tokenise(expr);
  const steps: { op: string; why: string }[] = [];

  if (tokens.includes("(")) {
    steps.push({
      op: "( )",
      why: "Brackets are always resolved first, whatever is inside them.",
    });
  }

  const present = LEVELS.filter((l) => l.tokens.some((t) => tokens.includes(t))).sort(
    (a, b) => b.rank - a.rank,
  );

  present.forEach((l) => {
    const used = l.tokens.filter((t) => tokens.includes(t));
    const count = tokens.filter((t) => used.includes(t)).length;
    steps.push({
      op: used.join(" "),
      why:
        count > 1
          ? l.rightAssoc
            ? `${l.name} — several of these, and ** groups RIGHT to left`
            : `${l.name} — several of these, evaluated left to right`
          : l.name,
    });
  });

  return steps;
}

export function OperatorPrecedence() {
  const [expr, setExpr] = useState("2 + 3 * 4 ** 2");
  const steps = useMemo(() => explainOrder(expr), [expr]);

  let result = "";
  try {
    // A tiny safe evaluator: only arithmetic tokens are allowed through.
    if (/^[\d\s+\-*/%().]+$/.test(expr)) {
      result = String(Function(`"use strict";return (${expr.replace(/\*\*/g, "**")})`)());
    }
  } catch {
    result = "";
  }

  return (
    <Shell
      title="Which operator runs first?"
      subtitle="Pick an expression and see the order Python resolves it in"
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setExpr(p)}
            className={cn(
              "rounded-lg border px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] transition-colors",
              expr === p
                ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                : "border-line bg-sunken text-muted hover:border-line-strong",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        className="w-full rounded-lg border border-line bg-sunken px-3 py-2 font-[family-name:var(--font-mono)] text-[14px] outline-none focus:border-[var(--brand)]"
        aria-label="Expression"
      />

      <ol className="mt-3 space-y-1.5">
        {steps.map((s, i) => (
          <motion.li
            key={`${s.op}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2.5 rounded-lg bg-sunken px-3 py-1.5"
          >
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-[var(--brand-fg)]">
              {i + 1}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--brand)]">
              {s.op}
            </span>
            <span className="text-[12.5px] text-muted">{s.why}</span>
          </motion.li>
        ))}
        {steps.length === 0 && (
          <li className="rounded-lg bg-sunken px-3 py-2 text-[12.5px] text-subtle">
            No operators in this expression.
          </li>
        )}
      </ol>

      {result !== "" && (
        <p className="mt-3 rounded-lg bg-success-soft px-3 py-2 font-[family-name:var(--font-mono)] text-[13px] text-success-soft-fg">
          {expr} = {result}
        </p>
      )}
    </Shell>
  );
}

/* ── data type inspector ─────────────────────────────────────────────────── */

const SAMPLES: { literal: string; type: string; category: string; note: string }[] = [
  { literal: "17", type: "int", category: "Numbers · integral", note: "A whole number." },
  { literal: "2.8", type: "float", category: "Numbers · real", note: "Has a decimal point." },
  { literal: "1j", type: "complex", category: "Numbers · complex", note: "j marks the imaginary part." },
  { literal: "True", type: "bool", category: "Numbers · integral", note: "Booleans are a kind of integer in Python: True is 1." },
  { literal: '"Ravi"', type: "str", category: "Sequence · immutable", note: "Text. Cannot be changed in place." },
  { literal: "(1, 2)", type: "tuple", category: "Sequence · immutable", note: "Ordered and locked." },
  { literal: "[1, 2]", type: "list", category: "Sequence · mutable", note: "Ordered and changeable." },
  { literal: "{1, 2}", type: "set", category: "Set types", note: "Unordered, no duplicates." },
  { literal: '{"a": 1}', type: "dict", category: "Mappings", note: "Key : value pairs." },
  { literal: 'int("25")', type: "int", category: "Casting", note: "Text converted to a whole number." },
  { literal: 'float("3.5")', type: "float", category: "Casting", note: "Text converted to a decimal." },
  { literal: "str(99)", type: "str", category: "Casting", note: "A number converted to text." },
  { literal: "int(7.9)", type: "int", category: "Casting", note: "Truncates to 7 — it does NOT round." },
  { literal: 'input()', type: "str", category: "Casting", note: "Always a string, even if the user typed a number." },
];

export function DatatypeInspector() {
  const [selected, setSelected] = useState(0);
  const s = SAMPLES[selected];

  return (
    <Shell title="Data type inspector" subtitle="Tap a value to see what Python calls it">
      <div className="flex flex-wrap gap-1.5">
        {SAMPLES.map((sample, i) => (
          <button
            key={sample.literal}
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[12.5px] transition-colors",
              i === selected
                ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                : "border-line bg-sunken text-muted hover:border-line-strong",
            )}
          >
            {sample.literal}
          </button>
        ))}
      </div>

      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-lg border border-line bg-sunken p-3"
      >
        <p className="font-[family-name:var(--font-mono)] text-[13px]">
          <span className="text-subtle">type(</span>
          <span className="text-ink">{s.literal}</span>
          <span className="text-subtle">)</span>
          <span className="mx-2 text-subtle">→</span>
          <span className="font-semibold text-[var(--brand)]">{s.type}</span>
        </p>
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
          {s.category}
        </p>
        <p className="mt-1 text-[13px] leading-snug text-muted">{s.note}</p>
      </motion.div>
    </Shell>
  );
}
