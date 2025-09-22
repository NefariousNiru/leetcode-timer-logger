# LeetCode Timer Logger

A **personal Chrome extension** to track and analyze the time you spend solving LeetCode problems.
Designed for **personal use only**, this extension helps you **measure your efficiency**, maintain **detailed logs**, and **view statistics** for your problem-solving sessions.

---

## Features

* ⏱ **Live timer**: Starts when you type in a problem and stops when the solution is accepted.
* 📝 **Automatic logging**: Tracks problem title, link, difficulty, time taken, and submission date.
* 📊 **Detailed analytics**:

  * Average, minimum, and maximum times per difficulty (Easy / Medium / Hard).
  * Total solved problems.
  * Recent problem history (last 5 problems).
  * Time shown in **minutes with one decimal precision**.
* ❌ **Delete all logs** with a single click (confirmation prompt included).
* 💻 **Local storage only** — no data is sent externally.
* 🎨 **Modern, clean popup UI** with live elapsed timer.

---

## Screenshots

![Popup Screenshot](/assets/Screenshot.png)

---

## Installation

### Load as unpacked extension

1. Clone or download this repository:

```bash
git clone https://github.com/NefariousNiru/leetcode-timer-logger.git
```

2. Open Chrome and go to: `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** → select the folder `leetcode-timer-logger/`.
5. The extension icon will appear in your toolbar.

### Using a packed `.crx` file

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode**.
3. Drag the `.crx` file into the extensions page.
4. Confirm installation.

---

## Usage

1. Open any LeetCode problem.
2. Start typing → timer starts automatically.
3. Solve the problem and get an **Accepted** submission → time is logged.
4. Click the extension icon to open the popup:

   * See **live timer** if a problem is in progress.
   * View **statistics** and **recent problems**.
   * Delete all logs using the **Delete All** button if needed.

---

## Data Storage

* All logs are stored in **Chrome's local storage** (`chrome.storage.local`).
* No data leaves your browser.
* Local storage structure:

```json
[
  {
    "title": "Two Sum",
    "link": "https://leetcode.com/problems/two-sum/",
    "difficulty": "Easy",
    "timeTaken": 12,       // in seconds
    "date": "2025-09-22T05:57:21.244Z"
  }
]
```

---

## File Structure

```
leetcode-timer-logger/
├─ manifest.json
├─ background.js
├─ content.js
├─ popup.html
├─ popup.js
├─ icons/
│   ├─ gray.png
│   └─ yellow.png
└─ README.md
```

---

## Legal Disclaimer

* This extension is **not affiliated with, endorsed by, or sponsored by LeetCode**.
* All LeetCode content, logos, problem titles, and icons are **property of LeetCode**.
* This project is intended for **personal use only**.
* Do **not publish or distribute** this extension commercially without permission.

---

## Author & Links

Built by **Nirupom Bose Roy**

* [LinkedIn](https://www.linkedin.com/in/nbroy/)
* [GitHub](https://github.com/NefariousNiru)

---

## License

© 2025 Nirupom Bose Roy

Personal use only.


