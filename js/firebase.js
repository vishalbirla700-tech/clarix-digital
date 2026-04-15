/* ═══════════════════════════════════════════════════════
   CLARIX — FIREBASE AUTH
   Immediate auth gate + Google sign-in (redirect on mobile)
═══════════════════════════════════════════════════════ */

/* ── IMMEDIATE GATE IIFE ──
   Runs synchronously when this script loads (bottom of body).
   Shows a blocking overlay instantly if user is not logged in,
   before Firebase SDK even loads. No delay. */
;(function clarixImmediateGate() {
  var PROTECTED = [
    '/library','/library.html',
    '/history','/history.html','/profile','/profile.html',
    '/breakdown','/breakdown.html','/community','/community.html'
  ];
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  var isProtected = PROTECTED.some(function(p) { return path === p || path.endsWith(p); });
  if (!isProtected) return;
  if (localStorage.getItem('clarix_uid')) return; /* already logged in */

  /* Show instant loading overlay — replaced by full gate once Firebase loads */
  var el = document.createElement('div');
  el.id = 'clarix-early-gate';
  el.style.cssText = [
    'position:fixed;top:0;left:0;right:0;bottom:0',
    'background:linear-gradient(135deg,#0f0f1a 0%,#1a0825 40%,#0a1a0f 100%)',
    'z-index:99998;display:flex;align-items:center;justify-content:center',
    'flex-direction:column;gap:16px'
  ].join(';');
  el.innerHTML = '<div style="font-size:34px;font-weight:900;color:#fff;letter-spacing:-1px;">'
    + '<span style="color:#ff7043;">✦</span> clarix</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.35);letter-spacing:2px;">LOADING...</div>';
  document.body.appendChild(el);
  document.body.style.overflow = 'hidden';
})();

const CLARIX_FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAM4ge2l11JSwtkC4Hzp9PDSjQDw-hAsZU",
  authDomain:        "clarix-firebase.firebaseapp.com",
  projectId:         "clarix-firebase",
  storageBucket:     "clarix-firebase.firebasestorage.app",
  messagingSenderId: "24399996790",
  appId:             "1:24399996790:web:1a337ec0707165fa123c57",
  measurementId:     "G-01WJLJZGXE"
};

const FB_CDN = 'https://www.gstatic.com/firebasejs/10.11.0';

