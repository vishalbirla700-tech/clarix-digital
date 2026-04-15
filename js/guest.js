/* ═══════════════════════════════════════════════
   CLARIX — GUEST MODE
   Allows visitors to use up to 5 prompts without
   signing in, then nudges them to create an account.
═══════════════════════════════════════════════ */

var GuestMode = {
  LIMIT: 5,
  KEY:   'clarix_guest_prompts',

  /* True when no Firebase session exists */
  isGuest: function() {
    return !localStorage.getItem('clarix_uid');
  },

  getCount: function() {
    return parseInt(localStorage.getItem(this.KEY) || '0');
  },

  remaining: function() {
    return Math.max(0, this.LIMIT - this.getCount());
  },

  canUse: function() {
    return this.getCount() < this.LIMIT;
  },

  inc: function() {
    var next = this.getCount() + 1;
    localStorage.setItem(this.KEY, next);
    this._updateBanner();
    return next;
  },

  /* ── Banner (slim strip below topnav) ── */
  showBanner: function() {
    if (!this.isGuest()) return;
    var existing = document.getElementById('clarix-guest-banner');
    if (existing) { this._updateBanner(); return; }

    var rem    = this.remaining();
    var banner = document.createElement('div');
    banner.id  = 'clarix-guest-banner';
    banner.style.cssText = [
      'position:fixed;top:56px;left:0;right:0;z-index:9990',
      'background:linear-gradient(90deg,#ff7043 0%,#e53935 100%)',
      'color:#fff;padding:9px 16px',
      'display:flex;align-items:center;justify-content:center;gap:10px',
      'font-size:13px;font-weight:600;font-family:Inter,sans-serif',
      'box-shadow:0 2px 12px rgba(255,112,67,0.35)'
    ].join(';');

    banner.innerHTML = this._bannerHTML(rem);
    document.body.appendChild(banner);

    /* Push page content down so it doesn't hide under the banner */
    var content = document.querySelector('.write-layout, .inspire-layout, .apps-content, main, .page-content');
    if (content) content.style.marginTop = '40px';
  },

  _bannerHTML: function(rem) {
    var dots = '';
    for (var i = 0; i < this.LIMIT; i++) {
      dots += '<span style="width:8px;height:8px;border-radius:50%;display:inline-block;margin:0 2px;background:' + (i < (this.LIMIT - rem) ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.9)') + '"></span>';
    }
    return '<span>' + dots + '</span>'
      + ' <span><strong>' + rem + '</strong> free prompt' + (rem !== 1 ? 's' : '') + ' left</span>'
      + ' <button id="guestBannerSignIn" style="background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.3);color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">Sign in for 25 more →</button>'
      + ' <button onclick="document.getElementById(\'clarix-guest-banner\').style.display=\'none\'" style="background:none;border:none;color:rgba(255,255,255,0.6);font-size:18px;cursor:pointer;padding:0;line-height:1;margin-left:4px;">×</button>';
  },

  _updateBanner: function() {
    var banner = document.getElementById('clarix-guest-banner');
    if (!banner) return;
    var rem = this.remaining();
    banner.innerHTML = this._bannerHTML(rem);
    this._bindBannerBtn();
  },

  _bindBannerBtn: function() {
    var btn = document.getElementById('guestBannerSignIn');
    if (btn) {
      btn.onclick = function() {
        if (typeof AuthModal !== 'undefined' && AuthModal.show) {
          AuthModal.show();
        } else if (typeof ClarixAuth !== 'undefined') {
          ClarixAuth._showLoginModal();
        }
      };
    }
  },

  /* ── Hard limit modal (shown when 5 prompts are exhausted) ── */
  showLimit: function() {
    var existing = document.getElementById('clarix-guest-limit');
    if (existing) return;

    var overlay = document.createElement('div');
    overlay.id  = 'clarix-guest-limit';
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:99999',
      'background:rgba(0,0,0,0.75)',
      'display:flex;align-items:center;justify-content:center',
      'padding:20px;backdrop-filter:blur(10px)',
      'animation:guestFadeIn 0.3s ease'
    ].join(';');

    overlay.innerHTML = [
      '<style>@keyframes guestFadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}</style>',
      '<div style="background:linear-gradient(135deg,#0f0f1a 0%,#1a0825 100%);',
        'border:1px solid rgba(255,255,255,0.1);border-radius:24px;',
        'padding:44px 36px;max-width:420px;width:100%;text-align:center;',
        'box-shadow:0 24px 80px rgba(0,0,0,0.6);">',
        '<div style="font-size:40px;margin-bottom:14px">🔐</div>',
        '<div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;margin-bottom:8px">',
          'You\'ve used all 5 free prompts!',
        '</div>',
        '<div style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.8;margin-bottom:28px">',
          'Sign in free and unlock <strong style="color:#ff7043">25 more prompts</strong>.<br>',
          'Works in Hindi, Gujarati, English &amp; 20+ languages.<br>',
          '<span style="color:rgba(255,255,255,0.35);font-size:12px">No credit card. No cost.</span>',
        '</div>',
        '<button id="guestLimitSignIn" style="',
          'width:100%;padding:15px;background:#fff;color:#222;',
          'border:none;border-radius:14px;font-size:15px;font-weight:700;',
          'cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;',
          'margin-bottom:16px;transition:transform 0.2s;">',
          '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20">',
          'Continue with Google — It\'s Free',
        '</button>',
        '<button onclick="document.getElementById(\'clarix-guest-limit\').remove()" style="',
          'background:none;border:none;color:rgba(255,255,255,0.3);',
          'font-size:13px;cursor:pointer;padding:4px 8px;">',
          'Maybe later',
        '</button>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);

    var signInBtn = document.getElementById('guestLimitSignIn');
    if (signInBtn) {
      signInBtn.onmouseover = function() { this.style.transform = 'translateY(-2px)'; };
      signInBtn.onmouseout  = function() { this.style.transform = ''; };
      signInBtn.onclick = function() {
        overlay.remove();
        if (typeof AuthModal !== 'undefined' && AuthModal.show) {
          AuthModal.show();
        } else if (typeof ClarixAuth !== 'undefined') {
          ClarixAuth._showLoginModal();
        }
      };
    }
  },

  /* ── Init — call on DOMContentLoaded ── */
  init: function() {
    var self = this;

    /* If already logged in, skip everything */
    if (!self.isGuest()) return;

    /* Show banner after a short delay so nav loads first */
    setTimeout(function() {
      self.showBanner();
      self._bindBannerBtn();
    }, 800);

    /* Poll for sign-in (Firebase may resolve async) */
    var poll = setInterval(function() {
      if (!self.isGuest()) {
        clearInterval(poll);
        var banner = document.getElementById('clarix-guest-banner');
        if (banner) {
          banner.style.transition = 'opacity 0.4s';
          banner.style.opacity    = '0';
          setTimeout(function() { banner.remove(); }, 400);
        }
        var content = document.querySelector('.write-layout, .inspire-layout, .apps-content, main');
        if (content) content.style.marginTop = '';
      }
    }, 1500);
  }
};

/* Auto-init */
document.addEventListener('DOMContentLoaded', function() { GuestMode.init(); });
