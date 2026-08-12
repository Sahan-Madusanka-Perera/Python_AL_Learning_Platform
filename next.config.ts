import type { NextConfig } from "next";

/**
 * Cross-origin isolation is required for SharedArrayBuffer, which is what makes
 * two things possible in this app:
 *   1. a real, blocking `input()` — the program pauses and waits for the student
 *   2. Ctrl-C style interrupts, so an accidental `while True:` can be stopped
 *
 * Every asset (Python runtime, fonts, icons) is served same-origin so that
 * `require-corp` never blocks anything.
 */
const crossOriginIsolation = [
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: crossOriginIsolation,
      },
      {
        // The Python runtime never changes for a given build — cache it hard.
        source: "/pyodide/:path*",
        headers: [
          ...crossOriginIsolation,
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
