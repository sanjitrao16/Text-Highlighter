import { updateHighlightStatus } from "../storage/updatehighlights.js";

function removeHighlight(selection) {
  try {
    let targetElement = selection.anchorNode;

    if (targetElement.nodeType === Node.TEXT_NODE) {
      targetElement = targetElement.parentElement;
    }

    let highlightSpan = targetElement;
    while (highlightSpan && !highlightSpan.classList.contains("highlighted")) {
      highlightSpan = highlightSpan.parentElement;
      if (highlightSpan === document.body) {
        highlightSpan = null;
        break;
      }
    }

    if (!highlightSpan) {
      console.error("No highlighted element found in selection");
      return false;
    }

    const highlightId = highlightSpan.getAttribute("id");

    if (!highlightId) {
      console.error("Highlight ID not found");
      return false;
    }

    // Find ALL spans with the same highlight ID
    const allHighlightSpans = document.querySelectorAll(
      `span[id="${highlightId}"].highlighted`
    );

    // Instead of removing spans, just hide them and change class
    allHighlightSpans.forEach((span, index) => {
      span.style.backgroundColor = "transparent";
      span.className = "highlighted-removed"; // Change class to indicate removed state
    });

    // Update storage to mark as removed
    updateHighlightStatus(highlightId, "removed");
    return true;
  } catch (error) {
    console.error("Error in removeHighlight:", error);
    return false;
  }
}

export { removeHighlight };
