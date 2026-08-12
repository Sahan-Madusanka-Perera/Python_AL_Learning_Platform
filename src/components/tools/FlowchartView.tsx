"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { FlowNode, FlowShape } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ============================================================================
 * Flow chart renderer.
 *
 * Draws the six standard symbols with an automatic layout, so lesson content
 * can describe a chart as data instead of shipping an image. Images do not
 * respond to dark mode, do not scale on a phone, and cannot be read aloud.
 * ==========================================================================*/

const NODE_W = 168;
const NODE_H = 46;
const DECISION_H = 62;
const GAP_Y = 34;
const GAP_X = 30;

interface Placed extends FlowNode {
  row: number;
  col: number;
  x: number;
  y: number;
  h: number;
}

function layout(nodes: FlowNode[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const rows = new Map<string, number>();
  const cols = new Map<string, number>();

  // Longest path from the start gives the row, so joins sit below both branches.
  const visit = (id: string, depth: number, seen: Set<string>) => {
    const node = byId.get(id);
    if (!node || seen.has(id)) return;
    rows.set(id, Math.max(rows.get(id) ?? 0, depth));
    const next = new Set(seen).add(id);
    if (node.next) visit(node.next, depth + 1, next);
    if (node.no) visit(node.no, depth + 1, next);
  };
  if (nodes.length) visit(nodes[0].id, 0, new Set());

  // Columns: a decision pushes YES left and NO right; joins settle in between.
  const parents = new Map<string, string[]>();
  nodes.forEach((n) => {
    [n.next, n.no].forEach((child) => {
      if (child) parents.set(child, [...(parents.get(child) ?? []), n.id]);
    });
  });

  const order = [...nodes].sort((a, b) => (rows.get(a.id) ?? 0) - (rows.get(b.id) ?? 0));
  order.forEach((n) => {
    const ps = parents.get(n.id) ?? [];
    if (!ps.length) {
      cols.set(n.id, 0);
      return;
    }
    const values = ps.map((pid) => {
      const parent = byId.get(pid);
      const pc = cols.get(pid) ?? 0;
      if (parent?.shape === "decision") {
        if (parent.next === n.id && parent.no) return pc - 1;
        if (parent.no === n.id) return pc + 1;
      }
      return pc;
    });
    // A node reached from several places sits at the average of its parents.
    cols.set(n.id, Math.round(values.reduce((a, b) => a + b, 0) / values.length));
  });

  const minCol = Math.min(...[...cols.values()]);
  const maxCol = Math.max(...[...cols.values()]);

  // Rows have variable height because decisions are taller.
  const rowHeights: number[] = [];
  nodes.forEach((n) => {
    const r = rows.get(n.id) ?? 0;
    const h = n.shape === "decision" ? DECISION_H : NODE_H;
    rowHeights[r] = Math.max(rowHeights[r] ?? 0, h);
  });
  const rowY: number[] = [];
  let acc = 0;
  rowHeights.forEach((h, i) => {
    rowY[i] = acc;
    acc += h + GAP_Y;
  });

  const placed: Placed[] = nodes.map((n) => {
    const row = rows.get(n.id) ?? 0;
    const col = (cols.get(n.id) ?? 0) - minCol;
    const h = n.shape === "decision" ? DECISION_H : NODE_H;
    return {
      ...n,
      row,
      col,
      h,
      x: col * (NODE_W + GAP_X) + NODE_W / 2,
      y: rowY[row] + h / 2,
    };
  });

  return {
    placed,
    width: (maxCol - minCol + 1) * (NODE_W + GAP_X) - GAP_X,
    height: acc - GAP_Y,
  };
}

function Shape({ node, x, y, h }: { node: FlowNode; x: number; y: number; h: number }) {
  const w = NODE_W;
  const common = { strokeWidth: 1.75, vectorEffect: "non-scaling-stroke" as const };
  const fill = SHAPE_FILL[node.shape];
  const stroke = SHAPE_STROKE[node.shape];

  switch (node.shape) {
    case "terminal":
      return (
        <rect
          x={x - w / 2}
          y={y - h / 2}
          width={w}
          height={h}
          rx={h / 2}
          fill={fill}
          stroke={stroke}
          {...common}
        />
      );
    case "io":
      return (
        <polygon
          points={`${x - w / 2 + 14},${y - h / 2} ${x + w / 2},${y - h / 2} ${x + w / 2 - 14},${y + h / 2} ${x - w / 2},${y + h / 2}`}
          fill={fill}
          stroke={stroke}
          {...common}
        />
      );
    case "decision":
      return (
        <polygon
          points={`${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`}
          fill={fill}
          stroke={stroke}
          {...common}
        />
      );
    case "connector":
      return <circle cx={x} cy={y} r={h / 2} fill={fill} stroke={stroke} {...common} />;
    case "subroutine":
      return (
        <>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} fill={fill} stroke={stroke} {...common} />
          <line x1={x - w / 2 + 10} y1={y - h / 2} x2={x - w / 2 + 10} y2={y + h / 2} stroke={stroke} {...common} />
          <line x1={x + w / 2 - 10} y1={y - h / 2} x2={x + w / 2 - 10} y2={y + h / 2} stroke={stroke} {...common} />
        </>
      );
    default:
      return (
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={5} fill={fill} stroke={stroke} {...common} />
      );
  }
}

