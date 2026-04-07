/* ═══════════════════════════════════════════════
   CLARIX — VOICE INPUT
   Web Speech API wrapper
═══════════════════════════════════════════════ */

const Voice = {
  _recognition: null,
  _active: false,

  isSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  },

  init(lang = 'en-IN') {
    if (!this.isSupported()) return null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = lang;
    this._recognition = r;
    return r;
  },

  start(targetElement, onFinal, lang = 'en-IN') {
    if (!this.isSupported()) {
      Toast.show('Voice input not supported in this browser', 'error');
      return;
    }
    if (this._active) { this.stop(); return; }

    const r = this.init(lang);
    if (!r) return;

    this._active = true;
    // Snapshot the existing text before voice starts — we append only to this
    const baseText = targetElement ? targetElement.value.trim() : '';

    r.onresult = (e) => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (targetElement) {
        // Show interim preview without duplicating
        const preview = final || interim;
        targetElement.value = baseText ? baseText + ' ' + preview : preview;
        if (final && onFinal) onFinal(targetElement.value);
      }
    };

    r.onerror = (e) => {
      this._active = false;
      this._updateBtn(false);
      if (e.error !== 'no-speech') Toast.show('Voice error: ' + e.error, 'error');
    };

    r.onend = () => {
      this._active = false;
      this._updateBtn(false);
    };

    r.start();
    this._updateBtn(true);
    Toast.show('Listening... speak now 🎙️', 'info', 3000);
  },

  stop() {
    if (this._recognition) this._recognition.stop();
    this._active = false;
    this._updateBtn(false);
  },

  _updateBtn(active) {
    document.querySelectorAll('.voice-btn').forEach(btn => {
      btn.classList.toggle('recording', active);
      btn.title = active ? 'Stop recording' : 'Voice input';
      btn.innerHTML = active
        ? '<span class="voice-pulse">🔴</span>'
        : '🎙️';
    });
  }
};
