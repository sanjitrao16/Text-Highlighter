import { createHighlightButton } from "../highlight-button/create.js";
import { createSpanElement } from "./createhighlight.js";
import { removeHighlight } from "./removehighlight.js";
import { removeAllHighlights } from "../storage/removeallhighlights.js";
import { handleHighlightShortcut } from "../utils/key-shortcuts.js";

let selection;
let selectedText;
let range;
let rect;

let highlightButton = createHighlightButton();
highlightButton.style.display = "none";
document.body.appendChild(highlightButton);
highlightButton.addEventListener("click", highlightText);

let removeButton = createHighlightButton("Remove Highlight");
removeButton.style.display = "none";
document.body.appendChild(removeButton);
removeButton.addEventListener("click", function () {
  removeHighlight(selection);
  selection.removeAllRanges();
  removeButton.style.display = "none";
});

function getHighlightColour() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("highlightColour", ({ highlightColour }) => {
      resolve(highlightColour || "yellow");
    });
  });
}

async function highlightText() {
  let colour = await getHighlightColour();

  createSpanElement(colour, range, selection);

  selection.removeAllRanges();
  highlightButton.style.display = "none";
}

function showHighlightButton(e) {
  // Prevent mouseup triggered by the button itself from interfering
  if (highlightButton.contains(e.target) || removeButton.contains(e.target))
    return;

  selection = window.getSelection();
  selectedText = selection.toString();

  // If the selection is already highlighted, do not show the button
  if (
    selection.anchorNode?.parentElement?.className === "highlighted" ||
    selection.focusNode?.parentElement?.className === "highlighted"
  ) {
    highlightButton.style.display = "none";
    return;
  }

  if (selection.isCollapsed && highlightButton.style.display === "block") {
    highlightButton.style.display = "none";
    return;
  } else if (selectedText && !selection.isCollapsed) {
    range = selection.getRangeAt(0);
    rect = range.getBoundingClientRect();

    highlightButton.style.top = `${rect.bottom + window.scrollY}px`;
    highlightButton.style.left = `${rect.left + window.scrollX}px`;
    highlightButton.style.display = "block";
  }
}

function showRemoveButton(e) {
  // Prevent mouseup triggered by the button itself from interfering
  if (highlightButton.contains(e.target) || removeButton.contains(e.target))
    return;

  selection = window.getSelection();
  selectedText = selection.toString();

  // If the selection is already highlighted, show the remove button
  if (
    selection.anchorNode?.parentElement?.className === "highlighted" &&
    selection.focusNode?.parentElement?.className === "highlighted" &&
    !selection.isCollapsed
  ) {
    range = selection.getRangeAt(0);
    rect = range.getBoundingClientRect();

    removeButton.style.top = `${rect.bottom + window.scrollY}px`;
    removeButton.style.left = `${rect.left + window.scrollX}px`;
    removeButton.style.display = "block";
  } else {
    removeButton.style.display = "none";
  }
}

function initializeHighlighter() {
  document.addEventListener("mouseup", showHighlightButton);
}

function initializeRemoveHighlighter() {
  document.addEventListener("mouseup", showRemoveButton);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "removeAllHighlights") {
    const result = removeAllHighlights();
    sendResponse(result);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlight-text") {
    handleHighlightShortcut();
    highlightButton.style.display = "none";
    sendResponse({ success: true });
  } else if (request.action === "remove-all-highlights") {
    const result = removeAllHighlights();
    sendResponse(result);
  }
});

export { initializeHighlighter, initializeRemoveHighlighter };
