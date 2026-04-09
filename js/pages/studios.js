/* ═══════════════════════════════════════════════
   CLARIX — CREATIVE STUDIOS ENGINE
   Kids / Corporate / Cultural / Multilingual
   All use Groq Vision (already working)
   Phase 1: Prompt output only (no image gen API)
═══════════════════════════════════════════════ */

/* ── Image compression helper (self-contained) ── */
function studioCompressImage(file, maxPx = 512, quality = 0.80) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({
        base64: dataUrl.split(',')[1],
        dataUrl,
        mime: 'image/jpeg',
        originalSize: file.size,
        compressedSize: Math.round(dataUrl.length * 0.75)
      });
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* ── STUDIO DEFINITIONS ────────────────────── */
const STUDIOS = [
  {
    id: 'kids',
    emoji: '👶',
    name: 'Kids Creator',
    sub: 'Fun cartoon-style prompts for children',
    badge: 'Fun Zone',
    css: 'studio-kids',
    hasUpload: true,
    desc: 'Upload your child\'s photo and get fun, animated style AI prompts perfect for creating cartoon artwork, birthday cards, and kids content.',
    options: {
      'Output Style': ['🎨 Cartoon / Animated', '🖍️ Sketch & Doodle', '📚 Storybook', '🦸 Superhero', '🌈 Colorful Pop Art'],
      'Platform': ['📸 Instagram', '💬 WhatsApp', '🖼️ Print / Poster', '🧒 Greeting Card']
    },
    textPlaceholder: 'Or describe what you want (e.g. "my daughter playing with her dog in the park")',
    analyzeLabel: '✨ Generate Fun Prompts',
    promptFn: buildKidsPrompt,
  },
  {
    id: 'corporate',
    emoji: '💼',
    name: 'Corporate Creator',
    sub: 'Professional content for business & brands',
    badge: 'Business',
    css: 'studio-corp',
    hasUpload: true,
    desc: 'Upload a photo or describe your brand/product and get professional AI prompts for LinkedIn, presentations, and business content.',
    options: {
      'Content Type': ['📄 LinkedIn Post', '📊 Pitch Deck Visual', '📧 Email Campaign', '🎯 Brand Ad', '👥 Team Photo'],
      'Style': ['💡 Professional & Clean', '🚀 Bold & Dynamic', '🤝 Friendly & Approachable', '🏆 Premium Luxury']
    },
    textPlaceholder: 'Describe your product, team, or brand (e.g. "our SaaS startup team in a modern office")',
    analyzeLabel: '⚡ Generate Pro Prompts',
    promptFn: buildCorporatePrompt,
  },
  {
    id: 'cultural',
    emoji: '🎉',
    name: 'Cultural Creator',
    sub: 'Festival captions, wishes & AI prompts — India & beyond',
    badge: 'Festivals',
    css: 'studio-cultural',
    hasUpload: false,
    desc: 'Select a festival, add your personal touch, and get ready captions with hashtags, Midjourney prompts, and WhatsApp wishes.',
    options: {
      'Language': ['🇮🇳 English', '🇮🇳 Hindi', '🇮🇳 Hinglish', '🇬🇧 Gujarati', '🇲🇦 Marathi', '🌙 Urdu'],
      'Content Type': ['📱 Instagram Post', '💬 WhatsApp Wish', '🎨 AI Art Prompt', '📢 Business Greeting', '🎊 Story/Reel Caption']
    },
    textPlaceholder: 'Add a personal touch (e.g. "from our family to yours, wishing warmth and joy")',
    analyzeLabel: '🎉 Generate Festival Content',
    promptFn: buildCulturalPrompt,
    festivals: [
      { emoji: '🪔', name: 'Diwali' },
      { emoji: '🎊', name: 'Navratri' },
      { emoji: '🌙', name: 'Eid' },
      { emoji: '🎄', name: 'Christmas' },
      { emoji: '🎆', name: 'New Year' },
      { emoji: '🌈', name: 'Holi' },
      { emoji: '💝', name: 'Valentine\'s' },
      { emoji: '🇮🇳', name: 'Republic Day' },
      { emoji: '🎂', name: 'Birthday' },
      { emoji: '🏆', name: 'Dussehra' },
      { emoji: '🙏', name: 'Ganesh Chaturthi' },
      { emoji: '🌸', name: 'Baisakhi' },
    ]
  },
  {
    id: 'multilingual',
    emoji: '🔤',
    name: 'Multilingual Analyzer',
    sub: 'Upload image with text — any language → 2 prompt variations',
    badge: 'Language AI',
    css: 'studio-multi',
    hasUpload: true,
    desc: 'Upload any image containing text in Hindi, Marathi, Gujarati, Tamil, Urdu, or any language. AI detects the language, reads the text, and generates 2 creative prompt variations.',
    options: {
      'Output Platform': ['🎨 Midjourney', '🤖 DALL-E / ChatGPT', '📸 Instagram', '💼 LinkedIn', '📱 WhatsApp'],
      'Variation Style': ['📝 Literal (close to original)', '🎨 Creative (artistic reinterpretation)', '🌟 Both variations']
    },
    textPlaceholder: 'Or describe the context (e.g. "this is a temple banner from Pune")',
    analyzeLabel: '🔍 Detect Language & Analyze',
    promptFn: buildMultilingualPrompt,
  }
];

