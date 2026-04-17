/* ═══════════════════════════════════════════════════════════
   CLARIX — PRODUCT TOUR  (tour.js)  v20260417F
   Spotlit, step-by-step interactive guide for first visitors.
   - Shows ONCE per page per app version (version-aware)
   - Floating "?" button always visible (z:10001, above overlay)
   - 30-second idle auto-advance per step
   - Double-rAF positioning so getBoundingClientRect is accurate
═══════════════════════════════════════════════════════════ */

const ClarixTour = window.ClarixTour = {

  /* ── Tour version: bump to force tour reset for all users who already saw it ── */
  TOUR_VERSION: '20260417F',

  /* ── State ── */
  _steps: [],
  _current: 0,
  _page: '',
  _overlay: null,
  _tooltip: null,
  _hand: null,
  _keyHandler: null,
  _idleTimer: null,       /* 30s auto-advance timer */
  _countdownInterval: null,
  _IDLE_SECS: 30,         /* seconds before auto-advance */

  /* ── Page step definitions ── */
  TOURS: {
    write: [
      {
        target: 'langBlock',
        title: '1 · Choose Your Language',
        body:  'Pick from 20+ Indian & world languages. Clarix will tailor every prompt to your tongue.',
        arrow: 'bottom',
        hand:  'point-down'
      },
      {
        target: 'modeTabs',
        title: '2 · Select a Platform',
        body:  'Are you writing for an AI tool like ChatGPT, or a social app like Instagram? Pick the right mode.',
        arrow: 'bottom',
        hand:  'point-down'
      },
      {
        target: 'promptInput',
        title: '3 · Type Your Idea',
        body:  'Write your rough idea in any language — Hindi, Hinglish, English, anything! Even a single line works.',
        arrow: 'right',
        hand:  'point-right'
      },
      {
        target: 'enhanceBtn',
        title: '4 · Hit Enhance ✦',
        body:  'Tap this button and watch Clarix transform your idea into a powerful, AI-optimised prompt in seconds.',
        arrow: 'top',
        hand:  'tap'
      },
      {
        target: 'resultsPanel',
        title: '5 · Your Results Appear Here',
        body:  'Three prompt variations will appear. Pick your favourite, copy it, or open directly in your AI tool!',
        arrow: 'left',
        hand:  'point-left'
      }
    ],

    inspire: [
      {
        target: 'uploadZone',
        title: '1 · Upload Your Photo',
        body:  'Drag & drop any image, or tap to upload. Gemini Vision will analyse it and generate a perfect prompt.',
        arrow: 'bottom',
        hand:  'point-down'
      },
      {
        target: 'categoryFilter',
        title: '2 · Filter by Category',
        body:  'Switch between Cinematic, Fashion, 3D, Video and more to find prompts that match your creative style.',
        arrow: 'bottom',
        hand:  'point-down'
      },
      {
        target: 'galleryGrid',
        title: '3 · Tap Any Image',
        body:  'Click any gallery card to open it in the prompt editor — then enhance, copy or send it directly to Write.',
        arrow: 'top',
        hand:  'tap'
      }
    ],

  },

  /* ── localStorage keys ── */
  _key(page)        { return 'clarix_tour_' + page; },
  _versionKey(page) { return 'clarix_tour_ver_' + page; },

  /* ── Has this page tour been seen on the CURRENT version? ── */
  hasSeen(page) {
    const done    = localStorage.getItem(this._key(page)) === 'done';
    const version = localStorage.getItem(this._versionKey(page));
    if (done && version !== this.TOUR_VERSION) {
      localStorage.removeItem(this._key(page));
      return false;
    }
    return done;
  },

  /* ── Bootstrap ── */
  init(page) {
    if (!page) return;
    this._page = page;
    this._addHelpButton(page);   /* Always show the floating ? button */

    if (this.hasSeen(page)) return;

    const steps = this.TOURS[page];
    if (!steps || !steps.length) return;
    this._steps = steps;

    /* Delay: let Firebase auth + onboarding resolve first */
    setTimeout(() => this.start(), 4000);
  },

  /* ── Floating "?" replay button — z:10001 so it's ABOVE the tour overlay ── */
  _addHelpButton(page) {
    if (document.getElementById('ct-help-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'ct-help-btn';
    btn.title = 'Take a guided tour';
    btn.setAttribute('aria-label', 'Start guided tour');
    btn.innerHTML = '?';
    btn.style.cssText = [
      'position:fixed',
      'bottom:80px',
      'right:16px',
      'width:44px',
      'height:44px',
      'border-radius:50%',
      'background:linear-gradient(135deg,#ff7043,#e64a19)',
      'color:#fff',
      'font-size:20px',
      'font-weight:900',
      'border:none',
      'cursor:pointer',
      'z-index:10001',          /* above the overlay (9000) AND tooltip (10000) */
      'box-shadow:0 4px 20px rgba(255,112,67,0.6)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'transition:transform 0.2s,box-shadow 0.2s',
      'font-family:var(--font-head,"Outfit",sans-serif)'
    ].join(';');

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.12)';
      btn.style.boxShadow = '0 8px 28px rgba(255,112,67,0.7)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 20px rgba(255,112,67,0.6)';
    });
    btn.addEventListener('click', () => this.replay(page));
    document.body.appendChild(btn);
  },

  /* ── Replay: force-start regardless of seen flag ── */
  replay(page) {
    const p = page || this._page;
    const steps = this.TOURS[p];
    if (!steps || !steps.length) return;
    this._page  = p;
    this._steps = steps;
    this.start();
  },

  /* ── Build and inject tour DOM ── */
  start() {
    this._current = 0;
    this._buildDOM();
    this._showStep(0);
    this._bindKeys();
  },

  _buildDOM() {
    document.getElementById('clarix-tour-root')?.remove();
    this._clearIdle();

    const root = document.createElement('div');
    root.id = 'clarix-tour-root';
    root.innerHTML = `
      <div class="ct-overlay" id="ct-overlay">
        <div class="ct-quad ct-top"    id="ct-top"></div>
        <div class="ct-quad ct-left"   id="ct-left"></div>
        <div class="ct-quad ct-right"  id="ct-right"></div>
        <div class="ct-quad ct-bottom" id="ct-bottom"></div>
      </div>
      <div class="ct-tooltip" id="ct-tooltip" role="dialog" aria-live="polite">
        <div class="ct-tooltip-arrow" id="ct-tooltip-arrow"></div>
        <div class="ct-tooltip-inner">
          <div class="ct-header">
            <div class="ct-title" id="ct-title"></div>
            <button class="ct-skip-btn" id="ct-skip-btn" aria-label="Skip tour">Skip tour</button>
          </div>
          <div class="ct-body" id="ct-body"></div>
          <div class="ct-footer">
            <div class="ct-dots" id="ct-dots"></div>
            <div class="ct-nav">
              <button class="ct-btn ct-btn-prev" id="ct-prev">← Prev</button>
              <button class="ct-btn ct-btn-next" id="ct-next">Next →</button>
            </div>
          </div>
        </div>
      </div>
      <div class="ct-hand" id="ct-hand" aria-hidden="true">
        <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 34V14a3 3 0 0 1 6 0v10a3 3 0 0 1 6 0v2a3 3 0 0 1 6 0v2a3 3 0 0 1 3 3v5c0 5.523-4.477 10-10 10h-4a10 10 0 0 1-10-10v-2z"
                fill="#fff" stroke="#ff7043" stroke-width="2"/>
          <circle cx="20" cy="14" r="3" fill="#ff7043" opacity="0.4"/>
        </svg>
        <div class="ct-hand-ripple"></div>
      </div>
    `;
    document.body.appendChild(root);

    this._overlay = document.getElementById('ct-overlay');
    this._tooltip = document.getElementById('ct-tooltip');
    this._hand    = document.getElementById('ct-hand');

    document.getElementById('ct-next').addEventListener('click', () => { this._clearIdle(); this._next(); });
    document.getElementById('ct-prev').addEventListener('click', () => { this._clearIdle(); this._prev(); });
    document.getElementById('ct-skip-btn').addEventListener('click', () => { this._clearIdle(); this.finish(true); });
    this._overlay.addEventListener('click', () => { this._clearIdle(); this._next(); });
  },

  /* ── Show a step ── */
  _showStep(index) {
    const step = this._steps[index];
    if (!step) { this.finish(false); return; }

    document.querySelectorAll('.ct-target-glow').forEach(el => el.classList.remove('ct-target-glow'));

    const target = document.getElementById(step.target);
    document.getElementById('ct-title').textContent = step.title;
    document.getElementById('ct-body').textContent  = step.body;

    document.getElementById('ct-dots').innerHTML = this._steps.map((_, i) =>
      `<div class="ct-dot${i === index ? ' active' : ''}"></div>`
    ).join('');

    const prevBtn = document.getElementById('ct-prev');
    const nextBtn = document.getElementById('ct-next');
    prevBtn.style.display = index === 0 ? 'none' : '';
    const isLast = index === this._steps.length - 1;
    nextBtn.textContent = isLast ? '🚀 Get Started!' : 'Next →';

    /* Start 30-second idle auto-advance */
    this._startIdle(nextBtn, isLast);

    if (target) {
      /* scrollIntoView then wait TWO animation frames so the browser
         has committed the scroll position before we read getBoundingClientRect */
      target.scrollIntoView({ behavior: 'auto', block: 'center' });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.classList.add('ct-target-glow');
          this._positionSpotlight(target);
          this._positionTooltip(target, step.arrow);
          this._positionHand(target, step.hand);
        });
      });
    }
  },

  /* ── 30-second idle timer: counts down inside Next button, then auto-advances ── */
  _startIdle(nextBtn, isLast) {
    this._clearIdle();
    let secs = this._IDLE_SECS;
    const origText = nextBtn.textContent;

    this._countdownInterval = setInterval(() => {
      secs--;
      if (document.getElementById('ct-next')) {
        document.getElementById('ct-next').textContent =
          isLast ? `🚀 Get Started! (${secs}s)` : `Next → (${secs}s)`;
      }
      if (secs <= 0) {
        this._clearIdle();
        this._next();  /* auto-advance (or finish if last step) */
      }
    }, 1000);
  },

  _clearIdle() {
    if (this._idleTimer)        { clearTimeout(this._idleTimer);         this._idleTimer = null; }
    if (this._countdownInterval){ clearInterval(this._countdownInterval); this._countdownInterval = null; }
  },

  _positionSpotlight(el) {
    const PAD    = 12;
    const r      = el.getBoundingClientRect();
    const top    = Math.max(0, r.top    - PAD);
    const left   = Math.max(0, r.left   - PAD);
    const bottom = Math.max(0, window.innerHeight - r.bottom - PAD);
    const right  = Math.max(0, window.innerWidth  - r.right  - PAD);
    const h      = r.height + PAD * 2;

    document.getElementById('ct-top').style.cssText    = `height:${top}px;left:0;right:0;top:0`;
    document.getElementById('ct-bottom').style.cssText = `height:${bottom}px;left:0;right:0;bottom:0`;
    document.getElementById('ct-left').style.cssText   = `width:${left}px;top:${top}px;height:${h}px;left:0`;
    document.getElementById('ct-right').style.cssText  = `width:${right}px;top:${top}px;height:${h}px;right:0`;
  },

  _positionTooltip(el, arrowDir) {
    const PAD = 16;
    const tp  = this._tooltip;
    const r   = el.getBoundingClientRect();
    const tw  = Math.min(300, window.innerWidth - 32);
    const th  = 190;

    tp.className       = 'ct-tooltip ct-tooltip-' + (arrowDir || 'bottom');
    tp.style.width     = tw + 'px';
    tp.style.opacity   = '0';
    tp.style.transform = 'scale(0.92)';

    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    let top, left;

    switch (arrowDir) {
      case 'bottom': top = r.top - th - PAD;   left = cx - tw / 2; break;
      case 'top':    top = r.bottom + PAD;      left = cx - tw / 2; break;
      case 'right':  top = cy - th / 2;         left = r.left - tw - PAD; break;
      case 'left':   top = cy - th / 2;         left = r.right + PAD; break;
      default:       top = r.bottom + PAD;      left = cx - tw / 2;
    }

    left = Math.max(8, Math.min(left, window.innerWidth  - tw - 8));
    top  = Math.max(8, Math.min(top,  window.innerHeight - th - 8));
    tp.style.left = left + 'px';
    tp.style.top  = top  + 'px';

    requestAnimationFrame(() => {
      tp.style.transition = 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)';
      tp.style.opacity    = '1';
      tp.style.transform  = 'scale(1)';
    });
  },

  _positionHand(el, type) {
    const h   = this._hand;
    const r   = el.getBoundingClientRect();
    const PAD = 20;

    h.className     = 'ct-hand ct-hand-' + (type || 'point-down');
    h.style.opacity = '0';

    let hx, hy;
    switch (type) {
      case 'tap':         hx = r.left + r.width  / 2 - 20; hy = r.top  + r.height / 2 - 10; break;
      case 'point-right': hx = r.left - 50 - PAD;          hy = r.top  + r.height / 2 - 20; break;
      case 'point-left':  hx = r.right + PAD;               hy = r.top  + r.height / 2 - 20; break;
      default:            hx = r.left + r.width / 2 - 20;  hy = r.top  - 60 - PAD;
    }

    hx = Math.max(4, Math.min(hx, window.innerWidth  - 50));
    hy = Math.max(4, Math.min(hy, window.innerHeight - 60));
    h.style.left = hx + 'px';
    h.style.top  = hy + 'px';

    requestAnimationFrame(() => {
      h.style.transition = 'opacity 0.3s ease 0.15s';
      h.style.opacity    = '1';
    });
  },

  _next() {
    if (this._current < this._steps.length - 1) {
      this._current++;
      this._showStep(this._current);
    } else {
      this.finish(false);
    }
  },

  _prev() {
    if (this._current > 0) {
      this._current--;
      this._showStep(this._current);
    }
  },

  _bindKeys() {
    this._keyHandler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { this._clearIdle(); this._next(); }
      if (e.key === 'ArrowLeft')  { this._clearIdle(); this._prev(); }
      if (e.key === 'Escape')     { this._clearIdle(); this.finish(true); }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  /* ── Finish: stamp version so future bumps auto-reset ── */
  finish(skipped) {
    this._clearIdle();
    document.querySelectorAll('.ct-target-glow').forEach(el => el.classList.remove('ct-target-glow'));
    document.getElementById('clarix-tour-root')?.remove();
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);

    localStorage.setItem(this._key(this._page), 'done');
    localStorage.setItem(this._versionKey(this._page), this.TOUR_VERSION);

    if (!skipped && typeof Toast !== 'undefined') {
      Toast.show('\u2756 You\'re all set! Start creating amazing prompts.', 'success', 3500);
    }
  },

  /* ── Manual reset (for testing) ── */
  reset(page) {
    const p = page || this._page;
    localStorage.removeItem(this._key(p));
    localStorage.removeItem(this._versionKey(p));
  }
};
