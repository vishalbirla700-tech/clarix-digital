/* ═══════════════════════════════════════════════
   CLARIX — EMAIL CAPTURE (Formspree)
   Phase 2 lead capture for home page
   Replace CLARIX_CONFIG.formspreeId with your
   real ID from formspree.io (free tier: 50/mo)
═══════════════════════════════════════════════ */

const EmailCapture = {
  _submitted: false,

  init() {
    // If user already submitted, hide the form and show a soft message
    if (localStorage.getItem('clarix_email_submitted') === 'true') {
      this._showAlreadySubmitted();
    }
  },

  _showAlreadySubmitted() {
    const form  = document.getElementById('ec-form');
    const badge = document.querySelector('.ec-badge');
    if (form) {
      form.innerHTML =
        '<p style="color:rgba(255,255,255,0.35);font-size:14px;margin:0">✅ You\'re already on our list — thanks! We\'ll be in touch.</p>';
    }
    if (badge) badge.textContent = '✦ Already subscribed';
  },

  async submit(e) {
    e.preventDefault();
    if (this._submitted) return;

    const nameEl  = document.getElementById('ec-name');
    const emailEl = document.getElementById('ec-email');
    const btn     = document.getElementById('ec-submit-btn');
    const btnText = btn?.querySelector('.ec-btn-text');
    const loader  = btn?.querySelector('.ec-btn-loader');

    // — Validate —
    let valid = true;
    [nameEl, emailEl].forEach(el => el?.classList.remove('error'));

    if (!nameEl?.value.trim()) {
      nameEl?.classList.add('error');
      nameEl?.focus();
      valid = false;
    }
    const emailVal = emailEl?.value.trim();
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      emailEl?.classList.add('error');
      if (valid) emailEl?.focus();
      valid = false;
    }
    if (!valid) {
      Toast.show('Please fill in your name and a valid email.', 'warning');
      return;
    }

    // — Loading state —
    this._submitted = true;
    if (btn)     { btn.disabled = true; }
    if (btnText) { btnText.style.display = 'none'; }
    if (loader)  { loader.style.display = 'flex'; }

    const formspreeId = (typeof CLARIX_CONFIG !== 'undefined' && CLARIX_CONFIG.formspreeId)
      ? CLARIX_CONFIG.formspreeId
      : null;

    try {
      if (formspreeId && formspreeId !== 'YOUR_FORMSPREE_ID') {
        // — Real Formspree submission —
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name:  nameEl.value.trim(),
            email: emailVal,
            source: 'clarix-home-capture',
            _subject: `New Clarix subscriber: ${nameEl.value.trim()}`
          })
        });
        if (!res.ok) throw new Error('Formspree error: ' + res.status);
      } else {
        // — Local fallback: simulate a 1s submit (no real endpoint) —
        await new Promise(r => setTimeout(r, 900));
        console.info('[EmailCapture] Formspree ID not set — submission simulated locally.');
        console.info('[EmailCapture] Set CLARIX_CONFIG.formspreeId in config.js to enable real submissions.');
      }

      // — Success —
      localStorage.setItem('clarix_email_submitted', 'true');
      this._showSuccess();

    } catch (err) {
      // — Error —
      this._submitted = false;
      if (btn)     { btn.disabled = false; }
      if (btnText) { btnText.style.display = ''; }
      if (loader)  { loader.style.display = 'none'; }
      Toast.show('Something went wrong. Please try again.', 'error');
      console.error('[EmailCapture]', err);
    }
  },

  _showSuccess() {
    const form    = document.getElementById('ec-form');
    const success = document.getElementById('ec-success');
    const title   = document.querySelector('.ec-title');
    const sub     = document.querySelector('.ec-sub');

    if (form)    { form.style.transition = 'opacity 0.3s'; form.style.opacity = '0'; }
    if (title)   { title.style.transition = 'opacity 0.3s'; title.style.opacity = '0'; }
    if (sub)     { sub.style.transition  = 'opacity 0.3s'; sub.style.opacity  = '0'; }

    setTimeout(() => {
      if (form)    form.style.display    = 'none';
      if (title)   title.style.display   = 'none';
      if (sub)     sub.style.display     = 'none';
      if (success) {
        success.style.display = 'block';
        success.style.animation = 'fadeUp 0.4s var(--ease) both';
      }
    }, 320);
  }
};

/* Init on DOM ready */
document.addEventListener('DOMContentLoaded', () => EmailCapture.init());
