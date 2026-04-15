/* ═══════════════════════════════════════════════════════
   CLARIX ADMIN PORTAL — admin.js
   Handles: auth guard, stats, user table, charts, actions
═══════════════════════════════════════════════════════ */

/* ── Config ── */
const ADMIN_EMAILS  = ['vishalbirla700@gmail.com'];
const ADMIN_SECRET  = 'clarix-admin-2024'; /* same as env var */
const API_BASE      = '/api/admin-action';
const FB_CDN        = 'https://www.gstatic.com/firebasejs/10.11.0';
const CLARIX_FB_CFG = {
  apiKey:            "AIzaSyAM4ge2l11JSwtkC4Hzp9PDSjQDw-hAsZU",
  authDomain:        "clarix-firebase.firebaseapp.com",
  projectId:         "clarix-firebase",
  storageBucket:     "clarix-firebase.firebasestorage.app",
  messagingSenderId: "24399996790",
  appId:             "1:24399996790:web:1a337ec0707165fa123c57"
};

/* ── State ── */
let _auth = null, _db = null, _adminUser = null;
let _allUsers   = [];
let _chart      = null;
let _activeSection = 'overview';

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
async function adminInit() {
  try {
    const { initializeApp } = await import(`${FB_CDN}/firebase-app.js`);
    const { getAuth, onAuthStateChanged, signOut } = await import(`${FB_CDN}/firebase-auth.js`);
    const { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc }
      = await import(`${FB_CDN}/firebase-firestore.js`);

    const app = initializeApp(CLARIX_FB_CFG);
    _auth = getAuth(app);
    _db   = getFirestore(app);

    /* Store signOut for nav button */
    window._adminSignOut = () => signOut(_auth).then(() => { location.href = '/'; });

    onAuthStateChanged(_auth, async (user) => {
      if (!user) {
        showAccessDenied('not-logged-in');
        return;
      }

      /* Check isAdmin in Firestore */
      try {
        const ref      = doc(_db, 'users', user.uid);
        const snap     = await getDoc(ref);
        const profile  = snap.exists() ? snap.data() : {};
        const isAdmin  = !!profile.isAdmin || ADMIN_EMAILS.includes(user.email);

        if (!isAdmin) {
          showAccessDenied('not-admin');
          return;
        }

        _adminUser = user;
        hideGate();
        populateAdminUser(user, profile);
        loadDashboard();

      } catch (e) {
        console.error('[Admin] Firestore check failed:', e);
        /* Fallback: allow if email is in ADMIN_EMAILS */
        if (ADMIN_EMAILS.includes(user.email)) {
          _adminUser = user;
          hideGate();
          populateAdminUser(user, {});
          loadDashboard();
        } else {
          showAccessDenied('error');
        }
      }
    });

  } catch (e) {
    console.error('[Admin] Init error:', e);
    showAccessDenied('error');
  }
}

/* ═══════════════════════════════════════════════════════
   GATE CONTROLS
═══════════════════════════════════════════════════════ */
function showAccessDenied(reason) {
  const gate = document.getElementById('adminGate');
  const main = document.getElementById('adminMain');
  if (main)  main.style.display = 'none';

  const messages = {
    'not-logged-in': { icon: '🔐', title: 'Sign In Required', sub: 'Please sign in with your admin Google account to access this portal.' },
    'not-admin':     { icon: '🚫', title: 'Access Denied',    sub: 'Your account does not have admin privileges. This incident will be logged.' },
    'error':         { icon: '⚠️', title: 'Auth Error',       sub: 'Could not verify your admin status. Try refreshing.' }
  };
  const m = messages[reason] || messages['error'];

  if (gate) {
    gate.innerHTML = `
      <div class="gate-box">
        <div class="gate-icon">${m.icon}</div>
        <div class="gate-logo"><span class="logo-star">✦</span> clarix admin</div>
        <div class="gate-title">${m.title}</div>
        <div class="gate-sub">${m.sub}</div>
        ${reason === 'not-logged-in' ? `<button class="gate-btn" onclick="location.href='/'">← Back to Clarix</button>` : `<button class="gate-btn" onclick="location.href='/'">← Go Home</button>`}
      </div>`;
    gate.style.display = 'flex';
  }
}

function hideGate() {
  const gate = document.getElementById('adminGate');
  const main = document.getElementById('adminMain');
  if (gate) { gate.style.opacity = '0'; setTimeout(() => gate.remove(), 400); }
  if (main) main.style.display  = 'flex';
}

