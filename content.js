let startTime = null;
let timerInterval = null;
let finalized = false; // prevent multiple saves/dismissals if observer fires again

function sendTimerStatus(active) {
  chrome.runtime.sendMessage({ action: "updateIcon", active, startTime });
}

// Start timer on first keypress
document.addEventListener(
  "keydown",
  () => {
    if (!startTime) {
      startTime = Date.now();
      chrome.storage.local.set({ timerStartTime: startTime }); // store for popup
      sendTimerStatus(true);

      timerInterval = setInterval(() => {
        chrome.runtime.sendMessage({ action: "updateTimer", startTime });
      }, 1000);
    }
  },
  { once: true }
);

// Observe for "Accepted"
const observer = new MutationObserver(() => {
  if (finalized) return;

  const result = document.querySelector('span[data-e2e-locator="submission-result"]');
  if (result && result.textContent.includes("Accepted") && startTime) {
    // compute elapsed first
    const elapsedMs = Date.now() - startTime;
    const timeTakenSec = Math.round(elapsedMs / 1000);
    const timeTakenMin = (timeTakenSec / 60).toFixed(1);

    // collect metadata up front so we can show it in confirm
    const title = (document.title.split("-")[0] || "").trim() || "Untitled";
    const link = window.location.href;

    const difficultyEl = document.querySelector('div[class*="text-difficulty-"]');
    const difficulty = difficultyEl ? difficultyEl.textContent.trim() : "Unknown";

    // ask before saving
    const shouldSave = window.confirm(
      `Accepted: "${title}"\nTime: ${timeTakenMin} min (${timeTakenSec} s)\n\nSave this attempt to your logs?`
    );

    // mark finalized to avoid duplicate work even if DOM mutates again
    finalized = true;

    if (shouldSave) {
      const entry = {
        title,
        link,
        difficulty,
        timeTaken: timeTakenSec,
        date: new Date().toISOString(),
      };

      chrome.storage.local.get({ leetcodeLogs: [] }, (data) => {
        const logs = Array.isArray(data.leetcodeLogs) ? data.leetcodeLogs : [];
        logs.push(entry);
        chrome.storage.local.set({ leetcodeLogs: logs });
      });
    }

    // in both cases, stop the live timer and reset
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    chrome.storage.local.remove("timerStartTime"); // remove live timer
    sendTimerStatus(false);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
