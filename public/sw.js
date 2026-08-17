/* ============================================================================
 * Service worker: the part that makes this usable on unreliable data.
 *
 * Strategy per resource:
 *   • Python runtime (/pyodide/*): cache first, forever. It is 13 MB and it
 *     never changes for a given build, so a student pays for it once.
 *   • Build assets (/_next/static/*): cache first, content-hashed filenames.
 *   • Pages: network first, falling back to cache so lessons already visited
 *     still open with no signal at all.
 * ==========================================================================*/

const VERSION = "c9-v2";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const PYODIDE_CACHE = `${VERSION}-pyodide`;
const PAGE_CACHE = `${VERSION}-pages`;

const SHELL = ["/", "/learn", "/practice", "/playground", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // A missing entry must not abort the whole install.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const hit = await cache.match(request);
    if (hit) return hit;
    const shell = await caches.open(SHELL_CACHE);
    const root = await shell.match("/");
    if (root) return root;
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache the dev server's hot-reload traffic.
  if (url.pathname.startsWith("/_next/webpack") || url.pathname.includes("__nextjs")) return;

  if (url.pathname.startsWith("/pyodide/")) {
    event.respondWith(cacheFirst(request, PYODIDE_CACHE));
    return;
  }
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGE_CACHE));
    return;
  }
  if (url.pathname === "/pyodide-worker.js" || url.pathname.endsWith(".svg") || url.pathname.endsWith(".png")) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
  }
});
