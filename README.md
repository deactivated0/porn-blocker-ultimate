# 🛑 Porn Blocker | Ultimate

> **The Most Advanced, Lightweight, & Intelligent Adult Content Blocker Userscript**
> Automatically inspects, scores, and blocks NSFW / adult websites, hidden adult chatrooms, dangerous TLDs, and obfuscated text across the web in real-time.

[![Install Userscript](https://img.shields.io/badge/🚀_Install_Script-Direct_Link-success?style=for-the-badge&logo=tampermonkey)](https://github.com/deactivated0/porn-blocker-ultimate/raw/main/p.user.js)
[![GitHub Stars](https://img.shields.io/github/stars/deactivated0/porn-blocker-ultimate?style=for-the-badge&color=gold)](https://github.com/deactivated0/porn-blocker-ultimate/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Compatible with Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-darkgreen?style=for-the-badge&logo=tampermonkey)](https://www.tampermonkey.net/)
[![Compatible with ScriptCat](https://img.shields.io/badge/ScriptCat-Compatible-orange?style=for-the-badge)](https://scriptcat.org/)
[![Compatible with Violentmonkey](https://img.shields.io/badge/Violentmonkey-Compatible-purple?style=for-the-badge)](https://violentmonkey.github.io/)

---

## ⚡ Quick Install

Click the big green button below to install directly into your userscript manager (Tampermonkey, ScriptCat, Violentmonkey, or Greasemonkey):

<p align="center">
  <a href="https://github.com/deactivated0/porn-blocker-ultimate/raw/main/p.user.js">
    <img src="https://img.shields.io/badge/👉_CLICK_HERE_TO_INSTALL_PORN_BLOCKER_ULTIMATE-2ea44f?style=for-the-badge&logo=javascript&logoColor=white" alt="Install Porn Blocker Ultimate Userscript" width="600" />
  </a>
</p>

---

## 🌟 Key Features

- ⚡ **Document-Start Execution**: Blocks adult content **before** the page finishes rendering to prevent accidental exposure.
- 🛡️ **Intelligent Heuristic Scoring System**: Calculates real-time threat scores based on page titles, URL paths, meta keywords, and DOM text density.
- 🔍 **Obfuscation & Leetspeak Detection**: Detects evasive spellings, hidden chatroom overlays, and text obfuscation techniques used by adult sites.
- 🌐 **Dangerous TLD Shield**: Instantly blocks known high-risk adult top-level domains (`.xxx`, `.porn`, `.sex`, `.adult`).
- 🟢 **Comprehensive Safe-Site Allowlist**: Includes over 100+ trusted domain rules (Search engines, AI tools like ChatGPT/Claude/DeepSeek, Wikipedia, GitHub, StackOverflow, Linux distros, Cloud services) ensuring **zero false positives** on productivity sites.
- 🔄 **Auto-Redirect to Safe Search**: Redirects blocked access directly to DuckDuckGo (customizable).
- 💾 **Local Caching & Expiry**: Caches blacklist decisions locally via Userscript Storage (`GM_setValue`/`GM_getValue`) for lightning-fast subsequent loads.

---

## 🚀 How to Install

### Prerequisites
Install a userscript manager extension for your web browser:
- [Tampermonkey](https://www.tampermonkey.net/) *(Recommended for Chrome, Edge, Firefox, Brave, Safari, Opera)*
- [ScriptCat](https://scriptcat.org/) *(Powerful open-source userscript manager)*
- [Violentmonkey](https://violentmonkey.github.io/) *(Open-source alternative)*
- [Greasemonkey](https://www.greasespot.net/) *(Firefox)*

### Step-by-Step
1. Install your preferred extension listed above.
2. Click **[Install Script](https://github.com/deactivated0/porn-blocker-ultimate/raw/main/p.user.js)**.
3. Your userscript manager will prompt you to confirm the installation. Click **Install**.
4. Enjoy safe, adult-free browsing!

---

## ⚙️ How It Works (Technical Overview)

`Porn Blocker | Ultimate` operates continuously at `document-start` with minimal overhead:

```
[ Incoming Page Load ]
          │
          ▼
   Is Domain in Safe Allowlist? ──► YES ──► [ Allow Page Immediately ]
          │
         NO
          ▼
   Is TLD Dangerous (.xxx/.porn)? ─► YES ──► [ Block & Redirect ]
          │
         NO
          ▼
   Calculate Threat Score:
   ├── Title Keywords Match
   ├── Path / URL Pattern Match
   ├── Meta Tag & Head Keyword Match
   └── DOM Text Content Scoring
          │
          ▼
   Score >= Threshold? ────────► YES ──► [ Save to Local Cache & Redirect ]
          │
         NO
          ▼
   [ Allow Page ]
```

---

## 🌐 Browser & Extension Compatibility

| Browser | Supported Extensions | Supported |
| :--- | :--- | :---: |
| Google Chrome | Tampermonkey / ScriptCat / Violentmonkey | ✅ |
| Mozilla Firefox | Tampermonkey / ScriptCat / Violentmonkey / Greasemonkey | ✅ |
| Brave Browser | Tampermonkey / ScriptCat | ✅ |
| Microsoft Edge | Tampermonkey / ScriptCat | ✅ |
| Opera | Tampermonkey / ScriptCat | ✅ |
| Android (Kiwi / Firefox Mobile) | Tampermonkey / ScriptCat / Violentmonkey | ✅ |

---

## 🛠️ Customization

You can customize thresholds and redirection by editing lines 16–21 of `p.user.js` inside your userscript manager editor:

```javascript
const REDIRECT_URL = 'https://duckduckgo.com/'; // Target URL for blocked sites
const BLOCK_THRESHOLD = 6;                       // Sensitivity score threshold (lower = stricter)
```

---

## 🔒 Privacy & Safety

- 100% Client-Side: Zero network requests to third-party tracking servers.
- No Data Collection: All safe/block decision caches remain locally inside your browser storage.
- Open Source: Fully readable code.

---

## 🏷️ Search Keywords & Tags

`porn-blocker` • `nsfw-blocker` • `tampermonkey` • `scriptcat` • `violentmonkey` • `greasemonkey` • `userscript` • `adult-content-blocker` • `safe-browsing` • `parental-controls` • `nofap` • `anti-porn` • `safesearch` • `content-filter` • `browser-extension` • `chrome-extension` • `firefox-addon` • `privacy` • `security`

---

## 📝 License

Distributed under the [MIT License](LICENSE). Free for personal and commercial use.

---

<p align="center">
  Developed with ❤️ by <a href="https://github.com/deactivated0">deactivated0</a>
</p>
