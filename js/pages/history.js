/* ═══════════════════════════════════════════════
   CLARIX — HISTORY PAGE JS
   Search, Filter, Favourites, Re-use, Export
═══════════════════════════════════════════════ */

const HistoryPage = {
  _all: [],
  _filtered: [],
  _favsOnly: false,
  _searchQuery: '',

  init() {
    Sidebar.init();
    this._load();
    this._buildFilterOptions();
    this._renderStats();
    this.applyFilters();
  },

  _load() {
    this._all = JSON.parse(localStorage.getItem('clarix_history') || '[]');
  },

  _save() {
    localStorage.setItem('clarix_history', JSON.stringify(this._all));
  },

  _buildFilterOptions() {
    // Platforms
    const platforms = [...new Set(this._all.map(i => i.platform).filter(Boolean))];
    const pSel = document.getElementById('filterPlatform');
    if (pSel) {
      platforms.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p; opt.textContent = p;
        pSel.appendChild(opt);
      });
    }
    // Languages
    const langs = [...new Set(this._all.map(i => i.lang).filter(Boolean))];
    const lSel = document.getElementById('filterLang');
    if (lSel) {
      langs.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l; opt.textContent = l;
        lSel.appendChild(opt);
      });
    }
  },

  _renderStats() {
    const total    = this._all.length;
    const favs     = this._all.filter(i => i.fav).length;
    const avgScore = total
      ? Math.round(this._all.reduce((s,i) => s + (i.score || 0), 0) / total)
      : 0;
    const topPlatform = this._topValue('platform');

    document.getElementById('historyStats').innerHTML = `
      <div class="hist-stat"><div class="hist-stat-num">${total}</div><div class="hist-stat-label">Total Prompts</div></div>
      <div class="hist-stat"><div class="hist-stat-num">${favs}</div><div class="hist-stat-label">Favourites ⭐</div></div>
      <div class="hist-stat"><div class="hist-stat-num">${avgScore || '—'}</div><div class="hist-stat-label">Avg Score</div></div>
      <div class="hist-stat"><div class="hist-stat-num" style="font-size:18px">${topPlatform || '—'}</div><div class="hist-stat-label">Top Platform</div></div>
    `;
  },

  _topValue(key) {
    const counts = {};
    this._all.forEach(i => { if (i[key]) counts[i[key]] = (counts[i[key]] || 0) + 1; });
    return Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
  },

  search(q) {
    this._searchQuery = q.toLowerCase();
    this.applyFilters();
  },

  toggleFavsOnly() {
    this._favsOnly = !this._favsOnly;
    document.getElementById('favsBtn')?.classList.toggle('active', this._favsOnly);
    this.applyFilters();
  },

  applyFilters() {
    const platform = document.getElementById('filterPlatform')?.value || '';
    const lang     = document.getElementById('filterLang')?.value || '';
    const dateF    = document.getElementById('filterDate')?.value || '';
    const q        = this._searchQuery;

    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week  = new Date(today - 6 * 86400000);
    const month = new Date(today.getFullYear(), today.getMonth(), 1);

    this._filtered = this._all.filter(item => {
      if (this._favsOnly && !item.fav) return false;
      if (platform && item.platform !== platform) return false;
      if (lang && item.lang !== lang) return false;
      if (dateF) {
        const d = new Date(item.time);
        if (dateF === 'today' && d < today) return false;
        if (dateF === 'week'  && d < week)  return false;
        if (dateF === 'month' && d < month) return false;
      }
      if (q) {
        const haystack = `${item.text} ${item.enhanced}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    this._renderList();
  },

  _renderList() {
    const list  = document.getElementById('historyList');
    const empty = document.getElementById('historyEmpty');
    const meta  = document.getElementById('historyResultsMeta');

    if (!this._filtered.length) {
      if (list)  list.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      if (empty) empty.querySelector('.history-empty-title').textContent =
        this._all.length ? 'No prompts match your filters' : 'No prompts yet';
      if (meta) meta.textContent = '';
      return;
    }

    if (empty) empty.classList.add('hidden');
    if (meta) meta.textContent = `Showing ${this._filtered.length} of ${this._all.length} prompts`;

    list.innerHTML = this._filtered.map((item, idx) => `
      <div class="hist-card" id="hcard-${item.id}">
        <div class="hist-card-header" onclick="HistoryPage.toggle('${item.id}')">
          <span class="hist-card-num">${this._all.indexOf(item) + 1}</span>
          <div class="hist-card-preview">${escHistHtml(item.enhanced || item.text)}</div>
          <div class="hist-card-meta">
            ${item.lang     ? `<span class="hist-meta-badge lang">${item.langFlag || '🌐'} ${item.lang}</span>` : ''}
            ${item.platform ? `<span class="hist-meta-badge">${item.platform}</span>` : ''}
            ${item.score    ? `<span class="hist-meta-badge score">⭐ ${item.score}</span>` : ''}
            <span class="hist-meta-badge">${fmtTimeSB(item.time)}</span>
          </div>
          <button class="hist-fav-btn${item.fav ? ' active' : ''}"
            onclick="event.stopPropagation();HistoryPage.toggleFav('${item.id}',this)" title="Favourite">⭐</button>
          <span class="hist-expand-icon">▼</span>
        </div>
        <div class="hist-card-body">
          ${item.text && item.text !== item.enhanced ? `
            <div class="hist-body-section">
              <div class="hist-body-label">Original Input</div>
              <div class="hist-body-text">${escHistHtml(item.text)}</div>
            </div>` : ''}
          <div class="hist-body-section">
            <div class="hist-body-label">Enhanced Prompt</div>
            <div class="hist-body-text enhanced">${escHistHtml(item.enhanced || item.text)}</div>
          </div>
          ${item.variations?.length ? `
            <div class="hist-body-section">
              <div class="hist-body-label">Variations</div>
              ${item.variations.map((v,i) => `
                <div class="hist-body-text" style="margin-bottom:8px">
                  <span style="color:var(--accent);font-size:11px;font-weight:700">V${i+1}</span> ${escHistHtml(v)}
                </div>`).join('')}
            </div>` : ''}
          <div class="hist-card-actions">
            <button class="btn-copy-inline" onclick="copyText('${escJ2(item.enhanced || item.text)}')">📋 Copy</button>
            <button class="btn btn-ghost btn-sm" onclick="HistoryPage.reuse('${escJ2(item.text)}')">✍️ Re-use in Write</button>
            <button class="btn btn-ghost btn-sm" onclick="HistoryPage.remix('${escJ2(item.enhanced || item.text)}')">🔄 Remix</button>
            <button class="btn btn-ghost btn-sm" style="color:#f87171;border-color:rgba(248,113,113,0.2)" onclick="HistoryPage.delete('${item.id}')">🗑 Delete</button>
          </div>
        </div>
      </div>`).join('');
  },

  toggle(id) {
    document.getElementById(`hcard-${id}`)?.classList.toggle('expanded');
  },

  toggleFav(id, btn) {
    const item = this._all.find(i => i.id === id);
    if (!item) return;
    item.fav = !item.fav;
    btn.classList.toggle('active', item.fav);
    this._save();
    this._renderStats();
    Toast.show(item.fav ? '⭐ Added to favourites' : 'Removed from favourites', 'success');
  },

  reuse(text) {
    localStorage.setItem('clarix_intent', text);
    window.location.href = 'write.html';
  },

  remix(text) {
    const remixed = `Improve and expand this prompt: ${text}`;
    localStorage.setItem('clarix_intent', remixed);
    window.location.href = 'write.html';
  },

  delete(id) {
    if (!confirm('Delete this prompt from history?')) return;
    this._all = this._all.filter(i => i.id !== id);
    this._save();
    this._renderStats();
    this.applyFilters();
    Toast.show('Deleted from history', 'info');
  },

  clearAll() {
    if (!confirm('Clear ALL prompt history? This cannot be undone.')) return;
    localStorage.removeItem('clarix_history');
    this._all = []; this._filtered = [];
    this._renderStats(); this.applyFilters();
    Toast.show('History cleared', 'info');
  },

  exportAll() {
    if (!this._all.length) { Toast.show('No history to export', 'info'); return; }
    const lines = [
      'CLARIX — PROMPT HISTORY EXPORT',
      `Exported: ${new Date().toLocaleString()}`,
      `Total: ${this._all.length} prompts`,
      '='.repeat(60),
      '',
      ...this._all.map((item, i) => [
        `[${i+1}] ${new Date(item.time).toLocaleString()}`,
        `Platform: ${item.platform || '—'} | Language: ${item.lang || '—'} | Score: ${item.score || '—'}`,
        `Original: ${item.text}`,
        `Enhanced: ${item.enhanced || '—'}`,
        '-'.repeat(40)
      ].join('\n'))
    ].join('\n');
    downloadFile('clarix-history.txt', lines);
    Toast.show('History exported!', 'success');
  }
};

function escHistHtml(str) {
  return (str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escJ2(str) {
  return (str||'').replace(/'/g,"\\'").replace(/\n/g,' ').slice(0,300);
}

/* Save prompt to history (called from write.js after enhance) */
function saveToHistory(item) {
  const history = JSON.parse(localStorage.getItem('clarix_history') || '[]');
  const entry = {
    id: Date.now().toString(),
    time: new Date().toISOString(),
    text:      item.text      || '',
    enhanced:  item.enhanced  || '',
    score:     item.score     || 0,
    platform:  item.platform  || '',
    lang:      item.lang      || LangState.name,
    langFlag:  LangState.flag,
    variations:item.variations || [],
    socialCaption: item.socialCaption || '',
    fav: false
  };
  history.unshift(entry);
  if (history.length > 200) history.pop();
  localStorage.setItem('clarix_history', JSON.stringify(history));
}

document.addEventListener('DOMContentLoaded', () => {
  HistoryPage.init();
});
