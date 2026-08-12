"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Button ──────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand)] text-[var(--brand-fg)] hover:brightness-110 active:brightness-95 shadow-sm",
  secondary: "bg-brand-soft text-brand-soft-fg hover:brightness-105",
  ghost: "text-muted hover:bg-hover hover:text-ink",
  outline: "border border-line-strong text-ink hover:bg-hover",
  danger: "bg-danger-500 text-white hover:brightness-110",
  success: "bg-success-500 text-white hover:brightness-110",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, icon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all select-none",
        "disabled:opacity-45 disabled:pointer-events-none active:scale-[0.98]",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner className="size-4" /> : icon}
      {children}
    </button>
  );
});

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card", className)} {...rest}>
      {children}
    </div>
  );
}

/* ── Chip ────────────────────────────────────────────────────────────────── */

const CHIP_TONES = {
  neutral: "bg-sunken text-muted",
  brand: "bg-brand-soft text-brand-soft-fg",
  success: "bg-success-soft text-success-soft-fg",
  danger: "bg-danger-soft text-danger-soft-fg",
  warn: "bg-accent-soft text-accent-soft-fg",
  info: "bg-info-soft text-info-soft-fg",
} as const;

export function Chip({
  tone = "neutral",
  className,
  children,
  icon,
}: {
  tone?: keyof typeof CHIP_TONES;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        CHIP_TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/* ── Progress ────────────────────────────────────────────────────────────── */

export function ProgressBar({
  value,
  max = 100,
  className,
  tone = "brand",
  showLabel,
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "brand" | "success" | "accent";
  showLabel?: boolean;
}) {
  const p = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const bg =
    tone === "success"
      ? "bg-success-500"
      : tone === "accent"
        ? "bg-accent-500"
        : "bg-[var(--brand)]";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-sunken">
        <motion.div
          className={cn("h-full rounded-pill", bg)}
          initial={{ width: 0 }}
          animate={{ width: `${p}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-muted">
          {Math.round(p)}%
        </span>
      )}
    </div>
  );
}

export function ProgressRing({
  value,
  max = 100,
  size = 56,
  stroke = 5,
  className,
  children,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-sunken)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - p) }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ── Segmented control ───────────────────────────────────────────────────── */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "md",
}: {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  const id = React.useId();
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex gap-1 rounded-xl bg-sunken p-1",
        size === "sm" ? "text-[12px]" : "text-[13px]",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative rounded-lg font-medium transition-colors",
              size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5",
              active ? "text-ink" : "text-subtle hover:text-muted",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-lg bg-surface shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Sheet / modal ───────────────────────────────────────────────────────── */

export function Sheet({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
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
            className={cn(
              "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-surface shadow-lg sm:rounded-2xl",
              wide ? "sm:max-w-3xl" : "sm:max-w-lg",
            )}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {title && (
              <header className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-[15px] font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-subtle transition-colors hover:bg-hover hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </header>
            )}
            <div className="scrollbar-slim flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Toast ───────────────────────────────────────────────────────────────── */

export interface ToastItem {
  id: number;
  title: string;
  body?: string;
  icon?: React.ReactNode;
  tone?: "brand" | "success" | "danger";
}

let pushToastFn: ((t: Omit<ToastItem, "id">) => void) | null = null;

export function toast(t: Omit<ToastItem, "id">) {
  pushToastFn?.(t);
}

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  useEffect(() => {
    pushToastFn = (t) => {
      const id = ++seq.current;
      setItems((cur) => [...cur, { ...t, id }]);
      setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== id)), 4200);
    };
    return () => {
      pushToastFn = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lg",
              t.tone === "success" && "border-success-500/30",
              t.tone === "danger" && "border-danger-500/30",
            )}
          >
            {t.icon && <div className="mt-0.5 shrink-0">{t.icon}</div>}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">{t.title}</p>
              {t.body && <p className="mt-0.5 text-[13px] leading-snug text-muted">{t.body}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Misc ────────────────────────────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {icon && <div className="text-subtle">{icon}</div>}
      <h3 className="text-[15px] font-semibold">{title}</h3>
      {body && <p className="max-w-sm text-sm leading-relaxed text-muted">{body}</p>}
      {action}
    </div>
  );
}
