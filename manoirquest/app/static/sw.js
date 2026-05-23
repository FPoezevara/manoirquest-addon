// ManoirQuest Service Worker — v0.1
const CACHE = 'manoirquest-v1';

// Assets à mettre en cache offline
const PRECACHE = [
  '/',
  '/login',
  '/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // On ne cache que les GET ; les POST/actions SvelteKit passent normalement
  if (e.request.method !== 'GET') return;

  // Stratégie : network-first pour les pages, cache-first pour les assets statiques
  const url = new URL(e.request.url);
  const isStatic = url.pathname.startsWith('/_app/') || url.pathname.startsWith('/icons/');

  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then(cached => cached ?? fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
  } else {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});
