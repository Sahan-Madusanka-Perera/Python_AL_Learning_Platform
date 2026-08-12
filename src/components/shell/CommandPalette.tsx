"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Wrench,
  CornerDownLeft,
} from "lucide-react";
import { SEARCH_INDEX, type SearchEntry } from "@/lib/content";
import { TOOLBOX } from "@/components/tools/registry";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  module: GraduationCap,
  lesson: BookOpen,
  exercise: FlaskConical,
  tool: Wrench,
} as const;

const TOOL_ENTRIES: SearchEntry[] = TOOLBOX.map((t) => ({
  kind: "tool",
  title: t.name,
  subtitle: `Tool · ${t.levels.join(", ")} · ${t.blurb}`,
  href: `/toolbox#${t.id}`,
  keywords: `${t.name} ${t.blurb} ${t.levels.join(" ")} tool`.toLowerCase(),
}));

const ENTRIES = [...SEARCH_INDEX, ...TOOL_ENTRIES];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES.filter((e) => e.kind === "module").slice(0, 14);
    const words = q.split(/\s+/);
    return ENTRIES.map((e) => {
      let score = 0;
      words.forEach((w) => {
        if (e.title.toLowerCase().includes(w)) score += 10;
        if (e.keywords.includes(w)) score += 3;
      });
      return { e, score };
    })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((r) => r.e);
  }, [query]);

  const go = (entry: SearchEntry) => {
    router.push(entry.href);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  useEffect(() => {
    listRef.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh]">
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative z-10 flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lg"
          >
            <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
              <Search className="size-4 shrink-0 text-subtle" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search lessons, labs and tools…"
                className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-subtle"
              />
              <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-subtle sm:block">
                esc
              </kbd>
            </div>

            <ul ref={listRef} className="scrollbar-slim flex-1 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-[13px] text-subtle">
                  Nothing matched “{query}”
                </li>
              )}
              {results.map((entry, i) => {
                const Icon = KIND_ICON[entry.kind];
                return (
                  <li key={entry.href + i}>
                    <button
                      onClick={() => go(entry)}
                      onMouseEnter={() => setCursor(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                        i === cursor ? "bg-brand-soft" : "hover:bg-hover",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          i === cursor ? "text-[var(--brand)]" : "text-subtle",
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium">
                          {entry.title}
                        </span>
                        <span className="block truncate text-[11.5px] text-subtle">
                          {entry.subtitle}
                        </span>
                      </span>
                      {i === cursor && (
                        <CornerDownLeft className="size-3.5 shrink-0 text-[var(--brand)]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
