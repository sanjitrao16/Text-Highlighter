function initialize() {
  chrome.commands.onCommand.addListener((command) => {
    if (command === "highlight-text" || command === "remove-all-highlights") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: command,
          });
        }
      });
    }
  });
}

export { initialize };
