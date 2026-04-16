/* ═══════════════════════════════════════════════
   CLARIX — Marketing Digital JS
   Handles: startup form, AI plan generation,
            day-by-day content generation,
            Clarix tool routing, progress tracking
═══════════════════════════════════════════════ */

/* ─── STATE ───────────────────────────────────── */
const MktgState = {
  startup: null,      // Startup intake form data
  plan: null,         // Generated 30-day plan object
  currentWeek: 1,     // Active week tab
  doneDays: new Set(),// Completed day IDs (persisted)
  contentCache: {},   // Generated content keyed by "day-channel"

  save() {
    try {
      localStorage.setItem('mktg_startup', JSON.stringify(this.startup));
      localStorage.setItem('mktg_plan', JSON.stringify(this.plan));
      localStorage.setItem('mktg_done', JSON.stringify([...this.doneDays]));
    } catch(e) {}
  },

  load() {
    try {
      const s = localStorage.getItem('mktg_startup');
      const p = localStorage.getItem('mktg_plan');
      const d = localStorage.getItem('mktg_done');
      if (s) this.startup = JSON.parse(s);
      if (p) this.plan    = JSON.parse(p);
      if (d) this.doneDays = new Set(JSON.parse(d));
    } catch(e) {}
  },

  toggleDone(dayNum) {
    if (this.doneDays.has(dayNum)) this.doneDays.delete(dayNum);
    else this.doneDays.add(dayNum);
    this.save();
  }
};

/* ─── CHANNEL CONFIG ──────────────────────────── */
const CHANNEL_CONFIG = {
  reddit:      { label: 'Reddit',       icon: '&#128172;', clarix: 'write',   clarixLabel: 'Write Studio', clarixUrl: 'write.html',   tip: 'Reddit loves authentic stories. Write like you\'re talking to a friend.' },
  linkedin:    { label: 'LinkedIn',     icon: '&#128188;', clarix: 'apps',    clarixLabel: 'Corporate Studio', clarixUrl: 'apps.html',tip: 'LinkedIn posts with personal stories get 3x more engagement.' },
  twitter:     { label: 'Twitter / X',  icon: '&#128140;', clarix: 'write',   clarixLabel: 'Write Studio', clarixUrl: 'write.html',   tip: 'Threads under 280 chars each, numbered 1/, 2/, etc.' },
  whatsapp:    { label: 'WhatsApp',     icon: '&#128241;', clarix: 'write',   clarixLabel: 'Write Studio', clarixUrl: 'write.html',   tip: 'Keep it short. One clear CTA. Add your link at the end.' },
  producthunt: { label: 'Product Hunt', icon: '&#128640;', clarix: 'apps',    clarixLabel: 'Apps Studio',  clarixUrl: 'apps.html',    tip: 'Launch on Tuesday. Post your first comment within 10 mins.' },
  press:       { label: 'Press / PR',   icon: '&#128240;', clarix: 'write',   clarixLabel: 'Write Studio', clarixUrl: 'write.html',   tip: 'Lead with the human story. Data and numbers second.' },
  email:       { label: 'Email',        icon: '&#128269;', clarix: 'write',   clarixLabel: 'Write Studio', clarixUrl: 'write.html',   tip: 'Subject line matters most. Keep under 50 characters.' },
  content:     { label: 'Content',      icon: '&#9997;&#65039;', clarix: 'inspire', clarixLabel: 'InspireMe',    clarixUrl: 'inspire.html', tip: 'Consistency beats perfection. Post one piece of content daily.' },
  seo:         { label: 'SEO',          icon: '&#128269;', clarix: 'library', clarixLabel: 'Prompt Library',clarixUrl: 'library.html', tip: 'Target long-tail keywords first — less competition, faster ranking.' },
  community:   { label: 'Community',    icon: '&#128101;', clarix: 'community',clarixLabel: 'Community',   clarixUrl: 'community.html',tip: 'Give value first. Don\'t pitch immediately in communities.' },
  none:        { label: 'Planning',     icon: '&#128203;', clarix: 'none',    clarixLabel: '',             clarixUrl: '',             tip: '' }
};

