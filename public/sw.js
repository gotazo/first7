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
// Request Type Helpers
// ======================================================

function isHTML(request) {
  return (
    request.destination === "" ||
    request.destination === "document"
  );
}

function isImage(request) {
  return request.destination === "image";
}

function isStyle(request) {
  return request.destination === "style";
}

function isScript(request) {
  return request.destination === "script";
}

function isFont(request) {
  return request.destination === "font";
}

function isAsset(request) {
  return (
    isStyle(request) ||
    isScript(request) ||
    isFont(request)
  );
}

// ======================================================
// Caching Strategies
// ======================================================

async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.status === 200) {
      const copy = response.clone();

      let cacheName = CACHE.pages;

      if (isAsset(request)) {
        cacheName = CACHE.assets;
      } else if (isImage(request)) {
        cacheName = CACHE.images;
      }

      const cache = await caches.open(cacheName);
      await cache.put(request, copy);
    }

    return response;
  } catch {
    const cached = await caches.match(request);

    if (cached) {
      return cached;
    }

    if (request.mode === "navigate") {
      return caches.match(OFFLINE_URL);
    }

    return Response.error();
  }
}

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

  event.respondWith(networkFirst(event.request));