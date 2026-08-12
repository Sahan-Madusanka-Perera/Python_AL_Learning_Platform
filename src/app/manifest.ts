import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Competency 9 — A/L Python",
    short_name: "Competency 9",
    description:
      "The complete G.C.E. A/L ICT Competency 9 course, with real Python running in your browser.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0d1a",
    theme_color: "#4f46e5",
    categories: ["education"],
    lang: "en",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Playground", short_name: "Code", url: "/playground" },
      { name: "Practice labs", short_name: "Practice", url: "/practice" },
      { name: "Revision cards", short_name: "Revise", url: "/revise" },
    ],
  };
}
