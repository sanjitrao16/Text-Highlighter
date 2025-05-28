let span, parent, highlightId;

function removeObjectFromStorage() {
  chrome.storage.sync.get(["highlights"], (result) => {
    const allHighlights = result.highlights || {};
    const pageUrl = window.location.href;

    if (!allHighlights[pageUrl]) return;

    const updatedHighlights = allHighlights[pageUrl].filter(
      (highlight) => highlight.id !== highlightId
    );

    allHighlights[pageUrl] = updatedHighlights;
    if (updatedHighlights.length === 0) {
      delete allHighlights[pageUrl];
    }

    chrome.storage.sync.set({ highlights: allHighlights }, () => {
      console.log(`Removed highlight with id ${highlightId}`);
    });
  });
}

function removeHighlight(selection) {
  span = selection.anchorNode.parentElement;
  parent = span.parentNode;
  highlightId = span.getAttribute("id");

  try {
    const textNode = document.createTextNode(span.textContent);
    parent.replaceChild(textNode, span);

    // Remove corresponding highlight from storage

    removeObjectFromStorage();
  } catch (e) {
    console.error("Could not remove highlight:", e);
  }
}

export { removeHighlight };
