/* ═══════════════════════════════════════════════
   CLARIX — PWA MANAGER
   Handles: update detection, install banner,
            SW message listener, version checks
═══════════════════════════════════════════════ */

/* ── BUMP THIS every deployment to notify existing users ── */
const CLARIX_APP_VERSION = '20260413k';

const ClarixPWA = (() => {

  /* ── CSS for animations (injected once) ── */
  function _injectStyles() {
    if (document.getElementById('clarix-pwa-css')) return;
    const s = document.createElement('style');
    s.id = 'clarix-pwa-css';
    s.textContent = `
      @keyframes clarix-slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);   opacity: 1; }
      }
      @keyframes clarix-fade-in {
        from { opacity: 0; transform: scale(0.97) translateY(8px); }
        to   { opacity: 1; transform: scale(1)    translateY(0px); }
      }
      #clarix-update-banner { animation: clarix-slide-up 0.4s cubic-bezier(.16,1,.3,1); }
      #clarix-install-banner { animation: clarix-slide-up 0.5s cubic-bezier(.16,1,.3,1); }
    `;
    document.head.appendChild(s);
  }

  /* ════════════════════════════════════════════
     1. VERSION CHECK — Show update banner if
        the stored version doesn't match current
  ════════════════════════════════════════════ */
  function checkVersion() {
    const stored = localStorage.getItem('clarix_version');
    if (stored && stored !== CLARIX_APP_VERSION) {
      /* Show banner ONCE — stamp new version immediately so it never shows
         again on the next page, whether or not user taps Update Now */
      localStorage.setItem('clarix_version', CLARIX_APP_VERSION);
      _showUpdateBanner('🆕 Clarix has new features! Tap to reload.');
    } else {
      localStorage.setItem('clarix_version', CLARIX_APP_VERSION);
    }
  }

  /* ── Update Available Banner ── */
  function _showUpdateBanner(message) {
    if (document.getElementById('clarix-update-banner')) return;
    _injectStyles();

    const banner = document.createElement('div');
    banner.id = 'clarix-update-banner';
    banner.style.cssText = [
      'position:fixed;bottom:72px;left:12px;right:12px',
      'background:linear-gradient(135deg,#ff7043,#e64a19)',
      'border-radius:16px;padding:14px 16px',
      'display:flex;align-items:center;gap:12px',
      'z-index:10000;box-shadow:0 8px 40px rgba(255,112,67,0.45)',
      'max-width:500px;margin:0 auto'
    ].join(';');

    banner.innerHTML = `
      <div style="font-size:22px;flex-shrink:0">🆕</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:800;color:#fff;line-height:1.2">${message}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-top:3px;">Tap Update Now for the latest version</div>
      </div>
      <button
        onclick="ClarixPWA._applyUpdate()"
        style="background:rgba(255,255,255,0.22);border:1.5px solid rgba(255,255,255,0.5);
               color:#fff;padding:9px 14px;border-radius:10px;font-size:12px;
               font-weight:800;cursor:pointer;white-space:nowrap;flex-shrink:0">
        Update Now
      </button>
      <button
        onclick="localStorage.setItem('clarix_version','${CLARIX_APP_VERSION}');this.closest('#clarix-update-banner').remove()"
        style="background:none;border:none;color:rgba(255,255,255,0.55);
               font-size:20px;cursor:pointer;line-height:1;padding:0;flex-shrink:0">✕</button>
    `;

    document.body.appendChild(banner);

    /* Auto-dismiss after 30 seconds */
    setTimeout(() => { banner.style.opacity='0'; banner.style.transition='opacity 0.5s'; setTimeout(() => banner.remove(), 500); }, 30000);
  }

  /* ════════════════════════════════════════════
     2. SERVICE WORKER UPDATE LISTENER
        SW posts SW_UPDATED — we show the banner
  ════════════════════════════════════════════ */

  /* Stored reference to a waiting SW so we can tell it to skip waiting */
  let _waitingSW = null;

  function listenForSWUpdates() {
    if (!navigator.serviceWorker) return;
    /* Just trigger a background SW update check on each page load.
       We do NOT hook SW_UPDATED messages or reg.waiting here —
       checkVersion() is the single source of truth for banner display.
       Multiple banner triggers (SW message + version check) caused
       the banner to appear on every page after an update. */
    navigator.serviceWorker.ready
      .then((reg) => reg.update())
      .catch(() => {});
  }

  /* ════════════════════════════════════════════
     3. CUSTOM PWA INSTALL BANNER
        Intercepts the native "Add to Home Screen"
        and replaces it with a branded explainer
  ════════════════════════════════════════════ */
  let _deferredPrompt = null;

  function interceptInstall() {
    /* Capture the native install event before it shows */
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      _deferredPrompt = e;

      /* Show our custom banner — only once, after user has been on the page 25s */
      const alreadyShown   = localStorage.getItem('clarix_install_banner_shown');
      const alreadyInstall = localStorage.getItem('clarix_installed');
      if (!alreadyShown && !alreadyInstall) {
        setTimeout(_showInstallBanner, 25000);
      }
    });

    window.addEventListener('appinstalled', () => {
      localStorage.setItem('clarix_installed', 'true');
      _hideInstallBanner();
      if (typeof Toast !== 'undefined') {
        Toast.show('🎉 Clarix added to home screen! Open it from there.', 'success', 5000);
      }
    });
  }

  function _showInstallBanner() {
    if (document.getElementById('clarix-install-banner')) return;
    _injectStyles();
    localStorage.setItem('clarix_install_banner_shown', 'true');

    const banner = document.createElement('div');
    banner.id = 'clarix-install-banner';
    banner.style.cssText = [
      'position:fixed;bottom:0;left:0;right:0',
      'background:linear-gradient(180deg,#1a0f2e,#0f0f1a)',
      'border-top:1px solid rgba(255,112,67,0.35)',
      'padding:18px 16px 36px;z-index:10000',
      'box-shadow:0 -20px 60px rgba(0,0,0,0.6)'
    ].join(';');

    banner.innerHTML = `
      <div style="max-width:440px;margin:0 auto">

        <!-- App header -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:48px;height:48px;background:linear-gradient(135deg,#ff7043,#ff5722);
                      border-radius:14px;display:flex;align-items:center;justify-content:center;
                      font-size:24px;font-weight:900;color:#fff;flex-shrink:0">✦</div>
          <div style="flex:1">
            <div style="font-size:17px;font-weight:900;color:#fff;letter-spacing:-0.5px">Clarix AI</div>
            <div style="font-size:12px;color:rgba(255,112,67,0.9);font-weight:600">India's First AI Prompt Engine — Made for you 🇮🇳</div>
          </div>
          <button onclick="_clarixHideInstall()"
            style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);
                   color:rgba(255,255,255,0.5);width:32px;height:32px;border-radius:50%;
                   font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
        </div>

        <!-- Feature pills -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px">
          ${[['📶','Works Offline'],['⚡','Instant Open'],['🔒','100% Free'],['🇮🇳','Indian AI']].map(([icon,label])=>`
            <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);
                        border-radius:10px;padding:8px 4px;text-align:center">
              <div style="font-size:18px">${icon}</div>
              <div style="font-size:10px;color:rgba(255,255,255,0.6);margin-top:3px;font-weight:600;line-height:1.2">${label}</div>
            </div>`).join('')}
        </div>

        <!-- Description -->
        <div style="font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6;margin-bottom:14px">
          This is Clarix — an AI prompt engine built for Indian creators. Write in Hindi, Gujarati, English
          and 20+ languages. Works like a native app. No Play Store install needed.
        </div>

        <!-- Buttons -->
        <div style="display:flex;gap:8px">
          <button onclick="_clarixHideInstall()"
            style="flex:1;padding:13px;background:rgba(255,255,255,0.06);
                   border:1px solid rgba(255,255,255,0.12);border-radius:12px;
                   color:rgba(255,255,255,0.55);font-size:13px;font-weight:600;cursor:pointer">
            Maybe later
          </button>
          <button onclick="ClarixPWA.triggerInstall()"
            style="flex:2;padding:13px;background:linear-gradient(135deg,#ff7043,#e64a19);
                   border:none;border-radius:12px;color:#fff;font-size:14px;
                   font-weight:800;cursor:pointer;box-shadow:0 4px 20px rgba(255,112,67,0.35)">
            📲 Add to Home Screen — Free
          </button>
        </div>

        <div style="text-align:center;font-size:11px;color:rgba(255,255,255,0.2);margin-top:10px">
          This is the official Clarix app by Clarix.digital · clarix.digital
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    /* Make close function globally accessible */
    window._clarixHideInstall = _hideInstallBanner;
  }

  function _hideInstallBanner() {
    const b = document.getElementById('clarix-install-banner');
    if (b) { b.style.transition = 'transform 0.4s,opacity 0.4s'; b.style.transform = 'translateY(100%)'; b.style.opacity = '0'; setTimeout(() => b.remove(), 400); }
  }

  function triggerInstall() {
    if (!_deferredPrompt) {
      /* Fallback instructions if prompt already fired */
      if (typeof Toast !== 'undefined') {
        Toast.show('Open browser menu → "Add to Home Screen" to install Clarix', 'info', 6000);
      }
      _hideInstallBanner();
      return;
    }
    _deferredPrompt.prompt();
    _deferredPrompt.userChoice.then((r) => {
      if (r.outcome === 'accepted') localStorage.setItem('clarix_installed', 'true');
      _deferredPrompt = null;
      _hideInstallBanner();
    });
  }

  /* ── Apply update: activate waiting SW then reload cleanly ── */
  function _applyUpdate() {
    if (_waitingSW) {
      /* Tell the waiting SW to activate, then do a clean reload.
         We use location.reload() instead of ?_cb= navigation because:
         1. location.reload() preserves the PWA standalone mode URL
         2. ?_cb= URLs can break PWA scope and exit standalone mode on mobile
         3. The SW already fetches ALL HTML with cache:'no-store' so reload
            always gets the freshest HTML regardless of caching */
      _waitingSW.postMessage({ type: 'SKIP_WAITING' });
      setTimeout(() => window.location.reload(), 200);
    } else {
      /* No waiting SW — just reload; SW serves HTML fresh from network */
      window.location.reload();
    }
  }

  /* ════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════ */
  return {
    init() {
      checkVersion();
      listenForSWUpdates();
      interceptInstall();
    },
    triggerInstall,
    _applyUpdate,
    showUpdateBanner: _showUpdateBanner
  };

})();

/* ── Auto-init on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => ClarixPWA.init());
