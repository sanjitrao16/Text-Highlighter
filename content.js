// Dynamic import of content script. This is necessary to avoid issues with the manifest v3 service worker.
// The content script is loaded dynamically to ensure that it runs in the context of the page.

(async () => {
  const src = chrome.runtime.getURL("src/content/index.js");
  const contentScript = await import(src);
  contentScript.initialize();
})();
