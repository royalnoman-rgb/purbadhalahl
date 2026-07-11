self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // A minimal fetch handler to satisfy PWA requirements
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
