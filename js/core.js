/* ═══════════════════════════════════════════════
   CLARIX — CORE JS
   State, Navigation, Usage Counter, Toast, Utils
═══════════════════════════════════════════════ */

/* ─── STATE ───────────────────────────────────── */
const ClarixState = {
  get isPro() { return localStorage.getItem('clarix_pro') === 'true'; },
  set isPro(v) { localStorage.setItem('clarix_pro', v); },

  get username() { return localStorage.getItem('clarix_username') || 'Creator'; },
  set username(v) { localStorage.setItem('clarix_username', v); },

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
    const u = this.getUsage();
    // Track lifetime trial prompts
    if (u.lifetime < CLARIX_CONFIG.freeTrialLimit) {
      localStorage.setItem('clarix_trial_used', u.lifetime + 1);
    }
    // Track daily count
    u.count += 1;
    u.date = new Date().toDateString();
    localStorage.setItem('clarix_usage', JSON.stringify({ date: u.date, count: u.count }));
    return u.count;
  },
  canEnhance() {
    if (this.isPro) return true;
    const u = this.getUsage();
    if (u.lifetime < CLARIX_CONFIG.freeTrialLimit) return true; // Still in trial
    return u.count < CLARIX_CONFIG.freeDailyLimit; // Post-trial daily limit
  },
  remainingToday() {
    if (this.isPro) return Infinity;
    const u = this.getUsage();
    if (u.lifetime < CLARIX_CONFIG.freeTrialLimit) {
      return CLARIX_CONFIG.freeTrialLimit - u.lifetime; // Remaining trial
    }
    return Math.max(0, CLARIX_CONFIG.freeDailyLimit - u.count);
  },
  isInTrial() {
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

/* ─── UPGRADE MODAL ───────────────────────────── */
const UpgradeModal = {
  show(reason = '') {
    const existing = document.getElementById('upgrade-modal-overlay');
    if (existing) { existing.classList.add('open'); return; }

    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = 'upgrade-modal-overlay';
    el.innerHTML = `
      <div class="modal">
        <button class="modal-close" onclick="UpgradeModal.hide()">✕</button>
        <div style="text-align:center">
          <div style="font-size:40px;margin-bottom:12px">⚡</div>
          <h3 style="font-family:var(--font-head);font-size:24px;margin-bottom:8px">
            ${reason || "You've hit the free limit"}
          </h3>
          <p style="color:#888;font-size:14px;margin-bottom:24px">
            Upgrade to Clarix Pro for unlimited enhancements, full Expert Breakdown, and priority AI.
          </p>
          <div style="background:rgba(255,112,67,0.06);border:1px solid rgba(255,112,67,0.2);border-radius:16px;padding:20px;margin-bottom:24px">
            <div style="font-size:32px;font-weight:800;font-family:var(--font-head);color:var(--accent)">₹299<span style="font-size:16px;color:#888">/month</span></div>
            <div style="font-size:13px;color:#aaa;margin-top:4px">Start with 7 days free</div>
          </div>
          <ul style="text-align:left;list-style:none;margin-bottom:24px;display:flex;flex-direction:column;gap:10px">
            ${['Unlimited AI enhancements','Full Expert Breakdown','Pro upgrade prompts','All platforms + export','Priority AI processing'].map(f=>`<li style="display:flex;align-items:center;gap:10px;font-size:14px;color:#ccc"><span style="color:#ff7043">✦</span>${f}</li>`).join('')}
          </ul>
          <button class="btn btn-primary" style="width:100%" onclick="UpgradeModal.activate()">
            Start 7-Day Free Trial
          </button>
          <button onclick="UpgradeModal.hide()" style="background:none;border:none;color:#555;font-size:13px;margin-top:14px;cursor:pointer;display:block;width:100%">
            Maybe later
          </button>
        </div>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('open'));
    el.addEventListener('click', (e) => { if (e.target === el) UpgradeModal.hide(); });
  },
  hide() {
    const el = document.getElementById('upgrade-modal-overlay');
    if (el) { el.classList.remove('open'); setTimeout(() => el.remove(), 300); }
  },
  activate() {
    if (CLARIX_CONFIG.instamojoUrl) {
      window.open(CLARIX_CONFIG.instamojoUrl, '_blank');
      Toast.show('🔗 Redirecting to payment... Complete payment to unlock Pro!', 'info', 4000);
    } else {
      // Dev mode: activate directly (remove when Instamojo is live)
      ClarixState.isPro = true;
      this.hide();
      updateUsageCounter();
      if (typeof Sidebar !== 'undefined') Sidebar.refresh();
      Toast.show('🎉 Clarix Pro activated! Enjoy unlimited access.', 'success', 4000);
    }
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
