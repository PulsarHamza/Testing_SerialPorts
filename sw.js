const CACHE_NAME = "xml-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./sample.xml", // Path to your XML file
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.console.log("Installed!");
});

// // Fetch event
// self.addEventListener("fetch", (event) => {
//   const requestUrl = new URL(event.request.url);

//   if (requestUrl.pathname.endsWith(".xml")) {
//     self.console.log("URL matched!");
//     event.respondWith(
//       caches.open(CACHE_NAME).then((cache) => {
//         return cache.match(event.request).then((response) => {
//           if (response) {
//             self.console.log("From cache!");
//             return response;
//           }
//         });
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         self.console.log("From network!");
//         return response || fetch(event.request);
//       })
//     );
//   }
// });

self.addEventListener("fetch", (event) => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method !== "GET") return;
  event.respondWith(
    (async () => {
      // Try to get the response from a cache.
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        // If we found a match in the cache, return it, but also
        // update the entry in the cache in the background.
        //event.waitUntil(cache.add(event.request));
        self.console.log("Cached response!");
        return cachedResponse;
      }

      // If we didn't find a match in the cache, use the network.
      self.console.log("Network response!");
      return fetch(event.request);
    })()
  );
});
