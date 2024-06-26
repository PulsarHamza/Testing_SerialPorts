document.getElementById('loadButton').addEventListener('click', loadXML);
document.getElementById('saveButton').addEventListener('click', saveToCookie);
document.getElementById('downloadButton').addEventListener('click', showXMLInNewTab);

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

function showXMLInNewTab() {
    const xmlContent = getCookie('xmlContent');
    if (xmlContent) {
        const newWindow = window.open();
        newWindow.document.write('<pre>' + escapeHTML(decodeURIComponent(xmlContent)) + '</pre>');
        newWindow.document.close();
        alert('Copy the content and save it as an XML file.');
    } else {
        alert('No XML content found in cookies');
    }
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

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
        }
    });
}
