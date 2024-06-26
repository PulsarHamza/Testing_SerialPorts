// Service Worker Script (sw.js)

// Define the cache name
const CACHE_NAME = "web-app-cache-v1";

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
