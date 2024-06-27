function fetchXML() {
  fetch("./sample.xml", { mode: "same-origin", cache: "only-if-cached" })
    .then((response) => response.text())
    .then((xml) => {
      const status = document.getElementById("status");
      const isEdited = xml.includes("<edited>true</edited>");

      if (isEdited) {
        alert("Edited XML");
        status.textContent = "Status: Served from cache (Edited)";
      } else {
        alert("Unedited XML");
        status.textContent = "Status: Served from cache (Unedited)";
      }
    })
    .catch((error) => {
      console.error("Error fetching XML:", error);
      alert("Error fetching XML");
      document.getElementById("status").textContent = "Status: Error fetching XML";
    });
}
function fetchXML_updated() {
  fetch("./sample1.xml", { mode: "same-origin", cache: "force-cache" })
    .then((response) => response.text())
    .then((xml) => {
      const status = document.getElementById("status");
      const isEdited = xml.includes("<edited>true</edited>");

      if (isEdited) {
        alert("Edited XML");
        status.textContent = "Status: Served from cache (Edited)";
      } else {
        alert("Unedited XML");
        status.textContent = "Status: Served from cache (Unedited)";
      }
    })
    .catch((error) => {
      console.error("Error fetching XML:", error);
      alert("Error fetching XML");
      document.getElementById("status").textContent = "Status: Error fetching XML";
    });
}

function editXML() {
  fetch("./sample.xml")
    .then((response) => response.text())
    .then((xml) => {
      const editedXml = xml.replace("<edited>false</edited>", "<edited>true</edited>");

      // Update the cache with the edited XML
      caches
        .open("xml-cache-v1")
        .then((cache) => {
          const editedResponse = new Response(editedXml, { headers: { "Content-Type": "application/xml" } });
          return cache.put("./sample1.xml", editedResponse).then(() => {
            console.log("Edited XML cached");
            alert("XML edited successfully");
          });
        })
        .catch((error) => console.error("Error caching edited XML:", error));
    })
    .catch((error) => console.error("Error editing XML:", error));
}
function check_cache() {
  // Check if "./sample1.xml" exists in the cache
  caches
    .open("xml-cache-v1")
    .then((cache) => {
      cache
        .has("./sample1.xml")
        .then((hasEntry) => {
          if (hasEntry) {
            console.log("./sample1.xml exists in the cache");
          } else {
            console.log("./sample1.xml does not exist in the cache");
          }
        })
        .catch((err) => {
          console.error("Error checking cache:", err);
        });
    })
    .catch((err) => {
      console.error("Error opening cache:", err);
    });
}
// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}
