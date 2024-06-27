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

function downloadXML() {
  const url = "./sample.xml"; // Replace with your XML file URL

  // Create an <a> element to trigger the download
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = url;

  // Set the download attribute and optionally specify a filename
  anchor.setAttribute("download", "sample.xml");

  // Append the anchor element to the document body
  document.body.appendChild(anchor);

  // Trigger the click event to initiate download
  anchor.click();

  // Clean up: remove the anchor from the body after download
  document.body.removeChild(anchor);
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
