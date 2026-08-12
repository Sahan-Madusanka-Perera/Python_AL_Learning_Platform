"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import type { TreeNode } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── read-only renderer (used by lesson content) ─────────────────────────── */

function Branch({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const hasKids = Boolean(node.children?.length);
  return (
    <li className="relative">
      <div
        className={cn(
          "inline-flex min-h-9 flex-col justify-center rounded-lg border px-3 py-1.5",
          depth === 0
            ? "border-[var(--brand)] bg-brand-soft"
            : hasKids
              ? "border-line-strong bg-surface"
              : "border-line bg-sunken",
        )}
      >
        <span
          className={cn(
            "text-[13px] font-medium leading-tight",
            depth === 0 && "font-semibold text-brand-soft-fg",
          )}
        >
          {node.label}
        </span>
        {node.note && (
          <span className="text-[11px] leading-tight text-subtle">{node.note}</span>
        )}
      </div>

      {hasKids && (
        <ul className="mt-3 flex flex-wrap gap-3 border-l border-line pl-4 sm:ml-3">
          {node.children!.map((child, i) => (
            <Branch key={i} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function StructureChartView({
  tree,
  title,
  caption,
  className,
}: {
  tree: TreeNode;
  title?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn("my-5", className)}>
      {title && <figcaption className="mb-2 text-[13px] font-semibold">{title}</figcaption>}
      <div className="scrollbar-slim overflow-x-auto rounded-xl border border-line bg-surface p-4">
        <ul className="inline-block min-w-full">
          <Branch node={tree} />
        </ul>
      </div>
      {caption && <p className="mt-2 text-[12.5px] leading-snug text-muted">{caption}</p>}
    </figure>
  );
}

/* ── interactive builder ─────────────────────────────────────────────────── */

interface EditNode {
  id: number;
  label: string;
  children: EditNode[];
}

let nextId = 1;
const node = (label: string, children: EditNode[] = []): EditNode => ({
  id: nextId++,
  label,
  children,
});

const STARTER = (): EditNode =>
  node("Library Management System", [
    node("Manage books", [node("Add book"), node("Remove book")]),
    node("Manage members"),
    node("Issue and return"),
  ]);

/**
 * Structure chart builder.
 *
 * Drawing one by hand is the examinable skill, so this exists to let a student
 * try a decomposition, look at it, and rearrange it — the stepwise refinement
 * loop — without redrawing the whole chart on paper each time.
 */
export function StructureChartBuilder() {
  const [root, setRoot] = useState<EditNode>(STARTER);
  const [selected, setSelected] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const update = (fn: (n: EditNode) => EditNode) => setRoot((r) => fn(structuredClone(r)));

  const findNode = (n: EditNode, id: number): EditNode | null => {
    if (n.id === id) return n;
    for (const c of n.children) {
      const found = findNode(c, id);
      if (found) return found;
    }
    return null;
  };

  const removeNode = (n: EditNode, id: number): EditNode => ({
    ...n,
    children: n.children.filter((c) => c.id !== id).map((c) => removeNode(c, id)),
  });

  const addChild = () => {
    const label = draft.trim();
    if (!label || selected === null) return;
    update((r) => {
      const parent = findNode(r, selected);
      if (parent) parent.children.push(node(label));
      return r;
    });
    setDraft("");
  };

  const depthOf = (n: EditNode, id: number, d = 0): number => {
    if (n.id === id) return d;
    for (const c of n.children) {
      const found = depthOf(c, id, d + 1);
      if (found >= 0) return found;
    }
    return -1;
  };

  const countNodes = (n: EditNode): number =>
    1 + n.children.reduce((sum, c) => sum + countNodes(c), 0);

  const maxDepth = (n: EditNode): number =>
    n.children.length ? 1 + Math.max(...n.children.map(maxDepth)) : 0;

  const Row = ({ n, depth }: { n: EditNode; depth: number }) => (
    <li>
      <div className="flex items-center gap-1.5 py-0.5">
        <button
          onClick={() => setSelected(n.id === selected ? null : n.id)}
          className={cn(
            "rounded-lg border px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors",
            selected === n.id
              ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
              : depth === 0
                ? "border-line-strong bg-surface"
                : "border-line bg-sunken hover:border-line-strong",
          )}
        >
          {n.label}
        </button>
        {depth > 0 && (
          <button
            onClick={() => {
              update((r) => removeNode(r, n.id));
              if (selected === n.id) setSelected(null);
            }}
            aria-label={`Remove ${n.label}`}
            className="rounded p-1 text-subtle transition-colors hover:bg-danger-soft hover:text-danger-500"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
      {n.children.length > 0 && (
        <ul className="ml-3 border-l border-line pl-3">
          {n.children.map((c) => (
            <Row key={c.id} n={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );

  const selectedNode = selected !== null ? findNode(root, selected) : null;

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-line bg-surface">
      <header className="flex items-center justify-between border-b border-line bg-sunken px-4 py-2.5">
        <div>
          <p className="text-[13px] font-semibold">Structure chart builder</p>
          <p className="text-[11.5px] text-subtle">
            Tap a box to select it, then add the modules it is made of
          </p>
        </div>
        <button
          onClick={() => {
            setRoot(STARTER());
            setSelected(null);
          }}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-muted transition-colors hover:bg-hover hover:text-ink"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </header>

      <div className="scrollbar-slim max-h-80 overflow-auto p-4">
        <ul>
          <Row n={root} depth={0} />
        </ul>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-sunken"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addChild();
              }}
              className="flex items-center gap-2 px-4 py-3"
            >
              <span className="hidden shrink-0 text-[12px] text-muted sm:block">
                Add a part of <strong className="font-semibold">{selectedNode.label}</strong>:
              </span>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. Search catalogue"
                className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] outline-none focus:border-[var(--brand)]"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[var(--brand)] px-3 text-[13px] font-medium text-[var(--brand-fg)] disabled:opacity-40"
              >
                <Plus className="size-3.5" />
                Add
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="flex gap-4 border-t border-line px-4 py-2 text-[11.5px] text-subtle">
        <span>{countNodes(root)} modules</span>
        <span>{maxDepth(root)} levels deep</span>
        {selectedNode && <span>Selected at level {depthOf(root, selectedNode.id)}</span>}
      </footer>
    </div>
  );
}
