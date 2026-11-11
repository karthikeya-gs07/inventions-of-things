// Service worker: makes the app installable and usable offline.
// The two constants below are filled in by the build (see vite.config.js).
// All paths are relative to this file, so the app can live under any subpath.
const VERSION = '__SW_VERSION__';
const PRECACHE = self.__PRECACHE__ || [];

const SHELL = `shell-${VERSION}`;
const PORTRAITS = 'portraits-v1'; // inventor photos + their lookups, kept across app updates

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('shell-') && k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// The page asks the waiting worker to take over when the user accepts an update.
self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

const isFont = (url) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

const isPortrait = (url) =>
  (url.hostname === 'en.wikipedia.org' && url.pathname.startsWith('/api/rest_v1/page/summary/')) ||
  url.hostname === 'upload.wikimedia.org';

// Serve from cache, refresh in the background.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fresh = fetch(request)
    .then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  return cached || (await fresh) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (isFont(url)) {
    event.respondWith(staleWhileRevalidate(request, 'fonts-v1'));
    return;
  }
  if (isPortrait(url)) {
    event.respondWith(staleWhileRevalidate(request, PORTRAITS));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Page loads: always try the network first so a new deploy is picked up at once
  // (and an old page never asks for files the host has since deleted).
  // Offline, fall back to the cached app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('index.html', { ignoreVary: true }).then((cached) => cached || Response.error())
      )
    );
    return;
  }

  // Built files are precached and content-hashed, so the cache is always right.
  // ignoreVary: module scripts are requested with different headers than the precache used.
  event.respondWith(caches.match(request, { ignoreVary: true }).then((cached) => cached || fetch(request)));
});
