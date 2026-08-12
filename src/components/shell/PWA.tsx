"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X, WifiOff } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Registers the service worker and offers an install prompt.
 *
 * Installing matters more than usual here: an installed copy keeps the 13 MB
 * Python runtime cached, so the app opens and runs code with no connection.
 */
export function PWA() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline support is a bonus, never a blocker */
      });
    }

    setDismissed(localStorage.getItem("al-install-dismissed") === "1");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem("al-install-dismissed", "1");
  };

  return (
    <>
      <AnimatePresence>
        {offline && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed inset-x-0 top-0 z-[80] flex items-center justify-center gap-2 bg-accent-500 py-1.5 text-[12px] font-semibold text-[#3a2a08]"
          >
            <WifiOff className="size-3.5" />
            You are offline — lessons you have opened before still work
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deferred && !dismissed && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[65] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lg lg:bottom-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-[var(--brand)]">
              <Download className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold">Install for offline study</p>
              <p className="text-[11.5px] leading-snug text-muted">
                Keeps Python on your phone — works with no data
              </p>
            </div>
            <button
              onClick={install}
              className="shrink-0 rounded-lg bg-[var(--brand)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--brand-fg)]"
            >
              Install
            </button>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 rounded p-1 text-subtle hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