// ── ACTIVE STUDIO STATE ────────────────────
let activeStudio = null;
let studioFile   = null;
let studioDataUrl = null;
let selectedOptions = {};
let selectedFestival = null;
let selectedVariation = null;

// ── RENDER STUDIO CARDS ─────────────────────
function renderStudios() {
  const grid = document.getElementById('studiosGrid');
  if (!grid) return;
  grid.innerHTML = STUDIOS.map((s, i) => `
    <div class="studio-card ${s.css}" onclick="openStudio('${s.id}')"
         style="animation-delay:${i * 0.07}s">
      <span class="studio-arrow">↗</span>
      <div class="studio-emoji">${s.emoji}</div>
      <div class="studio-name">${s.name}</div>
      <div class="studio-desc">${s.sub}</div>
      <div class="studio-badge">${s.badge}</div>
    </div>`).join('');
}

// ── OPEN STUDIO MODAL ───────────────────────
function openStudio(id) {
  activeStudio  = STUDIOS.find(s => s.id === id);
  studioFile    = null;
  studioDataUrl = null;
  selectedOptions = {};
  selectedFestival = null;
  selectedVariation = null;

  // Pre-select first option in each group
  Object.entries(activeStudio.options || {}).forEach(([group, pills]) => {
    selectedOptions[group] = pills[0];
  });

  renderStudioModal();
  const overlay = document.getElementById('studioOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStudio() {
  document.getElementById('studioOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── RENDER MODAL CONTENT ────────────────────
function renderStudioModal() {
  const s = activeStudio;
  const overlay = document.getElementById('studioOverlay');

  let uploadSection = '';
  if (s.hasUpload) {
    uploadSection = `
      <div class="studio-options-label">Upload Photo (Optional)</div>
      <div class="studio-upload-zone" id="studioDropZone"
           onclick="document.getElementById('studioFileInput').click()"
           ondragover="studioDragOver(event)" ondrop="studioDrop(event)">
        <div id="studioUploadInner">
          <div style="font-size:36px">📷</div>
          <div style="font-size:14px; font-weight:700; color:#fff">Tap to upload photo</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.45)">or drag & drop</div>
        </div>
      </div>
      <div class="studio-upload-preview" id="studioPreview">
        <img id="studioPreviewImg" src="" alt="Preview">
        <button class="change-photo" onclick="event.stopPropagation(); document.getElementById('studioFileInput').click()">Change photo</button>
      </div>
      <input type="file" id="studioFileInput" accept="image/*" style="display:none"
             onchange="studioFileSelected(this.files[0])">`;
  }

  // Festival selector for Cultural
  let festivalSection = '';
  if (s.festivals) {
    festivalSection = `
      <div class="studio-options-label">Choose Festival</div>
      <div class="festival-grid">
        ${s.festivals.map(f => `
          <div class="festival-card ${selectedFestival === f.name ? 'selected' : ''}"
               onclick="selectFestival('${f.name}')">
            <div class="fi-emoji">${f.emoji}</div>
            <div class="fi-name">${f.name}</div>
          </div>`).join('')}
      </div>`;
  }

  // Option pill groups
  let optionsHtml = '';
  Object.entries(s.options || {}).forEach(([group, pills]) => {
    optionsHtml += `
      <div class="studio-options-label">${group}</div>
      <div class="studio-pill-group">
        ${pills.map(p => `
          <div class="studio-pill ${selectedOptions[group] === p ? 'active' : ''}"
               onclick="selectPill('${group}', '${p.replace(/'/g,"\\'")}')">
            ${p}
          </div>`).join('')}
      </div>`;
  });

  overlay.querySelector('.studio-modal').innerHTML = `
    <div class="studio-modal-header">
      <div class="studio-modal-emoji">${s.emoji}</div>
      <div>
        <div class="studio-modal-title">${s.name}</div>
        <div class="studio-modal-sub">${s.desc}</div>
      </div>
      <button class="studio-modal-close" onclick="closeStudio()">✕</button>
    </div>

    ${festivalSection}
    ${uploadSection}

    ${optionsHtml}

    <div class="studio-options-label">Add Context (Optional)</div>
    <textarea id="studioContext" rows="3" style="
      width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
      border-radius:12px; padding:14px; color:#e0e0e0; font-size:14px; line-height:1.6;
      font-family:var(--font-body); resize:none; box-sizing:border-box; margin-bottom:16px;
    " placeholder="${s.textPlaceholder}"></textarea>

    <button class="studio-analyze-btn" id="studioAnalyzeBtn" onclick="runStudio()">
      ${s.analyzeLabel}
    </button>

    <div class="studio-output" id="studioOutput">
      <div class="studio-output-label">✨ AI Generated — Pick a Variation</div>
      <div id="studioVariations"></div>
      <button class="studio-send-to-write" onclick="sendStudioToWrite()">
        ✍️ Open in Write for further customization →
      </button>
    </div>
  `;
}

// ── INTERACTION HANDLERS ────────────────────
function selectPill(group, value) {
  selectedOptions[group] = value;
  renderStudioModal();
  // Re-show output if it was visible
  const output = document.getElementById('studioOutput');
  if (output && document.getElementById('studioVariations').children.length > 0) {
    output.classList.add('visible');
  }
}

function selectFestival(name) {
  selectedFestival = name;
  renderStudioModal();
}

function studioDragOver(e) {
  e.preventDefault();
  document.getElementById('studioDropZone').classList.add('dragover');
}

function studioDrop(e) {
  e.preventDefault();
  document.getElementById('studioDropZone').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) studioFileSelected(file);
}

function studioFileSelected(file) {
  if (!file) return;
  studioFile = file;
  const reader = new FileReader();
  reader.onload = ev => {
    studioDataUrl = ev.target.result;
    const preview = document.getElementById('studioPreview');
    const inner   = document.getElementById('studioUploadInner');
    const img     = document.getElementById('studioPreviewImg');
    if (preview && img) {
      img.src = studioDataUrl;
      preview.classList.add('visible');
      if (inner) inner.style.display = 'none';
    }
  };
  reader.readAsDataURL(file);
}

// ── RUN STUDIO ANALYSIS ─────────────────────
async function runStudio() {
  const s = activeStudio;
  const btn = document.getElementById('studioAnalyzeBtn');
  const context = document.getElementById('studioContext')?.value?.trim() || '';

  // Validate
  if (s.festivals && !selectedFestival) {
    Toast.show('Please select a festival first 🎉', 'error'); return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Analyzing...';
  Toast.show(`${s.emoji} Generating your content...`, 'info', 10000);

  try {
    let base64 = null, mime = 'image/jpeg';

    // Compress image if uploaded
    if (studioFile) {
      const compressed = await studioCompressImage(studioFile, 512, 0.80);
      base64 = compressed.base64;
      mime   = compressed.mime;
    }

    // Build prompt based on studio type
    const promptFn = s.promptFn;
    const result   = await promptFn({ base64, mime, context, options: selectedOptions, festival: selectedFestival });

    renderStudioOutput(result);
    Toast.show('✅ Content ready! Pick a variation below.', 'success', 3000);

  } catch (err) {
    console.error('[Studio]', err);
    Toast.show('❌ Something went wrong. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = s.analyzeLabel;
  }
}

// ── RENDER OUTPUT VARIATIONS ────────────────
function renderStudioOutput(result) {
  const output = document.getElementById('studioOutput');
  const varDiv = document.getElementById('studioVariations');

  const variations = Array.isArray(result) ? result : [result.variation1, result.variation2].filter(Boolean);

  varDiv.innerHTML = variations.map((v, i) => `
    <div class="studio-variation ${i === 0 ? 'selected' : ''}" onclick="selectVariation(${i})" id="sv_${i}">
      <div class="studio-variation-num">Variation ${i + 1} ${i === 0 ? '· ★ Recommended' : ''}</div>
      <div class="studio-variation-text">${v}</div>
      <button class="studio-variation-copy" onclick="event.stopPropagation(); copyVariation(${i}, '${v.replace(/'/g,"\\'")}')">Copy</button>
    </div>`).join('');

  // Store for send-to-write
  window._studioVariations = variations;
  selectedVariation = 0;
  output.classList.add('visible');
  output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function selectVariation(i) {
  document.querySelectorAll('.studio-variation').forEach((el, idx) => {
    el.classList.toggle('selected', idx === i);
  });
  selectedVariation = i;
}

function copyVariation(i, text) {
  navigator.clipboard?.writeText(text).then(() => {
    Toast.show('✅ Copied to clipboard!', 'success', 2000);
  }).catch(() => {
    Toast.show('Could not copy — try selecting manually', 'error');
  });
}

function sendStudioToWrite() {
  if (window._studioVariations && selectedVariation !== null) {
    const text = window._studioVariations[selectedVariation];
    localStorage.setItem('clarix_intent', text);
    localStorage.setItem('clarix_intent_source', 'studio'); // flag: already AI-generated
    closeStudio();
    window.location.href = 'write.html';
  }
}

// ════════════════════════════════════════════
// ── STUDIO PROMPT BUILDERS ──────────────────
// ════════════════════════════════════════════

// ── KIDS CREATOR ────────────────────────────
async function buildKidsPrompt({ base64, mime, context, options }) {
  const style    = options['Output Style'] || 'Cartoon / Animated';
  const platform = options['Platform'] || 'Instagram';

  const PROMPT = `You are a fun, creative AI prompt writer for children's content.
${base64 ? 'Analyze the uploaded photo carefully.' : ''}
${context ? `Context: "${context}"` : ''}

Generate 2 fun, child-friendly AI image prompts in ${style} style, suitable for ${platform}.
Keep it bright, happy, and age-appropriate.

Return JSON only (no markdown):
{
  "variation1": "First fun prompt — describe the scene with animated/cartoon details, bright colors, whimsical setting. End with: --style raw --q 2 if Midjourney",
  "variation2": "Second variation with a different fun angle — maybe superhero, fairytale, or storybook style"
}`;

  return callGroqVision(base64, mime, PROMPT);
}

// ── CORPORATE CREATOR ────────────────────────
async function buildCorporatePrompt({ base64, mime, context, options }) {
  const type  = options['Content Type'] || 'LinkedIn Post';
  const style = options['Style'] || 'Professional & Clean';

  const PROMPT = `You are a professional brand content strategist.
${base64 ? 'Analyze the uploaded business/brand/team photo.' : ''}
${context ? `Context: "${context}"` : ''}

Generate 2 professional AI prompts for ${type} in ${style} style.

Return JSON only:
{
  "variation1": "First professional prompt — precise, business-appropriate, with professional photography descriptors",
  "variation2": "Second variation with a bolder, more impactful angle for the same use case"
}`;

  return callGroqVision(base64, mime, PROMPT);
}

// ── CULTURAL CREATOR ─────────────────────────
async function buildCulturalPrompt({ context, options, festival }) {
  const lang    = options['Language'] || 'English';
  const type    = options['Content Type'] || 'Instagram Post';
  const langMap = {
    '🇮🇳 English': 'English',
    '🇮🇳 Hindi': 'Hindi',
    '🇮🇳 Hinglish': 'Hinglish (mix of Hindi and English)',
    '🇬🇧 Gujarati': 'Gujarati',
    '🇲🇦 Marathi': 'Marathi',
    '🌙 Urdu': 'Urdu',
  };
  const langName = langMap[lang] || 'English';

  const PROMPT = `You are a cultural content expert specializing in Indian festivals and celebrations.
Festival: ${festival}
Language: ${langName}
Content Type: ${type}
${context ? `Personal message to include: "${context}"` : ''}

Generate 2 warm, culturally appropriate ${festival} messages for ${type} in ${langName}.
${type.includes('Instagram') ? 'Include 5-8 relevant hashtags.' : ''}
${type.includes('AI Art') ? 'Make it a detailed Midjourney/DALL-E prompt for a beautiful festival scene.' : ''}

Return JSON only:
{
  "variation1": "First ${festival} message/prompt — warm, authentic, culturally rich${type.includes('Instagram') ? ' with hashtags' : ''}",
  "variation2": "Second variation — slightly different tone or angle, equally beautiful"
}`;

  // For cultural, no image needed — use text-only Groq
  return callGroqText(PROMPT);
}

// ── MULTILINGUAL ANALYZER ────────────────────
async function buildMultilingualPrompt({ base64, mime, context, options }) {
  const platform = options['Output Platform'] || 'Midjourney';
  const varStyle = options['Variation Style'] || '🌟 Both variations';

  if (!base64) {
    Toast.show('Please upload an image with text for language detection', 'error');
    throw new Error('No image uploaded');
  }

  const PROMPT = `You are an expert multilingual AI analyst and prompt engineer.

TASK: Analyze this image carefully.
1. Detect ALL text visible in the image — in any language (Hindi, Marathi, Gujarati, Tamil, Telugu, Urdu, Arabic, English, or mixed)
2. Identify the language(s)
3. Translate/understand the full meaning
4. Generate 2 ${platform} prompts based on what you see and read

${context ? `Additional context: "${context}"` : ''}

Return JSON only (no markdown):
{
  "detected_language": "Name of detected language(s)",
  "text_found": "The actual text you read from the image",
  "translation": "English translation of the text",
  "variation1": "Literal ${platform} prompt — stays close to what's in the image/text",
  "variation2": "Creative ${platform} prompt — artistic reinterpretation of the theme"
}`;

  const raw = await callGroqVision(base64, mime, PROMPT);

  // Format nicely showing detected language
  return {
    variation1: `🌐 Language: ${raw.detected_language || 'Detected'}\n📝 Text: "${raw.text_found || ''}"\n\n${raw.variation1 || ''}`,
    variation2: raw.variation2 || ''
  };
}

// ════════════════════════════════════════════
// ── GROQ HELPER: Vision + text calls ────────
// ════════════════════════════════════════════

async function callGroqVision(base64, mime, prompt) {
  const key = CLARIX_CONFIG.groqApiKey;
  if (!key || key === 'YOUR_GROQ_API_KEY') throw new Error('No Groq key configured');

  const messages = [{
    role: 'user',
    content: base64
      ? [
          { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } },
          { type: 'text', text: prompt }
        ]
      : prompt
  }];

  const model = base64
    ? 'meta-llama/llama-4-scout-17b-16e-instruct'  // vision model
    : 'meta-llama/llama-4-scout-17b-16e-instruct'; // text model

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model, messages, max_tokens: 800, temperature: 0.5 })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq ${res.status}`);
  }

  const data  = await res.json();
  const raw   = data?.choices?.[0]?.message?.content || '';
  const clean = raw.trim().replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
  const jsonStr = clean.startsWith('{') ? clean : (clean.match(/\{[\s\S]*\}/) || [])[0];

  if (jsonStr) return JSON.parse(jsonStr);
  // If not JSON, return as two variations split by newline
  const lines = clean.split('\n').filter(Boolean);
  return { variation1: lines[0] || clean, variation2: lines[1] || clean };
}

async function callGroqText(prompt) {
  return callGroqVision(null, null, prompt);
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderStudios();
  // Close on backdrop click
  document.getElementById('studioOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'studioOverlay') closeStudio();
  });
});
