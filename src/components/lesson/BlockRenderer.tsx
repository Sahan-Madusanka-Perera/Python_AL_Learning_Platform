"use client";

import {
  Info,
  Lightbulb,
  AlertTriangle,
  GraduationCap,
  Key,
  Bug,
} from "lucide-react";
import type { Block } from "@/lib/types";
import { Markdown, Inline } from "@/components/ui/Markdown";
import { CodeRunner } from "@/components/python/CodeRunner";
import { FlowchartView } from "@/components/tools/FlowchartView";
import { StructureChartView } from "@/components/tools/StructureChart";
import { StepThrough } from "@/components/tools/StepThrough";
import { Widget } from "@/components/tools/registry";
import { QuizCard } from "./QuizCard";
import { ExerciseCard } from "./ExerciseCard";
import { getExercise } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ── callouts ────────────────────────────────────────────────────────────── */

const CALLOUTS = {
  note: { icon: Info, label: "Note", cls: "border-info-500/30 bg-info-soft text-info-soft-fg" },
  tip: { icon: Lightbulb, label: "Tip", cls: "border-success-500/30 bg-success-soft text-success-soft-fg" },
  warn: { icon: AlertTriangle, label: "Careful", cls: "border-danger-500/30 bg-danger-soft text-danger-soft-fg" },
  exam: { icon: GraduationCap, label: "In the exam", cls: "border-brand-400/40 bg-brand-soft text-brand-soft-fg" },
  key: { icon: Key, label: "Key point", cls: "border-accent-500/35 bg-accent-soft text-accent-soft-fg" },
  mistake: { icon: Bug, label: "Common mistake", cls: "border-danger-500/30 bg-danger-soft text-danger-soft-fg" },
} as const;

function Callout({ tone, title, md }: { tone: keyof typeof CALLOUTS; title?: string; md: string }) {
  const meta = CALLOUTS[tone];
  const Icon = meta.icon;
  return (
    <aside className={cn("my-5 rounded-xl border px-4 py-3.5", meta.cls)}>
      <p className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide opacity-85">
        <Icon className="size-3.5" />
        {title ?? meta.label}
      </p>
      <Markdown className="text-[13.5px] leading-relaxed [&_a]:underline [&_code:not(pre_code)]:bg-black/10 [&_code:not(pre_code)]:text-current dark:[&_code:not(pre_code)]:bg-white/10">
        {md}
      </Markdown>
    </aside>
  );
}

/* ── syntax diagram ──────────────────────────────────────────────────────── */

const TONE_CLASS = {
  keyword: "text-[var(--brand)]",
  name: "text-success-600 dark:text-success-400",
  value: "text-accent-600 dark:text-accent-400",
  punct: "text-muted",
} as const;

