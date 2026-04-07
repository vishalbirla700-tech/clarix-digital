/* ═══════════════════════════════════════════════
   CLARIX — SHARE.JS
   Share prompts via URL + copy link
   No backend required — URL-encoded sharing
═══════════════════════════════════════════════ */

const SharePrompt = {

  /* ─── GENERATE SHAREABLE LINK ───────────────── */
  generate(promptText, platform = '') {
    const base = window.location.origin;
    const params = new URLSearchParams();
    params.set('prompt', promptText);
    if (platform) params.set('platform', platform);
    params.set('via', 'clarix');
    return `${base}/write.html?${params.toString()}`;
  },

  /* ─── COPY SHARE LINK ────────────────────────── */
  async copyLink(promptText, platform = '') {
    const link = this.generate(promptText, platform);
    try {
      await navigator.clipboard.writeText(link);
      Toast.show('🔗 Share link copied!', 'success', 3000);
      return link;
    } catch {
      Toast.show('Could not copy. Try manually.', 'error');
      return null;
    }
  },

  /* ─── NATIVE SHARE (mobile) ──────────────────── */
  async native(promptText, platform = '') {
    const link = this.generate(promptText, platform);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Clarix AI Prompt',
          text: `✦ Check out this prompt I made on Clarix:\n\n${promptText.slice(0, 120)}...`,
          url: link
        });
        return true;
      } catch { /* user cancelled */ }
    }
    // Fallback to copy
    return this.copyLink(promptText, platform);
  },

  /* ─── SHOW SHARE MODAL ───────────────────────── */
  showModal(promptText, platform = '') {
    const existing = document.getElementById('share-modal-overlay');
    if (existing) existing.remove();

    const link = this.generate(promptText, platform);
    const shortLink = link.length > 60 ? link.slice(0, 57) + '...' : link;

    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.id = 'share-modal-overlay';
    el.innerHTML = `
      <div class="modal share-modal">
        <button class="modal-close" onclick="document.getElementById('share-modal-overlay').remove()">✕</button>
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-size:36px;margin-bottom:8px">🔗</div>
          <h3 style="font-family:var(--font-head);font-size:20px;margin-bottom:6px">Share This Prompt</h3>
          <p style="color:#888;font-size:13px">Anyone with this link can view and use your prompt</p>
        </div>

        <div class="share-link-box">
          <div class="share-link-text" id="share-link-display">${shortLink}</div>
          <button class="share-copy-btn" id="share-copy-btn" onclick="SharePrompt._copyFromModal('${encodeURIComponent(link)}')">
            📋 Copy
          </button>
        </div>

        <div class="share-actions">
          ${navigator.share ? `
            <button class="btn btn-primary" style="flex:1" onclick="SharePrompt.native(decodeURIComponent('${encodeURIComponent(promptText)}'))">
              📤 Share via...
            </button>
          ` : ''}
          <button class="btn btn-secondary" style="flex:1" onclick="SharePrompt._whatsapp('${encodeURIComponent(promptText)}','${encodeURIComponent(link)}')">
            WhatsApp
          </button>
          <button class="btn btn-secondary" style="flex:1" onclick="SharePrompt._twitter('${encodeURIComponent(promptText)}','${encodeURIComponent(link)}')">
            𝕏 Twitter
          </button>
        </div>

        <div class="share-preview">
          <div class="share-preview-label">Prompt Preview</div>
          <div class="share-preview-text">${(promptText || '').slice(0, 160)}${promptText?.length > 160 ? '...' : ''}</div>
        </div>
      </div>`;

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('open'));
    el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  },

  /* ─── COPY FROM MODAL ────────────────────────── */
  async _copyFromModal(encodedLink) {
    const link = decodeURIComponent(encodedLink);
    try {
      await navigator.clipboard.writeText(link);
      const btn = document.getElementById('share-copy-btn');
      if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = '📋 Copy', 2000); }
      Toast.show('🔗 Link copied!', 'success');
    } catch { Toast.show('Copy failed', 'error'); }
  },

  /* ─── WHATSAPP ───────────────────────────────── */
  _whatsapp(encodedPrompt, encodedLink) {
    const prompt = decodeURIComponent(encodedPrompt);
    const link = decodeURIComponent(encodedLink);
    const text = `✦ Check this AI prompt I made on Clarix:\n\n"${prompt.slice(0, 100)}..."\n\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  },

  /* ─── TWITTER / X ────────────────────────────── */
  _twitter(encodedPrompt, encodedLink) {
    const prompt = decodeURIComponent(encodedPrompt);
    const link = decodeURIComponent(encodedLink);
    const text = `✦ Made this AI prompt on @ClarixAI:\n\n"${prompt.slice(0, 80)}..." ${link} #AIPrompts #Clarix`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  },

  /* ─── READ SHARED PROMPT FROM URL ───────────────
     Call on write.html load to auto-fill a shared prompt
  ────────────────────────────────────────────── */
  readFromURL() {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get('prompt');
    const platform = params.get('platform');
    const via = params.get('via');

    if (!prompt || via !== 'clarix') return null;

    return { prompt: decodeURIComponent(prompt), platform };
  }
};
