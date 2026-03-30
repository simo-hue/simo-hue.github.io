// Simone Mattioli Portfolio - Enhanced PWA Service Worker
// Uses Workbox 6 for smart caching strategies

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js"
);

const CACHE_VERSION = "v1.1.0";
const OFFLINE_URL = "/offline/";

workbox.setConfig({ debug: false });

// ── Precache core app shell ─────────────────────────────────────────────────
workbox.core.setCacheNameDetails({
  prefix: "simo-portfolio",
  suffix: CACHE_VERSION,
});

// ── Images: NetworkFirst (always try fresh, fallback to cache) ──────────────
workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.NetworkFirst({
    cacheName: `simo-images-${CACHE_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// ── CSS & JS: StaleWhileRevalidate (instant load, refresh in BG) ────────────
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `simo-assets-${CACHE_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// ── Fonts: CacheFirst (fonts don't change) ──────────────────────────────────
workbox.routing.registerRoute(
  ({ request }) => request.destination === "font",
  new workbox.strategies.CacheFirst({
    cacheName: `simo-fonts-${CACHE_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// ── HTML Pages: NetworkFirst with offline fallback ──────────────────────────
workbox.routing.registerRoute(
  ({ request }) => request.destination === "document",
  new workbox.strategies.NetworkFirst({
    cacheName: `simo-pages-${CACHE_VERSION}`,
    networkTimeoutSeconds: 5,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 3 * 24 * 60 * 60, // 3 days
      }),
    ],
  })
);

// ── Offline Fallback ─────────────────────────────────────────────────────────
// When a page is not in cache and network is unavailable, show offline page
self.addEventListener("fetch", (event) => {
  if (event.request.destination === "document") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL) || caches.match("/");
      })
    );
  }
});
