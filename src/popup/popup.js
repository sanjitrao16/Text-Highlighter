const colourPalette = document.getElementById("colour-palette");

colourPalette.addEventListener("click", (e) => {
  e.preventDefault();

  const selectedColor = e.target.parentElement.id;

  if (selectedColor) {
    chrome.storage.sync.set({ highlightColour: selectedColor }, () => {
      console.log(`Highlight color set to ${selectedColor}`);
    });
  }
});
