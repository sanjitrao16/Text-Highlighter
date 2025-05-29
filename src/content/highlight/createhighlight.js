import { Highlight } from "../storage/highlight.js";
import { getCSSPath } from "../utils/paths.js";
import { storeHighlight } from "../storage/store.js";
import {
  highlightSingleTextNode,
  highlightMultipleNodes,
} from "./highlight.js";

function createSpanElement(colour, range, selection) {
  const span = document.createElement("span");
  span.style.backgroundColor = colour || "yellow";

  console.log(selection.focusOffset);

  let container = range.commonAncestorContainer;

  while (!container.innerHTML) {
    container = container.parentNode;
  }

  const anchorNode = selection.anchorNode;
  const focusNode = selection.focusNode;

  if (!anchorNode || !focusNode) return;

  try {
    // Create a new Highlight object
    let highlight = new Highlight(
      selection.toString(),
      (colour || "yellow").toString(),
      window.location.href,
      getCSSPath(selection.anchorNode),
      selection.anchorOffset,
      getCSSPath(selection.focusNode),
      selection.focusOffset,
      getCSSPath(container)
    );

    // Step 1: Create a range from anchor to focus
    const selectionRange = document.createRange();

    // Ensure consistent direction
    const position = anchorNode.compareDocumentPosition(focusNode);
    const isForward =
      position === 0 || position & Node.DOCUMENT_POSITION_FOLLOWING;

    if (isForward) {
      selectionRange.setStart(anchorNode, highlight.anchorOffset);
      selectionRange.setEnd(focusNode, highlight.focusOffset);
    } else {
      selectionRange.setStart(focusNode, highlight.focusOffset);
      selectionRange.setEnd(anchorNode, highlight.anchorOffset);
    }

    // Step 2: Check if it's a single text node selection
    const isSingleNode = anchorNode === focusNode;

    if (isSingleNode) {
      // Handle single text node selection
      highlightSingleTextNode(anchorNode, highlight, isForward);
    } else {
      // Handle multi-node selection
      highlightMultipleNodes(selectionRange, highlight, isForward);
    }

    // Step 3: Deselect
    window.getSelection().removeAllRanges();

    console.log(`Highlighted with ID: ${highlight.id}`);

    // Store the highlight in local storage
    storeHighlight(highlight);
  } catch (error) {
    console.error("Could not highlight selection:", error);
  }
}

export { createSpanElement };
