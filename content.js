// content.js
let startTime = null;
let timerInterval = null;

function sendTimerStatus(active) {
  chrome.runtime.sendMessage({ action: "updateIcon", active, startTime });
}

// Start timer on first keypress
document.addEventListener("keydown", () => {
  if (!startTime) {
    startTime = Date.now();
    chrome.storage.local.set({ timerStartTime: startTime }); // store for popup
    sendTimerStatus(true);

    timerInterval = setInterval(() => {
      chrome.runtime.sendMessage({ action: "updateTimer", startTime });
    }, 1000);
  }
}, { once: true });

// Observe for "Accepted"
const observer = new MutationObserver(() => {
  const result = document.querySelector('span[data-e2e-locator="submission-result"]');
  if (result && result.textContent.includes("Accepted") && startTime) {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const title = document.title.split("-")[0].trim();
    const link = window.location.href;

    const difficultyEl = document.querySelector('div[class*="text-difficulty-"]');
    const difficulty = difficultyEl ? difficultyEl.textContent.trim() : "Unknown";

    const entry = { title, link, difficulty, timeTaken, date: new Date().toISOString() };

    chrome.storage.local.get({ leetcodeLogs: [] }, (data) => {
      const logs = data.leetcodeLogs;
      logs.push(entry);
      chrome.storage.local.set({ leetcodeLogs: logs });
    });

    clearInterval(timerInterval);
    startTime = null;
    chrome.storage.local.remove('timerStartTime'); // remove live timer
    sendTimerStatus(false);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

