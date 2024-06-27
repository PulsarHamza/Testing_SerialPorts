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
  const form = document.createElement("form");
  form.style.display = "none"; // Hide the form

  // Specify the URL of the XML file to download
  form.action = "./sample.xml"; // Replace with your XML file URL

  // Set method as 'GET' or 'POST' depending on your server setup
  form.method = "GET";

  // Append the form to the document body
  document.body.appendChild(form);

  // Submit the form
  form.submit();

  // Clean up: remove the form from the body after submission
  document.body.removeChild(form);
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
