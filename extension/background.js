// Background service worker for the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'join-room') {
    // Relay room ID to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'join-room',
          roomId: request.roomId,
        });
      }
    });
  }
});

// // Reconnect Socket.IO if tab refreshes (optional)
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.url.includes('hotstar.com')) {
//     chrome.tabs.sendMessage(tabId, { action: 'reconnect-socket' });
//   }
// });


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "playbackUpdate") {
//       // Broadcast this update to all other tabs/users
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         for (const tab of tabs) {
//           if (tab.id !== sender.tab.id) {
//             console.log(`Sending Message to ${tab.id} : ${message}`)
//             chrome.tabs.sendMessage(tab.id, message);
//           }
//         }
//       });
//     }
//   });
