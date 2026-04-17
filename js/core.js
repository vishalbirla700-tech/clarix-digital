/* ═══════════════════════════════════════════════
   CLARIX — CORE JS
   State, Navigation, Usage Counter, Toast, Utils
═══════════════════════════════════════════════ */

/* ─── STATE ───────────────────────────────────── */
const ClarixState = {
  get isPro() {
    /* Prefer Firebase profile */
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.userProfile) return ClarixAuth.userProfile.isPro === true;
    return localStorage.getItem('clarix_pro') === 'true';
  },
  set isPro(v) { localStorage.setItem('clarix_pro', v); },

  get username() {
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.userProfile) return ClarixAuth.userProfile.name || 'Creator';
    return localStorage.getItem('clarix_username') || 'Creator';
  },
  set username(v) { localStorage.setItem('clarix_username', v); },

  get userPhoto() {
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.userProfile) return ClarixAuth.userProfile.photo || '';
    return '';
  },

  get userCountry() {
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.userProfile) return ClarixAuth.userProfile.country || '';
    return '';
  },

  get userCountryFlag() {
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.userProfile) return ClarixAuth.userProfile.countryFlag || '';
    return '';
  },

  get totalPrompts() { return parseInt(localStorage.getItem('clarix_total') || '0'); },
  inc() { localStorage.setItem('clarix_total', this.totalPrompts + 1); },

  getUsage() {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('clarix_usage') || '{"date":"","count":0}');
    const trialUsed = parseInt(localStorage.getItem('clarix_trial_used') || '0');
    const dailyCount = stored.date !== today ? 0 : stored.count;
    return { date: today, count: dailyCount, lifetime: trialUsed };
  },

  incUsage() {
    /* Prefer Firebase cross-device tracking */
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.currentUser) {
      ClarixAuth.incUsage();
      return;
    }
    /* Fallback: localStorage */
    const u = this.getUsage();
    if (u.lifetime < CLARIX_CONFIG.freeTrialLimit) {
      localStorage.setItem('clarix_trial_used', u.lifetime + 1);
    }
    u.count += 1;
    u.date = new Date().toDateString();
    localStorage.setItem('clarix_usage', JSON.stringify({ date: u.date, count: u.count }));
    return u.count;
  },

  canEnhance() {
    /* ── Admin shortcut: check stored email before anything else ── */
    const ADMIN_EMAILS = ['vishalbirla700@gmail.com'];
    const storedEmail = (localStorage.getItem('clarix_admin_email') || '').toLowerCase();
    if (ADMIN_EMAILS.indexOf(storedEmail) !== -1) return true;

    /* Prefer Firebase cross-device tracking */
    if (typeof ClarixAuth !== 'undefined') {
      if (ClarixAuth.currentUser) {
        /* Cache admin email so subsequent calls are instant */
        const email = (ClarixAuth.currentUser.email || '').toLowerCase();
        if (ADMIN_EMAILS.indexOf(email) !== -1) {
          localStorage.setItem('clarix_admin_email', email);
          return true;
        }
        return ClarixAuth.canEnhance();
      }
      /* Auth exists but currentUser not resolved yet.
         If localStorage has a uid (returning user), allow through
         rather than showing the upgrade modal during the grace period. */
      if (localStorage.getItem('clarix_uid')) return true;
      /* Truly unauthenticated — block */
      return false;
    }
    /* Fallback: localStorage (only if Firebase SDK not loaded at all) */
    if (this.isPro) return true;
    const u = this.getUsage();
    if (u.lifetime < CLARIX_CONFIG.freeTrialLimit) return true;
    return u.count < CLARIX_CONFIG.freeDailyLimit;
  },

  remainingToday() {
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.currentUser) {
      return ClarixAuth.remainingToday();
    }
    if (this.isPro) return Infinity;
    const u = this.getUsage();
    if (u.lifetime < CLARIX_CONFIG.freeTrialLimit) {
      return CLARIX_CONFIG.freeTrialLimit - u.lifetime;
    }
    return Math.max(0, CLARIX_CONFIG.freeDailyLimit - u.count);
  },

  isInTrial() {
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.userProfile) {
      return (ClarixAuth.userProfile.trialUsed || 0) < CLARIX_CONFIG.freeTrialLimit;
    }
    if (this.isPro) return false;
    return this.getUsage().lifetime < CLARIX_CONFIG.freeTrialLimit;
  }
};


