function createHighlightButton(text = "Highlight") {
  const button = document.createElement("button");
  button.textContent = `${text}`;
  button.style.position = "absolute";
  button.style.zIndex = "9999";

  return button;
}

export { createHighlightButton };
