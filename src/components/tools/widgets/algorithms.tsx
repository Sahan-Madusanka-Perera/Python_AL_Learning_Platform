"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, SkipForward, Shuffle, RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
 * Bubble sort and sequential search, animated.
 *
 * Both are built as a list of pre-computed frames rather than live mutation,
 * so a student can scrub backwards and forwards — the comparison that made a
 * swap happen is usually the one they want to look at twice.
 * ==========================================================================*/

const WidgetShell = ({
  title,
  subtitle,
  children,
  controls,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  controls: React.ReactNode;
}) => (
  <div className="my-5 overflow-hidden rounded-xl border border-line bg-surface">
    <header className="border-b border-line bg-sunken px-4 py-2.5">
      <p className="text-[13px] font-semibold">{title}</p>
      <p className="text-[11.5px] text-subtle">{subtitle}</p>
    </header>
    <div className="p-4">{children}</div>
    <footer className="flex flex-wrap items-center gap-1.5 border-t border-line px-3 py-2">
      {controls}
    </footer>
  </div>
);

const CtrlButton = ({
  onClick,
  disabled,
  children,
  primary,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  primary?: boolean;
  label?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={cn(
      "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium transition-all active:scale-95 disabled:opacity-35",
      primary
        ? "bg-[var(--brand)] px-3 text-[var(--brand-fg)]"
        : "text-muted hover:bg-hover hover:text-ink",
    )}
  >
    {children}
  </button>
);

/* ── bubble sort ─────────────────────────────────────────────────────────── */

interface SortFrame {
  list: number[];
  compare: [number, number] | null;
  swapped: boolean;
  sortedFrom: number;
  pass: number;
  comparisons: number;
  swaps: number;
  note: string;
}

function buildSortFrames(input: number[]): SortFrame[] {
  const L = [...input];
  const frames: SortFrame[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = L.length;

  frames.push({
    list: [...L],
    compare: null,
    swapped: false,
    sortedFrom: n,
    pass: 0,
    comparisons,
    swaps,
    note: "Starting list — nothing is sorted yet.",
  });

  for (let p = 0; p < n - 1; p++) {
    let didSwap = false;
    for (let i = 0; i < n - 1 - p; i++) {
      comparisons++;
      const willSwap = L[i] > L[i + 1];
      frames.push({
        list: [...L],
        compare: [i, i + 1],
        swapped: false,
        sortedFrom: n - p,
        pass: p + 1,
        comparisons,
        swaps,
        note: willSwap
          ? `${L[i]} > ${L[i + 1]}, so they must be exchanged.`
          : `${L[i]} is not greater than ${L[i + 1]} — leave them alone.`,
      });
      if (willSwap) {
        [L[i], L[i + 1]] = [L[i + 1], L[i]];
        swaps++;
        didSwap = true;
        frames.push({
          list: [...L],
          compare: [i, i + 1],
          swapped: true,
          sortedFrom: n - p,
          pass: p + 1,
          comparisons,
          swaps,
          note: `Swapped. ${L[i + 1]} moves one place to the right.`,
        });
      }
    }
    frames.push({
      list: [...L],
      compare: null,
      swapped: false,
      sortedFrom: n - p - 1,
      pass: p + 1,
      comparisons,
      swaps,
      note: `End of pass ${p + 1}. ${L[n - 1 - p]} has bubbled to its final position.`,
    });
    if (!didSwap) {
      frames.push({
        list: [...L],
        compare: null,
        swapped: false,
        sortedFrom: 0,
        pass: p + 1,
        comparisons,
        swaps,
        note: "A whole pass with no swaps — the list is already sorted, so we can stop early.",
      });
      return frames;
    }
  }

  frames.push({
    list: [...L],
    compare: null,
    swapped: false,
    sortedFrom: 0,
    pass: n - 1,
    comparisons,
    swaps,
    note: `Sorted after ${n - 1} passes, ${comparisons} comparisons and ${swaps} swaps.`,
  });
  return frames;
}

const randomList = () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);

export function SortVisualiser() {
  const [input, setInput] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frames = useMemo(() => buildSortFrames(input), [input]);
  const frame = frames[Math.min(i, frames.length - 1)];
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setI((v) => {
        if (v >= frames.length - 1) {
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, 620);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, frames.length]);

  const max = Math.max(...frame.list);

  return (
    <WidgetShell
      title="Bubble sort, step by step"
      subtitle="Watch the largest value bubble to the end on every pass"
      controls={
        <>
          <CtrlButton onClick={() => setPlaying((p) => !p)} primary>
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
            {playing ? "Pause" : "Play"}
          </CtrlButton>
          <CtrlButton
            onClick={() => {
              setPlaying(false);
              setI((v) => Math.min(frames.length - 1, v + 1));
            }}
            disabled={i >= frames.length - 1}
            label="Next step"
          >
            <SkipForward className="size-3.5" />
            Step
          </CtrlButton>
          <CtrlButton
            onClick={() => {
              setPlaying(false);
              setI(0);
            }}
            label="Restart"
          >
            <RotateCcw className="size-3.5" />
            Restart
          </CtrlButton>
          <CtrlButton
            onClick={() => {
              setPlaying(false);
              setI(0);
              setInput(randomList());
            }}
            label="New random list"
          >
            <Shuffle className="size-3.5" />
            Shuffle
          </CtrlButton>
          <div className="flex-1" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-subtle">
            pass {frame.pass} · {frame.comparisons} comparisons · {frame.swaps} swaps
          </span>
        </>
      }
    >
      <div className="flex h-44 justify-center gap-1.5 sm:gap-2.5">
        {frame.list.map((v, idx) => {
          const comparing = frame.compare?.includes(idx);
          const sorted = idx >= frame.sortedFrom;
          return (
            <motion.div
              key={`${idx}-${v}`}
              layout
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex h-full min-w-0 flex-1 flex-col items-center gap-1"
              style={{ maxWidth: 56 }}
            >
              {/* The bar area needs a definite height of its own, otherwise the
                  bar's percentage height has nothing to resolve against. */}
              <div className="flex w-full flex-1 items-end">
                <motion.div
                  animate={{
                    height: `${Math.max(6, (v / max) * 100)}%`,
                    scale: frame.swapped && comparing ? 1.06 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className={cn(
                    "w-full rounded-t-md",
                    sorted
                      ? "bg-success-500"
                      : comparing
                        ? frame.swapped
                          ? "bg-danger-500"
                          : "bg-accent-500"
                        : "bg-[var(--brand)]",
                  )}
                />
              </div>
              <span
                className={cn(
                  "shrink-0 font-[family-name:var(--font-mono)] text-[11px] tabular-nums",
                  comparing ? "font-bold text-ink" : "text-muted",
                )}
              >
                {v}
              </span>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-3 min-h-10 rounded-lg bg-sunken px-3 py-2 text-[12.5px] leading-snug text-muted">
        {frame.note}
      </p>

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-subtle">
        <Legend colour="bg-[var(--brand)]" label="unsorted" />
        <Legend colour="bg-accent-500" label="comparing" />
        <Legend colour="bg-danger-500" label="swapping" />
        <Legend colour="bg-success-500" label="in final position" />
      </div>
    </WidgetShell>
  );
}

const Legend = ({ colour, label }: { colour: string; label: string }) => (
  <span className="flex items-center gap-1.5">
    <span className={cn("size-2.5 rounded-sm", colour)} />
    {label}
  </span>
);

/* ── sequential search ───────────────────────────────────────────────────── */

export function SearchVisualiser() {
  const [list] = useState([34, 12, 89, 5, 67, 23, 41]);
  const [target, setTarget] = useState(67);
  const [pos, setPos] = useState(-1);
  const [done, setDone] = useState<null | "found" | "missing">(null);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    setPos(-1);
    setDone(null);
    setPlaying(false);
  };

  const stepOnce = () => {
    setPos((p) => {
      if (done) return p;
      const next = p + 1;
      if (next >= list.length) {
        setDone("missing");
        setPlaying(false);
        return p;
      }
      if (list[next] === target) {
        setDone("found");
        setPlaying(false);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!playing) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(stepOnce, 700);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, done, target]);

  const comparisons = pos + 1;

  return (
    <WidgetShell
      title="Sequential search"
      subtitle="Check every item in turn until you find it — or run out"
      controls={
        <>
          <CtrlButton onClick={() => setPlaying((p) => !p)} disabled={Boolean(done)} primary>
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
            {playing ? "Pause" : "Search"}
          </CtrlButton>
          <CtrlButton onClick={stepOnce} disabled={Boolean(done)} label="Next comparison">
            <SkipForward className="size-3.5" />
            Step
          </CtrlButton>
          <CtrlButton onClick={reset} label="Reset">
            <RotateCcw className="size-3.5" />
            Reset
          </CtrlButton>
          <div className="flex-1" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-subtle">
            {comparisons} comparison{comparisons === 1 ? "" : "s"}
          </span>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-[12.5px] text-muted">
          <Search className="size-3.5" />
          Looking for
        </label>
        <select
          value={target}
          onChange={(e) => {
            setTarget(Number(e.target.value));
            reset();
          }}
          className="rounded-lg border border-line bg-surface px-2 py-1 font-[family-name:var(--font-mono)] text-[13px]"
        >
          {[...list, 99].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <span className="text-[11.5px] text-subtle">(99 is not in the list)</span>
      </div>

      <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-1">
        {list.map((v, idx) => {
          const checked = idx < pos || (idx === pos && done !== null);
          const active = idx === pos;
          const isHit = active && done === "found";
          return (
            <div key={idx} className="flex shrink-0 flex-col items-center gap-1">
              <motion.div
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cn(
                  "grid size-11 place-items-center rounded-lg border-2 font-[family-name:var(--font-mono)] text-[13px] font-semibold transition-colors",
                  isHit
                    ? "border-success-500 bg-success-soft text-success-soft-fg"
                    : active
                      ? "border-accent-500 bg-accent-soft text-accent-soft-fg"
                      : checked
                        ? "border-line bg-sunken text-subtle line-through"
                        : "border-line bg-surface",
                )}
              >
                {v}
              </motion.div>
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-subtle">
                {idx}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 min-h-10 rounded-lg bg-sunken px-3 py-2 text-[12.5px] leading-snug text-muted">
        {done === "found"
          ? `Found ${target} at position ${pos} after ${comparisons} comparison${comparisons === 1 ? "" : "s"}.`
          : done === "missing"
            ? `Checked all ${list.length} items — ${target} is not in the list. This is the worst case: n comparisons.`
            : pos < 0
              ? "Press Search. The algorithm starts at position 0 and checks each item in turn."
              : `Position ${pos}: is ${list[pos]} equal to ${target}? ${list[pos] === target ? "Yes." : "No — move to the next item."}`}
      </p>
    </WidgetShell>
  );
}
