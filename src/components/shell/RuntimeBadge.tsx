"use client";

import { useEffect, useState } from "react";
import { getRuntime, type RuntimeStatus } from "@/lib/python/runtime";
import { cn } from "@/lib/utils";

/** Small "is Python awake?" indicator: students should never wonder. */
export function RuntimeBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState<RuntimeStatus>({ state: "idle" });

  useEffect(() => {
    const unsubscribe = getRuntime().subscribe(setStatus);
    return () => {
      unsubscribe();
    };
  }, []);

  const dot =
    status.state === "ready"
      ? "bg-success-500"
      : status.state === "error"
        ? "bg-danger-500"
        : status.state === "booting"
          ? "bg-accent-500 animate-pulse"
          : "bg-[var(--fg-subtle)]";

  const label =
    status.state === "ready"
      ? `Python ${status.pythonVersion}`
      : status.state === "booting"
        ? "Starting…"
        : status.state === "error"
          ? "Python failed"
          : "Python idle";

  return (
    <span
      className={cn("flex items-center gap-1.5 text-[10.5px] font-medium text-subtle", className)}
      title={
        status.state === "ready" && !status.interactive
          ? "Interactive input is unavailable on this host: supply inputs before running."
          : label
      }
    >
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
