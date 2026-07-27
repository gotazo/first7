// ======================================================
// First7 Service Worker
// Phase 2.4 - Caching Strategies
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
    caches.open(CACHE.assets).then((cache) => cache.addAll(PRECACHE))
  );

  self.skipWaiting();
});

// ======================================================
// Activate
// ======================================================

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !VALID_CACHES.includes(key))
          .map((key) => caches.delete(key))
      )
    )
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

// HTML - Network First
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cacheName = isImage(request)
        ? CACHE.images
        : isAsset(request)
          ? CACHE.assets
          : CACHE.pages;

      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
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

// Images - Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE.images);

  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return Response.error();
  }
}

// CSS / JS / Fonts - Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE.assets);

  // Return cached response immediately if available
  const cached = await cache.match(request);

  // Fetch a fresh copy in the background
  const networkFetch = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const response = await networkFetch;

  return response ?? Response.error();
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

  if (isImage(event.request)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (isAsset(event.request)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  event.respondWith(networkFirst(event.request));
});