function SyntaxCard({
  title,
  parts,
}: {
  title: string;
  parts: { text: string; label: string; tone?: keyof typeof TONE_CLASS }[];
}) {
  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-line bg-surface">
      <figcaption className="border-b border-line bg-sunken px-4 py-2 text-[12.5px] font-semibold">
        {title}
      </figcaption>
      <div className="scrollbar-slim overflow-x-auto px-4 pb-4 pt-5">
        <div className="flex min-w-max items-start">
          {parts.map((p, i) => (
            <div key={i} className="flex flex-col items-center">
              <code
                className={cn(
                  "whitespace-pre font-[family-name:var(--font-mono)] text-[15px] font-semibold",
                  TONE_CLASS[p.tone ?? "punct"],
                )}
              >
                {p.text}
              </code>
              {p.label && (
                <>
                  <span className="my-1 h-3 w-px bg-[var(--border-strong)]" />
                  <span className="max-w-28 text-center text-[10.5px] leading-tight text-subtle">
                    {p.label}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ── other block types ───────────────────────────────────────────────────── */

function DataTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <figure className="my-5">
      <div className="scrollbar-slim overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-max border-collapse text-[13px]">
          <thead>
            <tr className="bg-sunken">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="border-b border-line px-3 py-2.5 text-left font-semibold text-ink"
                >
                  <Inline text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="even:bg-sunken/40">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "border-b border-line px-3 py-2 align-top leading-snug",
                      ci === 0 ? "font-medium text-ink" : "text-muted",
                    )}
                  >
                    <Inline text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="mt-2 text-[12.5px] text-muted">{caption}</figcaption>}
    </figure>
  );
}

function CompareBlock({
  title,
  left,
  right,
}: {
  title?: string;
  left: { title: string; items: string[] };
  right: { title: string; items: string[] };
}) {
  return (
    <figure className="my-5">
      {title && <figcaption className="mb-2 text-[13px] font-semibold">{title}</figcaption>}
      <div className="grid gap-3 sm:grid-cols-2">
        {[left, right].map((side, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl border p-3.5",
              i === 0 ? "border-brand-400/40 bg-brand-soft" : "border-line bg-sunken",
            )}
          >
            <p
              className={cn(
                "mb-2 text-[13px] font-semibold",
                i === 0 ? "text-brand-soft-fg" : "text-ink",
              )}
            >
              {side.title}
            </p>
            <ul className="space-y-1.5">
              {side.items.map((item, n) => (
                <li
                  key={n}
                  className={cn(
                    "flex gap-2 text-[13px] leading-snug",
                    i === 0 ? "text-brand-soft-fg/90" : "text-muted",
                  )}
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-current opacity-50" />
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </figure>
  );
}

function Steps({ title, steps }: { title?: string; steps: { title: string; md: string }[] }) {
  return (
    <figure className="my-5">
      {title && <figcaption className="mb-3 text-[13px] font-semibold">{title}</figcaption>}
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="step-rail relative pl-11">
            <span className="absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-brand-soft text-[13px] font-bold text-brand-soft-fg">
              {i + 1}
            </span>
            <p className="pt-1 text-[14px] font-semibold leading-snug">{s.title}</p>
            <Markdown className="mt-1 text-[13.5px] leading-relaxed text-muted">{s.md}</Markdown>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function Terms({ title, terms }: { title?: string; terms: { term: string; def: string }[] }) {
  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-line">
      {title && (
        <figcaption className="border-b border-line bg-sunken px-4 py-2 text-[12.5px] font-semibold">
          {title}
        </figcaption>
      )}
      <dl className="divide-y divide-[var(--border)]">
        {terms.map((t, i) => (
          <div key={i} className="px-4 py-2.5">
            <dt className="text-[13.5px] font-semibold text-[var(--brand)]">{t.term}</dt>
            <dd className="mt-0.5 text-[13px] leading-snug text-muted">
              <Inline text={t.def} />
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

/* ── the renderer ────────────────────────────────────────────────────────── */

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "text":
            return <Markdown key={i}>{block.md}</Markdown>;

          case "heading":
            return (
              <h2
                key={i}
                id={`h-${i}`}
                className="mb-3 mt-8 scroll-mt-24 font-[family-name:var(--font-display)] text-[19px] font-semibold leading-tight"
              >
                {block.text}
              </h2>
            );

          case "callout":
            return <Callout key={i} tone={block.tone} title={block.title} md={block.md} />;

          case "code":
            if (block.lang === "pseudo" || block.lang === "text") {
              return (
                <figure key={i} className="my-5 overflow-hidden rounded-xl border border-line">
                  {block.caption && (
                    <figcaption className="border-b border-line bg-sunken px-3.5 py-2 text-[12.5px] text-muted">
                      {block.caption}
                    </figcaption>
                  )}
                  <pre className="scrollbar-slim overflow-x-auto bg-[var(--bg-code)] px-4 py-3 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-[#d7dbf0]">
                    {block.code}
                  </pre>
                </figure>
              );
            }
            return (
              <CodeRunner
                key={i}
                code={block.code}
                lang={block.lang === "sql" ? "sql" : "python"}
                stdin={block.stdin}
                files={block.files}
                caption={block.caption}
                runnable={block.runnable}
                staticOutput={block.output}
              />
            );

          case "table":
            return (
              <DataTable
                key={i}
                headers={block.headers}
                rows={block.rows}
                caption={block.caption}
              />
            );

          case "compare":
            return (
              <CompareBlock key={i} title={block.title} left={block.left} right={block.right} />
            );

          case "steps":
            return <Steps key={i} title={block.title} steps={block.steps} />;

          case "terms":
            return <Terms key={i} title={block.title} terms={block.terms} />;

          case "flowchart":
            return (
              <FlowchartView
                key={i}
                nodes={block.nodes}
                title={block.title}
                caption={block.caption}
              />
            );

          case "structure":
            return (
              <StructureChartView
                key={i}
                tree={block.tree}
                title={block.title}
                caption={block.caption}
              />
            );

          case "syntax":
            return <SyntaxCard key={i} title={block.title} parts={block.parts} />;

          case "widget":
            return <Widget key={i} id={block.id} props={block.props} />;

          case "check":
            return <QuizCard key={i} question={block.question} />;

          case "trace":
            return (
              <StepThrough
                key={i}
                code={block.code}
                caption={block.caption}
                stdin={block.stdin}
              />
            );

          case "exercise": {
            const exercise = getExercise(block.exerciseId);
            if (!exercise) return null;
            return <ExerciseCard key={i} exercise={exercise} />;
          }

          default:
            return null;
        }
      })}
    </>
  );
}
