// Function to fetch and edit XML
async function fetchAndEditXML() {
  try {
    const response = await fetch('./data/runtime.xml'); // Path to your XML file
    let xmlText = await response.text();

    // Edit XML content (for demonstration, appending a timestamp)
    const timestamp = new Date().toLocaleString();
    xmlText += `\n<!-- Updated at ${timestamp} -->`;

    // Display edited XML content
    document.getElementById('xmlData').textContent = xmlText;

    // Cache the edited XML using the service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        command: 'cacheXML',
        url: './data/reflect-e_0.1.7_default.xml', // URL to cache (same as fetch URL)
        content: xmlText // Edited XML content to cache
      });
    }
  } catch (error) {
    console.error('Error fetching XML:', error);
  }
}
// Function to download cached XML
function downloadXML() {
  const form = document.createElement('form');
  form.style.display = 'none'; // Hide the form

  // Specify the URL of the XML file to download (cache URL)
  form.action = './data/runtime.xml'; // Replace with the cached XML file URL

  // Set method as 'GET' or 'POST' depending on your server setup
  form.method = 'GET';

  // Append the form to the document body
  document.body.appendChild(form);

  // Submit the form
  form.submit();

  // Clean up: remove the form from the body after submission
  document.body.removeChild(form);
}

