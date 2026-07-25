// ======================================================
// First7 Service Worker
// Phase 2.1 - Refactored Architecture
// ======================================================

const CACHE_VERSION = "v2";

const CACHE = {
  pages: `first7-pages-${CACHE_VERSION}`,
  assets: `first7-assets-${CACHE_VERSION}`,
  images: `first7-images-${CACHE_VERSION}`,
};

const VALID_CACHES = Object.values(CACHE);

const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ======================================================
// Install
// ======================================================

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE.assets).then((cache) => {
      return cache.addAll(PRECACHE);
    })
  );

  self.skipWaiting();
});

// ======================================================
// Activate
// ======================================================

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !VALID_CACHES.includes(key))
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// ======================================================
// Fetch
// ======================================================

self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Ignore third-party requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (response.status === 200) {
          const copy = response.clone();

          let cacheName = CACHE.pages;

          switch (event.request.destination) {
            case "style":
            case "script":
            case "font":
              cacheName = CACHE.assets;
              break;

            case "image":
              cacheName = CACHE.images;
              break;

            default:
              cacheName = CACHE.pages;
          }

          caches.open(cacheName).then((cache) => {
            cache.put(event.request, copy);
          });
        }

        return response;
      })
      .catch(async () => {
        // Return cached resource if available
        const cached = await caches.match(event.request);

        if (cached) {
          return cached;
        }

        // Show offline page only for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }

        return Response.error();
      })
  );
});