const SHAPE_FILL: Record<FlowShape, string> = {
  terminal: "var(--brand-soft)",
  process: "var(--bg-elevated)",
  io: "var(--info-soft)",
  decision: "var(--accent-soft)",
  connector: "var(--bg-sunken)",
  subroutine: "var(--bg-elevated)",
};

const SHAPE_STROKE: Record<FlowShape, string> = {
  terminal: "var(--brand)",
  process: "var(--border-strong)",
  io: "var(--color-info-500)",
  decision: "var(--color-accent-500)",
  connector: "var(--border-strong)",
  subroutine: "var(--border-strong)",
};

/** Break a label into lines that fit inside the symbol. */
function wrap(text: string, max = 22) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export function FlowchartView({
  nodes,
  title,
  caption,
  className,
}: {
  nodes: FlowNode[];
  title?: string;
  caption?: string;
  className?: string;
}) {
  const { placed, width, height } = useMemo(() => layout(nodes), [nodes]);
  const byId = useMemo(() => new Map(placed.map((n) => [n.id, n])), [placed]);

  const PAD = 26;

  const edges = placed.flatMap((n) => {
    const out: { from: Placed; to: Placed; label?: string; branch: "yes" | "no" | "plain" }[] = [];
    if (n.next && byId.has(n.next)) {
      out.push({
        from: n,
        to: byId.get(n.next)!,
        label: n.shape === "decision" ? (n.edgeLabel ?? "YES") : undefined,
        branch: n.shape === "decision" ? "yes" : "plain",
      });
    }
    if (n.no && byId.has(n.no)) {
      out.push({ from: n, to: byId.get(n.no)!, label: n.noLabel ?? "NO", branch: "no" });
    }
    return out;
  });

  return (
    <figure className={cn("my-5", className)}>
      {title && (
        <figcaption className="mb-2 text-[13px] font-semibold text-ink">{title}</figcaption>
      )}
      <div className="scrollbar-slim overflow-x-auto rounded-xl border border-line bg-surface p-4">
        <svg
          viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
          style={{ minWidth: Math.min(width + PAD * 2, 320), maxWidth: width + PAD * 2 }}
          className="mx-auto h-auto w-full"
          role="img"
          aria-label={title ?? "Flow chart"}
        >
          <defs>
            <marker
              id="fc-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--fg-subtle)" />
            </marker>
          </defs>

          {edges.map((e, i) => {
            const startY = e.from.y + e.from.h / 2;
            const endY = e.to.y - e.to.h / 2;
            const sideExit = e.from.shape === "decision" && e.from.x !== e.to.x;

            let d: string;
            let labelX = (e.from.x + e.to.x) / 2;
            let labelY = (startY + endY) / 2;

            if (sideExit) {
              // Leave a decision through its left or right point.
              const dir = e.to.x < e.from.x ? -1 : 1;
              const exitX = e.from.x + dir * (NODE_W / 2);
              const midY = e.from.y;
              d = `M ${exitX} ${midY} H ${e.to.x} V ${endY}`;
              labelX = exitX + dir * 16;
              labelY = midY - 7;
            } else if (Math.abs(e.from.x - e.to.x) < 1) {
              d = `M ${e.from.x} ${startY} V ${endY}`;
            } else {
              const midY = (startY + endY) / 2;
              d = `M ${e.from.x} ${startY} V ${midY} H ${e.to.x} V ${endY}`;
            }

            return (
              <g key={i}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="var(--fg-subtle)"
                  strokeWidth={1.5}
                  markerEnd="url(#fc-arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
                />
                {e.label && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    className="fill-[var(--fg-muted)] font-[family-name:var(--font-sans)] text-[10px] font-bold"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {placed.map((n, i) => {
            const lines = wrap(n.text, n.shape === "decision" ? 18 : 22);
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
              >
                <Shape node={n} x={n.x} y={n.y} h={n.h} />
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={n.x}
                    y={n.y + (li - (lines.length - 1) / 2) * 12 + 4}
                    textAnchor="middle"
                    className="fill-[var(--fg)] font-[family-name:var(--font-sans)] text-[11px] font-medium"
                  >
                    {line}
                  </text>
                ))}
              </motion.g>
            );
          })}
        </svg>
      </div>
      {caption && <p className="mt-2 text-[12.5px] leading-snug text-muted">{caption}</p>}
    </figure>
  );
}
