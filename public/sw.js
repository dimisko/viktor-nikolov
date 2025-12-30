// Service Worker for Skopje Confidential
const CACHE_NAME = 'skopje-confidential-v1';
const RUNTIME_CACHE = 'skopje-confidential-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (like CDN resources, fonts, etc.)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip service worker and manifest requests
  if (url.pathname.includes('/sw.js') || url.pathname.includes('/manifest.json')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(RUNTIME_CACHE).then((cache) => {
        return fetch(event.request).then((response) => {
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache successful responses (and only same-origin)
          if (response.status === 200 && response.type === 'basic') {
            cache.put(event.request, responseToCache);
          }
          
          return response;
        }).catch(() => {
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          // For other requests, return a simple offline response
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      });
    })
  );
});

// Handle background sync (if needed in the future)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Add background sync logic here if needed
      Promise.resolve()
    );
  }
});

