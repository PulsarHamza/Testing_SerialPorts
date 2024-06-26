// Service Worker to cache and serve XML file

// Cache name
const CACHE_NAME = 'xml-cache-v1';

// URLs to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/sample.xml' // Path to your XML file
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Serve the XML file from cache
  if (requestUrl.pathname.endsWith('/sample.xml')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            // XML found in cache
            console.log('Serving XML from cache');
            return response;
          } else {
            // XML not in cache, fetch from network
            console.log('Fetching XML from network');
            return fetch(event.request).then(networkResponse => {
              // Cache the fetched XML
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
        });
      })
    );
  } else {
    // For other requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
