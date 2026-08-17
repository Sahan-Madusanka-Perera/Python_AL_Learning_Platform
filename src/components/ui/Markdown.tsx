import React from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
 * A deliberately small Markdown renderer.
 *
 * Lesson copy only ever needs bold, italics, inline code, links, lists and
 * fenced code blocks. Pulling in a full parser for that would cost more bytes
 * than the entire lesson library, and students on slow connections pay for
 * every one of them.
 * ==========================================================================*/

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const FENCE = /^\s*```/;

export function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          return (
            <a key={i} href={link[2]} target="_blank" rel="noreferrer noopener">
              {link[1]}
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

interface MarkdownProps {
  children: string;
  className?: string;
  /** Render without the surrounding prose styles (for tight spaces). */
  bare?: boolean;
}

export function Markdown({ children, className, bare }: MarkdownProps) {
  const blocks: React.ReactNode[] = [];
  const lines = children.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code block: kept verbatim, scrolls sideways rather than
    // overflowing whatever it is nested inside (callout, step, exercise brief)
    if (FENCE.test(line)) {
      i++;
      const code: string[] = [];
      while (i < lines.length && !FENCE.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push(
        <pre
          key={key++}
          className="scrollbar-slim my-3 overflow-x-auto rounded-lg bg-[var(--bg-code)] px-3.5 py-2.5 font-[family-name:var(--font-mono)] text-[12.5px] font-normal leading-relaxed text-[#d7dbf0]"
        >
          {code.join("\n")}
        </pre>,
      );
      continue;
    }

    // unordered list
    if (/^\s*[-•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-•]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((t, n) => (
            <li key={n}>
              <Inline text={t} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // ordered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((t, n) => (
            <li key={n}>
              <Inline text={t} />
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // paragraph: consume until a blank line, a list or a code fence starts
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !FENCE.test(lines[i]) &&
      !/^\s*[-•]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push(
      <p key={key++}>
        <Inline text={para.join(" ")} />
      </p>,
    );
  }

  return <div className={cn(!bare && "prose-lesson", className)}>{blocks}</div>;
}
