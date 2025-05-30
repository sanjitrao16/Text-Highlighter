// Function to handle single text node highlighting
function highlightSingleTextNode(textNode, highlight, isForward) {
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
    console.error("Invalid offsets for single node highlight");
    return;
  }

  nodeRange.setStart(textNode, startOffset);
  nodeRange.setEnd(textNode, endOffset);

  // Create span for this text node
  const nodeSpan = document.createElement("span");
  nodeSpan.style.backgroundColor = highlight.color;
  nodeSpan.setAttribute("id", highlight.id);
  nodeSpan.setAttribute("class", "highlighted");
  nodeSpan.setAttribute("data-highlight-part", "0");

  try {
    // Extract and wrap the content
    const extractedContent = nodeRange.extractContents();
    nodeSpan.appendChild(extractedContent);
    nodeRange.insertNode(nodeSpan);
  } catch (error) {
    console.error("Error highlighting single text node:", error);
  }
}

// Function to handle multiple nodes highlighting
function highlightMultipleNodes(selectionRange, highlight, isForward) {
  const textNodes = getTextNodesInRange(selectionRange);
  const highlightedSpans = [];

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
    nodeSpan.style.backgroundColor = highlight.color;
    nodeSpan.setAttribute("id", highlight.id);
    nodeSpan.setAttribute("class", "highlighted");
    nodeSpan.setAttribute("data-highlight-part", index.toString());

    try {
      // Extract and wrap the content
      const extractedContent = nodeRange.extractContents();
      nodeSpan.appendChild(extractedContent);
      nodeRange.insertNode(nodeSpan);

      highlightedSpans.push(nodeSpan);
    } catch (error) {
      console.error("Error highlighting text node:", error);
    }
  });
}

// Helper function to get all text nodes within a range
function getTextNodesInRange(range) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        // Check if this text node intersects with our range
        if (range.intersectsNode(node)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    },
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  return textNodes;
}

export { highlightSingleTextNode, highlightMultipleNodes, getTextNodesInRange };
