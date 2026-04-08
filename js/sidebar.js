/* ═══════════════════════════════════════════════
   CLARIX — SIDEBAR JS
   Left nav panel, auto-close, recent history
═══════════════════════════════════════════════ */

const Sidebar = {
  _open: false,

  init() {
    if (document.getElementById('clarix-sidebar')) return;
    this._renderDOM();
    this._bindEvents();
    this.refresh();
  },

  _renderDOM() {
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.id = 'sidebar-backdrop';
    backdrop.addEventListener('click', () => this.close());
    document.body.appendChild(backdrop);

    // Sidebar
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = [
      { href:'index.html',   icon:'🏠', label:'Home' },
      { href:'write.html',   icon:'✍️', label:'Write' },
      { href:'inspire.html', icon:'🎨', label:'InspireMe' },
      { href:'library.html', icon:'📚', label:'Library', dynamicBadge:'clarix_saved' },
      { href:'apps.html',    icon:'🚀', label:'Apps' },
      { href:'history.html', icon:'📜', label:'History' },
      { href:'profile.html', icon:'👤', label:'Profile' },
    ];

    // Resolve dynamic badges from localStorage
    navLinks.forEach(l => {
      if (l.dynamicBadge) {
        const count = JSON.parse(localStorage.getItem(l.dynamicBadge) || '[]').length;
        l.badge = count > 0 ? String(count) : '';
      }
    });

    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.id = 'clarix-sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">✦ clarix</div>
        <button class="sidebar-close" onclick="Sidebar.close()">✕</button>
      </div>

      <div class="sidebar-user" id="sb-user">
        <div class="sidebar-avatar" id="sb-avatar">C</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name" id="sb-name">Creator</div>
          <div class="sidebar-user-lang" id="sb-lang">🌐 English</div>
        </div>
        <div class="sidebar-user-badge" id="sb-badge">Free</div>
      </div>

      <div class="sidebar-body">
        <nav class="sidebar-nav">
          ${navLinks.map(l => `
            <a href="${l.href}" class="sidebar-nav-link${l.href === page ? ' active' : ''}" onclick="Sidebar.close()">
              <span class="snl-icon">${l.icon}</span>
              <span>${l.label}</span>
              ${l.badge ? `<span class="snl-badge">${l.badge}</span>` : ''}
            </a>`).join('')}
        </nav>

        <div class="sidebar-usage" id="sb-usage">
          <div class="sidebar-usage-label" id="sb-usage-label">Your Usage</div>
          <div class="sidebar-usage-bar-track">
            <div class="sidebar-usage-bar-fill" id="sb-usage-fill" style="width:0%"></div>
          </div>
          <div class="sidebar-usage-text" id="sb-usage-text">
            <span>25</span> / 25 trial left
          </div>
        </div>

        <div class="sidebar-recent">
          <div class="sidebar-recent-title">Recent Prompts</div>
          <div id="sb-recent-list"></div>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="sidebar-upgrade-btn" onclick="UpgradeModal.show();Sidebar.close()">
          ⚡ Upgrade to Pro — ₹299/mo
        </button>
        <button class="sidebar-logout-btn" onclick="if(typeof AuthModal!=='undefined')AuthModal._logout();Sidebar.close();" id="sb-logout-btn">
          🚪 Logout
        </button>
        <div class="sidebar-footer-links">
          <a href="terms.html" class="sidebar-footer-link">Terms</a>
          <a href="privacy.html" class="sidebar-footer-link">Privacy</a>
          <a href="refund.html" class="sidebar-footer-link">Refund</a>
        </div>
      </div>
    `;
    document.body.appendChild(sidebar);
  },

  _bindEvents() {
    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._open) this.close();
    });
  },

  open() {
    this._open = true;
    document.getElementById('clarix-sidebar')?.classList.add('open');
    document.getElementById('sidebar-backdrop')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.refresh();
  },

  close() {
    this._open = false;
    document.getElementById('clarix-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-backdrop')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  toggle() {
    this._open ? this.close() : this.open();
  },

  refresh() {
    const name      = ClarixState.username;
    const isPro     = ClarixState.isPro;
    const usage     = ClarixState.getUsage();
    const isInTrial = ClarixState.isInTrial ? ClarixState.isInTrial() : false;
    const limit     = isPro ? 1 : (isInTrial ? CLARIX_CONFIG.freeTrialLimit : CLARIX_CONFIG.freeDailyLimit);
    const current   = isPro ? 0 : (isInTrial ? usage.lifetime : usage.count);
    const pct       = isPro ? 0 : Math.min(100, (current / limit) * 100);

    // User block
    const avatarEl = document.getElementById('sb-avatar');
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    const nameEl = document.getElementById('sb-name');
    if (nameEl) nameEl.textContent = name;
    const langEl = document.getElementById('sb-lang');
    if (langEl) langEl.textContent = `${LangState.flag} ${LangState.name}`;
    const badgeEl = document.getElementById('sb-badge');
    if (badgeEl) {
      badgeEl.textContent = isPro ? 'Pro ✦' : 'Free';
      badgeEl.style.color = isPro ? '#ffc843' : '';
    }

    // Usage label
    const labelEl = document.getElementById('sb-usage-label');
    if (labelEl) {
      labelEl.textContent = isPro ? 'Usage' : (isInTrial ? '🎁 Trial Prompts' : '📅 Daily Prompts');
    }

    // Usage bar
    const fillEl = document.getElementById('sb-usage-fill');
    if (fillEl) fillEl.style.width = pct + '%';
    const textEl = document.getElementById('sb-usage-text');
    if (textEl) {
      if (isPro) {
        textEl.innerHTML = '<span>∞</span> Unlimited (Pro)';
      } else if (isInTrial) {
        textEl.innerHTML = `<span>${limit - current}</span> / ${limit} trial remaining`;
      } else {
        textEl.innerHTML = `<span>${current}</span> / ${limit} used today`;
      }
    }

    // Recent prompts
    this._renderRecent();

    // Hide upgrade btn if pro
    const upgradeBtn = document.querySelector('.sidebar-upgrade-btn');
    if (upgradeBtn) upgradeBtn.style.display = isPro ? 'none' : '';
  },

  _renderRecent() {
    const list  = document.getElementById('sb-recent-list');
    if (!list) return;
    const all   = JSON.parse(localStorage.getItem('clarix_history') || '[]');
    const recent = all.slice(0, 5);
    if (!recent.length) {
      list.innerHTML = '<div class="sidebar-recent-empty">No recent prompts yet</div>';
      return;
    }
    list.innerHTML = recent.map(item => `
      <div class="sidebar-recent-item" onclick="Sidebar._loadPrompt('${escSB(item.enhanced || item.text)}')">
        <div class="sidebar-recent-text">${escHtmlSB(item.enhanced || item.text)}</div>
        <div class="sidebar-recent-meta">${item.platform || ''} · ${fmtTimeSB(item.time)}</div>
      </div>`).join('');
  },

  _loadPrompt(text) {
    localStorage.setItem('clarix_intent', text);
    this.close();
    if (!window.location.pathname.includes('write.html')) {
      window.location.href = 'write.html';
    } else {
      const el = document.getElementById('promptInput');
      if (el) { el.value = text; if (typeof onPromptInput === 'function') onPromptInput(el); }
    }
  }
};

function escSB(str)     { return (str || '').replace(/'/g,"\\'").replace(/\n/g,' ').slice(0,200); }
function escHtmlSB(str) { return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').slice(0,120); }
function fmtTimeSB(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
}
