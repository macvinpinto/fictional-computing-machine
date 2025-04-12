// Identify video element and playback controls (replace with specific Youtube element selectors)
const videoElement = document.querySelector("video");
const playButton = document.querySelector("#play-pause-button");

// Function to send playback state to background script
function sendPlaybackState() {
  console.log(`Watch-Party: Sending State: paused: ${videoElement.paused}, time: ${videoElement.currentTime}`);

  chrome.runtime.sendMessage({
    action: "playbackUpdate",
    state: videoElement.paused ? "paused" : "playing",
    time: videoElement.currentTime
  });

}

// Listen for play/pause events and send updates
// playButton.addEventListener("click", sendPlaybackState);
videoElement.addEventListener('click', sendPlaybackState)
videoElement.addEventListener("timeupdate", sendPlaybackState);

// Listen for messages from background script (future implementation)
chrome.runtime.onMessage.addListener((message) => {
  // Implement logic to update playback state based on received messages (future)
  console.log(`Watch-Party: ${message}`);
  console.log(message);
  videoElement.currentTime = message.time
  if (  message.action === 'playing' && videoElement.paused) {
    videoElement.play()
  }else if (message.action === 'paused' && !videoElement.paused ) {
    videoElement.pause()
  }
});
