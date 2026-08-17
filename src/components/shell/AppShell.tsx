"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  GraduationCap,
  Terminal,
  Dumbbell,
  BarChart3,
  Flame,
  Moon,
  Sun,
  Wrench,
  Layers,
  FileText,
  Search,
} from "lucide-react";
import { cn, levelLabel } from "@/lib/utils";
import { useProgress, levelFromXp } from "@/lib/store/progress";
import { CommandPalette } from "./CommandPalette";
import { RuntimeBadge } from "./RuntimeBadge";

const PRIMARY_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/playground", label: "Code", icon: Terminal },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

const SECONDARY_NAV = [
  { href: "/toolbox", label: "Visual toolbox", icon: Wrench },
  { href: "/revise", label: "Revision cards", icon: Layers },
  { href: "/exam", label: "Exam room", icon: FileText },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrate = useProgress((s) => s.hydrate);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The lesson reader and playground manage their own full-height layout.
  const immersive = pathname.startsWith("/playground");

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <DesktopSidebar pathname={pathname} onSearch={() => setPaletteOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar onSearch={() => setPaletteOpen(true)} />
        <main
          className={cn(
            "min-w-0 flex-1",
            !immersive && "pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0",
          )}
        >
          {children}
        </main>
      </div>

      <MobileTabBar pathname={pathname} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

/* ── desktop rail ────────────────────────────────────────────────────────── */

function DesktopSidebar({ pathname, onSearch }: { pathname: string; onSearch: () => void }) {
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak);
  const { level, into, need } = useMemo(() => levelFromXp(xp), [xp]);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <Mark />
        <div className="leading-tight">
          <p className="font-[family-name:var(--font-display)] text-[15px] font-semibold">
            Competency 9
          </p>
          <p className="text-[11px] text-subtle">A/L ICT · Python</p>
        </div>
      </Link>

      <button
        onClick={onSearch}
        className="mx-3 mb-3 flex items-center gap-2 rounded-xl border border-line bg-page px-3 py-2 text-left text-[13px] text-subtle transition-colors hover:border-line-strong hover:text-muted"
      >
        <Search className="size-3.5" />
        <span className="flex-1">Search lessons…</span>
        <kbd className="rounded border border-line px-1 font-[family-name:var(--font-mono)] text-[10px]">
          ⌘K
        </kbd>
      </button>

      <nav className="scrollbar-slim flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavRow key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </ul>

        <p className="px-3 pb-1.5 pt-5 text-[10px] font-semibold uppercase tracking-widest text-subtle">
          Tools
        </p>
        <ul className="space-y-0.5">
          {SECONDARY_NAV.map((item) => (
            <NavRow key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        <div className="rounded-xl bg-page p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-semibold">
              Level {level}
              <span className="ml-1.5 font-normal text-subtle">{levelLabel(level)}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-accent-soft-fg">
              <Flame className="size-3" />
              {streak}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-sunken">
            <motion.div
              className="h-full rounded-pill bg-[var(--brand)]"
              initial={{ width: 0 }}
              animate={{ width: `${(into / need) * 100}%` }}
              transition={{ type: "spring", stiffness: 110, damping: 20 }}
            />
          </div>
          <p className="mt-1.5 text-[10.5px] tabular-nums text-subtle">
            {into} / {need} XP to level {level + 1}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <RuntimeBadge />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

function NavRow({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
          active ? "text-[var(--brand)]" : "text-muted hover:bg-hover hover:text-ink",
        )}
      >
        {active && (
          <motion.span
            layoutId="nav-active"
            className="absolute inset-0 rounded-lg bg-brand-soft"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <Icon className="relative z-10 size-4" />
        <span className="relative z-10">{label}</span>
      </Link>
    </li>
  );
}

/* ── mobile ──────────────────────────────────────────────────────────────── */

function MobileTopBar({ onSearch }: { onSearch: () => void }) {
  const streak = useProgress((s) => s.streak);
  const xp = useProgress((s) => s.xp);
  const { level } = useMemo(() => levelFromXp(xp), [xp]);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line surface-blur px-4 py-2.5 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <Mark size={26} />
        <span className="font-[family-name:var(--font-display)] text-[14px] font-semibold">
          Competency 9
        </span>
      </Link>
      <div className="flex-1" />
      <span className="flex items-center gap-1 rounded-pill bg-accent-soft px-2 py-1 text-[11px] font-bold text-accent-soft-fg">
        <Flame className="size-3" />
        {streak}
      </span>
      <span className="rounded-pill bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand-soft-fg">
        Lv {level}
      </span>
      <button
        onClick={onSearch}
        aria-label="Search"
        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-hover"
      >
        <Search className="size-4" />
      </button>
      <ThemeToggle />
    </header>
  );
}

function MobileTabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line surface-blur pb-safe lg:hidden">
      <ul className="flex items-stretch">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-[var(--brand)]" : "text-subtle",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="tab-active"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-pill bg-[var(--brand)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon className={cn("size-[19px] transition-transform", active && "scale-110")} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ── bits ────────────────────────────────────────────────────────────────── */

/**
 * The platform mark: a Python prompt followed by the numeral 9.
 *
 * The chevron is doing real work: a nine on its own is the same shape as a
 * lowercase q, and reads as one the moment it loses the prompt beside it.
 */
function Mark({ size = 30 }: { size?: number }) {
  const gradientId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className="shrink-0"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="115" fill={`url(#${gradientId})`} />
      <path
        d="M154 196 L212 256 L154 316"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="319" cy="218" r="39" fill="none" stroke="#ffffff" strokeWidth="34" />
      <rect x="341" y="218" width="34" height="132" rx="17" fill="#ffffff" />
    </svg>
  );
}

export function ThemeToggle() {
  const theme = useProgress((s) => s.theme);
  const setTheme = useProgress((s) => s.setTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Keep the DOM, the store and the pre-paint localStorage mirror in step.
  useEffect(() => {
    if (!mounted) return;
    const dark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("al-theme", theme);
  }, [theme, mounted]);

  const isDark =
    mounted &&
    (theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches));

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-hover hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -35, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 35, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.16 }}
          className="block"
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
