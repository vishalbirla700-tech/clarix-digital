/* ═══════════════════════════════════════════════
   CLARIX — PROFILE PAGE JS v2
   Stats, Analytics Charts, Pro toggle, Saved prompts
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadAnalytics();
});

/* ─── ANALYTICS TRACKING HELPERS ────────────────
   Called from write.js after every successful enhance
   Usage: ProfileAnalytics.track(platform, language)
─────────────────────────────────────────────── */
const ProfileAnalytics = {

  /* track platform + language usage */
  track(platform, language) {
    this._trackPlatform(platform);
    this._trackLanguage(language);
    this._trackDay();
  },

  _trackPlatform(platform) {
    if (!platform) return;
    const data = JSON.parse(localStorage.getItem('clarix_platforms') || '{}');
    data[platform] = (data[platform] || 0) + 1;
    localStorage.setItem('clarix_platforms', JSON.stringify(data));
  },

  _trackLanguage(language) {
    if (!language) return;
    const data = JSON.parse(localStorage.getItem('clarix_languages') || '{}');
    data[language] = (data[language] || 0) + 1;
    localStorage.setItem('clarix_languages', JSON.stringify(data));
  },

  _trackDay() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const data = JSON.parse(localStorage.getItem('clarix_daily') || '{}');
    data[today] = (data[today] || 0) + 1;
    // Keep only last 30 days
    const keys = Object.keys(data).sort().slice(-30);
    const trimmed = {};
    keys.forEach(k => trimmed[k] = data[k]);
    localStorage.setItem('clarix_daily', JSON.stringify(trimmed));
  },

  /* Get last N days of usage data for chart */
  getDailyData(days = 7) {
    const data = JSON.parse(localStorage.getItem('clarix_daily') || '{}');
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      result.push({
        label: dayLabels[d.getDay()],
        value: data[key] || 0,
        isToday: i === 0
      });
    }
    return result;
  },

  /* Get top platforms sorted by usage */
  getTopPlatforms(limit = 5) {
    const data = JSON.parse(localStorage.getItem('clarix_platforms') || '{}');
    return Object.entries(data)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  },

  /* Get language distribution */
  getLanguages() {
    const data = JSON.parse(localStorage.getItem('clarix_languages') || '{}');
    return Object.entries(data)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  },

  /* Calculate usage streak */
  getStreak() {
    const data = JSON.parse(localStorage.getItem('clarix_daily') || '{}');
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (data[key] > 0) streak++;
      else if (i > 0) break; // Gap breaks streak
    }
    return streak;
  }
};

/* ─── LOAD PROFILE ───────────────────────────── */
function loadProfile() {
  const isPro      = ClarixState.isPro;
  const usage      = ClarixState.getUsage();
  const total      = ClarixState.totalPrompts;
  const remaining  = ClarixState.remainingToday();
  const saved      = JSON.parse(localStorage.getItem('clarix_saved') || '[]');
  const username   = ClarixState.username;
  const streak     = ProfileAnalytics.getStreak();

  // Avatar & greeting
  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl) avatarEl.textContent = username.charAt(0).toUpperCase();

  const greetEl = document.getElementById('profileGreeting');
  if (greetEl) greetEl.textContent = getGreeting() + ',';

  const nameEl = document.getElementById('profileName');
  if (nameEl) nameEl.textContent = username;

  const inputEl = document.getElementById('usernameInput');
  if (inputEl) inputEl.value = username === 'Creator' ? '' : username;

  // Pro badge
  const badgeEl = document.getElementById('profileBadge');
  if (badgeEl && isPro) {
    badgeEl.innerHTML = '<div class="pro-badge">Pro ✦</div>';
  }

  // Stats
  setEl('statTotal',     total);
  setEl('statToday',     usage.count);
  setEl('statRemaining', isPro ? '∞' : remaining);
  setEl('statSaved',     saved.length);
  setEl('statStreak',    streak > 0 ? `${streak}🔥` : '0');

  // Usage bar
  const usagePct = isPro ? 0 : Math.min(100, (usage.count / CLARIX_CONFIG.freeLimit) * 100);
  const fillEl = document.getElementById('usageBarFill');
  if (fillEl) { setTimeout(() => { fillEl.style.width = usagePct + '%'; }, 200); }
  setEl('usageBarCount', isPro ? 'Unlimited (Pro)' : `${usage.count} / ${CLARIX_CONFIG.freeLimit} used`);

  // Pro card visibility
  const upgradeCard = document.getElementById('proUpgradeCard');
  const activeCard  = document.getElementById('proActiveCard');
  if (upgradeCard) upgradeCard.classList.toggle('hidden', isPro);
  if (activeCard)  activeCard.classList.toggle('hidden', !isPro);

  // Saved prompts
  renderSavedPrompts(saved);
}

/* ─── LOAD ANALYTICS ─────────────────────────── */
function loadAnalytics() {
  if (typeof ClarixCharts === 'undefined') return;

  const dailyData    = ProfileAnalytics.getDailyData(7);
  const platforms    = ProfileAnalytics.getTopPlatforms(5);
  const languages    = ProfileAnalytics.getLanguages();

  // 7-day bar chart
  requestAnimationFrame(() => {
    ClarixCharts.renderBarChart('chart-daily', dailyData);
  });

  // Top platforms
  if (platforms.length) {
    requestAnimationFrame(() => {
      ClarixCharts.renderHorizontalBar('chart-platforms', platforms);
    });
    document.getElementById('no-platforms')?.classList.add('hidden');
    document.getElementById('chart-platforms')?.classList.remove('hidden');
  }

  // Language donut
  if (languages.length) {
    requestAnimationFrame(() => {
      ClarixCharts.renderDonut('chart-languages', languages);
    });
    document.getElementById('no-languages')?.classList.add('hidden');
    document.getElementById('chart-languages')?.classList.remove('hidden');
  }

  // Re-render charts on resize
  window.addEventListener('resize', debounce(() => {
    ClarixCharts.renderBarChart('chart-daily', dailyData);
    if (platforms.length) ClarixCharts.renderHorizontalBar('chart-platforms', platforms);
    if (languages.length) ClarixCharts.renderDonut('chart-languages', languages);
  }, 300));
}

/* ─── HELPERS ────────────────────────────────── */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function saveName() {
  const input = document.getElementById('usernameInput');
  const name = input?.value?.trim();
  if (!name) { Toast.show('Enter a name first', 'info'); return; }
  ClarixState.username = name;
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileAvatar').textContent = name.charAt(0).toUpperCase();
  Toast.show('Name saved! 👋', 'success');
}

function renderSavedPrompts(saved) {
  const list = document.getElementById('savedList');
  if (!list) return;
  if (!saved.length) {
    list.innerHTML = '<div class="saved-empty">No saved prompts yet.<br>Use the 💾 button in Write to save prompts here.</div>';
    return;
  }
  list.innerHTML = saved.slice(0, 10).map(item => {
    const date = new Date(item.time);
    const timeStr = date.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
    return `
      <div class="saved-item" onclick="copyText('${escJ(item.text)}')">
        <div class="saved-item-text">${item.text}</div>
        <div class="saved-item-time">${timeStr}</div>
      </div>`;
  }).join('');
}

function deactivatePro() {
  if (!confirm('Downgrade to the free tier?')) return;
  ClarixState.isPro = false;
  loadProfile();
  updateUsageCounter();
  Toast.show('Downgraded to free tier', 'info');
}

function escJ(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, ' ').slice(0, 200);
}