/* ─── TOAST ───────────────────────────────────── */
const Toast = {
  _el: null,
  _timer: null,
  init() {
    if (document.getElementById('clarix-toast')) return;
    const el = document.createElement('div');
    el.id = 'clarix-toast';
    el.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span>';
    document.body.appendChild(el);
    this._el = el;
  },
  show(msg, type = 'info', duration = 2800) {
    if (!this._el) this.init();
    const icons = { success: '✅', error: '❌', info: '✦', warning: '⚠️' };
    this._el.querySelector('.toast-icon').textContent = icons[type] || '✦';
    this._el.querySelector('.toast-msg').textContent = msg;
    this._el.className = type;
    this._el.classList.add('show');
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._el?.classList.remove('show'), duration);
  }
};

/* ─── UPGRADE MODAL — COMING SOON ────────────────
   Payments not yet live. Show a premium "coming soon"
   card with notify CTA. Swap activate() when Razorpay
   is ready by replacing the modal body below.
─────────────────────────────────────────────── */
const UpgradeModal = {
  show(reason = '') {
    const existing = document.getElementById('upgrade-modal-overlay');
    if (existing) { existing.classList.add('open'); return; }

    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = 'upgrade-modal-overlay';
    el.innerHTML = `
      <div class="modal upgrade-coming-soon-modal">
        <button class="modal-close" onclick="UpgradeModal.hide()">✕</button>

        <!-- Coming Soon Badge -->
        <div class="ucs-badge">🚀 Coming Soon</div>

        <!-- Icon + Title -->
        <div class="ucs-icon">⚡</div>
        <h3 class="ucs-title">
          ${reason || "You've used your free prompts"}
        </h3>
        <p class="ucs-sub">
          Clarix Pro is almost here — unlimited AI enhancements, priority processing, and full Expert Breakdown.
        </p>

        <!-- Pricing card -->
        <div class="ucs-price-card">
          <div class="ucs-price">₹299<span class="ucs-per">/month</span></div>
          <div class="ucs-price-note">7-day free trial · Cancel anytime</div>
        </div>

        <!-- Features list -->
        <ul class="ucs-features">
          ${[
            '✦ Unlimited AI enhancements daily',
            '✦ Full Expert Breakdown mode',
            '✦ All platforms + language support',
            '✦ Priority AI processing',
            '✦ Prompt history & library'
          ].map(f => `<li>${f}</li>`).join('')}
        </ul>

        <!-- Notify CTA -->
        <div class="ucs-notify-wrap" id="ucsNotifyWrap">
          <button class="btn btn-primary ucs-notify-btn" id="ucsNotifyBtn" onclick="UpgradeModal.notifyMe()">
            🔔 Notify Me When Pro Launches
          </button>
          <div class="ucs-notify-input-row hidden" id="ucsInputRow">
            <input type="email" id="ucsEmailInput" class="ucs-email-input"
              placeholder="Your email address..."
              onkeydown="if(event.key==='Enter') UpgradeModal.submitNotify()">
            <button class="btn btn-primary ucs-submit-btn" onclick="UpgradeModal.submitNotify()">Notify Me</button>
          </div>
          <div class="ucs-success hidden" id="ucsSuccess">
            ✅ You're on the list! We'll notify you at launch.
          </div>
        </div>

        <button onclick="UpgradeModal.hide()" class="ucs-later-btn">
          Continue with Free Tier
        </button>
      </div>`;

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('open'));
    el.addEventListener('click', (e) => { if (e.target === el) UpgradeModal.hide(); });
  },

  hide() {
    const el = document.getElementById('upgrade-modal-overlay');
    if (el) { el.classList.remove('open'); setTimeout(() => el.remove(), 300); }
  },

  notifyMe() {
    document.getElementById('ucsNotifyBtn')?.classList.add('hidden');
    document.getElementById('ucsInputRow')?.classList.remove('hidden');
    setTimeout(() => document.getElementById('ucsEmailInput')?.focus(), 100);
  },

  submitNotify() {
    const email = document.getElementById('ucsEmailInput')?.value?.trim();
    if (!email || !email.includes('@')) {
      Toast.show('Please enter a valid email', 'error'); return;
    }
    /* Save to localStorage as waitlist entry */
    const waitlist = JSON.parse(localStorage.getItem('clarix_waitlist') || '[]');
    if (!waitlist.includes(email)) {
      waitlist.push(email);
      localStorage.setItem('clarix_waitlist', JSON.stringify(waitlist));
    }
    /* Also save to Firestore if user is signed in */
    if (typeof ClarixAuth !== 'undefined' && ClarixAuth.currentUser) {
      ClarixAuth.saveField('proWaitlistEmail', email);
      ClarixAuth.saveField('proWaitlist', true);
    }
    document.getElementById('ucsInputRow')?.classList.add('hidden');
    document.getElementById('ucsSuccess')?.classList.remove('hidden');
    Toast.show('🎉 You\'re on the Pro waitlist!', 'success', 4000);
  },

  /* ── Called when Razorpay is ready (swap this in Phase 5) ── */
  activate() {
    /* PAYMENT NOT YET LIVE — show coming soon instead */
    this.notifyMe();
  }
};

