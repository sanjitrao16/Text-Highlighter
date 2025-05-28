import { getNodeFromCSSPath } from "../utils/paths.js";

function loadAllHighlights() {
  console.log("Loading all highlights...");

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
      if (document.getElementById(highlight.id)) return; // Already applied

      const anchorNode = getNodeFromCSSPath(highlight.anchorNode);
      const focusNode = getNodeFromCSSPath(highlight.focusNode);

      console.log(anchorNode, focusNode);

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

        // Step 2: Extract contents and rewrap text nodes
        const contents = range.cloneContents();
        const walker = document.createTreeWalker(
          contents,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );

        const span = document.createElement("span");
        span.style.backgroundColor = highlight.color;
        span.setAttribute("id", highlight.id);
        span.setAttribute("class", "highlighted");

        // Re-wrap each text node (splitting not needed because range is clean)
        let node;
        while ((node = walker.nextNode())) {
          const wrapper = document.createElement("span");
          wrapper.style.backgroundColor = highlight.color;
          wrapper.setAttribute("class", "highlighted-part");
          wrapper.textContent = node.textContent;
          node.parentNode.replaceChild(wrapper, node);
        }

        // Insert the span into original document range
        const extracted = range.extractContents();
        span.appendChild(extracted);
        range.insertNode(span);

        // Step 3: Deselect
        window.getSelection().removeAllRanges();
      } catch (err) {
        console.error("Failed to restore highlight:", err);
      }
    });
  });
}
export { loadAllHighlights };
