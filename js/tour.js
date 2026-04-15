/* ═══════════════════════════════════════════════════════════
   CLARIX — PRODUCT TOUR  (tour.js)
   Spotlit, step-by-step interactive guide for first visitors.
   Uses: spotlight overlay + animated hand/arrow + tooltip.
   Triggered on page load if clarix_tour_<page> not set.
═══════════════════════════════════════════════════════════ */

const ClarixTour = {

  /* ── State ── */
  _steps: [],
  _current: 0,
  _page: '',
  _overlay: null,
  _tooltip: null,
  _hand: null,
  _raf: null,

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
        body:  'Are you writing for a AI tool like ChatGPT, or a social app like Instagram? Pick the right mode.',
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

    apps: [
      {
        target: 'studiosGrid',
        title: '1 · Creative Studios',
        body:  'Four specialised AI tools — Kids, Corporate, Festival & Multilingual. Each has a unique creative flow.',
        arrow: 'bottom',
        hand:  'point-down'
      },
      {
        target: 'intentGrid',
        title: '2 · Quick Intent Shortcuts',
        body:  'Tap any intent card to jump straight into the Write page with a preset topic and platform ready to go.',
        arrow: 'bottom',
        hand:  'tap'
      },
      {
        target: 'hubContent',
        title: '3 · AI Creation Hubs',
        body:  'Discover the best AI tools for Video, Blog, 3D and more — all curated and categorised for Indian creators.',
        arrow: 'top',
        hand:  'point-down'
      }
    ]
  },

  /* ── Key for localStorage ── */
  _key(page) { return 'clarix_tour_' + page; },

  /* ── Has tour been seen for this page? ── */
  hasSeen(page) {
    return localStorage.getItem(this._key(page)) === 'done';
  },

  /* ── Bootstrap: auto-detect page, delay 1.2s for page paint ── */
  init(page) {
    if (!page) return;
    this._page = page;
    if (this.hasSeen(page)) return;
    const steps = this.TOURS[page];
    if (!steps || !steps.length) return;
    this._steps = steps;

    /* Short delay so the page fully paints before we highlight */
    setTimeout(() => this.start(), 1200);
  },

  /* ── Build and inject the tour DOM ── */
  start() {
    this._current = 0;
    this._buildDOM();
    this._showStep(0);
    this._bindKeys();
  },

  _buildDOM() {
    /* Remove any stale tour */
    document.getElementById('clarix-tour-root')?.remove();

    const root = document.createElement('div');
    root.id = 'clarix-tour-root';
    root.innerHTML = `
      <!-- Spotlight overlay (4 quadrant divs to create a hole) -->
      <div class="ct-overlay" id="ct-overlay">
        <div class="ct-quad ct-top"    id="ct-top"></div>
        <div class="ct-quad ct-left"   id="ct-left"></div>
        <div class="ct-quad ct-right"  id="ct-right"></div>
        <div class="ct-quad ct-bottom" id="ct-bottom"></div>
      </div>

      <!-- Tooltip bubble -->
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
              <button class="ct-btn ct-btn-prev" id="ct-prev" aria-label="Previous step">← Prev</button>
              <button class="ct-btn ct-btn-next" id="ct-next" aria-label="Next step">Next →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Animated hand pointer -->
      <div class="ct-hand" id="ct-hand" aria-hidden="true">
        <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 34V14a3 3 0 0 1 6 0v10a3 3 0 0 1 6 0v2a3 3 0 0 1 6 0v2a3 3 0 0 1 3 3v5
                   c0 5.523-4.477 10-10 10h-4a10 10 0 0 1-10-10v-2z"
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

    /* Wire buttons */
    document.getElementById('ct-next').addEventListener('click', () => this._next());
    document.getElementById('ct-prev').addEventListener('click', () => this._prev());
    document.getElementById('ct-skip-btn').addEventListener('click', () => this.finish(true));

    /* Click outside spotlight → advance */
    this._overlay.addEventListener('click', () => this._next());
  },

  /* ── Show a single step ── */
  _showStep(index) {
    const step = this._steps[index];
    if (!step) { this.finish(false); return; }

    /* Remove glow from previous target */
    document.querySelectorAll('.ct-target-glow').forEach(el => el.classList.remove('ct-target-glow'));

    const target = document.getElementById(step.target);

    /* Update text */
    document.getElementById('ct-title').textContent = step.title;
    document.getElementById('ct-body').textContent  = step.body;

    /* Update dots */
    const dotsEl = document.getElementById('ct-dots');
    dotsEl.innerHTML = this._steps.map((_, i) =>
      `<div class="ct-dot${i === index ? ' active' : ''}"></div>`
    ).join('');

    /* Button labels */
    const prevBtn = document.getElementById('ct-prev');
    const nextBtn = document.getElementById('ct-next');
    prevBtn.style.display = index === 0 ? 'none' : '';
    nextBtn.textContent   = index === this._steps.length - 1 ? '\uD83D\uDE80 Get Started!' : 'Next \u2192';

    /* Position spotlight + tooltip + hand */
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      /* Wait for scroll before measuring + add glow ring */
      setTimeout(() => {
        target.classList.add('ct-target-glow');
        this._positionSpotlight(target);
        this._positionTooltip(target, step.arrow);
        this._positionHand(target, step.hand);
      }, 350);
    }
  },

  /* ── Spotlight: carve a "hole" around the target element ── */
  _positionSpotlight(el) {
    const PAD = 12;
    const r   = el.getBoundingClientRect();
    const top    = Math.max(0, r.top    - PAD);
    const left   = Math.max(0, r.left   - PAD);
    const bottom = Math.max(0, window.innerHeight - r.bottom - PAD);
    const right  = Math.max(0, window.innerWidth  - r.right  - PAD);
    const h      = r.height + PAD * 2;
    const w      = r.width  + PAD * 2;

    document.getElementById('ct-top').style.cssText    = `height:${top}px;left:0;right:0;top:0`;
    document.getElementById('ct-bottom').style.cssText = `height:${bottom}px;left:0;right:0;bottom:0`;
    document.getElementById('ct-left').style.cssText   = `width:${left}px;top:${top}px;height:${h}px;left:0`;
    document.getElementById('ct-right').style.cssText  = `width:${right}px;top:${top}px;height:${h}px;right:0`;
  },

  /* ── Tooltip placement ── */
  _positionTooltip(el, arrowDir) {
    const PAD   = 16;
    const tp    = this._tooltip;
    const r     = el.getBoundingClientRect();
    const tw    = Math.min(300, window.innerWidth - 32);
    const th    = 180; /* estimated */

    tp.className = 'ct-tooltip ct-tooltip-' + (arrowDir || 'bottom');
    tp.style.width   = tw + 'px';
    tp.style.opacity = '0';
    tp.style.transform = 'scale(0.92)';

    let top, left;
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;

    switch (arrowDir) {
      case 'bottom': /* tooltip above target */
        top  = r.top - th - PAD;
        left = cx - tw / 2;
        break;
      case 'top':    /* tooltip below target */
        top  = r.bottom + PAD;
        left = cx - tw / 2;
        break;
      case 'right':  /* tooltip to the left */
        top  = cy - th / 2;
        left = r.left - tw - PAD;
        break;
      case 'left':   /* tooltip to the right */
        top  = cy - th / 2;
        left = r.right + PAD;
        break;
      default:
        top  = r.bottom + PAD;
        left = cx - tw / 2;
    }

    /* Clamp within viewport */
    left = Math.max(8, Math.min(left, window.innerWidth  - tw - 8));
    top  = Math.max(8, Math.min(top,  window.innerHeight - th - 8));

    tp.style.left = left + 'px';
    tp.style.top  = top  + 'px';

    /* Animate in */
    requestAnimationFrame(() => {
      tp.style.transition = 'opacity 0.3s ease, transform 0.3s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1))';
      tp.style.opacity    = '1';
      tp.style.transform  = 'scale(1)';
    });
  },

  /* ── Animated hand pointer ── */
  _positionHand(el, type) {
    const h   = this._hand;
    const r   = el.getBoundingClientRect();
    const PAD = 20;

    h.className = 'ct-hand ct-hand-' + (type || 'point-down');
    h.style.opacity = '0';

    let hx, hy;
    switch (type) {
      case 'tap':
        hx = r.left + r.width  / 2 - 20;
        hy = r.top  + r.height / 2 - 10;
        break;
      case 'point-right':
        hx = r.left - 50 - PAD;
        hy = r.top  + r.height / 2 - 20;
        break;
      case 'point-left':
        hx = r.right + PAD;
        hy = r.top   + r.height / 2 - 20;
        break;
      case 'point-down':
      default:
        hx = r.left + r.width / 2 - 20;
        hy = r.top  - 60 - PAD;
    }

    /* Clamp */
    hx = Math.max(4, Math.min(hx, window.innerWidth  - 50));
    hy = Math.max(4, Math.min(hy, window.innerHeight - 60));

    h.style.left = hx + 'px';
    h.style.top  = hy + 'px';

    requestAnimationFrame(() => {
      h.style.transition = 'opacity 0.3s ease 0.15s';
      h.style.opacity = '1';
    });
  },

  /* ── Navigation ── */
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

  /* ── Keyboard nav ── */
  _bindKeys() {
    this._keyHandler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') this._next();
      if (e.key === 'ArrowLeft')  this._prev();
      if (e.key === 'Escape')     this.finish(true);
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  /* ── Clean up and mark done ── */
  finish(skipped) {
    document.querySelectorAll('.ct-target-glow').forEach(el => el.classList.remove('ct-target-glow'));
    document.getElementById('clarix-tour-root')?.remove();
    document.removeEventListener('keydown', this._keyHandler);
    localStorage.setItem(this._key(this._page), 'done');

    if (!skipped && typeof Toast !== 'undefined') {
      Toast.show('\u2756 You\'re all set! Start creating amazing prompts.', 'success', 3500);
    }
  },

  /* ── Utility: reset tour for a page (for testing / re-launch) ── */
  reset(page) {
    localStorage.removeItem(this._key(page || this._page));
  }
};
