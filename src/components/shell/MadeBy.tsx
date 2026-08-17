import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
 * Author credit.
 *
 * lucide dropped its brand glyphs, so the three marks are inlined. They are
 * `currentColor` so they follow the surrounding text through both themes.
 * ==========================================================================*/

const LINKS = [
  {
    label: "Sahan Perera on LinkedIn",
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/sahan-perera-64183b204/",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM2.4 21.5h5.16V9.75H2.4V21.5zM10.2 9.75V21.5h5.15v-6.5c0-1.72.33-3.39 2.46-3.39 2.1 0 2.13 1.97 2.13 3.5v6.39h5.16v-7.42c0-4.47-.97-7.16-5.2-7.16-2.03 0-3.4 1.11-3.95 2.17h-.08V9.75H10.2z",
  },
  {
    label: "Sahan Perera on Instagram",
    name: "Instagram",
    href: "https://www.instagram.com/sahan._perera/",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zm0 6.18a3.66 3.66 0 1 0 0 7.32 3.66 3.66 0 0 0 0-7.32zm0 6.03a2.38 2.38 0 1 1 0-4.75 2.38 2.38 0 0 1 0 4.75zm4.66-6.17a.86.86 0 1 1-1.71 0 .86.86 0 0 1 1.71 0z",
  },
  {
    label: "Sahan Perera on GitHub",
    name: "GitHub",
    href: "https://github.com/Sahan-Madusanka-Perera",
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z",
  },
];

export function MadeBy({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <p className="flex items-center gap-1 text-[11px] text-subtle">
        Made with
        <Heart className="size-3 fill-current text-danger-500" aria-label="love" />
        by
        <span className="font-medium text-muted">Sahan Perera</span>
      </p>
      <ul className="flex items-center gap-1">
        {LINKS.map((l) => (
          <li key={l.name}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={l.label}
              title={l.name}
              className="flex size-7 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-hover hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
                {/* evenodd so the ring shapes (Instagram's lens) stay hollow */}
                <path d={l.path} fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
