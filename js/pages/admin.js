/* ═══════════════════════════════════════════════════════
   CLARIX ADMIN PORTAL — admin.js
   Loaded as a regular script (NO type=module) so all
   functions are global and onclick handlers work correctly.
═══════════════════════════════════════════════════════ */

/* ── Config ── */
var ADMIN_EMAILS  = ['vishalbirla700@gmail.com'];
var ADMIN_SECRET  = 'clarix-admin-2024';
var API_BASE      = '/api/admin-action';
var FB_CDN        = 'https://www.gstatic.com/firebasejs/10.11.0';
var CLARIX_FB_CFG = {
  apiKey:            "AIzaSyAM4ge2l11JSwtkC4Hzp9PDSjQDw-hAsZU",
  authDomain:        "clarix-firebase.firebaseapp.com",
  projectId:         "clarix-firebase",
  storageBucket:     "clarix-firebase.firebasestorage.app",
  messagingSenderId: "24399996790",
  appId:             "1:24399996790:web:1a337ec0707165fa123c57"
};

/* ── State ── */
var _auth = null, _db = null, _adminUser = null;
var _allUsers      = [];
var _activeSection = 'overview';

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
async function adminInit() {
  try {
    var fbApp  = await import(FB_CDN + '/firebase-app.js');
    var fbAuth = await import(FB_CDN + '/firebase-auth.js');
    var fbFs   = await import(FB_CDN + '/firebase-firestore.js');

    var app = fbApp.initializeApp(CLARIX_FB_CFG);
    _auth   = fbAuth.getAuth(app);
    _db     = fbFs.getFirestore(app);

    /* Store sign-out for sidebar button */
    window._adminSignOut = function() {
      fbAuth.signOut(_auth).then(function() { location.href = '/'; });
    };

    fbAuth.onAuthStateChanged(_auth, async function(user) {
      if (!user) { showAccessDenied('not-logged-in'); return; }

      try {
        var ref  = fbFs.doc(_db, 'users', user.uid);
        var snap = await fbFs.getDoc(ref);
        var profile = snap.exists() ? snap.data() : {};
        var isAdmin = !!profile.isAdmin || ADMIN_EMAILS.indexOf(user.email) !== -1;

        if (!isAdmin) { showAccessDenied('not-admin'); return; }

        _adminUser = user;
        hideGate();
        populateAdminUser(user, profile);
        loadDashboard();

      } catch (e) {
        console.error('[Admin] Firestore check failed:', e);
        if (ADMIN_EMAILS.indexOf(user.email) !== -1) {
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
  var gate = document.getElementById('adminGate');
  var main = document.getElementById('adminMain');
  if (main) main.style.display = 'none';

  var messages = {
    'not-logged-in': { icon: '🔐', title: 'Sign In Required',  sub: 'Please sign in with your admin Google account.' },
    'not-admin':     { icon: '🚫', title: 'Access Denied',     sub: 'Your account does not have admin privileges.' },
    'error':         { icon: '⚠️', title: 'Auth Error',        sub: 'Could not verify your admin status. Try refreshing.' }
  };
  var m = messages[reason] || messages['error'];

  if (gate) {
    gate.innerHTML =
      '<div class="gate-box">'
      + '<div class="gate-icon">' + m.icon + '</div>'
      + '<div class="gate-logo"><span class="logo-star">✦</span> clarix admin</div>'
      + '<div class="gate-title">' + m.title + '</div>'
      + '<div class="gate-sub">' + m.sub + '</div>'
      + '<button class="gate-btn" onclick="location.href=\'/\'">← Back to Clarix</button>'
      + '</div>';
    gate.style.display = 'flex';
  }
}

function hideGate() {
  var gate = document.getElementById('adminGate');
  var main = document.getElementById('adminMain');
  if (gate) { gate.style.opacity = '0'; setTimeout(function() { gate.remove(); }, 400); }
  if (main) main.style.display = 'flex';
}

function populateAdminUser(user, profile) {
  var nameEl   = document.getElementById('adminUserName');
  var emailEl  = document.getElementById('adminUserEmail');
  var avatarEl = document.getElementById('adminAvatar');
  var name     = user.displayName || profile.name || 'Admin';
  if (nameEl)  nameEl.textContent  = name;
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl) {
    if (user.photoURL) {
      avatarEl.innerHTML = '<img src="' + user.photoURL + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
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
    var resp = await fetch(API_BASE + '?action=getStats&secret=' + ADMIN_SECRET);
    var data = await resp.json();
    if (!data.success) throw new Error(data.error);
    animateCounter('statTotalUsers',   data.totalUsers   || 0);
    animateCounter('statProUsers',     data.proUsers     || 0);
    animateCounter('statTotalPrompts', data.totalPrompts || 0);
  } catch (e) {
    console.warn('[Admin] Stats fetch failed:', e.message);
  }
}

function animateCounter(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var duration = 800;
  var startTs  = performance.now();
  function step(now) {
    var elapsed  = now - startTs;
    var progress = Math.min(elapsed / duration, 1);
    var ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * ease).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Users ── */
async function loadUsers(search) {
  search = search || '';
  showTableLoading(true);
  try {
    var url  = API_BASE + '?action=getUsers&secret=' + ADMIN_SECRET + '&limit=500'
      + (search ? '&search=' + encodeURIComponent(search) : '');
    var resp = await fetch(url);
    var data = await resp.json();
    if (!data.success) throw new Error(data.error);
    _allUsers = data.users || [];
    renderUsersTable(_allUsers);

    /* Update "new today" */
    var today      = new Date().toDateString();
    var todayCount = _allUsers.filter(function(u) {
      return u.createdAt && new Date(u.createdAt).toDateString() === today;
    }).length;
    animateCounter('statNewToday', todayCount);

    renderInsights(_allUsers);
  } catch (e) {
    console.warn('[Admin] Users fetch failed:', e.message);
    var body = document.getElementById('usersTableBody');
    if (body) body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:rgba(255,255,255,0.3);padding:40px;">Failed to load users: ' + e.message + '</td></tr>';
  }
  showTableLoading(false);
}

function showTableLoading(on) {
  var loader = document.getElementById('tableLoader');
  if (loader) loader.style.display = on ? 'flex' : 'none';
}

/* ═══════════════════════════════════════════════════════
   RENDER — USERS TABLE
═══════════════════════════════════════════════════════ */
function renderUsersTable(users) {
  var body  = document.getElementById('usersTableBody');
  var count = document.getElementById('usersCount');
  if (!body) return;
  if (count) count.textContent = users.length + ' users';

  if (!users.length) {
    body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:rgba(255,255,255,0.3);padding:40px;">No users found</td></tr>';
    _refreshOverviewRecent();
    return;
  }

  body.innerHTML = users.map(function(u) {
    var createdDate = u.createdAt
      ? new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' })
      : '—';
    var proBadge   = u.isPro   ? '<span class="badge badge-pro">✦ Pro</span>'   : '<span class="badge badge-free">Free</span>';
    var adminBadge = u.isAdmin ? '<span class="badge badge-admin">Admin</span>' : '';
    var avatar     = u.photo
      ? '<img src="' + u.photo + '" onerror="this.style.display=\'none\';" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">'
      : '<span class="user-initials">' + (u.name || '?').charAt(0) + '</span>';
    var pct = Math.min(100, Math.round((u.trialUsed / 25) * 100));

    return '<tr>'
      + '<td><div style="display:flex;align-items:center;gap:10px;">'
      + '<div style="width:32px;height:32px;flex-shrink:0;">' + avatar + '</div>'
      + '<div><div style="font-weight:600;font-size:13px;color:#fff;">' + escHtml(u.name) + '</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,0.4);">' + escHtml(u.email) + '</div></div></div></td>'
      + '<td>' + (u.countryFlag || '') + ' <span style="font-size:12px;color:rgba(255,255,255,0.6);">' + escHtml(u.country || '—') + '</span></td>'
      + '<td style="font-size:12px;color:rgba(255,255,255,0.6);">' + escHtml(u.language || '—') + '</td>'
      + '<td><div style="display:flex;align-items:center;gap:6px;">'
      + '<div class="usage-bar-wrap"><div class="usage-bar" style="width:' + pct + '%;"></div></div>'
      + '<span style="font-size:12px;color:rgba(255,255,255,0.7);">' + u.trialUsed + '/25</span></div></td>'
      + '<td>' + proBadge + ' ' + adminBadge + '</td>'
      + '<td style="font-size:12px;color:rgba(255,255,255,0.45);">' + createdDate + '</td>'
      + '<td><div style="display:flex;gap:6px;flex-wrap:wrap;">'
      + '<button class="action-btn action-btn-orange" onclick="adminResetTrial(\'' + u.uid + '\',\'' + escHtml(u.name) + '\')">Reset Trial</button>'
      + '<button class="action-btn ' + (u.isPro ? 'action-btn-red' : 'action-btn-green') + '" onclick="adminTogglePro(\'' + u.uid + '\',\'' + escHtml(u.name) + '\',' + (!u.isPro) + ')">' + (u.isPro ? 'Revoke Pro' : 'Grant Pro') + '</button>'
      + '</div></td></tr>';
  }).join('');

  /* Refresh Recent Signups on Overview */
  _refreshOverviewRecent();
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
  var counts = {};
  users.forEach(function(u) {
    var key = (u.countryFlag || '') + ' ' + (u.country || 'Unknown');
    counts[key] = (counts[key] || 0) + 1;
  });
  var sorted = Object.entries(counts).sort(function(a,b) { return b[1]-a[1]; }).slice(0, 8);
  var labels = sorted.map(function(e) { return e[0]; });
  var values = sorted.map(function(e) { return e[1]; });

  var ctx = document.getElementById('countryChart');
  if (!ctx) return;
  if (window._countryChart) window._countryChart.destroy();
  window._countryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
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
  var counts = {};
  users.forEach(function(u) { var l = u.language || 'English'; counts[l] = (counts[l] || 0) + 1; });
  var sorted = Object.entries(counts).sort(function(a,b) { return b[1]-a[1]; }).slice(0, 8);
  var max    = sorted.length ? sorted[0][1] : 1;
  var el     = document.getElementById('languageList');
  if (!el) return;
  el.innerHTML = sorted.map(function(pair) {
    var lang = pair[0], cnt = pair[1];
    return '<div class="lang-row">'
      + '<span class="lang-name">' + escHtml(lang) + '</span>'
      + '<div class="lang-bar-wrap"><div class="lang-bar" style="width:' + Math.round((cnt/max)*100) + '%;"></div></div>'
      + '<span class="lang-count">' + cnt + '</span></div>';
  }).join('');
}

function renderSignupTimeline(users) {
  var byDay = {};
  users.forEach(function(u) {
    if (!u.createdAt) return;
    var d = new Date(u.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
    byDay[d] = (byDay[d] || 0) + 1;
  });
  var sorted = Object.entries(byDay).slice(-14);
  var labels = sorted.map(function(e) { return e[0]; });
  var values = sorted.map(function(e) { return e[1]; });

  var ctx = document.getElementById('signupChart');
  if (!ctx) return;
  if (window._signupChart) window._signupChart.destroy();
  window._signupChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'New Users', data: values,
        backgroundColor: 'rgba(255,112,67,0.7)',
        borderColor: '#ff7043', borderWidth: 1,
        borderRadius: 6, borderSkipped: false
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
  if (!confirm('Reset trial count to 0 for ' + name + '?')) return;
  showToast('Resetting trial for ' + name + '…', 'info');
  try {
    var resp = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: ADMIN_SECRET, action: 'resetTrial', uid: uid })
    });
    var data = await resp.json();
    if (data.success) {
      showToast('✅ Trial reset for ' + name, 'success');
      var u = _allUsers.find(function(x) { return x.uid === uid; });
      if (u) u.trialUsed = 0;
      renderUsersTable(_allUsers);
    } else {
      showToast('❌ Failed: ' + data.error, 'error');
    }
  } catch (e) {
    showToast('❌ Error: ' + e.message, 'error');
  }
}

async function adminTogglePro(uid, name, grantPro) {
  var action = grantPro ? 'Grant Pro' : 'Revoke Pro';
  if (!confirm(action + ' for ' + name + '?')) return;
  showToast(action + ' for ' + name + '…', 'info');
  try {
    var resp = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: ADMIN_SECRET, action: 'setIsPro', uid: uid, value: grantPro })
    });
    var data = await resp.json();
    if (data.success) {
      showToast('✅ ' + action + ' done for ' + name, 'success');
      var u = _allUsers.find(function(x) { return x.uid === uid; });
      if (u) u.isPro = grantPro;
      renderUsersTable(_allUsers);
    } else {
      showToast('❌ Failed: ' + data.error, 'error');
    }
  } catch (e) {
    showToast('❌ Error: ' + e.message, 'error');
  }
}

