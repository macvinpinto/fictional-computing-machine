document.getElementById('create-room').addEventListener('click', () => {
    const roomId = 101; //Math.random().toString(36).substring(2, 6);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'join-room', roomId });
    });
  });

  document.getElementById('join-room').addEventListener('click', () => {
    const roomId = 101; //document.getElementById('roomId').value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'join-room', roomId });
    });
  });
