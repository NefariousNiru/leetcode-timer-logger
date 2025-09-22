// popup.js
let liveTimerInterval = null;
const liveTimerEl = document.getElementById("live-timer");

// Start live timer (display minutes up to 1 decimal)
function startLiveTimer(startTime) {
  clearInterval(liveTimerInterval);
  liveTimerInterval = setInterval(() => {
    const elapsedSec = (Date.now() - startTime) / 1000;
    const elapsedMin = (elapsedSec / 60).toFixed(1);
    liveTimerEl.textContent = `⏱ Elapsed: ${elapsedMin} min`;
  }, 1000);
}

// Load logs and optionally start live timer
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get({ leetcodeLogs: [], timerStartTime: null }, (data) => {
    const logs = data.leetcodeLogs;
    const statsDiv = document.getElementById("stats");
    const recentTbody = document.querySelector("#recent-table tbody");

    // Start live timer if active problem exists
    if (data.timerStartTime) {
      startLiveTimer(data.timerStartTime);
    }

    if (!logs.length) {
      statsDiv.textContent = "No data logged yet.";
      return;
    }

    function calcStats(logs) {
      const difficulties = ["Easy", "Medium", "Hard"];
      let stats = {};
      difficulties.forEach(d => {
        const filtered = logs.filter(l => l.difficulty.includes(d));
        if (filtered.length) {
          const times = filtered.map(x => x.timeTaken / 60); // convert to minutes
          const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
          stats[d] = {
            avg: avg.toFixed(1),
            min: Math.min(...times).toFixed(1),
            max: Math.max(...times).toFixed(1),
            count: filtered.length
          };
        } else {
          stats[d] = { avg: "N/A", min: "N/A", max: "N/A", count: 0 };
        }
      });
      return stats;
    }

    // Display averages + min/max
    const stats = calcStats(logs);
    statsDiv.innerHTML = `
      ${Object.entries(stats).map(([diff, s]) => `
        <div class="stats-row ${diff}">
          <span class="difficulty">${diff}:</span>
          <span>Avg: ${s.avg} | Min: ${s.min} | Max: ${s.max} | Solved: ${s.count}</span>
        </div>
      `).join('')}
      <hr>
      <div class="stats-row">
        <span>Total solved:</span>
        <span>${logs.length}</span>
      </div>
    `;

    // Show last 5 problems
    const recentLogs = logs.slice(-5).reverse();
    recentTbody.innerHTML = recentLogs.map(l => `
      <tr>
        <td><a href="${l.link}" target="_blank">${l.title}</a></td>
        <td class="difficulty ${l.difficulty}">${l.difficulty}</td>
        <td>${(l.timeTaken / 60).toFixed(1)}</td>
      </tr>
    `).join("");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.getElementById("delete-all-btn");

  chrome.storage.local.get({ leetcodeLogs: [], timerStartTime: null }, (data) => {
    const logs = data.leetcodeLogs;
    const statsDiv = document.getElementById("stats");
    const recentTbody = document.querySelector("#recent-table tbody");

    // Show Delete All button only if logs exist
    if (logs.length > 0) deleteBtn.style.display = "inline-block";

    // Start live timer if active problem exists
    if (data.timerStartTime) startLiveTimer(data.timerStartTime);

    if (!logs.length) {
      statsDiv.textContent = "No data logged yet.";
      return;
    }

    function calcStats(logs) {
      const difficulties = ["Easy", "Medium", "Hard"];
      let stats = {};
      difficulties.forEach(d => {
        const filtered = logs.filter(l => l.difficulty.includes(d));
        if (filtered.length) {
          const times = filtered.map(x => x.timeTaken / 60);
          const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
          stats[d] = {
            avg: avg.toFixed(1),
            min: Math.min(...times).toFixed(1),
            max: Math.max(...times).toFixed(1),
            count: filtered.length
          };
        } else {
          stats[d] = { avg: "N/A", min: "N/A", max: "N/A", count: 0 };
        }
      });
      return stats;
    }

    const stats = calcStats(logs);

    statsDiv.innerHTML = `
      ${Object.entries(stats).map(([diff, s]) => `
        <div class="stats-row ${diff}">
          <span class="difficulty">${diff}:</span>
          <span>Avg: ${s.avg} | Min: ${s.min} | Max: ${s.max} | Solved: ${s.count}</span>
        </div>
      `).join('')}
      <hr>
      <div class="stats-row">
        <span>Total solved:</span>
        <span>${logs.length}</span>
      </div>
    `;

    const recentLogs = logs.slice(-5).reverse();
    recentTbody.innerHTML = recentLogs.map(l => `
      <tr>
        <td><a href="${l.link}" target="_blank">${l.title}</a></td>
        <td class="difficulty ${l.difficulty}">${l.difficulty}</td>
        <td>${(l.timeTaken / 60).toFixed(1)}</td>
      </tr>
    `).join("");
  });

  // Delete All button
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all LeetCode logs? This cannot be undone.")) {
      chrome.storage.local.set({ leetcodeLogs: [] }, () => {
        document.getElementById("stats").textContent = "No data logged yet.";
        document.querySelector("#recent-table tbody").innerHTML = "";
        liveTimerEl.textContent = "⏱ No active problem";
        deleteBtn.style.display = "none"; // hide button after deletion
      });
    }
  });
});
