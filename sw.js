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

    console.log('XML cached:', url);
  } else if (event.data.command === 'checkCache') {
    const { url } = event.data;
    const cacheRequest = new Request(url, { method: 'GET' });

    event.waitUntil(
      caches.match(cacheRequest).then(response => {
        if (response) {
          console.log('XML served from cache:', url);
        } else {
          console.log('XML served from network:', url);
        }
      })
    );
  }
});

// Fetch event: Serve from cache or fetch from network
self.addEventListener("fetch", (event) => {
  // Intercept fetch requests for the XML file
  if (event.request.url.endsWith("/data/runtime.xml")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // If found in cache, return the cached response
        if (cachedResponse) {
          console.log("Response served from cache:", event.request.url);
          return cachedResponse;
        }

        // If not found in cache, fetch it from the network
        return fetch(event.request).then((networkResponse) => {
          console.log("Response fetched from network:", event.request.url);

          // Clone the response as caches.put consumes the response body
          let cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Cache the fetched response
            cache.put(event.request, cacheCopy);
          });

          // Return the network response
          return networkResponse;
        }).catch((error) => {
          // Handle fetch errors
          console.error("Fetch error:", error);
        });
      })
    );
  } else {
    // For other requests, respond normally
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