/* ─── VIEWS ────────────────────────────────────── */
const Views = {
  FORM: 'view-form',
  LOADING: 'view-loading',
  PLAN: 'view-plan',

  show(id) {
    ['view-form','view-loading','view-plan'].forEach(v => {
      document.getElementById(v)?.classList.toggle('hidden', v !== id);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/* ─── STEP MANAGEMENT ─────────────────────────── */
function setStep(n) {
  document.querySelectorAll('.mktg-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 === n) el.classList.add('active');
    if (i + 1 < n)  el.classList.add('done');
  });
}

/* ─── CHIP SELECTION ─────────────────────────── */
function initChips() {
  document.querySelectorAll('.mktg-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.group;
      document.querySelectorAll(`.mktg-chip[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
}

/* ─── COLLECT FORM DATA ───────────────────────── */
function collectForm() {
  const get = id => document.getElementById(id)?.value?.trim() || '';
  const selectedChip = group => document.querySelector(`.mktg-chip.selected[data-group="${group}"]`)?.dataset?.value || '';

  return {
    name:        get('mktg-startup-name'),
    description: get('mktg-description'),
    audience:    get('mktg-audience'),
    usp:         get('mktg-usp'),
    goal:        selectedChip('goal'),
    budget:      selectedChip('budget'),
    industry:    get('mktg-industry')
  };
}

/* ─── VALIDATE FORM ───────────────────────────── */
function validateForm(data) {
  if (!data.name)        { showFormError('Please enter your startup name'); return false; }
  if (!data.description) { showFormError('Please describe what your startup does'); return false; }
  if (!data.audience)    { showFormError('Please describe your target audience'); return false; }
  if (!data.usp)         { showFormError('Please enter your key differentiator / USP'); return false; }
  if (!data.goal)        { showFormError('Please select your primary goal'); return false; }
  if (!data.budget)      { showFormError('Please select your budget level'); return false; }
  return true;
}

function showFormError(msg) {
  if (typeof Toast !== 'undefined') Toast.show(msg, 'error');
  else alert(msg);
}

/* ─── GENERATE PLAN ───────────────────────────── */
async function generatePlan() {
  const data = collectForm();
  if (!validateForm(data)) return;

  MktgState.startup = data;

  // Switch to loading view
  Views.show(Views.LOADING);
  setStep(2);
  startLoadingAnimation();

  try {
    const res = await fetch('/api/marketing-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'plan', startup: data })
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Generation failed');

    MktgState.plan = json.result;
    MktgState.currentWeek = 1;
    MktgState.save();

    renderPlan();
    Views.show(Views.PLAN);
    setStep(3);

    if (typeof Toast !== 'undefined') {
      Toast.show('&#127775; Your 30-day Marketing Plan is ready!', 'success', 4000);
    }

  } catch(err) {
    console.error('Plan generation failed:', err);
    Views.show(Views.FORM);
    setStep(1);
    showFormError('AI generation failed. Please check your connection and try again.');
  }
}

/* ─── LOADING ANIMATION ───────────────────────── */
function startLoadingAnimation() {
  const steps = [
    'Analysing your startup...',
    'Identifying your best channels...',
    'Building your 30-day action plan...',
    'Writing personalised content strategy...',
    'Setting weekly milestones...',
    'Finalising your Marketing Digital plan...'
  ];
  let i = 0;
  const el = document.getElementById('loading-step-text');
  const fill = document.getElementById('loading-progress-fill');
  if (!el || !fill) return;

  const interval = setInterval(() => {
    if (i >= steps.length) { clearInterval(interval); return; }
    el.textContent = steps[i];
    fill.style.width = `${((i + 1) / steps.length) * 100}%`;
    i++;
  }, 1200);
}

/* ─── RENDER PLAN ─────────────────────────────── */
function renderPlan() {
  const plan = MktgState.plan;
  if (!plan) return;

  // Summary bar
  const summaryEl = document.getElementById('plan-summary');
  if (summaryEl) {
    summaryEl.querySelector('.mktg-summary-text').textContent = plan.summary || '';
    summaryEl.querySelector('.mktg-summary-channel').textContent =
      '&#10022; Focus: ' + (plan.primaryChannel || '');
  }

  // Stats
  const daysData = plan.days || [];
  document.getElementById('stat-days').textContent = daysData.length || 30;
  document.getElementById('stat-channels').textContent =
    [...new Set(daysData.map(d => d.channel))].length;
  document.getElementById('stat-done').textContent = MktgState.doneDays.size;
  document.getElementById('stat-left').textContent =
    Math.max(0, daysData.length - MktgState.doneDays.size);

  // Startup name
  const nameEl = document.getElementById('plan-startup-name');
  if (nameEl) nameEl.textContent = MktgState.startup?.name || 'Your Startup';

  // Week tabs
  renderWeekTabs(daysData);

  // Progress bar
  updateProgressBar();
}

/* ─── WEEK TABS ───────────────────────────────── */
function renderWeekTabs(days) {
  const tabsEl = document.getElementById('week-tabs');
  if (!tabsEl) return;

  const weeks = [1, 2, 3, 4];
  tabsEl.innerHTML = weeks.map(w => `
    <button class="mktg-week-tab${w === MktgState.currentWeek ? ' active' : ''}"
            onclick="switchWeek(${w})" id="week-tab-${w}">
      Week ${w}
    </button>
  `).join('');

  renderWeekDays(days, MktgState.currentWeek);
}

function switchWeek(week) {
  MktgState.currentWeek = week;
  document.querySelectorAll('.mktg-week-tab').forEach((t, i) => {
    t.classList.toggle('active', i + 1 === week);
  });
  const days = MktgState.plan?.days || [];
  renderWeekDays(days, week);

  // Update week goal
  const goalEl = document.getElementById('week-goal-text');
  if (goalEl && MktgState.plan?.weeklyGoal) {
    goalEl.textContent = MktgState.plan.weeklyGoal[week - 1] || '';
  }
}

function renderWeekDays(days, week) {
  const container = document.getElementById('days-container');
  if (!container) return;

  const weekDays = days.filter(d => d.week === week || (
    week === Math.ceil(d.day / 7)
  ));

  if (!weekDays.length) {
    container.innerHTML = '<div class="mktg-empty"><div class="mktg-empty-icon">&#128197;</div><div class="mktg-empty-title">No days planned for this week</div></div>';
    return;
  }

  // Update week goal
  const goalEl = document.getElementById('week-goal-text');
  if (goalEl && MktgState.plan?.weeklyGoal) {
    goalEl.textContent = '&#127945; Goal: ' + (MktgState.plan.weeklyGoal[week - 1] || '');
  }

  container.innerHTML = weekDays.map(day => renderDayCard(day)).join('');
}

/* ─── DAY CARD ────────────────────────────────── */
function renderDayCard(day) {
  const ch = CHANNEL_CONFIG[day.channel] || CHANNEL_CONFIG.none;
  const isDone = MktgState.doneDays.has(day.day);
  const hasClarix = day.clarixTool && day.clarixTool !== 'none' && ch.clarixUrl;

  return `
    <div class="mktg-day-card${isDone ? ' done' : ''}" id="day-card-${day.day}">
      <div class="mktg-day-header" onclick="toggleDayExpand(${day.day})">
        <div class="mktg-day-num">${isDone ? '&#10003;' : day.day}</div>
        <div class="mktg-day-info">
          <div class="mktg-day-title">${escHtml(day.title)}</div>
          <div class="mktg-day-meta">
            <span class="mktg-channel-tag ch-${day.channel}">${ch.label}</span>
            <span class="mktg-effort-badge effort-${day.effort}">&#9679; ${cap(day.effort)} effort</span>
            <span class="mktg-effort-badge" style="color:rgba(255,255,255,0.3)">&#9650; ${cap(day.impact)} impact</span>
          </div>
        </div>
        <div class="mktg-day-actions">
          <button class="mktg-done-btn mktg-tooltip" data-tip="Mark as done"
            onclick="event.stopPropagation(); markDone(${day.day})">
            ${isDone ? '&#10003;' : '&#9711;'}
          </button>
          <span style="color:rgba(255,255,255,0.2);font-size:12px">&#8250;</span>
        </div>
      </div>
      <div class="mktg-day-expand" id="day-expand-${day.day}">
        <p class="mktg-day-desc">${escHtml(day.description)}</p>

        ${hasClarix ? `
        <div class="mktg-clarix-hint">
          <div class="mktg-clarix-hint-icon">&#10022;</div>
          <div class="mktg-clarix-hint-text">
            <strong>Use Clarix:</strong> ${escHtml(day.clarixHint || 'Use Clarix to help create this content.')}
          </div>
          <a href="${ch.clarixUrl}" class="mktg-clarix-link" target="_self">
            ${ch.clarixLabel} &#8594;
          </a>
        </div>` : ''}

        <div class="mktg-content-gen">
          <div class="mktg-content-gen-title">&#9997;&#65039; AI-Written Content for This Day</div>
          <button class="mktg-gen-btn" id="gen-btn-${day.day}"
            onclick="generateDayContent(${day.day}, '${day.channel}', '${escAttr(day.title)}', '${escAttr(day.description)}')">
            &#127775; Generate ${ch.label} Content
          </button>
          <div class="mktg-content-card" id="content-card-${day.day}"></div>
        </div>

        ${ch.tip ? `
        <div class="mktg-content-tip" style="margin-top:12px">
          &#128161; <strong>Pro Tip:</strong> ${escHtml(ch.tip)}
        </div>` : ''}
      </div>
    </div>`;
}

/* ─── TOGGLE DAY EXPAND ───────────────────────── */
function toggleDayExpand(dayNum) {
  const card = document.getElementById(`day-card-${dayNum}`);
  if (!card) return;
  const isExpanded = card.classList.contains('expanded');
  // Close all
  document.querySelectorAll('.mktg-day-card.expanded').forEach(c => c.classList.remove('expanded'));
  // Toggle this one
  if (!isExpanded) card.classList.add('expanded');
}

/* ─── MARK DONE ───────────────────────────────── */
function markDone(dayNum) {
  MktgState.toggleDone(dayNum);
  // Re-render current week
  const days = MktgState.plan?.days || [];
  renderWeekDays(days, MktgState.currentWeek);
  updateProgressBar();
  // Update stat
  document.getElementById('stat-done').textContent = MktgState.doneDays.size;
  document.getElementById('stat-left').textContent =
    Math.max(0, (days.length) - MktgState.doneDays.size);
}

/* ─── PROGRESS BAR ────────────────────────────── */
function updateProgressBar() {
  const total = MktgState.plan?.days?.length || 30;
  const done  = MktgState.doneDays.size;
  const pct   = Math.round((done / total) * 100);
  const fill  = document.getElementById('plan-progress-fill');
  const label = document.getElementById('plan-progress-label');
  if (fill)  fill.style.width  = pct + '%';
  if (label) label.textContent = `${done} / ${total} days completed (${pct}%)`;
}

/* ─── GENERATE DAY CONTENT ────────────────────── */
async function generateDayContent(dayNum, channel, title, description) {
  const cacheKey = `${dayNum}-${channel}`;

  // Check cache first
  if (MktgState.contentCache[cacheKey]) {
    renderContentCard(dayNum, MktgState.contentCache[cacheKey]);
    return;
  }

  const btn = document.getElementById(`gen-btn-${dayNum}`);
  if (btn) { btn.classList.add('loading'); btn.textContent = '&#9679;&#9679;&#9679; Generating...'; }

  try {
    const res = await fetch('/api/marketing-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'content',
        startup: MktgState.startup,
        channel,
        dayTitle: title,
        dayDescription: description
      })
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error);

    MktgState.contentCache[cacheKey] = json.result;
    renderContentCard(dayNum, json.result);

    if (typeof Toast !== 'undefined') Toast.show('Content ready to copy!', 'success');

  } catch(err) {
    console.error('Content generation failed:', err);
    if (typeof Toast !== 'undefined') Toast.show('Content generation failed. Please retry.', 'error');
  } finally {
    const ch = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG.none;
    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = `&#127775; Generate ${ch.label} Content`;
    }
  }
}

/* ─── RENDER CONTENT CARD ─────────────────────── */
function renderContentCard(dayNum, result) {
  const card = document.getElementById(`content-card-${dayNum}`);
  if (!card) return;

  const c = result.content || result;
  const tags = (c.hashtags || []).map(t => `<span class="mktg-tag">#${escHtml(t)}</span>`).join('');

  card.innerHTML = `
    <div class="mktg-content-headline">${escHtml(c.headline || '')}</div>
    <div class="mktg-content-body" id="content-body-${dayNum}">${escHtml(c.body || '')}</div>
    ${tags ? `<div class="mktg-content-tags">${tags}</div>` : ''}
    ${c.callToAction ? `<div class="mktg-content-cta">&#128073; CTA: ${escHtml(c.callToAction)}</div>` : ''}
    ${c.tip ? `<div class="mktg-content-tip">&#128161; ${escHtml(c.tip)}</div>` : ''}
    <button class="mktg-copy-btn" onclick="copyDayContent(${dayNum})" id="copy-btn-${dayNum}">
      &#128220; Copy Content
    </button>
  `;
  card.classList.add('visible');
}

/* ─── COPY CONTENT ────────────────────────────── */
async function copyDayContent(dayNum) {
  const body = document.getElementById(`content-body-${dayNum}`);
  const btn  = document.getElementById(`copy-btn-${dayNum}`);
  if (!body) return;

  try {
    await navigator.clipboard.writeText(body.textContent);
    if (btn) {
      btn.innerHTML = '&#10003; Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '&#128220; Copy Content';
        btn.classList.remove('copied');
      }, 2500);
    }
    if (typeof Toast !== 'undefined') Toast.show('Copied to clipboard!', 'success');
  } catch(e) {
    if (typeof Toast !== 'undefined') Toast.show('Copy failed — select manually', 'error');
  }
}

/* ─── RESET / START OVER ──────────────────────── */
function resetPlan() {
  if (!confirm('Start a new plan? Your current plan will be cleared.')) return;
  MktgState.plan    = null;
  MktgState.startup = null;
  MktgState.doneDays.clear();
  MktgState.contentCache = {};
  MktgState.save();
  Views.show(Views.FORM);
  setStep(1);
}

/* ─── HELPERS ─────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/\n/g, ' ').slice(0, 200);
}
function cap(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ─── INIT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initChips();
  MktgState.load();

  // If we have a saved plan, go straight to plan view
  if (MktgState.plan && MktgState.startup) {
    renderPlan();
    Views.show(Views.PLAN);
    setStep(3);
  } else {
    Views.show(Views.FORM);
    setStep(1);
  }

  if (window.Sidebar) Sidebar.init();
  if (window.ClarixTour) ClarixTour.init('marketing');
});
