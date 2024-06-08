chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "playbackUpdate") {
      // Broadcast this update to all other tabs/users
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        for (const tab of tabs) {
          if (tab.id !== sender.tab.id) {
            chrome.tabs.sendMessage(tab.id, message);
          }
        }
      });
    }
  });
  