/* ═══════════════════════════════════════════════════════
   CLARIX — FIREBASE AUTH (No Firestore needed)
   Email/Password + Google sign-in
   All data stored in localStorage — works 100% offline
   Firestore can be added later when billing is enabled
═══════════════════════════════════════════════════════ */

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

  /* ── Init ── */
  async function init() {
    try {
      const { initializeApp } = await import(`${FB_CDN}/firebase-app.js`);
      const { getAuth, onAuthStateChanged, signInWithEmailAndPassword,
              createUserWithEmailAndPassword, signInWithPopup,
              GoogleAuthProvider, sendPasswordResetEmail,
              signOut, updateProfile }
        = await import(`${FB_CDN}/firebase-auth.js`);

      // Store on global for modal use
      window._fbAuth = {
        signInWithEmailAndPassword, createUserWithEmailAndPassword,
        signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail,
        signOut, updateProfile
      };

      const app = initializeApp(CLARIX_FIREBASE_CONFIG);
      _auth = getAuth(app);

      onAuthStateChanged(_auth, (user) => {
        _user  = user;
        _ready = true;
        if (user) _applyUserToApp(user);
        _authCallbacks.forEach(cb => cb(user));
        _updateNavUI(user);
      });

      console.log('[Clarix Firebase] ✅ Auth ready (localStorage mode)');
    } catch(e) {
      console.warn('[Clarix Firebase] Auth init failed:', e.message);
      _ready = true;
      _authCallbacks.forEach(cb => cb(null));
    }
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
  async function signInWithGoogle() {
    const fb       = window._fbAuth;
    const provider = new fb.GoogleAuthProvider();
    const cred     = await fb.signInWithPopup(_auth, provider);
    return cred.user;
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
    <div class="modal-overlay active" id="authModalOverlay" onclick="AuthModal._backdropClick(event)">
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
    <div class="modal-overlay active" id="authModalOverlay" onclick="AuthModal._backdropClick(event)">
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
    // animate in
    requestAnimationFrame(() => wrap.querySelector('.modal-box')?.classList.add('open'));
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
    try {
      await ClarixFirebase.signInWithGoogle();
      close();
      if (typeof Toast !== 'undefined') Toast.show('Signed in with Google ✦', 'success');
      if (typeof loadProfile === 'function') loadProfile();
    } catch(e) {
      if (typeof Toast !== 'undefined') Toast.show('Google sign-in failed. Try email.', 'error');
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