function populateAdminUser(user, profile) {
  const nameEl   = document.getElementById('adminUserName');
  const emailEl  = document.getElementById('adminUserEmail');
  const avatarEl = document.getElementById('adminAvatar');

  const name = user.displayName || profile.name || 'Admin';
  if (nameEl)  nameEl.textContent  = name;
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl) {
    if (user.photoURL) {
      avatarEl.innerHTML = `<img src="${user.photoURL}" alt="${name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
      avatarEl.textContent = name.charAt(0).toUpperCase();
    }
  }
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD LOAD
═══════════════════════════════════════════════════════ */
async function loadDashboard() {
  showSection('overview');
  await Promise.all([loadStats(), loadUsers()]);
}

/* ── Stats ── */
async function loadStats() {
  try {
    const resp = await fetch(`${API_BASE}?action=getStats&secret=${ADMIN_SECRET}`);
    const data = await resp.json();
    if (!data.success) throw new Error(data.error);

    animateCounter('statTotalUsers',   data.totalUsers   || 0);
    animateCounter('statProUsers',     data.proUsers     || 0);
    animateCounter('statTotalPrompts', data.totalPrompts || 0);

    /* New users today — derive from user list */
    const today = new Date().toDateString();
    const todayCount = _allUsers.filter(u => u.createdAt && new Date(u.createdAt).toDateString() === today).length;
    animateCounter('statNewToday',     todayCount);

  } catch (e) {
    console.warn('[Admin] Stats fetch failed:', e.message);
  }
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start    = 0;
  const duration = 800;
  const startTs  = performance.now();
  function step(now) {
    const elapsed = now - startTs;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * ease).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Users ── */
async function loadUsers(search = '') {
  showTableLoading(true);
  try {
    const url  = `${API_BASE}?action=getUsers&secret=${ADMIN_SECRET}&limit=100${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (!data.success) throw new Error(data.error);
    _allUsers = data.users || [];
    renderUsersTable(_allUsers);

    /* Update "new today" counter now that we have data */
    const today = new Date().toDateString();
    const todayCount = _allUsers.filter(u => u.createdAt && new Date(u.createdAt).toDateString() === today).length;
    animateCounter('statNewToday', todayCount);

    renderInsights(_allUsers);
  } catch (e) {
    console.warn('[Admin] Users fetch failed:', e.message);
    document.getElementById('usersTableBody').innerHTML = `<tr><td colspan="8" style="text-align:center;color:rgba(255,255,255,0.3);padding:40px;">Failed to load users. Check API secret / Firestore rules.</td></tr>`;
  }
  showTableLoading(false);
}

function showTableLoading(on) {
  const loader = document.getElementById('tableLoader');
  if (loader) loader.style.display = on ? 'flex' : 'none';
}

/* ═══════════════════════════════════════════════════════
   RENDER — USERS TABLE
═══════════════════════════════════════════════════════ */
function renderUsersTable(users) {
  const body = document.getElementById('usersTableBody');
  const count = document.getElementById('usersCount');
  if (!body) return;
  if (count) count.textContent = `${users.length} users`;

  if (!users.length) {
    body.innerHTML = `<tr><td colspan="8" style="text-align:center;color:rgba(255,255,255,0.3);padding:40px;">No users found</td></tr>`;
    return;
  }

  body.innerHTML = users.map(u => {
    const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' }) : '—';
    const proBadge    = u.isPro   ? `<span class="badge badge-pro">✦ Pro</span>`   : `<span class="badge badge-free">Free</span>`;
    const adminBadge  = u.isAdmin ? `<span class="badge badge-admin">Admin</span>` : '';
    const avatar      = u.photo
      ? `<img src="${u.photo}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" style="width:32px;height:32px;border-radius:50%;object-fit:cover;"><span class="user-initials" style="display:none;">${(u.name||'?').charAt(0)}</span>`
      : `<span class="user-initials">${(u.name||'?').charAt(0)}</span>`;

    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;flex-shrink:0;">${avatar}</div>
          <div>
            <div style="font-weight:600;font-size:13px;color:#fff;">${escHtml(u.name)}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);">${escHtml(u.email)}</div>
          </div>
        </div>
      </td>
      <td>${u.countryFlag} <span style="font-size:12px;color:rgba(255,255,255,0.6);">${escHtml(u.country||'—')}</span></td>
      <td style="font-size:12px;color:rgba(255,255,255,0.6);">${escHtml(u.language||'—')}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px;">
          <div class="usage-bar-wrap"><div class="usage-bar" style="width:${Math.min(100,(u.trialUsed/25)*100)}%"></div></div>
          <span style="font-size:12px;color:rgba(255,255,255,0.7);">${u.trialUsed}/25</span>
        </div>
      </td>
      <td>${proBadge} ${adminBadge}</td>
      <td style="font-size:12px;color:rgba(255,255,255,0.45);">${createdDate}</td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="action-btn action-btn-orange" onclick="adminResetTrial('${u.uid}','${escHtml(u.name)}')">Reset Trial</button>
          <button class="action-btn ${u.isPro ? 'action-btn-red' : 'action-btn-green'}" onclick="adminTogglePro('${u.uid}','${escHtml(u.name)}',${!u.isPro})">${u.isPro ? 'Revoke Pro' : 'Grant Pro'}</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════
   RENDER — INSIGHTS
═══════════════════════════════════════════════════════ */
function renderInsights(users) {
  renderCountryChart(users);
  renderLanguageList(users);
  renderSignupTimeline(users);
}

function renderCountryChart(users) {
  const counts = {};
  users.forEach(u => {
    const key = `${u.countryFlag} ${u.country || 'Unknown'}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  const sorted  = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,8);
  const labels  = sorted.map(e => e[0]);
  const values  = sorted.map(e => e[1]);

  const ctx = document.getElementById('countryChart');
  if (!ctx) return;
  if (window._countryChart) window._countryChart.destroy();
  window._countryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values,
        backgroundColor: ['#ff7043','#ff8a65','#ffab91','#ef5350','#e53935','#ffd54f','#ff8f00','#f4511e'],
        borderColor: 'rgba(255,255,255,0.05)', borderWidth: 2 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { position:'right', labels:{ color:'rgba(255,255,255,0.7)', font:{ size:12 }, padding:12, boxWidth:12 } } }
    }
  });
}

function renderLanguageList(users) {
  const counts = {};
  users.forEach(u => { const l = u.language||'English'; counts[l] = (counts[l]||0)+1; });
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const max    = sorted[0]?.[1] || 1;
  const el     = document.getElementById('languageList');
  if (!el) return;
  el.innerHTML = sorted.map(([lang, cnt]) => `
    <div class="lang-row">
      <span class="lang-name">${escHtml(lang)}</span>
      <div class="lang-bar-wrap"><div class="lang-bar" style="width:${(cnt/max)*100}%"></div></div>
      <span class="lang-count">${cnt}</span>
    </div>`).join('');
}

function renderSignupTimeline(users) {
  /* Group by date */
  const byDay = {};
  users.forEach(u => {
    if (!u.createdAt) return;
    const d = new Date(u.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
    byDay[d] = (byDay[d] || 0) + 1;
  });
  const sorted  = Object.entries(byDay).sort((a,b) => {
    return new Date(a[0]) - new Date(b[0]);
  }).slice(-14); /* last 14 days */
  const labels  = sorted.map(e => e[0]);
  const values  = sorted.map(e => e[1]);

  const ctx = document.getElementById('signupChart');
  if (!ctx) return;
  if (window._signupChart) window._signupChart.destroy();
  window._signupChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'New Users',
        data: values,
        backgroundColor: 'rgba(255,112,67,0.7)',
        borderColor: '#ff7043',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color:'rgba(255,255,255,0.45)', font:{ size:11 } }, grid:{ color:'rgba(255,255,255,0.04)' } },
        y: { ticks: { color:'rgba(255,255,255,0.45)', font:{ size:11 } }, grid:{ color:'rgba(255,255,255,0.07)' } }
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════
   ACTIONS
═══════════════════════════════════════════════════════ */
async function adminResetTrial(uid, name) {
  if (!confirm(`Reset trial count to 0 for ${name}?`)) return;
  showToast(`Resetting trial for ${name}…`, 'info');
  try {
    const resp = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: ADMIN_SECRET, action: 'resetTrial', uid })
    });
    const data = await resp.json();
    if (data.success) {
      showToast(`✅ Trial reset for ${name}`, 'success');
      /* Update local state */
      const u = _allUsers.find(u => u.uid === uid);
      if (u) u.trialUsed = 0;
      renderUsersTable(_allUsers);
    } else {
      showToast(`❌ Failed: ${data.error}`, 'error');
    }
  } catch (e) {
    showToast(`❌ Error: ${e.message}`, 'error');
  }
}

async function adminTogglePro(uid, name, grantPro) {
  const action = grantPro ? 'Grant Pro' : 'Revoke Pro';
  if (!confirm(`${action} for ${name}?`)) return;
  showToast(`${action} for ${name}…`, 'info');
  try {
    const resp = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: ADMIN_SECRET, action: 'setIsPro', uid, value: grantPro })
    });
    const data = await resp.json();
    if (data.success) {
      showToast(`✅ ${action} done for ${name}`, 'success');
      const u = _allUsers.find(u => u.uid === uid);
      if (u) u.isPro = grantPro;
      renderUsersTable(_allUsers);
    } else {
      showToast(`❌ Failed: ${data.error}`, 'error');
    }
  } catch (e) {
    showToast(`❌ Error: ${e.message}`, 'error');
  }
}

/* ── Search ── */
function adminSearch(val) {
  const term = val.toLowerCase().trim();
  if (!term) { renderUsersTable(_allUsers); return; }
  const filtered = _allUsers.filter(u =>
    (u.email||'').toLowerCase().includes(term) ||
    (u.name||'').toLowerCase().includes(term)  ||
    (u.country||'').toLowerCase().includes(term)
  );
  renderUsersTable(filtered);
}

/* ── Bulk Reset ── */
async function adminBulkReset() {
  const count = _allUsers.filter(u => !u.isAdmin && !u.isPro).length;
  if (!confirm(`Reset trial counts for ALL ${count} non-Pro, non-admin users? This cannot be undone.`)) return;
  showToast('Running bulk reset…', 'info');
  let done = 0;
  const targets = _allUsers.filter(u => !u.isAdmin && !u.isPro);
  for (const u of targets) {
    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: ADMIN_SECRET, action: 'resetTrial', uid: u.uid })
      });
      u.trialUsed = 0;
      done++;
    } catch (_) {}
  }
  renderUsersTable(_allUsers);
  showToast(`✅ Bulk reset done — ${done} users reset`, 'success');
}

/* ── CSV Export ── */
function exportCSV() {
  const header = ['UID','Name','Email','Country','Language','Trial Used','Is Pro','Is Admin','Created At'];
  const rows   = _allUsers.map(u => [
    u.uid, u.name, u.email, u.country, u.language,
    u.trialUsed, u.isPro, u.isAdmin,
    u.createdAt ? new Date(u.createdAt).toISOString() : ''
  ]);
  const csv  = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `clarix-users-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 CSV exported', 'success');
}

/* ── Refresh ── */
function adminRefresh() {
  showToast('Refreshing data…', 'info');
  loadStats();
  loadUsers(document.getElementById('searchInput')?.value || '');
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════ */
function showSection(name) {
  _activeSection = name;
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const section = document.getElementById(`section-${name}`);
  if (section) section.style.display = 'block';

  const navItem = document.querySelector(`.nav-item[data-section="${name}"]`);
  if (navItem) navItem.classList.add('active');

  /* Trigger chart redraw on insights tab */
  if (name === 'insights' && _allUsers.length) {
    setTimeout(() => renderInsights(_allUsers), 50);
  }
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
function showToast(msg, type = 'info') {
  const existing = document.getElementById('adminToast');
  if (existing) existing.remove();

  const colors = { success:'#22c55e', error:'#ef4444', info:'#ff7043', warning:'#f59e0b' };
  const t = document.createElement('div');
  t.id = 'adminToast';
  t.style.cssText = `
    position:fixed;bottom:28px;right:28px;z-index:9999;
    background:rgba(20,20,35,0.96);
    border:1px solid ${colors[type] || colors.info}44;
    border-left:3px solid ${colors[type] || colors.info};
    color:#fff;padding:14px 20px;border-radius:12px;
    font-size:14px;font-weight:500;
    box-shadow:0 8px 40px rgba(0,0,0,0.5);
    backdrop-filter:blur(20px);
    animation:toastIn 0.3s ease;
    max-width:360px;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(8px)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(),300); }, 3000);
}

/* ═══════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════ */
function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', adminInit);
