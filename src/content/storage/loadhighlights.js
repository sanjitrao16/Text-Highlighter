import { getNodeFromCSSPath } from "../utils/paths.js";
import {
  restoreSingleTextNode,
  restoreMultipleNodes,
} from "../highlight/restorehighlight.js";

function loadAllHighlights() {
  function loadHighlights() {
    restoreHighlights();
  }

  if (document.readyState === "loading") {
    document.removeEventListener("DOMContentLoaded", loadHighlights);
    document.addEventListener("DOMContentLoaded", loadHighlights);
  } else {
    loadHighlights();
  }
}

function restoreHighlights() {
  chrome.storage.sync.get("highlights", (result) => {
    const pageUrl = window.location.href;
    const pageHighlights =
      (result.highlights && result.highlights[pageUrl]) || [];

    pageHighlights.forEach((highlight) => {
      if (document.getElementById(highlight.id)) return;

      const anchorNode = getNodeFromCSSPath(highlight.anchorNode);
      const focusNode = getNodeFromCSSPath(highlight.focusNode);

      if (!anchorNode || !focusNode) return;

      try {
        // Step 1: Create a range from anchor to focus
        const range = document.createRange();

        // Ensure consistent direction
        const position = anchorNode.compareDocumentPosition(focusNode);
        const isForward =
          position === 0 || position & Node.DOCUMENT_POSITION_FOLLOWING;

        if (isForward) {
          range.setStart(anchorNode, highlight.anchorOffset);
          range.setEnd(focusNode, highlight.focusOffset);
        } else {
          range.setStart(focusNode, highlight.focusOffset);
          range.setEnd(anchorNode, highlight.anchorOffset);
        }

        // Step 2: Check if it's a single text node selection
        const isSingleNode = anchorNode === focusNode;

        if (isSingleNode) {
          // Handle single text node restoration
          restoreSingleTextNode(anchorNode, highlight, isForward);
        } else {
          // Handle multi-node restoration
          restoreMultipleNodes(range, highlight, isForward);
        }
      } catch (err) {
        console.error("Failed to restore highlight:", err);
      }
    });
  });
}

export { loadAllHighlights };
