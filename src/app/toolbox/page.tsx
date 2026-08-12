"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Wrench } from "lucide-react";
import { TOOLBOX, Widget } from "@/components/tools/registry";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { cn } from "@/lib/utils";

export default function ToolboxPage() {
  const [active, setActive] = useState(TOOLBOX[0].id);

  // Support deep links like /toolbox#sort-visualiser from the command palette.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && TOOLBOX.some((t) => t.id === hash)) {
      setActive(hash as typeof active);
    }
  }, []);

  const tool = TOOLBOX.find((t) => t.id === active)!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight">
          <Wrench className="size-6 text-[var(--brand)]" />
          Visual toolbox
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          Every abstract idea in the syllabus, made visible. Use these when a concept will not sit
          still in your head.
        </p>
      </header>

      <div className="scrollbar-none mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {TOOLBOX.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActive(t.id);
              history.replaceState(null, "", `#${t.id}`);
            }}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
              active === t.id
                ? "border-[var(--brand)] bg-brand-soft text-brand-soft-fg"
                : "border-line bg-sunken text-muted hover:border-line-strong",
            )}
          >
            <ModuleIcon name={t.icon} className="size-3.5" />
            {t.name}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="text-[16px] font-semibold">{tool.name}</h2>
          {tool.levels.map((l) => (
            <span
              key={l}
              className="rounded-pill bg-brand-soft px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10.5px] font-semibold text-brand-soft-fg"
            >
              {l}
            </span>
          ))}
        </div>
        <p className="text-[13px] text-muted">{tool.blurb}</p>

        <Widget id={tool.id} />
      </motion.div>
    </div>
  );
}
