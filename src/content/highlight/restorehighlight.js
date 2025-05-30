import { getTextNodesInRange } from "./highlight.js";

// Function to restore single text node highlighting
function restoreSingleTextNode(textNode, highlight, isForward) {
  const nodeRange = document.createRange();

  let startOffset, endOffset;

  if (isForward) {
    startOffset = highlight.anchorOffset;
    endOffset = highlight.focusOffset;
  } else {
    startOffset = highlight.focusOffset;
    endOffset = highlight.anchorOffset;
  }

  // Ensure we have valid offsets
  if (
    startOffset >= endOffset ||
    startOffset < 0 ||
    endOffset > textNode.textContent.length
  ) {
    console.error("Invalid offsets for single node restoration");
    return;
  }

  nodeRange.setStart(textNode, startOffset);
  nodeRange.setEnd(textNode, endOffset);

  // Create span for this text node
  const nodeSpan = document.createElement("span");

  // Apply styling based on highlight status
  if (highlight.status === "removed") {
    nodeSpan.style.backgroundColor = "transparent";
    nodeSpan.setAttribute("class", "highlighted-removed");
  } else {
    nodeSpan.style.backgroundColor = highlight.color;
    nodeSpan.setAttribute("class", "highlighted");
  }

  nodeSpan.setAttribute("id", highlight.id);
  nodeSpan.setAttribute("data-highlight-part", "0");

  try {
    // Extract and wrap the content
    const extractedContent = nodeRange.extractContents();
    nodeSpan.appendChild(extractedContent);
    nodeRange.insertNode(nodeSpan);

    console.log(
      `Single node restored with status: ${highlight.status || "active"}`
    );
  } catch (error) {
    console.error("Error restoring single text node:", error);
  }
}

// Function to restore multiple nodes highlighting
function restoreMultipleNodes(selectionRange, highlight, isForward) {
  const textNodes = getTextNodesInRange(selectionRange);
  const restoredSpans = [];

  textNodes.forEach((textNode, index) => {
    const nodeRange = document.createRange();

    // Determine the start and end offsets for this text node
    let startOffset = 0;
    let endOffset = textNode.textContent.length;

    // If this is the anchor node
    if (
      textNode ===
      (isForward ? selectionRange.startContainer : selectionRange.endContainer)
    ) {
      startOffset = isForward ? highlight.anchorOffset : highlight.focusOffset;
    }

    // If this is the focus node
    if (
      textNode ===
      (isForward ? selectionRange.endContainer : selectionRange.startContainer)
    ) {
      endOffset = isForward ? highlight.focusOffset : highlight.anchorOffset;
    }

    // Skip if no content to highlight in this node
    if (startOffset >= endOffset) return;

    nodeRange.setStart(textNode, startOffset);
    nodeRange.setEnd(textNode, endOffset);

    // Create span for this text node
    const nodeSpan = document.createElement("span");

    // Apply styling based on highlight status
    if (highlight.status === "removed") {
      nodeSpan.style.backgroundColor = "transparent";
      nodeSpan.setAttribute("class", "highlighted-removed");
    } else {
      nodeSpan.style.backgroundColor = highlight.color;
      nodeSpan.setAttribute("class", "highlighted");
    }

    nodeSpan.setAttribute("id", highlight.id);
    nodeSpan.setAttribute("data-highlight-part", index.toString());

    try {
      // Extract and wrap the content
      const extractedContent = nodeRange.extractContents();
      nodeSpan.appendChild(extractedContent);
      nodeRange.insertNode(nodeSpan);

      restoredSpans.push(nodeSpan);
    } catch (error) {
      console.error("Error restoring text node:", error);
    }
  });

  console.log(
    `Restored ${restoredSpans.length} spans with status: ${highlight.status || "active"}`
  );
}

export { restoreSingleTextNode, restoreMultipleNodes };
