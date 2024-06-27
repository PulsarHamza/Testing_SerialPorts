async function fetchXML() {
  try {
    const response = await fetch("./sample.xml", { cache: "reload" });
    const text = await response.text();
    console.log("Fetched XML:", text);
    document.getElementById("content").innerText = text;
  } catch (error) {
    console.error("Error fetching XML:", error);
  }
}

async function updateCache() {
  const newContent = `
    <root>
      <data>Updated Data</data>
    </root>
  `;

  const blob = new Blob([newContent], { type: "application/xml" });
  const response = new Response(blob, {
    headers: { "Content-Type": "application/xml" },
  });

  const cache = await caches.open("v1");
  await cache.put("./sample.xml", response);

  alert("Cache updated with edited XML");
}

document.getElementById("fetchXML").addEventListener("click", fetchXML);
document.getElementById("updateCache").addEventListener("click", updateCache);
