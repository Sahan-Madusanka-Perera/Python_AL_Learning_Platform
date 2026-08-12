import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { ToastHost } from "@/components/ui/primitives";
import { ThemeScript } from "@/components/shell/ThemeScript";
import { PWA } from "@/components/shell/PWA";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Competency 9 — A/L Python",
    template: "%s · Competency 9",
  },
  description:
    "Learn the complete G.C.E. A/L ICT Competency 9 syllabus — algorithms, flow charts, Python, data structures, files, databases, searching and sorting. Runs real Python in your browser, on any phone.",
  applicationName: "Competency 9",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Competency 9",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d1a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${mono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <ToastHost />
        <PWA />
      </body>
    </html>
  );
}
