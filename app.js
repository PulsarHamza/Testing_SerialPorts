const CACHE_NAME = "web-app-cache-v1";

// Function to fetch, edit, cache, and display XML
async function fetchAndEditXML() {
  try {
    const response = await fetch("./data/runtime.xml"); // Path to your XML file
    let xmlText = await response.text();

    // Edit XML content (for demonstration, appending a timestamp)
    const timestamp = new Date().toLocaleString();
    xmlText += `\n<!-- Updated at ${timestamp} -->`;

    // Log edit done
    alert("XML edit done");

    // Cache the edited XML using service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      // Send message to service worker to cache the edited XML
      navigator.serviceWorker.controller.postMessage({
        command: "cacheXML",
        url: "./data/runtime.xml",
        content: xmlText,
      });

      // After caching, update the displayed XML content
      document.getElementById("xmlData").textContent = xmlText;
    } else {
      console.error("Service Worker not supported");
    }
  } catch (error) {
    alert("Error fetching XML:", error);
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
}

// Register service worker if supported
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
} else {
  console.warn("Service Worker is not supported by this browser");
}
