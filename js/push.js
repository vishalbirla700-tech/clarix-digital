/* ═══════════════════════════════════════════════
   CLARIX — WEB PUSH SUBSCRIPTION MANAGER
   Handles: permission prompt, subscription save,
            state management via localStorage
   
   Usage: auto-inits on DOMContentLoaded
   Public API: ClarixPush.init(), ClarixPush.subscribe(),
               ClarixPush.unsubscribe(), ClarixPush.getStatus()
═══════════════════════════════════════════════ */

/* ── VAPID public key — must match server ── */
const CLARIX_VAPID_PUBLIC_KEY = 'BA-aCCh9MZ6zmK-viBo0p6l4cYRXN8_9wXpcxw9Fh0a10wp0Mv1tjE_-3H-JSzFze76_msZ6V1kQctMOaE9TMx0';

const ClarixPush = (() => {

  /* ── State ── */
  const LS_SUBSCRIBED   = 'clarix_push_subscribed';   // 'true' | 'false' | null
  const LS_PROMPT_SHOWN = 'clarix_push_prompt_shown'; // 'true' | null
  const LS_DISMISSED    = 'clarix_push_dismissed_at'; // timestamp | null
  const DISMISS_COOLDOWN_DAYS = 7; // re-show after 7 days of dismissal

  /* ── Convert VAPID key from base64url to Uint8Array ── */
  function _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }

  /* ── Check if browser supports push ── */
  function _isSupported() {
    return 'serviceWorker' in navigator &&
           'PushManager'   in window   &&
           'Notification'  in window;
  }

  /* ── Should we show the prompt? ── */
  function _shouldShowPrompt() {
    if (!_isSupported()) return false;
    if (Notification.permission === 'granted') return false; // already subscribed
    if (Notification.permission === 'denied')  return false; // user blocked — can't ask again

    if (localStorage.getItem(LS_SUBSCRIBED) === 'true') return false;
    if (localStorage.getItem(LS_PROMPT_SHOWN) === 'true') {
      /* Check if dismiss cooldown has passed */
      const dismissedAt = parseInt(localStorage.getItem(LS_DISMISSED) || '0');
      const cooldownMs  = DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < cooldownMs) return false;
    }
    return true;
  }

  /* ══════════════════════════════════════════════
     STYLED PERMISSION PROMPT CARD
  ══════════════════════════════════════════════ */
  function _showPrompt() {
    if (document.getElementById('clarix-push-prompt')) return;

    const card = document.createElement('div');
    card.id = 'clarix-push-prompt';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Stay updated with Clarix');
    card.style.cssText = [
      'position:fixed;bottom:80px;left:12px;right:12px;max-width:420px;margin:0 auto',
      'background:linear-gradient(135deg,#1a1028 0%,#0f0f1a 100%)',
      'border:1px solid rgba(255,112,67,0.35)',
      'border-radius:20px;padding:20px;z-index:10001',
      'box-shadow:0 16px 60px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.04)',
      'animation:clarixPushSlideUp 0.45s cubic-bezier(.16,1,.3,1)'
    ].join(';');

    card.innerHTML = `
      <style>
        @keyframes clarixPushSlideUp {
          from { transform:translateY(24px); opacity:0; }
          to   { transform:translateY(0);   opacity:1; }
        }
      </style>

      <!-- Header -->
      <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;">
        <div style="width:48px;height:48px;border-radius:14px;flex-shrink:0;
                    background:linear-gradient(135deg,#ff7043,#e64a19);
                    display:flex;align-items:center;justify-content:center;font-size:22px;">
          🔔
        </div>
        <div style="flex:1;">
          <div style="font-size:15px;font-weight:800;color:#fff;letter-spacing:-0.3px;margin-bottom:3px;">
            Stay in the loop 🇮🇳
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,0.55);line-height:1.6;">
            Get notified about new Creative Studios, AI features & exclusive tips — right on your device.
          </div>
        </div>
        <button id="clarix-push-dismiss-x"
          style="background:none;border:none;color:rgba(255,255,255,0.3);
                 font-size:20px;cursor:pointer;padding:0;line-height:1;flex-shrink:0;margin-top:-4px;">
          ✕
        </button>
      </div>

      <!-- Feature row -->
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        ${[['✨','New Features'],['🎨','New Studios'],['💡','AI Tips']].map(([e,l]) => `
          <div style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);
                      border-radius:10px;padding:8px 4px;text-align:center;">
            <div style="font-size:16px;">${e}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:3px;font-weight:600;">${l}</div>
          </div>`).join('')}
      </div>

      <!-- Buttons -->
      <div style="display:flex;gap:8px;">
        <button id="clarix-push-dismiss"
          style="flex:1;height:44px;background:rgba(255,255,255,0.05);
                 border:1px solid rgba(255,255,255,0.1);border-radius:12px;
                 color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;cursor:pointer;">
          Maybe later
        </button>
        <button id="clarix-push-allow"
          style="flex:2;height:44px;background:linear-gradient(135deg,#ff7043,#e64a19);
                 border:none;border-radius:12px;color:#fff;font-size:13px;
                 font-weight:800;cursor:pointer;box-shadow:0 4px 20px rgba(255,112,67,0.35);">
          🔔 Turn on Notifications
        </button>
      </div>

      <div style="text-align:center;font-size:10px;color:rgba(255,255,255,0.2);margin-top:10px;">
        You can turn off at any time · clarix.digital
      </div>
    `;

    document.body.appendChild(card);

    /* Wire up buttons */
    document.getElementById('clarix-push-allow').addEventListener('click',   () => { _dismiss(); subscribe(); });
    document.getElementById('clarix-push-dismiss').addEventListener('click',  () => _dismiss(true));
    document.getElementById('clarix-push-dismiss-x').addEventListener('click',() => _dismiss(true));

    localStorage.setItem(LS_PROMPT_SHOWN, 'true');
  }

  function _dismiss(saveTime = false) {
    const card = document.getElementById('clarix-push-prompt');
    if (card) {
      card.style.transition = 'transform 0.35s, opacity 0.35s';
      card.style.transform  = 'translateY(24px)';
      card.style.opacity    = '0';
      setTimeout(() => card.remove(), 350);
    }
    if (saveTime) localStorage.setItem(LS_DISMISSED, String(Date.now()));
  }

  /* ══════════════════════════════════════════════
     SUBSCRIBE
  ══════════════════════════════════════════════ */
  async function subscribe() {
    if (!_isSupported()) {
      console.warn('[ClarixPush] Browser does not support push');
      return;
    }

    try {
      /* Request notification permission */
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        console.info('[ClarixPush] Permission denied by user');
        localStorage.setItem(LS_SUBSCRIBED, 'false');
        return;
      }

      /* Get SW registration */
      const reg = await navigator.serviceWorker.ready;

      /* Subscribe to push manager */
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: _urlBase64ToUint8Array(CLARIX_VAPID_PUBLIC_KEY)
      });

      /* Save subscription to server */
      const uid     = _getUid();
      const guestId = localStorage.getItem('clarix_guest_id');

      await fetch('/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, uid, guestId })
      });

      /* Mark as subscribed */
      localStorage.setItem(LS_SUBSCRIBED, 'true');
      console.info('[ClarixPush] Subscribed successfully');

      /* Show a confirmation toast if Toast is available */
      if (typeof Toast !== 'undefined') {
        Toast.show('🔔 Notifications enabled! We\'ll keep you updated.', 'success', 4000);
      }

    } catch (err) {
      console.error('[ClarixPush] Subscribe error:', err.message);
    }
  }

  /* ══════════════════════════════════════════════
     UNSUBSCRIBE
  ══════════════════════════════════════════════ */
  async function unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        localStorage.setItem(LS_SUBSCRIBED, 'false');
        console.info('[ClarixPush] Unsubscribed');
      }
    } catch (err) {
      console.error('[ClarixPush] Unsubscribe error:', err.message);
    }
  }

  /* ── Get Firebase UID if user is logged in ── */
  function _getUid() {
    try {
      /* ClarixFirebase or firebase auth may expose current user */
      if (window.firebase && window.firebase.auth) {
        const user = window.firebase.auth().currentUser;
        return user ? user.uid : null;
      }
      return null;
    } catch (_) { return null; }
  }

  /* ── Get status ── */
  function getStatus() {
    return {
      supported:  _isSupported(),
      permission: _isSupported() ? Notification.permission : 'unsupported',
      subscribed: localStorage.getItem(LS_SUBSCRIBED) === 'true'
    };
  }

  /* ══════════════════════════════════════════════
     INIT — called on DOM ready
  ══════════════════════════════════════════════ */
  function init() {
    if (!_isSupported()) return;

    /* Already subscribed but permission revoked? Clean up. */
    if (Notification.permission === 'denied') {
      localStorage.setItem(LS_SUBSCRIBED, 'false');
      return;
    }

    /* If permission already granted but we don't have subscription yet, subscribe silently */
    if (Notification.permission === 'granted' &&
        localStorage.getItem(LS_SUBSCRIBED) !== 'true') {
      subscribe();
      return;
    }

    /* Show prompt after 20s delay if conditions are met */
    if (_shouldShowPrompt()) {
      setTimeout(_showPrompt, 20000);
    }
  }

  /* ── Public API ── */
  return { init, subscribe, unsubscribe, getStatus };

})();

/* ── Auto-init ── */
document.addEventListener('DOMContentLoaded', () => ClarixPush.init());
