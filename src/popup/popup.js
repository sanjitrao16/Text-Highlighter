const colourPalette = document.getElementById("colour-palette");
const remove = document.getElementById("remove");

colourPalette.addEventListener("click", (e) => {
  e.preventDefault();

  const selectedColor = e.target.parentElement.id;

  if (selectedColor) {
    chrome.storage.sync.set({ highlightColour: selectedColor }, () => {
      console.log(`Highlight color set to ${selectedColor}`);
    });
  }
});

remove.addEventListener("click", (e) => {
  e.preventDefault();

  // Add confirmation dialog
  if (
    confirm("Are you sure you want to remove all highlights from this page?")
  ) {
    // Send message to content script to remove all highlights
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "removeAllHighlights",
        },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
            alert(
              "Error: Could not communicate with the page. Please refresh and try again."
            );
            return;
          }

          if (response && response.success) {
            alert(`Successfully removed ${response.removedCount} highlights!`);
            // Optionally close the popup
            window.close();
          } else {
            alert("Failed to remove highlights. Please try again.");
          }
        }
      );
    });
  }
});
