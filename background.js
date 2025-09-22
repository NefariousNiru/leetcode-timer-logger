// background.js
let timerActive = false;
let startTime = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "updateIcon") {
    timerActive = msg.active;
    startTime = msg.startTime || null;

    const iconPath = timerActive ? "icons/yellow.png" : "icons/gray.png";
    chrome.action.setIcon({ path: iconPath, tabId: sender.tab.id });
  }

  if (msg.action === "updateTimer") {
    startTime = msg.startTime;
  }
});

