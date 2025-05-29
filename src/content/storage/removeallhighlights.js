function removeAllHighlights() {
  try {
    const currentUrl = window.location.href;

    // Get all highlighted elements grouped by ID
    const highlightedElements = document.querySelectorAll(".highlighted");
    const highlightGroups = {};

    // Group spans by their highlight ID
    highlightedElements.forEach((element) => {
      const id = element.getAttribute("id");
      if (!highlightGroups[id]) {
        highlightGroups[id] = [];
      }
      highlightGroups[id].push(element);
    });

    let removedCount = 0;

    // Process each highlight group
    Object.keys(highlightGroups).forEach((highlightId) => {
      const spans = highlightGroups[highlightId];

      // Sort spans by their position in the document
      spans.sort((a, b) => {
        const position = a.compareDocumentPosition(b);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

      // Replace each span with its text content
      spans.forEach((span) => {
        const textNode = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(textNode, span);
        removedCount++;
      });
    });

    // Normalize text nodes to merge adjacent ones
    document.normalize();

    // Clear from storage
    chrome.storage.sync.get("highlights", (result) => {
      const allHighlights = result.highlights || {};

      if (allHighlights[currentUrl]) {
        delete allHighlights[currentUrl];
        chrome.storage.sync.set({ highlights: allHighlights }, () => {
          console.log(`Cleared all highlights from storage for ${currentUrl}`);
        });
      }
    });

    return { success: true, removedCount: removedCount };
  } catch (error) {
    console.error("Error removing highlights:", error);
    return { success: false, error: error.message };
  }
}

export { removeAllHighlights };