/* ── Search ── */
function adminSearch(val) {
  var term = (val || '').toLowerCase().trim();
  if (!term) { renderUsersTable(_allUsers); return; }
  var filtered = _allUsers.filter(function(u) {
    return (u.email || '').toLowerCase().indexOf(term) !== -1
      || (u.name || '').toLowerCase().indexOf(term) !== -1
      || (u.country || '').toLowerCase().indexOf(term) !== -1;
  });
  renderUsersTable(filtered);
}

/* ── Bulk Reset ── */
async function adminBulkReset() {
  var targets = _allUsers.filter(function(u) { return !u.isAdmin && !u.isPro; });
  if (!confirm('Reset trial counts for ALL ' + targets.length + ' non-Pro, non-admin users? This cannot be undone.')) return;
  showToast('Running bulk reset…', 'info');
  var done = 0;
  for (var i = 0; i < targets.length; i++) {
    var u = targets[i];
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
  showToast('✅ Bulk reset done — ' + done + ' users reset', 'success');
}

/* ── CSV Export ── */
function exportCSV() {
  var header = ['UID','Name','Email','Country','Language','Trial Used','Is Pro','Is Admin','Created At'];
  var rows   = _allUsers.map(function(u) {
    return [u.uid, u.name, u.email, u.country, u.language,
      u.trialUsed, u.isPro, u.isAdmin,
      u.createdAt ? new Date(u.createdAt).toISOString() : ''];
  });
  var csv  = [header].concat(rows).map(function(r) {
    return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
  }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'clarix-users-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 CSV exported', 'success');
}

/* ── Refresh ── */
function adminRefresh() {
  showToast('Refreshing data…', 'info');
  loadStats();
  var search = document.getElementById('searchInput');
  loadUsers(search ? search.value : '');
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════ */
function showSection(name) {
  _activeSection = name;
  document.querySelectorAll('.admin-section').forEach(function(s) { s.style.display = 'none'; });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });

  var section = document.getElementById('section-' + name);
  if (section) section.style.display = 'block';

  var navItem = document.querySelector('.nav-item[data-section="' + name + '"]');
  if (navItem) navItem.classList.add('active');

  /* Redraw charts when Insights tab becomes visible */
  if (name === 'insights' && _allUsers.length) {
    setTimeout(function() { renderInsights(_allUsers); }, 50);
  }

  /* Load push stats when Push Alerts tab becomes visible */
  if (name === 'push' && typeof loadPushStats === 'function') {
    loadPushStats();
  }
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
function showToast(msg, type) {
  type = type || 'info';
  var existing = document.getElementById('adminToast');
  if (existing) existing.remove();

  var colors = { success:'#22c55e', error:'#ef4444', info:'#ff7043', warning:'#f59e0b' };
  var color  = colors[type] || colors.info;

  var t = document.createElement('div');
  t.id  = 'adminToast';
  t.style.cssText =
    'position:fixed;bottom:28px;right:28px;z-index:9999;'
    + 'background:rgba(20,20,35,0.96);'
    + 'border:1px solid ' + color + '44;'
    + 'border-left:3px solid ' + color + ';'
    + 'color:#fff;padding:14px 20px;border-radius:12px;'
    + 'font-size:14px;font-weight:500;'
    + 'box-shadow:0 8px 40px rgba(0,0,0,0.5);'
    + 'backdrop-filter:blur(20px);'
    + 'animation:toastIn 0.3s ease;'
    + 'max-width:360px;font-family:Inter,sans-serif;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateY(8px)';
    t.style.transition = 'all 0.3s';
    setTimeout(function() { t.remove(); }, 300);
  }, 3000);
}

/* ═══════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════ */
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* Recent signups mini-list on Overview tab */
function _refreshOverviewRecent() {
  var recent = _allUsers.slice(0, 5);
  var el     = document.getElementById('recentUsersPreview');
  if (!el) return;
  if (!recent.length) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:rgba(255,255,255,0.3);font-size:13px;">No users yet</div>';
    return;
  }
  el.innerHTML = recent.map(function(u) {
    var date   = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : '—';
    var avatar = u.photo
      ? '<img src="' + u.photo + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" onerror="this.style.display=\'none\'">'
      : '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ff7043,#e53935);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;">' + (u.name || '?').charAt(0) + '</div>';
    return '<div style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">'
      + avatar
      + '<div style="flex:1;"><div style="font-size:13px;font-weight:600;color:#fff;">' + escHtml(u.name) + '</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,0.3);">' + escHtml(u.email) + '</div></div>'
      + '<div style="text-align:right;"><div style="font-size:11px;color:rgba(255,255,255,0.3);">' + date + '</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,0.5);">' + (u.countryFlag || '') + ' ' + escHtml(u.country || '—') + '</div></div></div>';
  }).join('');
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', adminInit);
