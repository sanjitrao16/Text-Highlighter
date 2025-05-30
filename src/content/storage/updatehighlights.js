function updateHighlightStatus(highlightId, status) {
  chrome.storage.sync.get(["highlights"], (result) => {
    const allHighlights = result.highlights || {};
    const pageUrl = window.location.href;

    if (!allHighlights[pageUrl]) return;

    const highlightIndex = allHighlights[pageUrl].findIndex(
      (h) => h.id === highlightId
    );

    if (highlightIndex !== -1) {
      allHighlights[pageUrl][highlightIndex].status = status;
      allHighlights[pageUrl][highlightIndex].color = "inherit";

      chrome.storage.sync.set({ highlights: allHighlights }, () => {
        console.log(`Updated highlight ${highlightId} status to ${status}`);
      });
    }
  });
}

export { updateHighlightStatus };
