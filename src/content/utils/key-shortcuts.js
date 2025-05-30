import { createSpanElement } from "../highlight/createhighlight.js";

function handleHighlightShortcut() {
  const selection = window.getSelection();

  if (!selection || selection.toString().trim().length === 0) {
    return;
  }

  try {
    chrome.storage.sync.get(["highlightColour"], (result) => {
      const color = result.highlightColour || "yellow";

      const range = selection.getRangeAt(0);

      createSpanElement(color, range, selection);

      selection.removeAllRanges();
    });
  } catch (error) {
    console.error("Error highlighting text with shortcut:", error);
  }
}

export { handleHighlightShortcut };
