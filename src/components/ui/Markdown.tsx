import React from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
 * A deliberately small Markdown renderer.
 *
 * Lesson copy only ever needs bold, italics, inline code, links and lists.
 * Pulling in a full parser for that would cost more bytes than the entire
 * lesson library, and students on slow connections pay for every one of them.
 * ==========================================================================*/

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

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

    // paragraph — consume until blank line or a list starts
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
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
