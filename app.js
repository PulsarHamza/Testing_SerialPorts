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