/* ─── FIREBASE MANAGER (Auth-only) ─────────────────── */
const ClarixFirebase = (() => {
  let _auth = null;
  let _user = null;
  let _ready = false;
  let _authCallbacks = [];

  /* ── Mobile detection — popup is blocked on mobile ── */
  function _isMobile() {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /* ── Init ── */
  async function init() {
    try {
      const { initializeApp } = await import(`${FB_CDN}/firebase-app.js`);
      const { getAuth, onAuthStateChanged, signInWithEmailAndPassword,
              createUserWithEmailAndPassword, signInWithPopup,
              signInWithRedirect, getRedirectResult,
              GoogleAuthProvider, sendPasswordResetEmail,
              signOut, updateProfile }
        = await import(`${FB_CDN}/firebase-auth.js`);

      // Store on global for modal use
      window._fbAuth = {
        signInWithEmailAndPassword, createUserWithEmailAndPassword,
        signInWithPopup, signInWithRedirect, getRedirectResult,
        GoogleAuthProvider, sendPasswordResetEmail,
        signOut, updateProfile
      };

      const app = initializeApp(CLARIX_FIREBASE_CONFIG);
      _auth = getAuth(app);

      /* ── Handle redirect result (mobile Google sign-in flow) ── */
      try {
        const result = await getRedirectResult(_auth);
        if (result && result.user) {
          console.log('[Clarix Firebase] Redirect sign-in success:', result.user.email);
          AuthModal.close();
          if (typeof Toast !== 'undefined') Toast.show('Signed in with Google ✦', 'success');
        }
      } catch(redirErr) {
        console.warn('[Clarix Firebase] Redirect result error:', redirErr.message);
        /* Reset any stuck Google button */
        const gBtns = document.querySelectorAll('.btn-google');
        gBtns.forEach(btn => {
          btn.disabled = false;
          btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="G"> Continue with Google';
        });
      }

      onAuthStateChanged(_auth, (user) => {
        _user  = user;
        _ready = true;
        if (user) {
          _applyUserToApp(user);
          /* ── Remove forced auth gate if it was showing ── */
          const gate = document.getElementById('clarix-force-auth');
          if (gate) {
            gate.style.transition = 'opacity 0.5s';
            gate.style.opacity = '0';
            setTimeout(() => { gate.remove(); document.body.style.overflow = ''; }, 500);
          }
          /* ── Trigger onboarding NOW (after auth) if not yet completed ── */
          if (localStorage.getItem('clarix_onboarded') !== 'true' && typeof Onboarding !== 'undefined') {
            setTimeout(() => { Onboarding.render(); Onboarding.show(); }, 600);
          }
        } else {
          /* Not signed in — show forced auth gate on protected pages */
          _showForcedAuth();
        }
        _authCallbacks.forEach(cb => cb(user));
        _updateNavUI(user);
      });

      console.log('[Clarix Firebase] ✅ Auth ready');
    } catch(e) {
      console.warn('[Clarix Firebase] Auth init failed:', e.message);
      _ready = true;
      _authCallbacks.forEach(cb => cb(null));
    }
  }

  /* ── Forced Auth Gate ──
     Shows a full-screen sign-in overlay on all protected pages.
     Public pages (marketing/legal) are excluded. */
  const _PUBLIC_PAGES = [
    '/', '/index.html',
    '/about', '/about.html',
    '/terms', '/terms.html',
    '/privacy', '/privacy.html',
    '/refund', '/refund.html',
    '/onepager', '/clarix-onepager.html',
    '/indias-first-ai-prompt-engine'
  ];

  function _isProtectedPage() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    return !_PUBLIC_PAGES.some(p => path === p || path.endsWith(p));
  }

  function _showForcedAuth() {
    if (!_isProtectedPage()) return;
    if (document.getElementById('clarix-force-auth')) return;

    /* Remove the early loading gate (shown by the IIFE) */
    var early = document.getElementById('clarix-early-gate');
    if (early) early.remove();

    const overlay = document.createElement('div');
    overlay.id = 'clarix-force-auth';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:linear-gradient(135deg,#0f0f1a 0%,#1a0825 40%,#0a1a0f 100%);
      z-index:99999;display:flex;align-items:center;justify-content:center;
      padding:20px;box-sizing:border-box;
      animation:clarix-gate-in 0.4s ease;
    `;
    overlay.innerHTML = `
      <style>
        @keyframes clarix-gate-in { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        @keyframes clarix-gate-pulse { 0%,100%{box-shadow:0 0 60px rgba(255,112,67,0.15)} 50%{box-shadow:0 0 100px rgba(255,112,67,0.3)} }
        #clarix-gate-box { animation: clarix-gate-pulse 3s ease-in-out infinite; }
        #clarix-force-google-btn:hover { transform:translateY(-2px)!important; box-shadow:0 8px 40px rgba(0,0,0,0.5)!important; }
      </style>
      <div id="clarix-gate-box" style="
        background:rgba(255,255,255,0.04);
        border:1px solid rgba(255,255,255,0.1);
        border-radius:28px;
        padding:44px 36px;
        max-width:420px;width:100%;
        text-align:center;
        backdrop-filter:blur(24px);
      ">
        <div style="font-size:36px;font-weight:900;color:#fff;letter-spacing:-1.5px;margin-bottom:6px;">
          <span style="color:#ff7043;">✦</span> clarix
        </div>
        <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,112,67,0.7);margin-bottom:20px;font-weight:600;">AI Prompt Engine</div>
        <div style="font-size:16px;color:rgba(255,255,255,0.85);margin-bottom:6px;font-weight:600;">Welcome to India's First AI Prompt Engine</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:32px;line-height:1.7;">
          Sign in to unlock <strong style="color:#ff7043;">25 free prompts</strong> — works in Hindi,<br>Gujarati, English &amp; 20+ languages.
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:28px;text-align:left;">
          <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;font-size:13px;color:rgba(255,255,255,0.6);">
            <span style="font-size:16px;">📱</span> Works on mobile &amp; desktop
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;font-size:13px;color:rgba(255,255,255,0.6);">
            <span style="font-size:16px;">🌍</span> Personalised for your country &amp; language
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;font-size:13px;color:rgba(255,255,255,0.6);">
            <span style="font-size:16px;">🔒</span> Secure &middot; No password needed
          </div>
        </div>
        <button id="clarix-force-google-btn" style="
          width:100%;padding:15px 20px;
          background:#fff;color:#333;
          border:none;border-radius:14px;
          font-size:15px;font-weight:700;
          cursor:pointer;
          display:flex;align-items:center;justify-content:center;gap:12px;
          transition:all 0.25s ease;
          box-shadow:0 4px 24px rgba(0,0,0,0.4);
          margin-bottom:18px;
        ">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="G">
          Continue with Google
        </button>
        <div style="font-size:11px;color:rgba(255,255,255,0.25);line-height:1.6;">
          By signing in you agree to our
          <a href="/terms" style="color:rgba(255,255,255,0.4);text-decoration:underline;">Terms</a> &amp;
          <a href="/privacy" style="color:rgba(255,255,255,0.4);text-decoration:underline;">Privacy Policy</a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const btn = document.getElementById('clarix-force-google-btn');
    btn.onclick = async function() {
      btn.disabled = true;
      btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="G" style="opacity:0.5;"> <span style="opacity:0.7;">Opening Google…</span>';
      try {
        await ClarixFirebase.signInWithGoogle();
        /* Desktop: popup closes, onAuthStateChanged fires = gate removes itself */
        /* Mobile:  page redirects to Google — nothing more to do here */
      } catch(e) {
        btn.disabled = false;
        btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="G"> Continue with Google';
        console.warn('Auth gate error:', e.message);
      }
    };
  }

  /* ── Apply signed-in user to Clarix state ── */
  function _applyUserToApp(user) {
    const name = user.displayName || user.email?.split('@')[0] || 'Creator';
    // Update Clarix username to match Firebase name
    if (typeof ClarixState !== 'undefined') {
      ClarixState.username = name;
    }
    // Save uid to localStorage for future use
    localStorage.setItem('clarix_uid',   user.uid);
    localStorage.setItem('clarix_email', user.email || '');
    localStorage.setItem('clarix_uname', name);
  }

  /* ── Sign Up ── */
  async function signUp(email, password, displayName) {
    const fb   = window._fbAuth;
    const cred = await fb.createUserWithEmailAndPassword(_auth, email, password);
    await fb.updateProfile(cred.user, { displayName });
    _applyUserToApp({ ...cred.user, displayName });
    return cred.user;
  }

  /* ── Sign In ── */
  async function signIn(email, password) {
    const cred = await window._fbAuth.signInWithEmailAndPassword(_auth, email, password);
    return cred.user;
  }

  /* ── Google Sign In ── */
  /* Mobile: redirect (popup is blocked by Android/iOS browsers)
     Desktop: popup for instant UX */
  async function signInWithGoogle() {
    const fb       = window._fbAuth;
    const provider = new fb.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    /* Force account chooser — never show email text input */
    provider.setCustomParameters({ prompt: 'select_account' });

    if (_isMobile()) {
      /* Redirect — page reloads after Google auth, result handled in init() */
      await fb.signInWithRedirect(_auth, provider);
      return null; /* page will redirect */
    } else {
      const cred = await fb.signInWithPopup(_auth, provider);
      return cred.user;
    }
  }

  /* ── Sign Out ── */
  async function logOut() {
    await window._fbAuth.signOut(_auth);
    _user = null;
    localStorage.removeItem('clarix_uid');
    localStorage.removeItem('clarix_email');
    localStorage.removeItem('clarix_uname');
    if (typeof ClarixState !== 'undefined') {
      ClarixState.username = 'Creator';
    }
    if (typeof Toast !== 'undefined') Toast.show('Signed out', 'info');
  }

  /* ── Password Reset ── */
  async function resetPassword(email) {
    await window._fbAuth.sendPasswordResetEmail(_auth, email);
  }

  /* ── Update display name ── */
  async function updateName(name) {
    if (!_user) return;
    await window._fbAuth.updateProfile(_user, { displayName: name });
    _applyUserToApp({ ..._user, displayName: name });
  }

  /* ── Nav UI ── */
  function _updateNavUI(user) {
    const btn = document.getElementById('authNavBtn');
    if (!btn) return;
    if (user) {
      const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
      btn.innerHTML = `<span class="nav-avatar" title="${user.displayName || user.email}">${initial}</span>`;
      btn.onclick = () => AuthModal.showProfile();
    } else {
      btn.innerHTML = 'Login';
      btn.onclick = () => AuthModal.show();
    }
  }

  /* ── Getters ── */
  function getUser()    { return _user; }
  function isLoggedIn() { return !!_user; }
  function onAuthChange(cb) {
    _authCallbacks.push(cb);
    if (_ready) cb(_user); // fire immediately if already resolved
  }

  return {
    init, signUp, signIn, signInWithGoogle,
    logOut, resetPassword, updateName,
    getUser, isLoggedIn, onAuthChange
  };
})();

/* ─── AUTH MODAL ────────────────────────────────────── */
const AuthModal = (() => {

  function _html() {
    return `
    <div class="modal-overlay" id="authModalOverlay" onclick="AuthModal._backdropClick(event)">
      <div class="modal-box auth-modal-box">
        <div class="auth-tabs">
          <button class="auth-tab active" id="authTabLogin" onclick="AuthModal._tab('login')">Sign In</button>
          <button class="auth-tab"        id="authTabSignup" onclick="AuthModal._tab('signup')">Sign Up</button>
        </div>

        <!-- LOGIN -->
        <form id="authLoginForm" class="auth-form" onsubmit="AuthModal._login(event)">
          <div class="auth-title">Welcome back 👋</div>
          <div class="auth-sub">Sign in to keep your prompts forever</div>
          <div class="auth-field">
            <label>Email</label>
            <input type="email" id="authEmail" class="auth-input" placeholder="you@example.com" required autocomplete="email">
          </div>
          <div class="auth-field">
            <label>Password</label>
            <input type="password" id="authPass" class="auth-input" placeholder="••••••••" required>
          </div>
          <div id="authErr" class="auth-error" style="display:none"></div>
          <button type="submit" class="btn btn-primary w-full" id="authLoginBtn">Sign In →</button>
          <div class="auth-divider"><span>or</span></div>
          <button type="button" class="btn btn-google w-full" onclick="AuthModal._google()">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="G">
            Continue with Google
          </button>
          <div class="auth-forgot"><a href="#" onclick="AuthModal._forgot(event)">Forgot password?</a></div>
        </form>

        <!-- SIGNUP -->
        <form id="authSignupForm" class="auth-form" style="display:none" onsubmit="AuthModal._signup(event)">
          <div class="auth-title">Create account ✦</div>
          <div class="auth-sub">Free forever. No credit card needed.</div>
          <div class="auth-field">
            <label>Your Name</label>
            <input type="text" id="authName" class="auth-input" placeholder="Vishal" required>
          </div>
          <div class="auth-field">
            <label>Email</label>
            <input type="email" id="authEmailSU" class="auth-input" placeholder="you@example.com" required autocomplete="email">
          </div>
          <div class="auth-field">
            <label>Password</label>
            <input type="password" id="authPassSU" class="auth-input" placeholder="Min. 6 characters" required minlength="6">
          </div>
          <div id="authErrSU" class="auth-error" style="display:none"></div>
          <button type="submit" class="btn btn-primary w-full" id="authSignupBtn">Create Account →</button>
          <div class="auth-divider"><span>or</span></div>
          <button type="button" class="btn btn-google w-full" onclick="AuthModal._google()">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="G">
            Continue with Google
          </button>
        </form>

        <button class="modal-close" onclick="AuthModal.close()">✕</button>
      </div>
    </div>`;
  }

  function show() {
    if (ClarixFirebase.isLoggedIn()) { showProfile(); return; }
    _inject(_html());
  }

  function showProfile() {
    const user = ClarixFirebase.getUser();
    if (!user) { show(); return; }
    const name  = user.displayName || localStorage.getItem('clarix_uname') || 'Creator';
    const email = user.email || '';
    const isPro = typeof ClarixState !== 'undefined' && ClarixState.isPro;
    _inject(`
    <div class="modal-overlay" id="authModalOverlay" onclick="AuthModal._backdropClick(event)">
      <div class="modal-box auth-modal-box">
        <div class="auth-profile-view">
          <div class="auth-profile-avatar">${name.charAt(0).toUpperCase()}</div>
          <div class="auth-profile-name">${name}</div>
          <div class="auth-profile-email">${email}</div>
          <div class="auth-profile-tag">${isPro ? '✦ Pro Member' : '🆓 Free Plan'}</div>
          <button class="btn btn-secondary w-full" onclick="AuthModal.close();location.href='profile.html'" style="margin-bottom:10px">
            📊 View Profile & Analytics
          </button>
          <button class="btn btn-ghost w-full" onclick="AuthModal._logout()">Sign Out</button>
        </div>
        <button class="modal-close" onclick="AuthModal.close()">✕</button>
      </div>
    </div>`);
  }

  function _inject(html) {
    close();
    const wrap = document.createElement('div');
    wrap.id = 'authModalRoot';
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
    // Animate in — trigger open class on the overlay
    requestAnimationFrame(() => {
      const overlay = wrap.querySelector('.modal-overlay');
      if (overlay) overlay.classList.add('open');
    });
    document.addEventListener('keydown', _esc);
  }

  function close() {
    document.getElementById('authModalRoot')?.remove();
    document.removeEventListener('keydown', _esc);
  }

  function _esc(e) { if (e.key === 'Escape') close(); }
  function _backdropClick(e) { if (e.target.id === 'authModalOverlay') close(); }

  function _tab(t) {
    document.getElementById('authLoginForm').style.display  = t === 'login'  ? 'block' : 'none';
    document.getElementById('authSignupForm').style.display = t === 'signup' ? 'block' : 'none';
    document.getElementById('authTabLogin').classList.toggle('active',  t === 'login');
    document.getElementById('authTabSignup').classList.toggle('active', t === 'signup');
  }

  function _err(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  async function _login(e) {
    e.preventDefault();
    const btn = document.getElementById('authLoginBtn');
    btn.textContent = 'Signing in…'; btn.disabled = true;
    try {
      await ClarixFirebase.signIn(
        document.getElementById('authEmail').value.trim(),
        document.getElementById('authPass').value
      );
      close();
      if (typeof Toast !== 'undefined') Toast.show('Welcome back! 👋', 'success');
      if (typeof loadProfile === 'function') loadProfile();
    } catch(err) {
      _err('authErr', _msg(err.code));
      btn.textContent = 'Sign In →'; btn.disabled = false;
    }
  }

  async function _signup(e) {
    e.preventDefault();
    const btn  = document.getElementById('authSignupBtn');
    const name = document.getElementById('authName').value.trim();
    btn.textContent = 'Creating…'; btn.disabled = true;
    try {
      await ClarixFirebase.signUp(
        document.getElementById('authEmailSU').value.trim(),
        document.getElementById('authPassSU').value,
        name
      );
      close();
      if (typeof Toast !== 'undefined') Toast.show(`Welcome to Clarix, ${name}! ✦`, 'success');
      if (typeof loadProfile === 'function') loadProfile();
    } catch(err) {
      _err('authErrSU', _msg(err.code));
      btn.textContent = 'Create Account →'; btn.disabled = false;
    }
  }

  async function _google() {
    const btns = document.querySelectorAll('.btn-google');
    btns.forEach(btn => {
      btn.disabled = true;
      btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="G" style="opacity:0.5;"> Opening Google…';
    });
    try {
      const user = await ClarixFirebase.signInWithGoogle();
      /* On mobile: signInWithGoogle triggers a redirect — page navigates away.
         user will be null. Don't try to close/toast — just wait for redirect. */
      if (user) {
        /* Desktop popup success */
        close();
        if (typeof Toast !== 'undefined') Toast.show('Signed in with Google ✦', 'success');
        if (typeof loadProfile === 'function') loadProfile();
      }
      /* On mobile: page is already redirecting, nothing more to do */
    } catch(e) {
      btns.forEach(btn => {
        btn.disabled = false;
        btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="G"> Continue with Google';
      });
      if (typeof Toast !== 'undefined') Toast.show('Google sign-in failed. Try again.', 'error');
      console.warn('Google sign-in error:', e.message);
    }
  }

  async function _forgot(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail')?.value?.trim();
    if (!email) { _err('authErr', 'Enter your email first'); return; }
    try {
      await ClarixFirebase.resetPassword(email);
      _err('authErr', '✅ Reset link sent! Check your inbox.');
      document.getElementById('authErr').style.color = '#22c55e';
    } catch(ex) {
      _err('authErr', _msg(ex.code));
    }
  }

  async function _logout() {
    await ClarixFirebase.logOut();
    close();
    if (typeof updateUsageCounter === 'function') updateUsageCounter();
    if (typeof loadProfile === 'function') loadProfile();
  }

  function _msg(code) {
    return ({
      'auth/user-not-found':        'No account found. Sign up instead?',
      'auth/wrong-password':        'Incorrect password. Try again.',
      'auth/invalid-credential':    'Email or password is incorrect.',
      'auth/email-already-in-use':  'Email already registered. Sign in instead.',
      'auth/weak-password':         'Password too weak. Use 6+ characters.',
      'auth/invalid-email':         'Please enter a valid email.',
      'auth/too-many-requests':     'Too many attempts. Try again later.',
      'auth/network-request-failed':'No internet. Check your connection.',
      'auth/popup-blocked':         'Popup blocked. Allow popups for this site.',
      'auth/cancelled-popup-request': 'Sign-in cancelled.',
    })[code] || 'Something went wrong. Please try again.';
  }

  return {
    show, showProfile, close,
    _backdropClick, _tab, _login, _signup,
    _google, _forgot, _logout
  };

})();

/* ─── AUTO-INIT ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ClarixFirebase.init();
});
