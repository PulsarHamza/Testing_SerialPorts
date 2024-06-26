// Service Worker Script (sw.js)

// Define the cache name
const CACHE_NAME = "web-app-cache-v1";

// Listen for messages from clients (app.js)
self.addEventListener('message', event => {
  if (event.data.command === 'cacheXML') {
    const { url, content } = event.data;
    const request = new Request(url, { method: 'GET' });
    const response = new Response(content, { headers: { 'Content-Type': 'application/xml' } });

    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.put(request, response))
    );
  }
});

// Fetch event: Serve from cache or fetch from network
self.addEventListener("fetch", (event) => {
  // Intercept fetch requests for the XML file
  if (event.request.url.endsWith("/data/runtime.xml")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          // If found in cache, return it
          return response;
        }

        // Otherwise, fetch it from the network
        return fetch(event.request).then((networkResponse) => {
          // Clone the response as caches.put consumes the response body
          let cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Cache the fetched response
            cache.put(event.request, cacheCopy);
          });
          return networkResponse;
        });
      })
    );
  } else {
    // For other requests, respond normally
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
