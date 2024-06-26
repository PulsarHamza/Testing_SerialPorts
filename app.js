// Function to fetch, edit, cache, and display XML
async function fetchAndEditXML() {
  try {
    const response = await fetch("./data/runtime.xml"); // Path to your XML file
    let xmlText = await response.text();

    // Edit XML content (for demonstration, appending a timestamp)
    const timestamp = new Date().toLocaleString();
    xmlText += `\n<!-- Updated at ${timestamp} -->`;

    // Display edited XML content
    document.getElementById("xmlData").textContent = xmlText;

    // Cache the edited XML using the service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const cacheRequest = new Request("./data/runtime.xml", { method: "GET" });
      const cacheResponse = new Response(xmlText, { headers: { "Content-Type": "application/xml" } });

      caches.open(CACHE_NAME).then((cache) => {
        cache.put(cacheRequest, cacheResponse);
      });
    }
  } catch (error) {
    console.error("Error fetching XML:", error);
  }
}

// Function to download cached XML
function downloadXML() {
  const downloadUrl = "./data/runtime.xml"; // URL of the XML file to download

  // Create a temporary anchor element for downloading
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = downloadUrl;
  anchor.download = "runtime.xml"; // Filename for the downloaded file

  // Append anchor to body and click it programmatically
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up: remove the anchor from the body
  document.body.removeChild(anchor);

  // Alert to show where the XML file is served from
  showAlert(downloadUrl);
}

// Function to show alerts based on where the XML file is served from
function showAlert(url) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.controller.postMessage({
      command: "checkCache",
      url: url,
    });
  } else {
    alert("Service Worker not supported");
  }
}
