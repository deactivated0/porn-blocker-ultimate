// ==UserScript==
// @name         Porn Blocker | Ultimate
// @namespace    https://github.com/deactivated0
// @version      2.0
// @description  Strong adult-content blocker with safe-site allowlist, smart scoring, obfuscation detection, chatroom blocking, and redirect.
// @author       https://github.com/deactivated0
// @match        *://*/*
// @match        http://*/*
// @match        https://*/*
// @include      *
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @updateURL    https://raw.githubusercontent.com/deactivated0/porn-blocker-ultimate/main/p.user.js
// @downloadURL  https://raw.githubusercontent.com/deactivated0/porn-blocker-ultimate/main/p.user.js
// ==/UserScript==

(() => {
  'use strict';

  const REDIRECT_URL = 'https://duckduckgo.com/';

  // Immediate Line-1 Synchronous Domain Interceptor (0ms delay)
  try {
    const rawHost = String(location.hostname || location.host || '').toLowerCase();
    const INSTANT_ADULT_REGEX = /pornhub|xnxx|xvideo|xhamster|redtube|youporn|spankbang|myfreecams|rule34|youjizz|onlyfans|fansly|chaturbate|stripchat|bongacams|livejasmin|camsoda|cam4|missav|hentai|camwhore|camgirl|eporner|tnaflix|thumbzilla|javmost|hpjav|hqporner|javhd|supersex|brazzers|bangbros|naughtyamerica|realitykings|xanimu|hentaihaven|nhentai|asmhentai|hitomi|e-hentai|exhentai|pururin|hanime|gelbooru|danbooru|yandere|e621|beeg|tube8|txxx|heavy-r|motherless|tblop|javff|javsub|javlibrary|omegle|ometv|chatrandom|chatroulette|coomeet|shagle|dirtyroulette/i;

    if (rawHost && INSTANT_ADULT_REGEX.test(rawHost) || /\.(xxx|porn|sex|adult)$/i.test(rawHost)) {
      try { window.stop(); } catch {}
      try {
        if (document.documentElement) {
          document.documentElement.innerHTML = '<head><title>Access Blocked</title></head><body style="background:#000;color:#ff3333;text-align:center;padding-top:20vh;font-family:sans-serif;"><h1>🛑 Access Blocked</h1><p>Redirecting...</p></body>';
        }
      } catch {}
      try { window.top.location.replace(REDIRECT_URL); } catch {
        try { window.location.replace(REDIRECT_URL); } catch {
          window.location.href = REDIRECT_URL;
        }
      }
    }
  } catch {}

  const BLOCK_THRESHOLD = 4;
  const CONTENT_THRESHOLD = 8;
  const TITLE_THRESHOLD = 3;
  const PATH_THRESHOLD = 3;
  const EXPIRE_DAYS = 30;
  const BL_KEY = 'pornblocker-blacklist';
  const BL_VER = '7';
  const MAX_TEXT_LEN = 16000;
  const DANGEROUS_TLDS = new Set(['xxx', 'porn', 'sex', 'adult']);

  const safeSites = [
    // Search
    'google.com', 'bing.com', 'duckduckgo.com', 'brave.com', 'ecosia.org', 'qwant.com',
    'startpage.com', 'you.com', 'yahoo.com', 'baidu.com', 'yandex.com', 'naver.com',
    'daum.net', 'so.com', 'sogou.com', 'sm.cn', 'ask.com', 'aol.com', 'searx.me',

    // AI
    'chatgpt.com', 'openai.com',
    'claude.ai', 'anthropic.com',
    'gemini.google.com',
    'copilot.microsoft.com', 'cloud.microsoft',
    'meta.ai', 'dev.meta.ai',
    'perplexity.ai',
    'mistral.ai',
    'x.ai',
    'deepseek.com',
    'huggingface.co',
    'character.ai',
    'poe.com',
    'groq.com',
    'cohere.com',
    'openrouter.ai',
    'together.ai',
    'fireworks.ai',
    'phind.com',

    // Education / reference
    'wikipedia.org', 'wikimedia.org', 'britannica.com', 'khanacademy.org',
    'coursera.org', 'edx.org', 'udemy.com', 'archive.org', 'arxiv.org',
    'jstor.org', 'nature.com', 'science.org', 'sciencedirect.com', 'plos.org',
    'mit.edu', 'stanford.edu', 'harvard.edu', 'berkeley.edu', 'cmu.edu',
    'ox.ac.uk', 'cam.ac.uk', 'oxford.ac.uk',

    // Programming / docs
    'stackoverflow.com', 'stackexchange.com', 'github.com', 'gitlab.com', 'gitee.com',
    'bitbucket.org', 'sourceforge.net', 'npmjs.com', 'pypi.org', 'crates.io',
    'rubygems.org', 'packagist.org', 'nuget.org', 'docker.com', 'hub.docker.com',
    'kubernetes.io', 'kernel.org', 'gnu.org', 'python.org', 'nodejs.org',
    'rust-lang.org', 'go.dev', 'java.com', 'oracle.com', 'developer.mozilla.org',
    'w3.org', 'web.dev', 'developer.android.com', 'developer.apple.com',
    'learn.microsoft.com', 'docs.microsoft.com', 'docs.python.org',

    // Linux / open source
    'archlinux.org', 'cachyos.org', 'debian.org', 'ubuntu.com', 'fedora.org',
    'opensuse.org', 'linuxmint.com', 'manjaro.org', 'alpinelinux.org',
    'gentoo.org', 'voidlinux.org', 'distrowatch.com',
    'packages.archlinux.org', 'aur.archlinux.org',

    // Cloud / storage
    'dropbox.com', 'drive.google.com', 'onedrive.live.com', 'box.com',
    'mega.io', 'pcloud.com', 'icloud.com',
    'cloudflare.com', 'digitalocean.com', 'aws.amazon.com',
    'azure.microsoft.com', 'cloud.google.com',

    // Tech companies
    'apple.com', 'adobe.com', 'intel.com', 'amd.com', 'nvidia.com', 'ibm.com',
    'samsung.com', 'sony.com', 'asus.com', 'gigabyte.com', 'msi.com',
    'lenovo.com', 'dell.com', 'hp.com', 'acer.com', 'qualcomm.com', 'mediatek.com',

    // News / public
    'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'npr.org', 'pbs.org',
    'theguardian.com', 'nytimes.com', 'washingtonpost.com', 'cnn.com',
    'aljazeera.com', 'dw.com', 'france24.com',
    'usa.gov', 'whitehouse.gov', 'congress.gov', 'irs.gov', 'nasa.gov',
    'nih.gov', 'cdc.gov', 'fda.gov', 'who.int', 'un.org', 'europa.eu',

    // Utility
    'paypal.com', 'stripe.com', 'mozilla.org', 'firefox.com', 'opera.com',
    'proton.me', 'protonmail.com', 'signal.org', 'wordpress.com', 'wordpress.org',
    'blogger.com', 'medium.com', 'notion.so', 'evernote.com', 'trello.com',
    'asana.com', 'todoist.com', 'zoom.us'

    // News / public
    '4chan.org'

  ];

  const safeSitesSet = new Set(safeSites.map(s => s.toLowerCase()));

  const domainKeywords = {
    // Strong adult domains
    'pornhub': 8, 'xvideo': 8, 'xvideos': 8, 'redtube': 8, 'xnxx': 8, 'xhamster': 8,
    '4tube': 8, 'youporn': 8, 'spankbang': 8, 'myfreecams': 8, 'missav': 8,
    'rule34': 8, 'youjizz': 8, 'onlyfans': 8, 'fansly': 8, 'manyvids': 8,
    'camgirl': 6, 'camgirls': 6, 'camwhore': 8, 'webcam': 3, 'jav': 7,
    'porn': 6, 'nsfw': 6, 'hentai': 6, 'xxx': 8, 'adult': 5, 'sex': 5,
    'erotic': 4, 'erotica': 4, 'lewd': 4, 'fetish': 4, 'bdsm': 5,
    'escort': 6, 'escorts': 6, 'stripper': 6, 'stripclub': 6, 'brothel': 8,
    'prostitut': 8, 'nude': 5, 'naked': 5, 'upskirt': 6, 'creampie': 6,
    'blowjob': 8, 'handjob': 8, 'rimjob': 8, 'footjob': 8, 'deepthroat': 8,
    'bukkake': 8, 'gangbang': 8, 'orgy': 8, 'threesome': 7, 'cumshot': 8,
    'masturbat': 6, 'teenporn': 8, 'loli': 8, 'shota': 8, 'cuckold': 5,
    'luoli': 6, 'paidaa': 6, 'haijiao': 6, 'cock': 6, 'pussy': 6, 'vagina': 6,
    'boobs': 6, 'tits': 6, 'fuck': 6, 'slut': 6, 'whore': 6, 'milf': 6,
    'bbw': 5, 'kink': 5, 'anal': 6, 'oral': 5, 'dick': 6,

    // Chatrooms and random video chat platforms
    'omegle': 8, 'ometv': 8, 'umingle': 8, 'chatrandom': 8, 'chatroulette': 8,
    'coomeet': 8, 'emeraldchat': 8, 'shagle': 8, 'dirtyroulette': 8,
    'chaturbate': 8, 'stripchat': 8, 'bongacams': 8, 'livejasmin': 8,
    'camsoda': 8, 'flirt4free': 8, 'flingster': 8, 'cam4': 8, 'chattous': 8,
    'tinychat': 6, 'camfrog': 6, 'bazoocam': 8, 'strangerchat': 8, 'flirtymania': 8,

    // Negative safe hints
    'edu': -30, 'health': -30, 'medical': -30, 'science': -20, 'gov': -30,
    'official': -20, 'academy': -15, 'clinic': -15, 'therapy': -15,
    'university': -15, 'research': -15, 'dictionary': -15, 'library': -15,
    'museum': -15, 'news': -10, 'docs': -8, 'developer': -8, 'stack': -8,
    'github': -8, 'gitlab': -8, 'source': -6, 'code': -6, 'forum': -4,
    'bbs': -4, 'community': -4, 'tech': -5, 'cloud': -5, 'software': -5,
    'cyber': -3
  };

  const contentKeywords = {
    // English
    '\\b(?:porn|pr[o0]n|p0rn|pr0n|porn0|pr0n0)\\b': 6,
    '\\bnsfw\\b': 5,
    '\\bhentai\\b': 6,
    '\\bxxx\\b': 6,
    '\\badult(?:content|site|sites|video|videos|image|images|pics?|material)?\\b': 4,
    '\\b(?:sex|s[e3]x|s3x|sexx)\\b': 4,
    '\\b(?:sexy|erotic|erotica|lewd|lewdness)\\b': 3,
    '\\b(?:fetish|fetishes|fetishism|kink|kinky)\\b': 4,
    '\\b(?:bdsm|bondage|dominatrix|dominant|submissive)\\b': 4,
    '\\b(?:escort|escorts|brothel|brothels|prostitut(?:e|ion)\\w*)\\b': 6,
    '\\b(?:stripper|strippers|stripclub|stripclubs|stripping)\\b': 5,
    '\\b(?:nude|nudes|nudity|naked|topless|bottomless|upskirt)\\b': 5,
    '\\b(?:masturbat(?:e|ion|ing)?|onanism)\\b': 5,
    '\\b(?:blow\\s*job|hand\\s*job|rim\\s*job|foot\\s*job|deep\\s*throat|deepthroat)\\b': 6,
    '\\b(?:creampie|cumshot|cumshots|bukkake|gangbang|orgy|orgies|threesome|threesomes)\\b': 6,
    '\\b(?:anal|oral)\\s+sex\\b': 6,
    '\\b(?:cuckold|milf|milfs|gilf|gilfs|camgirl|camgirls|camwhore|webcam)\\b': 5,
    '\\b(?:onlyfans|fansly|manyvids|myfreecams)\\b': 6,
    '\\b(?:virgin|virgins)\\b': 2,
    '\\b(?:teen|teens)(?:porn)?\\b': 4,
    '\\b(?:loli|shota|lolicon|shotacon)\\b': 6,
    '\\b(?:shemale|tranny)\\b': 4,
    '\\b(?:h[o0]rny|horny)\\b': 3,
    '\\b(?:f[a@]p|fap(?:ping)?)\\b': 3,
    '\\b(?:n[o0]ods?|n00ds?|noods?)\\b': 4,
    '\\b(?:s[e3]ggs|s3ggs|shex)\\b': 3,
    '\\b(?:prawn|thicc|bussy|sloot)\\b': 2,
    '\\b(?:cum|cums|cumming|cummed)\\b': 3,
    '\\b(?:pussy|vagina|cock|dick|penis|boobs|tits|nipple|nipples|clitoris)\\b': 5,
    '\\b(?:fuck|fucking|fucked|fucker|slut|sluts|whore|whores)\\b': 4,

    // Chatroom & Random Cam terms
    '\\b(?:random\\s*video\\s*chat|talk\\s*to\\s*strangers|stranger\\s*chat|cam\\s*chat|video\\s*roulette|online\\s*chatrooms?|adult\\s*chat|nsfw\\s*chat|cam\\s*to\\s*cam|dirty\\s*chat|cam\\s*2\\s*cam|cyber\\s*sex)\\b': 6,
    '\\b(?:live\\s*cam|live\\s*cams|sex\\s*chat|adult\\s*cam|cam\\s*models?)\\b': 6,

    // Obfuscation and spaced letters
    '\\bp\\s*[o0]\\s*r\\s*n\\b': 6,
    '\\bp\\s*[r]\\s*[o0]\\s*n\\b': 6,
    '\\bn\\s*s\\s*f\\s*w\\b': 5,
    '\\bh\\s*e\\s*n\\s*t\\s*a\\s*i\\b': 6,
    '\\bl\\s*o\\s*l\\s*i\\b': 8,
    '\\bs\\s*h\\s*o\\s*t\\s*a\\b': 8,
    '\\bs\\s*e\\s*x\\b': 3,
    '\\bn\\s*u\\s*d\\s*e\\b': 5,
    '\\bn\\s*a\\s*k\\s*e\\s*d\\b': 5,

    // Chinese
    '色情': 6, '成人内容': 6, '成人视频': 6, '成人网站': 6, '成人影片': 6, '成人图片': 6,
    '性行为': 6, '性交': 6, '性爱': 6, '性奴': 6, '裸体': 5, '裸照': 6, '裸图': 6, '全裸': 6,
    '淫秽': 6, '淫荡': 5, '淫乱': 5, '约炮': 6, '约啪': 6, '约x': 6, '约p': 6, '约会炮': 6,
    '约会啪': 6, '鸡巴': 6, '鸡吧': 6, '阴茎': 4, '阴道': 4, '口交': 6, '肛交': 6, '吞精': 6,
    '内射': 6, '乳交': 6, '射精': 5, '高潮': 4, '潮吹': 6, '狂操': 6, '轮奸': 6, '乱伦': 6,
    '女优': 6, '男优': 6, '涩图': 4, '涩涩': 4, '色图': 4, '色批': 3, '色气': 3, '色女': 3,
    '色男': 3, '色会': 3, '色图群': 5, '色图包': 5, '色图控': 4, '调教': 2, '捆绑': 2, '偷情': 3,
    '母狗': 4, '喷水': 2, '骚': 1,

    // Japanese
    'ポルノ': 6, 'エロ': 4, 'エロい': 4, 'エロ画像': 6, 'エロ動画': 6, '無修正': 6, 'オナニー': 6,
    '手コキ': 6, 'パイズリ': 6, '中出し': 6, 'アヘ顔': 6, '痴女': 5, '素人': 2, '処女': 2,
    'エッチ': 3, 'えっち': 3, 'えちえち': 3, 'えち': 2,

    // Korean
    '섹스': 6, '야동': 6, '자위': 4, '음란': 6, '성인': 4, '누드': 4, '야짤': 4, '야사': 4,
    '야한': 4, '야설': 4, '음란물': 6, '성인물': 5, '성인영상': 6, '성인사이트': 6, '노출': 4,

    // Russian
    'порно': 6, 'порн': 6, 'порнография': 6, 'эротика': 4, 'секс': 4, 'обнажённый': 5, 'обнаженная': 5,

    // Emojis
    '🔞': 3, '🍆': 1, '👅': 1, '👙': 1, '👠': 1, '👄': 1
  };

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function isSafeHost(host) {
    const h = String(host || '').toLowerCase();
    if (safeSitesSet.has(h)) return true;

    const parts = h.split('.');
    while (parts.length > 2) {
      parts.shift();
      if (safeSitesSet.has(parts.join('.'))) return true;
    }
    return false;
  }

  function normalizeForNSFW(text) {
    return String(text || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
      .replace(/[4@]/g, 'a')
      .replace(/3/g, 'e')
      .replace(/[1!|]/g, 'i')
      .replace(/0/g, 'o')
      .replace(/[$5]/g, 's')
      .replace(/7/g, 't')
      .replace(/8/g, 'b')
      .replace(/[\s._\-*~`'’"“”|/\\:;,+()[\]{}<>]+/g, '')
      .replace(/(.)\1{2,}/g, '$1$1');
  }

  const nsfwObfuscationPatterns = [
    /\bp[\s._\-*~`'"]*o[\s._\-*~`'"]*r[\s._\-*~`'"]*n\b/i,
    /\bp[\s._\-*~`'"]*r[\s._\-*~`'"]*o[\s._\-*~`'"]*n\b/i,
    /\bn[\s._\-*~`'"]*s[\s._\-*~`'"]*f[\s._\-*~`'"]*w\b/i,
    /\bs[\s._\-*~`'"]*e[\s._\-*~`'"]*x\b/i,
    /\bn[\s._\-*~`'"]*u[\s._\-*~`'"]*d[\s._\-*~`'"]*e\b/i,
    /\bn[\s._\-*~`'"]*a[\s._\-*~`'"]*k[\s._\-*~`'"]*e[\s._\-*~`'"]*d\b/i,
    /\bh[\s._\-*~`'"]*e[\s._\-*~`'"]*n[\s._\-*~`'"]*t[\s._\-*~`'"]*a[\s._\-*~`'"]*i\b/i,
    /\bl[\s._\-*~`'"]*o[\s._\-*~`'"]*l[\s._\-*~`'"]*i\b/i,
    /\bs[\s._\-*~`'"]*h[\s._\-*~`'"]*o[\s._\-*~`'"]*t[\s._\-*~`'"]*a\b/i
  ];

  function compileEntries(obj) {
    return Object.entries(obj).map(([key, weight]) => {
      let pattern = key;
      if (/^[a-z0-9]+$/i.test(key)) {
        pattern = `\\b${esc(key)}\\b`;
      }
      return { re: new RegExp(pattern, 'giu'), weight };
    });
  }

  const domainEntries = Object.entries(domainKeywords);
  const contentEntries = compileEntries(contentKeywords);

  function scoreDomain(hostname) {
    const host = String(hostname || '').toLowerCase();
    if (!host) return 0;
    if (isSafeHost(host)) return -1000;

    let score = 0;
    for (let i = 0; i < domainEntries.length; i++) {
      const [needle, weight] = domainEntries[i];
      if (host.includes(needle)) score += weight;
    }

    if (/\.(xxx|porn|sex|adult)$/i.test(host)) score += 10;
    if (/^(xxx|porn|sex|adult)\./i.test(host)) score += 6;

    return score;
  }

  function scoreText(text, entries) {
    const raw = String(text || '');
    if (!raw) return 0;

    let score = 0;
    const normalized = normalizeForNSFW(raw);
    const isNormalizedDiff = normalized !== raw;

    for (let i = 0; i < entries.length; i++) {
      const { re, weight } = entries[i];

      const matches = raw.match(re);
      if (matches) score += weight * matches.length;

      if (isNormalizedDiff) {
        const normMatches = normalized.match(re);
        if (normMatches) score += weight * normMatches.length;
      }
    }

    for (let i = 0; i < nsfwObfuscationPatterns.length; i++) {
      const re = nsfwObfuscationPatterns[i];
      if (re.test(raw) || (isNormalizedDiff && re.test(normalized))) {
        score += 5;
      }
    }

    return score;
  }

  function getVisibleText() {
    if (!document.body) return '';
    // Native body.innerText avoids forced reflows from getComputedStyle while ignoring non-rendered text
    return (document.body.innerText || '').slice(0, MAX_TEXT_LEN);
  }

  function getMetaText() {
    const out = [];
    const metas = document.querySelectorAll('meta[name="description"],meta[name="keywords"],meta[property="og:title"],meta[property="og:description"],meta[property="twitter:title"],meta[property="twitter:description"]');
    for (let i = 0; i < metas.length; i++) {
      const c = metas[i].content && String(metas[i].content).trim();
      if (c) out.push(c);
    }
    return out.join(' ').slice(0, MAX_TEXT_LEN);
  }

  function getMediaAndLinkText() {
    const out = [];
    const elements = document.querySelectorAll('img[alt],img[title],a[href],iframe[src],video[src],source[src]');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const text = `${el.alt || ''} ${el.title || ''} ${el.href || ''} ${el.src || ''}`.trim();
      if (text) out.push(text);
    }
    return out.join(' ').slice(0, MAX_TEXT_LEN);
  }

  function getPageContentScore(url) {
    const parts = [
      document.title || '',
      url.pathname || '',
      url.search || '',
      getMetaText(),
      getMediaAndLinkText(),
      getVisibleText()
    ];

    let score = 0;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) score += scoreText(parts[i], contentEntries);
    }

    return score;
  }

  async function gmGet(key, fallback) {
    try {
      if (typeof GM_getValue === 'function') {
        const v = await GM_getValue(key);
        return v === undefined ? fallback : v;
      }
    } catch {
      // ignore
    }
    return fallback;
  }

  async function gmSet(key, value) {
    try {
      if (typeof GM_setValue === 'function') {
        await GM_setValue(key, value);
      }
    } catch {
      // ignore
    }
  }

  let blacklistCache = null;

  async function getBlacklist() {
    if (blacklistCache !== null) return blacklistCache;

    const ver = await gmGet('pornblocker-ver', null);
    if (ver !== BL_VER) {
      await gmSet('pornblocker-ver', BL_VER);
      await gmSet(BL_KEY, []);
      blacklistCache = [];
      return blacklistCache;
    }

    const now = Date.now();
    const list = await gmGet(BL_KEY, []);
    const arr = Array.isArray(list) ? list : [];

    blacklistCache = arr
      .filter(x => {
        if (typeof x === 'string') return true;
        return x && x.host && x.expire > now;
      })
      .map(x => {
        if (typeof x === 'string') {
          return {
            host: x,
            reason: 'legacy',
            added: now,
            expire: now + 86400000 * EXPIRE_DAYS
          };
        }
        return x;
      });

    return blacklistCache;
  }

  async function addBlacklist(host, reason = 'unknown') {
    const h = String(host || '').toLowerCase();
    if (!h || isSafeHost(h)) return;

    const list = await getBlacklist();
    if (list.some(x => x.host === h)) return;

    list.push({
      host: h,
      reason,
      added: Date.now(),
      expire: Date.now() + 86400000 * EXPIRE_DAYS
    });

    blacklistCache = list;
    await gmSet(BL_KEY, list);
  }

  async function inBlacklist(host) {
    const h = String(host || '').toLowerCase();
    const list = await getBlacklist();
    return list.some(x => x.host === h);
  }

  let redirecting = false;

  function go() {
    if (redirecting) return;
    redirecting = true;
    try { window.stop(); } catch {}

    try {
      if (document.documentElement) {
        document.documentElement.innerHTML = '<head><title>Blocked</title></head><body style="background:#000;color:#ff3333;text-align:center;padding-top:20vh;font-family:sans-serif;font-size:24px;"><h1>🛑 Access Blocked</h1><p>Redirecting to safe search...</p></body>';
      }
    } catch {}

    const target = REDIRECT_URL;
    try { window.top.location.replace(target); } catch {
      try { window.location.replace(target); } catch {
        try { window.top.location.href = target; } catch {
          window.location.href = target;
        }
      }
    }
  }

  async function handleBlock(host, reason) {
    await addBlacklist(host, reason);
    go();
  }

  function isDangerousTld(host) {
    const h = String(host || '').toLowerCase();
    return [...DANGEROUS_TLDS].some(tld => h === tld || h.endsWith('.' + tld));
  }

  function scoreUrlParts(url) {
    const text = `${url.pathname || ''} ${url.search || ''}`;
    return scoreText(text, contentEntries);
  }

  function syncCheckDomain() {
    try {
      const host = location.hostname.toLowerCase();
      if (!host || isSafeHost(host)) return false;

      if (isDangerousTld(host) || scoreDomain(host) >= BLOCK_THRESHOLD) {
        go();
        return true;
      }
    } catch {}
    return false;
  }

  async function scanNow() {
    if (syncCheckDomain()) return;

    const url = new URL(location.href);
    const host = url.hostname.toLowerCase();
    if (!host) return;

    if (isSafeHost(host)) return;

    if (await inBlacklist(host)) {
      go();
      return;
    }

    if (isDangerousTld(host)) {
      await handleBlock(host, 'dangerous-tld');
      return;
    }

    const domainScore = scoreDomain(host);
    if (domainScore >= BLOCK_THRESHOLD) {
      await handleBlock(host, 'domain');
      return;
    }

    const titleScore = scoreText(document.title || '', contentEntries);
    if (titleScore >= TITLE_THRESHOLD) {
      await handleBlock(host, 'title');
      return;
    }

    const pathScore = scoreUrlParts(url) * 0.6;
    if (pathScore >= PATH_THRESHOLD) {
      await handleBlock(host, 'path');
      return;
    }

    if (document.body) {
      const contentScore = getPageContentScore(url);
      if (contentScore >= CONTENT_THRESHOLD) {
        await handleBlock(host, 'content');
        return;
      }
      watchDynamic(host);
    } else {
      document.addEventListener('DOMContentLoaded', async () => {
        if (redirecting) return;
        const postLoadScore = getPageContentScore(url);
        if (postLoadScore >= CONTENT_THRESHOLD) {
          await handleBlock(host, 'content');
          return;
        }
        watchDynamic(host);
      }, { once: true });
    }

    watchTitle(host);
  }

  function watchDynamic(host) {
    if (!document.body) return;

    let triggered = false;
    let timer = null;

    const run = async () => {
      if (triggered || redirecting) return;

      const url = new URL(location.href);
      const score = getPageContentScore(url);
      if (score >= CONTENT_THRESHOLD) {
        triggered = true;
        await handleBlock(host, 'dynamic');
        if (observer) observer.disconnect();
        clearTimeout(timer);
      }
    };

    const observer = new MutationObserver(ms => {
      if (triggered || redirecting) return;

      let major = false;
      for (let i = 0; i < ms.length; i++) {
        const m = ms[i];
        if (
          (m.target && m.target.nodeType === 1 && m.target.matches && m.target.matches('main,article,section,.main-content,.article-content,.post-content,.content')) ||
          (m.addedNodes && m.addedNodes.length > 5)
        ) {
          major = true;
          break;
        }
      }

      if (major) {
        clearTimeout(timer);
        timer = setTimeout(run, 200);
      }
    });

    try {
      observer.observe(document.body, { childList: true, subtree: true });
    } catch {
      // ignore
    }

    timer = setTimeout(run, 400);
    setTimeout(() => {
      try { observer.disconnect(); } catch {}
      clearTimeout(timer);
    }, 20000);
  }

  function watchTitle(host) {
    const titleEl = document.querySelector('title');
    if (!titleEl) return;

    const obs = new MutationObserver(async () => {
      if (redirecting) return;
      const title = document.title || '';
      if (!title) return;

      const score = scoreText(title, contentEntries) * 0.8;
      if (score >= TITLE_THRESHOLD) {
        obs.disconnect();
        await handleBlock(host, 'title-change');
      }
    });

    try {
      obs.observe(titleEl, { subtree: true, characterData: true, childList: true });
    } catch {
      // ignore
    }

    setTimeout(() => {
      try { obs.disconnect(); } catch {}
    }, 20000);
  }

  if (!syncCheckDomain()) {
    (async () => {
      await scanNow();
    })();
  }

  // Periodic blacklist cleanup
  (async () => {
    const k = 'pornblocker-clean';
    const now = Date.now();
    let last = 0;

    try {
      last = parseInt(localStorage.getItem(k) || '0', 10);
    } catch {
      // ignore
    }

    if (now - last > 86400000) {
      const list = await getBlacklist();
      const valid = list.filter(x => x.expire > now);
      if (valid.length !== list.length) {
        blacklistCache = valid;
        await gmSet(BL_KEY, valid);
      }
      try {
        localStorage.setItem(k, String(now));
      } catch {
        // ignore
      }
    }
  })();
})();
