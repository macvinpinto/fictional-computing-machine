let socket = null;
let roomId = null;
window.onload = () => {

  // Connect to WebSocket server
  function connectSocket() {
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      if (roomId) {
        socket.send(JSON.stringify({ type: 'join-room', roomId }));
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'sync-event') {
        const video = document.querySelector('video');
        if (!video) return;
        if (message.event === 'play') video.play();
        if (message.event === 'pause') video.pause();
        if (message.event === 'seek') video.currentTime = message.time;
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from server. Reconnecting...');
      setTimeout(connectSocket, 1000); // Reconnect
    };
  }

  // Initialize
  connectSocket();

  // Listen for messages from background.js (e.g., room ID)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'join-room') {
      roomId = request.roomId;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'join-room', roomId }));
      }
    }
  });

  // Send sync events to server
  const video = document.querySelector('video');
  console.log('Video element:', video);

  if (video) {
    video.addEventListener('play', () => {
      console.log('Video played');

      if (socket && roomId) {
        socket.send(JSON.stringify({ type: 'sync-event', roomId, event: 'play' }));
      }
    });

    video.addEventListener('pause', () => {
      console.log('Video paused');
      if (socket && roomId) {
        socket.send(JSON.stringify({ type: 'sync-event', roomId, event: 'pause' }));
      }
    });

    video.addEventListener('seeked', () => {
      console.log(`Video seeked: ${video.currentTime}`);
      if (socket && roomId) {
        socket.send(JSON.stringify({
          type: 'sync-event',
          roomId,
          event: 'seek',
          time: video.currentTime
        }));
      }
    });
  }
}
