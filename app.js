document.getElementById('loadButton').addEventListener('click', loadXML);
document.getElementById('saveButton').addEventListener('click', saveToCookie);
document.getElementById('downloadButton').addEventListener('click', downloadXMLFromCookie);
document.getElementById('copyButton').addEventListener('click', copyToClipboard);

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
    displayCookies();
}

function downloadXMLFromCookie() {
    const xmlContent = getCookie('xmlContent');
    if (xmlContent) {
        try {
            const blob = new Blob([decodeURIComponent(xmlContent)], { type: 'text/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited_data.xml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed, opening in new tab:', error);
            openXMLInNewTab(xmlContent);
        }
    } else {
        alert('No XML content found in cookies');
    }
}

function openXMLInNewTab(xmlContent) {
    const newTab = window.open();
    newTab.document.write('<pre>' + decodeURIComponent(xmlContent) + '</pre>');
    newTab.document.close();
}

function copyToClipboard() {
    const xmlContent = document.getElementById('xmlContent').value;
    navigator.clipboard.writeText(xmlContent).then(() => {
        alert('XML content copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy XML content');
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function displayCookies() {
    const cookies = document.cookie.split('; ').map(cookie => cookie.split('='));
    const cookieDisplay = document.getElementById('cookieDisplay');
    cookieDisplay.innerHTML = '';
    cookies.forEach(([name, value]) => {
        const div = document.createElement('div');
        div.textContent = `${name}: ${decodeURIComponent(value)}`;
        cookieDisplay.appendChild(div);
    });
}

// Initial display of cookies when the page loads
document.addEventListener('DOMContentLoaded', displayCookies);
