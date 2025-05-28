function storeHighlight(highlight) {
  chrome.storage.sync.get(["highlights"], (result) => {
    const allHighlights = result.highlights || {};
    const pageUrl = window.location.href;

    const pageHighlights = allHighlights[pageUrl] || [];
    pageHighlights.push(highlight);

    allHighlights[pageUrl] = pageHighlights;

    chrome.storage.sync.set({ highlights: allHighlights }, () => {
      console.log("Highlight saved for", pageUrl);
    });
  });
}

export { storeHighlight };
