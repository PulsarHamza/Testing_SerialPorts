document.getElementById('loadButton').addEventListener('click', loadXML);
document.getElementById('saveButton').addEventListener('click', saveToCookie);
document.getElementById('downloadButton').addEventListener('click', downloadXMLFromCookie);

function loadXML() {
    fetch('data.xml')
        .then(response => response.text())
        .then(data => {
            document.getElementById('xmlContent').value = data;
        })
        .catch(error => console.error('Error loading XML:', error));
}

function saveToCookie() {
    const xmlContent = document.getElementById('xmlContent').value;
    document.cookie = "xmlContent=" + encodeURIComponent(xmlContent) + "; path=/";
    alert('XML content saved to cookie');
}

function downloadXMLFromCookie() {
    const xmlContent = getCookie('xmlContent');
    if (xmlContent) {
        const blob = new Blob([decodeURIComponent(xmlContent)], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'edited_data.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        alert('No XML content found in cookies');
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
