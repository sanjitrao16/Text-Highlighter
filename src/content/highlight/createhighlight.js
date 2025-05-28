import { Highlight } from "../storage/highlight.js";
import { getCSSPath } from "../utils/paths.js";
import { storeHighlight } from "../storage/store.js";

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

    console.log(span.id);

    // Store the highlight in local storage
    storeHighlight(highlight);
  } catch (error) {
    console.error("Could not highlight selection:", error);
  }
}

export { createSpanElement };
