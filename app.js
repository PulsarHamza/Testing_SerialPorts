function fetchXML() {
  fetch("./sample.xml")
    .then((response) => response.text())
    .then((xml) => {
      const status = document.getElementById("status");
      const isEdited = xml.includes("<edited>true</edited>");

      if (isEdited) {
        alert("Edited XML");
        status.textContent = "Status: (Edited)";
      } else {
        alert("Unedited XML");
        status.textContent = "Status: (Unedited)";
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
          return cache.put("./sample.xml", editedResponse).then(() => {
            console.log("Edited XML cached");
            alert("XML edited successfully");
          });
        })
        .catch((error) => console.error("Error caching edited XML:", error));
    })
    .catch((error) => console.error("Error editing XML:", error));
}

async function downloadXML() {
  // Check if the file is cached
  caches.open("xml-cache-v1").then((cache) => {
    cache.match("./sample.xml").then((response) => {
      if (response) {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "filename.extension"; // Specify the filename
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        console.error("File not found in cache");
      }
    });
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
