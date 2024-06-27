function fetchXML() {
  fetch('/sample.xml')
    .then(response => response.text())
    .then(xml => {
      const status = document.getElementById('status');
      const isEdited = xml.includes('<edited>true</edited>');

      if (isEdited) {
        alert('Edited XML');
        status.textContent = 'Status: Served from cache (Edited)';
      } else {
        alert('Unedited XML');
        status.textContent = 'Status: Served from cache (Unedited)';
      }
    })
    .catch(error => {
      console.error('Error fetching XML:', error);
      alert('Error fetching XML');
      document.getElementById('status').textContent = 'Status: Error fetching XML';
    });
}

function editXML() {
  fetch('/sample.xml')
    .then(response => response.text())
    .then(xml => {
      const editedXml = xml.replace('<edited>false</edited>', '<edited>true</edited>');

      // Update the cache with the edited XML
      caches.open('xml-cache-v1')
        .then(cache => {
          const editedResponse = new Response(editedXml, { headers: { 'Content-Type': 'application/xml' } });
          cache.put('/sample.xml', editedResponse);
          console.log('Edited XML cached');
          alert('XML edited successfully');
        })
        .catch(error => console.error('Error caching edited XML:', error));
    })
    .catch(error => console.error('Error editing XML:', error));
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
