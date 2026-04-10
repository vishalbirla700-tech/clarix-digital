/* ═══════════════════════════════════════════════
   CLARIX — ONBOARDING JS
   First-visit wizard: Name → Language → Platform
═══════════════════════════════════════════════ */

const Onboarding = {
  currentStep: 1,
  totalSteps: 3,
  selectedLang: { code: 'en', name: 'English', flag: '🌐', native: 'English' },
  selectedPlatform: 'ChatGPT',

  hasCompleted() {
    return localStorage.getItem('clarix_onboarded') === 'true';
  },

  init() {
    /* Onboarding now triggered by firebase.js AFTER Google sign-in.
       Guard: never auto-run on page load (old behaviour bypassed auth). */
    if (this.hasCompleted()) return;
    /* Only proceed if Firebase has a signed-in user */
    if (!localStorage.getItem('clarix_uid')) return;
    this.render();
    this.show();
  },

  render() {
    const el = document.createElement('div');
    el.className = 'onboard-overlay';
    el.id = 'onboard-overlay';
    el.innerHTML = `
      <div class="onboard-box">
        <div class="onboard-progress">
          <div class="onboard-progress-fill" id="ob-progress" style="width:33%"></div>
        </div>
        <div class="onboard-dots">
          <div class="onboard-dot active" id="ob-dot-1"></div>
          <div class="onboard-dot" id="ob-dot-2"></div>
          <div class="onboard-dot" id="ob-dot-3"></div>
        </div>

        <!-- STEP 1: Name -->
        <div class="onboard-step active" id="ob-step-1">
          <div class="onboard-logo"><span class="onboard-logo-star">✦</span> clarix</div>
          <div class="onboard-welcome-icon">👋</div>
          <div class="onboard-title">India's First AI<br>Prompt Engine</div>
          <div class="onboard-sub">Let's personalise your experience. What should we call you?</div>
          <input type="text" class="onboard-input" id="ob-name-input"
            placeholder="Your name or creator alias..."
            maxlength="24"
            onkeydown="if(event.key==='Enter') Onboarding.nextStep()">
          <div class="onboard-btn-row">
            <button class="onboard-btn onboard-btn-skip" onclick="Onboarding.skip()">Skip</button>
            <button class="onboard-btn onboard-btn-primary" onclick="Onboarding.nextStep()">
              Continue →
            </button>
          </div>
        </div>

        <!-- STEP 2: Language -->
        <div class="onboard-step" id="ob-step-2">
          <div class="onboard-logo"><span class="onboard-logo-star">✦</span> clarix</div>
          <div class="onboard-title">Choose your language</div>
          <div class="onboard-sub">Clarix will generate prompts and outputs in your language.</div>
          <input type="text" class="lang-search" id="ob-lang-search"
            placeholder="🔍  Search language..."
            oninput="Onboarding.filterLangs(this.value)">
          <div id="ob-lang-container"></div>
          <div class="onboard-btn-row">
            <button class="onboard-btn onboard-btn-skip" onclick="Onboarding.prevStep()">← Back</button>
            <button class="onboard-btn onboard-btn-primary" onclick="Onboarding.nextStep()">
              Continue →
            </button>
          </div>
        </div>

        <!-- STEP 3: Platform -->
        <div class="onboard-step" id="ob-step-3">
          <div class="onboard-logo"><span class="onboard-logo-star">✦</span> clarix</div>
          <div class="onboard-title">Your go-to AI platform?</div>
          <div class="onboard-sub">We'll optimise your prompts for this platform by default.</div>
          <div class="platform-grid-onboard" id="ob-platform-grid"></div>
          <div class="onboard-btn-row">
            <button class="onboard-btn onboard-btn-skip" onclick="Onboarding.prevStep()">← Back</button>
            <button class="onboard-btn onboard-btn-primary" onclick="Onboarding.finish()">
              🚀 Start Creating
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    this.renderLangs('');
    this.renderPlatforms();
  },

  show() {
    document.getElementById('onboard-overlay')?.classList.remove('hiding');
    document.body.style.overflow = 'hidden';
  },

  renderLangs(query) {
    const container = document.getElementById('ob-lang-container');
    if (!container) return;

    const q = query.toLowerCase();
    const filterList = (list) => list.filter(l =>
      !q || l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q)
    );

    const indian  = filterList(LANGUAGES.indian);
    const world   = filterList(LANGUAGES.world);
    const current = this.selectedLang;

    let html = '';
    if (indian.length) {
      html += `<div class="lang-section-title">🇮🇳 Indian Languages</div>
        <div class="lang-grid">
          ${indian.map(l => `
            <div class="lang-chip${current.code === l.code ? ' selected' : ''}"
              onclick="Onboarding.selectLang('${l.code}','${l.name}','${l.flag}','${l.native.replace(/'/g,"\\'")}')">
              <span class="lang-flag">${l.flag}</span>
              <span class="lang-name">${l.name}</span>
            </div>`).join('')}
        </div>`;
    }
    if (world.length) {
      html += `<div class="lang-section-title" style="margin-top:12px">🌐 World Languages</div>
        <div class="lang-grid">
          ${world.map(l => `
            <div class="lang-chip${current.code === l.code ? ' selected' : ''}"
              onclick="Onboarding.selectLang('${l.code}','${l.name}','${l.flag}','${l.native.replace(/'/g,"\\'")}')">
              <span class="lang-flag">${l.flag}</span>
              <span class="lang-name">${l.name}</span>
            </div>`).join('')}
        </div>`;
    }
    if (!html) html = '<div style="text-align:center;padding:20px;color:#333;font-size:13px">No languages found</div>';
    container.innerHTML = html;
  },

  renderPlatforms() {
    const platforms = [
      { icon:'🤖', name:'ChatGPT' },   { icon:'🧠', name:'Claude' },
      { icon:'♊',  name:'Gemini' },    { icon:'🎨', name:'Midjourney' },
      { icon:'⚡', name:'Grok' },      { icon:'🔍', name:'Perplexity' },
      { icon:'🌊', name:'DeepSeek' },  { icon:'🪟', name:'Copilot' },
      { icon:'🤳', name:'Meta AI' },
    ];
    const grid = document.getElementById('ob-platform-grid');
    if (!grid) return;
    grid.innerHTML = platforms.map(p => `
      <div class="platform-item-onboard${this.selectedPlatform === p.name ? ' selected' : ''}"
        onclick="Onboarding.selectPlatform('${p.name}',this)">
        <span class="p-icon">${p.icon}</span>
        <span class="p-name">${p.name}</span>
      </div>`).join('');
  },

  selectLang(code, name, flag, native) {
    this.selectedLang = { code, name, flag, native };
    this.renderLangs(document.getElementById('ob-lang-search')?.value || '');
    // Auto-advance to next step after selection
    clearTimeout(this._langTimer);
    this._langTimer = setTimeout(() => this.nextStep(), 600);
  },

  selectPlatform(name, el) {
    this.selectedPlatform = name;
    document.querySelectorAll('.platform-item-onboard').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
  },

  filterLangs(q) { this.renderLangs(q); },

  nextStep() {
    if (this.currentStep === 1) {
      const name = document.getElementById('ob-name-input')?.value?.trim() || 'Creator';
      ClarixState.username = name;
    }
    if (this.currentStep < this.totalSteps) {
      this.goToStep(this.currentStep + 1);
    }
  },

  prevStep() {
    if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
  },

  goToStep(step) {
    document.getElementById(`ob-step-${this.currentStep}`)?.classList.remove('active');
    this.currentStep = step;
    document.getElementById(`ob-step-${step}`)?.classList.add('active');

    // Progress
    const pct = (step / this.totalSteps) * 100;
    document.getElementById('ob-progress').style.width = pct + '%';
    for (let i = 1; i <= this.totalSteps; i++) {
      document.getElementById(`ob-dot-${i}`)?.classList.toggle('active', i === step);
    }
  },

  finish() {
    const lang = this.selectedLang;
    LangState.set(lang.code, lang.name, lang.flag, lang.native);
    localStorage.setItem('clarix_default_platform', this.selectedPlatform);
    localStorage.setItem('clarix_onboarded', 'true');
    this.close();
    Toast.show(`Welcome, ${ClarixState.username}! ✦ Ready to create.`, 'success', 4000);
    if (typeof Sidebar !== 'undefined') Sidebar.refresh();
  },

  skip() {
    LangState.set('en', 'English', '🌐', 'English');
    localStorage.setItem('clarix_onboarded', 'true');
    this.close();
  },

  close() {
    const overlay = document.getElementById('onboard-overlay');
    if (overlay) {
      overlay.classList.add('hiding');
      setTimeout(() => { overlay.remove(); }, 500);
    }
    document.body.style.overflow = '';
  }
};