/* ─── USAGE COUNTER ───────────────────────────── */
function updateUsageCounter() {
  const el = document.getElementById('usage-counter');
  if (!el) return;
  if (ClarixState.isPro) {
    el.classList.add('pro');
    el.innerHTML = '∞ Pro';
    el.title = 'Clarix Pro — Unlimited';
  } else {
    const rem = ClarixState.remainingToday();
    const isInTrial = ClarixState.isInTrial();
    el.classList.remove('pro');
    const limit = isInTrial ? CLARIX_CONFIG.freeTrialLimit : CLARIX_CONFIG.freeDailyLimit;
    el.innerHTML = `${rem}/${limit} ${isInTrial ? 'trial' : 'free'}`;
    el.title = isInTrial
      ? `${rem} trial prompts remaining (${limit} total gift)`
      : `${rem} free prompts remaining today`;
  }
}

/* ─── NAV: set active link ────────────────────── */
function initNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mnav-item').forEach(el => {
    const href = el.getAttribute('href') || '';
    const isActive = href === page ||
      (href === 'index.html' && (page === '' || page === 'index.html'));
    el.classList.toggle('active', isActive);
  });
  updateUsageCounter();
}

/* ─── GREETING ────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── COPY TO CLIPBOARD ───────────────────────── */
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
    }
    Toast.show('Copied to clipboard!', 'success');
    return true;
  } catch { Toast.show('Copy failed. Try manually.', 'error'); return false; }
}

/* ─── DOWNLOAD ────────────────────────────────── */
function downloadFile(filename, content, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
}

/* ─── DEBOUNCE ────────────────────────────────── */
function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ─── AUTO-DETECT LANGUAGE ────────────────────── */
function detectLanguage(text) {
  if (!text) return 'English';
  const devanagari = /[\u0900-\u097F]/;
  if (devanagari.test(text)) return 'Hindi';
  const hinglishWords = /\b(kya|hai|mera|yaar|bhai|aur|bohot|thoda|accha|sahi|ek|image|photo|bana|chahiye|de|kar|karo|mere|tum|apna|wala)\b/i;
  if (hinglishWords.test(text)) return 'Hinglish';
  return 'English';
}

/* ─── COPY+OPEN PLATFORM MODAL ────────────────── */
const PLATFORM_URLS = {
  'ChatGPT':    'https://chat.openai.com',
  'Claude':     'https://claude.ai',
  'Gemini':     'https://gemini.google.com',
  'Grok':       'https://grok.x.ai',
  'DeepSeek':   'https://chat.deepseek.com',
  'Perplexity': 'https://perplexity.ai',
  'Copilot':    'https://copilot.microsoft.com',
  'Meta AI':    'https://meta.ai',
  'Midjourney': 'https://midjourney.com',
};

function showCopyOpenModal(prompt) {
  const existing = document.getElementById('copy-open-overlay');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'modal-overlay copy-open-modal'; el.id = 'copy-open-overlay';
  el.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="document.getElementById('copy-open-overlay').remove()">✕</button>
      <h3 style="font-family:var(--font-head);font-size:20px;margin-bottom:8px">Open in AI Platform</h3>
      <p style="color:#888;font-size:13px;margin-bottom:4px">Prompt copied ✓ — choose where to use it</p>
      <div class="platform-grid">
        ${Object.entries(PLATFORM_URLS).map(([name,url])=>`
          <button class="platform-btn-open" onclick="copyText(${JSON.stringify(prompt)});window.open('${url}','_blank')">
            <span class="platform-icon">🤖</span>
            <span>${name}</span>
          </button>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('open'));
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  copyText(prompt);
}

/* ─── LOCAL STORAGE PROMPTS ───────────────────── */
function savePromptToLib(promptText) {
  const saved = JSON.parse(localStorage.getItem('clarix_saved') || '[]');
  saved.unshift({ text: promptText, time: new Date().toISOString() });
  if (saved.length > 50) saved.pop();
  localStorage.setItem('clarix_saved', JSON.stringify(saved));
  Toast.show('Prompt saved to library!', 'success');
}

/* ─── INIT (runs on every page load) ─────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initNav();
});
