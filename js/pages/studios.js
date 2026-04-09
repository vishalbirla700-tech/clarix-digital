/* ═══════════════════════════════════════════════
   CLARIX — CREATIVE STUDIOS v2
   Visual hero · Canvas cards · Voice · Kids gallery
═══════════════════════════════════════════════ */

/* ── Image compression ── */
function studioCompressImage(file, maxPx = 512, quality = 0.80) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = c.toDataURL('image/jpeg', quality);
      resolve({ base64: dataUrl.split(',')[1], dataUrl, mime: 'image/jpeg',
        originalSize: file.size, compressedSize: Math.round(dataUrl.length * 0.75) });
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* ── FESTIVAL CONFIG ── */
const FESTIVALS = [
  { emoji:'🪔', name:'Diwali',              grad:['#ff6b00','#ffc300','#ff8c00'], emoji2:'✨🪔🎇' },
  { emoji:'🎊', name:'Navratri',            grad:['#d63031','#e17055','#fdcb6e'], emoji2:'🎊🌸💃' },
  { emoji:'🌙', name:'Eid',                 grad:['#00b894','#00cec9','#6c5ce7'], emoji2:'🌙⭐🕌' },
  { emoji:'🎄', name:'Christmas',           grad:['#2d3436','#00b894','#d63031'], emoji2:'🎄❄️🎁' },
  { emoji:'🎆', name:'New Year',            grad:['#2d3436','#6c5ce7','#e17055'], emoji2:'🎆🥂✨' },
  { emoji:'🌈', name:'Holi',               grad:['#e84393','#00b894','#fdcb6e'], emoji2:'🌈🎨💦' },
  { emoji:'💝', name:"Valentine's",         grad:['#d63031','#e84393','#fd79a8'], emoji2:'💝🌹❤️' },
  { emoji:'🇮🇳', name:'Republic Day',       grad:['#ff7043','#ffffff','#1a78c2'], emoji2:'🇮🇳🎺🌟' },
  { emoji:'🎂', name:'Birthday',            grad:['#a29bfe','#fd79a8','#fdcb6e'], emoji2:'🎂🎉🎈' },
  { emoji:'🏆', name:'Dussehra',            grad:['#e17055','#d63031','#fdcb6e'], emoji2:'🏆🏹✨' },
  { emoji:'🙏', name:'Ganesh Chaturthi',    grad:['#fdcb6e','#e17055','#6c5ce7'], emoji2:'🙏🐘🌸' },
  { emoji:'🌸', name:'Baisakhi',            grad:['#fdcb6e','#00b894','#e17055'], emoji2:'🌾🌸🎵' },
];

/* ── KIDS STYLE GALLERY ── */
const KIDS_STYLES = [
  { label:'🎨 Cartoon',   img:'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=200&q=70', desc:'Pixar-style fun' },
  { label:'🖍️ Sketch',    img:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&q=70', desc:'Doodle & draw' },
  { label:'📚 Storybook', img:'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200&q=70', desc:'Fairy tale vibes' },
  { label:'🦸 Superhero', img:'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=200&q=70', desc:'Hero power!' },
  { label:'🌈 Pop Art',   img:'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=70', desc:'Bold & vibrant' },
];

/* ── STUDIOS DEFINITIONS ── */
const STUDIOS = [
  {
    id:'kids', emoji:'👶', name:'Kids Creator', sub:'Fun cartoon-style prompts for young ones',
    badge:'Fun Zone', css:'studio-kids',
    heroGrad: 'linear-gradient(135deg,#ff6b6b22,#ffc30022)',
    heroBg: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&q=60',
    hasUpload:true,
    desc:'Turn any photo into fun, animated AI prompts for cartoon art, birthday cards, stickers & kids content.',
    tips:['📱 Share prompts on Instagram or WhatsApp', '🎨 Paste into Midjourney for real cartoon art', '🖨️ Print as a poster or birthday card', '🎬 Use as a Reel/YouTube Shorts description'],
    options:{
      'Art Style':['🎨 Cartoon / Pixar','🖍️ Sketch & Doodle','📚 Storybook / Fairy Tale','🦸 Superhero Comic','🌈 Colorful Pop Art'],
      'Platform':['📸 Instagram','💬 WhatsApp Sticker','🖼️ Print / Poster','🎂 Birthday Card','🎬 Reel Caption']
    },
    textPlaceholder:'Describe the scene (e.g. "my daughter playing with her puppy in the park")',
    analyzeLabel:'✨ Generate Fun Prompts',
    promptFn: buildKidsPrompt,
  },
  {
    id:'corporate', emoji:'💼', name:'Corporate Creator', sub:'Professional content for brands & businesses',
    badge:'Business', css:'studio-corp',
    heroGrad:'linear-gradient(135deg,#1a78c222,#0f4c8122)',
    heroBg:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=60',
    hasUpload:true,
    desc:'Professional AI prompts for LinkedIn posts, pitch decks, brand ads, and business content.',
    tips:['💼 LinkedIn posts get 3x more reach with visuals','📊 Use for pitch deck slide descriptions','📧 Perfect for email campaign headers','🏆 Build premium brand imagery'],
    options:{
      'Content Type':['📄 LinkedIn Post','📊 Pitch Deck Visual','📧 Email Campaign','🎯 Brand Ad','👥 Team Photo'],
      'Style':['💡 Professional & Clean','🚀 Bold & Dynamic','🤝 Friendly & Approachable','🏆 Premium Luxury']
    },
    textPlaceholder:'Describe your product or brand (e.g. "our SaaS fintech team in a modern Mumbai office")',
    analyzeLabel:'⚡ Generate Pro Prompts',
    promptFn: buildCorporatePrompt,
  },
  {
    id:'cultural', emoji:'🎉', name:'Cultural Creator', sub:'Festival cards, wishes & captions — India & beyond',
    badge:'Festivals', css:'studio-cultural',
    heroGrad:'linear-gradient(135deg,#ff704322,#f59e0b22)',
    heroBg:'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=800&q=60',
    hasUpload:false,
    desc:'Generate beautiful festival cards with AI text — download and share directly on WhatsApp & Instagram.',
    tips:['💬 Send as WhatsApp image instantly','📸 Share as Instagram story or post','🎨 AI generates the perfect festive message','🌏 Available in 6 Indian languages'],
    options:{
      'Language':['🇮🇳 English','🇮🇳 Hindi','🇮🇳 Hinglish','🎨 Gujarati','🙏 Marathi','🌙 Urdu'],
      'Card Style':['🪔 Festive & Warm','✨ Minimal & Elegant','🎨 Bold & Vibrant','🏆 Premium Dark'],
      'Content Type':['💬 WhatsApp Wish','📱 Instagram Post','📢 Business Greeting','🎊 Story Caption']
    },
    textPlaceholder:'Add your personal touch (e.g. "from our family to yours" or your name/brand)',
    analyzeLabel:'🎉 Generate Festival Card',
    festivals: FESTIVALS,
    promptFn: buildCulturalPrompt,
  },
  {
    id:'multilingual', emoji:'🔤', name:'Multilingual Analyzer', sub:'Image with any language text → 2 creative prompts',
    badge:'Language AI', css:'studio-multi',
    heroGrad:'linear-gradient(135deg,#7c3aed22,#db277722)',
    heroBg:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=60',
    hasUpload:true,
    desc:'Upload any image with Hindi, Marathi, Gujarati, Tamil, Urdu, Arabic or mixed-language text. AI reads it and generates prompts.',
    tips:['🇮🇳 Supports 20+ Indian & world languages','📸 Works with temple banners, product labels, menus','✍️ Get literal or creative interpretations','🌐 Auto-detects language — no selection needed'],
    options:{
      'Output Platform':['🎨 Midjourney','🤖 DALL-E / ChatGPT','📸 Instagram','💼 LinkedIn','📱 WhatsApp'],
      'Variation Style':['📝 Literal (stays close to original)','🎨 Creative (artistic reinterpretation)','🌟 Both styles']
    },
    textPlaceholder:'Add context (e.g. "this is a Diwali banner from a Pune shop")',
    analyzeLabel:'🔍 Detect Language & Analyze',
    promptFn: buildMultilingualPrompt,
  }
];

/* ── STATE ── */
let activeStudio = null, studioFile = null, studioDataUrl = null;
let selectedOptions = {}, selectedFestival = null, selectedVariation = null;
let studioVoiceOn = false;

/* ── RENDER CARDS ── */
function renderStudios() {
  const grid = document.getElementById('studiosGrid');
  if (!grid) return;
  grid.innerHTML = STUDIOS.map((s,i) => `
    <div class="studio-card ${s.css}" onclick="openStudio('${s.id}')" style="animation-delay:${i*0.07}s">
      <span class="studio-arrow">↗</span>
      <div class="studio-emoji">${s.emoji}</div>
      <div class="studio-name">${s.name}</div>
      <div class="studio-desc">${s.sub}</div>
      <div class="studio-badge">${s.badge}</div>
    </div>`).join('');
}

/* ── OPEN/CLOSE STUDIO ── */
function openStudio(id) {
  activeStudio = STUDIOS.find(s => s.id === id);
  studioFile = studioDataUrl = null;
  selectedOptions = {};
  selectedFestival = null;
  selectedVariation = null;
  Object.entries(activeStudio.options||{}).forEach(([g,p]) => selectedOptions[g] = p[0]);
  buildStudioModal();
  document.getElementById('studioOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStudio() {
  document.getElementById('studioOverlay').classList.remove('open');
  document.body.style.overflow = '';
  stopStudioVoice();
}

/* ── BUILD MODAL HTML ── */
function buildStudioModal() {
  const s = activeStudio;

  /* Hero section */
  const hero = `
    <div class="studio-hero" style="background-image:url('${s.heroBg}')">
      <div class="studio-hero-overlay" style="background:${s.heroGrad.replace(/22/g,'aa')}"></div>
      <div class="studio-hero-content">
        <div class="studio-hero-emoji">${s.emoji}</div>
        <div class="studio-hero-title">${s.name}</div>
        <div class="studio-hero-sub">${s.desc}</div>
      </div>
    </div>`;

  /* Tips strip */
  const tips = `
    <div class="studio-tips-strip">
      ${s.tips.map(t => `<div class="studio-tip">${t}</div>`).join('')}
    </div>`;

  /* Kids style gallery */
  const kidsGallery = s.id === 'kids' ? `
    <div class="studio-options-label">Style Preview — Tap to select</div>
    <div class="kids-style-gallery">
      ${KIDS_STYLES.map((k,i) => `
        <div class="kids-style-card ${selectedOptions['Art Style'] === k.label.replace(/ \//,'/') || (i===0 && !selectedOptions['Art Style']) ? 'active' : ''}"
             onclick="selectKidsStyle('${k.label}')">
          <img src="${k.img}" alt="${k.label}" loading="lazy">
          <div class="ks-label">${k.label}</div>
          <div class="ks-desc">${k.desc}</div>
        </div>`).join('')}
    </div>` : '';

  /* Festival festival picker */
  const festivalPicker = s.festivals ? `
    <div class="studio-options-label">Choose Your Festival</div>
    <div class="festival-grid">
      ${FESTIVALS.map(f => `
        <div class="festival-card ${selectedFestival === f.name ? 'selected' : ''}"
             onclick="selectFestival('${f.name}')"
             style="${selectedFestival===f.name ? `background:linear-gradient(135deg,${f.grad[0]}33,${f.grad[1]}22);border-color:${f.grad[0]}88` : ''}">
          <div class="fi-emoji">${f.emoji}</div>
          <div class="fi-name">${f.name}</div>
        </div>`).join('')}
    </div>
    ${selectedFestival ? renderFestivalPreview() : ''}` : '';

  /* Upload zone */
  const upload = s.hasUpload ? `
    <div class="studio-options-label">Upload Photo <span style="color:rgba(255,255,255,0.4);font-weight:400">(optional)</span></div>
    <div class="studio-upload-zone" id="studioDropZone"
         onclick="document.getElementById('studioFileInput').click()"
         ondragover="studioDragOver(event)" ondrop="studioDrop(event)">
      <div id="studioUploadInner">
        <div style="font-size:40px">📷</div>
        <div style="font-size:14px;font-weight:700;color:#fff;margin-top:8px">Tap to upload photo</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px">or drag & drop · JPG, PNG, HEIC</div>
      </div>
    </div>
    <div class="studio-upload-preview" id="studioPreview">
      <img id="studioPreviewImg" src="" alt="Preview">
      <button class="change-photo" onclick="event.stopPropagation();document.getElementById('studioFileInput').click()">📷 Change photo</button>
    </div>
    <input type="file" id="studioFileInput" accept="image/*" style="display:none" onchange="studioFileSelected(this.files[0])">` : '';

  /* Options */
  let opts = '';
  Object.entries(s.options||{}).forEach(([grp,pills]) => {
    opts += `<div class="studio-options-label">${grp}</div>
    <div class="studio-pill-group">
      ${pills.map(p => `<div class="studio-pill ${selectedOptions[grp]===p?'active':''}" onclick="selectPill('${grp}','${p.replace(/'/g,"\\'")}'">${p}</div>`).join('')}
    </div>`;
  });

  /* Context + voice */
  const ctx = `
    <div class="studio-options-label">Add Your Personal Touch</div>
    <div class="studio-voice-row">
      <textarea id="studioContext" rows="3" class="studio-textarea"
        placeholder="${s.textPlaceholder}"></textarea>
      <button class="studio-mic-btn" id="studioMicBtn" onclick="toggleStudioVoice()" title="Voice input">🎤</button>
    </div>`;

  /* CTA */
  const cta = `<button class="studio-analyze-btn" id="studioAnalyzeBtn" onclick="runStudio()">${s.analyzeLabel}</button>`;

  /* Output */
  const out = `
    <div class="studio-output" id="studioOutput">
      <div class="studio-output-label">✨ AI Generated — Choose your variation</div>
      <div id="studioVariations"></div>
      ${s.id === 'cultural' ? `<div id="festivalCardCanvas" class="festival-canvas-wrap"></div>` : ''}
      <button class="studio-send-to-write" onclick="sendStudioToWrite()">✍️ Open in Write for more customization →</button>
    </div>`;

  document.querySelector('.studio-modal').innerHTML = `
    <button class="studio-modal-close-top" onclick="closeStudio()">✕ Close</button>
    ${hero}
    <div class="studio-modal-body">
      ${tips}
      ${kidsGallery}
      ${festivalPicker}
      ${upload}
      ${opts}
      ${ctx}
      ${cta}
      ${out}
    </div>`;
}

/* ── FESTIVAL PREVIEW (mini card preview) ── */
function renderFestivalPreview() {
  const f = FESTIVALS.find(x => x.name === selectedFestival);
  if (!f) return '';
  return `
    <div class="festival-preview-card" style="background:linear-gradient(135deg,${f.grad[0]},${f.grad[1]},${f.grad[2]})">
      <div class="fpc-emojis">${f.emoji2}</div>
      <div class="fpc-name">${f.name}</div>
      <div class="fpc-sub">Tap Generate to get your card</div>
    </div>`;
}

/* ── KIDS STYLE SELECT ── */
function selectKidsStyle(label) {
  selectedOptions['Art Style'] = label;
  buildStudioModal();
  // restore scroll position
  document.querySelector('.studio-modal')?.scrollTo?.(0,0);
}

/* ── PILL SELECT ── */
function selectPill(group, value) {
  selectedOptions[group] = value;
  // re-render pill groups only (lightweight)
  document.querySelectorAll('.studio-pill-group').forEach(group_el => {
    group_el.querySelectorAll('.studio-pill').forEach(pill => {
      const grpLabel = pill.closest('.studio-pill-group')?.previousElementSibling?.textContent?.trim();
      if (grpLabel && selectedOptions[grpLabel] === pill.textContent.trim()) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  });
}

/* ── FESTIVAL SELECT ── */
function selectFestival(name) {
  selectedFestival = name;
  // Re-render festival section only
  const preview = document.querySelector('.festival-preview-card');
  const gridParent = document.querySelector('.festival-grid');
  if (gridParent) {
    gridParent.querySelectorAll('.festival-card').forEach(card => {
      const n = card.querySelector('.fi-name')?.textContent;
      const f = FESTIVALS.find(x => x.name === n);
      card.classList.toggle('selected', n === name);
      if (n === name && f) card.style.cssText = `background:linear-gradient(135deg,${f.grad[0]}33,${f.grad[1]}22);border-color:${f.grad[0]}88`;
      else card.style.cssText = '';
    });
    // Add/update preview card
    const f = FESTIVALS.find(x => x.name === name);
    let previewEl = document.querySelector('.festival-preview-card');
    const previewHtml = `<div class="festival-preview-card" style="background:linear-gradient(135deg,${f.grad[0]},${f.grad[1]},${f.grad[2]})">
      <div class="fpc-emojis">${f.emoji2}</div>
      <div class="fpc-name">${f.name}</div>
      <div class="fpc-sub">Tap Generate to get your card ↓</div>
    </div>`;
    if (previewEl) previewEl.outerHTML = previewHtml;
    else gridParent.insertAdjacentHTML('afterend', previewHtml);
  }
}

/* ── DRAG & DROP ── */
function studioDragOver(e) { e.preventDefault(); document.getElementById('studioDropZone')?.classList.add('dragover'); }
function studioDrop(e) {
  e.preventDefault();
  document.getElementById('studioDropZone')?.classList.remove('dragover');
  const f = e.dataTransfer.files[0];
  if (f?.type.startsWith('image/')) studioFileSelected(f);
}
function studioFileSelected(file) {
  if (!file) return;
  studioFile = file;
  const reader = new FileReader();
  reader.onload = ev => {
    studioDataUrl = ev.target.result;
    const prev = document.getElementById('studioPreview');
    const img  = document.getElementById('studioPreviewImg');
    const inn  = document.getElementById('studioUploadInner');
    if (prev && img) { img.src = studioDataUrl; prev.classList.add('visible'); }
    if (inn) inn.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

/* ── VOICE INPUT ── */
let studioRecognition = null;
function toggleStudioVoice() {
  if (studioVoiceOn) { stopStudioVoice(); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { Toast.show('Voice not supported on this browser', 'error'); return; }
  studioRecognition = new SR();
  studioRecognition.continuous = false;
  studioRecognition.interimResults = true;
  studioRecognition.lang = 'en-IN';
  studioRecognition.onresult = e => {
    const t = Array.from(e.results).map(r => r[0].transcript).join('');
    const ta = document.getElementById('studioContext');
    if (ta) ta.value = t;
  };
  studioRecognition.onend = () => stopStudioVoice();
  studioRecognition.start();
  studioVoiceOn = true;
  const btn = document.getElementById('studioMicBtn');
  if (btn) { btn.textContent = '🔴'; btn.style.background = 'rgba(255,50,50,0.2)'; }
  Toast.show('🎤 Listening... speak now', 'info', 5000);
}
function stopStudioVoice() {
  if (studioRecognition) { studioRecognition.stop(); studioRecognition = null; }
  studioVoiceOn = false;
  const btn = document.getElementById('studioMicBtn');
  if (btn) { btn.textContent = '🎤'; btn.style.background = ''; }
}

/* ── RUN STUDIO ── */
async function runStudio() {
  const s = activeStudio;
  const btn = document.getElementById('studioAnalyzeBtn');
  const context = document.getElementById('studioContext')?.value?.trim() || '';
  stopStudioVoice();

  if (s.festivals && !selectedFestival) { Toast.show('Please select a festival first 🎉', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner">⏳</span> Generating...';
  Toast.show(`${s.emoji} Creating your content...`, 'info', 12000);

  try {
    let base64 = null, mime = 'image/jpeg';
    if (studioFile) {
      const c = await studioCompressImage(studioFile, 512, 0.80);
      base64 = c.base64; mime = c.mime;
    }
    const result = await s.promptFn({ base64, mime, context, options: selectedOptions, festival: selectedFestival });
    renderStudioOutput(result);
    Toast.show('✅ Done! Pick a variation below.', 'success', 3000);
  } catch (err) {
    console.error('[Studio]', err);
    Toast.show(`❌ ${err.message || 'Something went wrong. Try again.'}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = s.analyzeLabel;
  }
}

/* ── RENDER OUTPUT ── */
function renderStudioOutput(result) {
  const out  = document.getElementById('studioOutput');
  const varD = document.getElementById('studioVariations');
  const vars = Array.isArray(result) ? result : [result.variation1, result.variation2].filter(Boolean);

  varD.innerHTML = vars.map((v, i) => `
    <div class="studio-variation ${i===0?'selected':''}" onclick="selectVariation(${i})" id="sv_${i}">
      <div class="studio-variation-num">Variation ${i+1} ${i===0?'· ★ Recommended':''}</div>
      <div class="studio-variation-text">${v.replace(/\n/g,'<br>')}</div>
      <button class="studio-variation-copy"
        onclick="event.stopPropagation();copyVar(${i})">Copy</button>
    </div>`).join('');

  window._studioVars = vars;
  selectedVariation = 0;
  out.classList.add('visible');

  // For Cultural: generate canvas card
  if (activeStudio.id === 'cultural' && selectedFestival && vars[0]) {
    generateFestivalCard(vars[0]);
  }

  out.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function selectVariation(i) {
  document.querySelectorAll('.studio-variation').forEach((el,idx) => el.classList.toggle('selected', idx===i));
  selectedVariation = i;
  // Regenerate card for selected variation
  if (activeStudio.id === 'cultural' && window._studioVars?.[i]) {
    generateFestivalCard(window._studioVars[i]);
  }
}

function copyVar(i) {
  const text = window._studioVars?.[i] || '';
  navigator.clipboard?.writeText(text)
    .then(() => Toast.show('✅ Copied!', 'success', 2000))
    .catch(() => Toast.show('Select and copy manually', 'error'));
}

function sendStudioToWrite() {
  if (!window._studioVars || selectedVariation === null) return;
  localStorage.setItem('clarix_intent', window._studioVars[selectedVariation]);
  localStorage.setItem('clarix_intent_source', 'studio');
  closeStudio();
  window.location.href = 'write.html';
}

/* ══════════════════════════════════════════════
   FESTIVAL CARD GENERATOR (HTML Canvas → image)
   No external API needed — 100% browser-side
══════════════════════════════════════════════ */
function generateFestivalCard(text) {
  const f = FESTIVALS.find(x => x.name === selectedFestival);
  if (!f) return;

  const wrap = document.getElementById('festivalCardCanvas');
  if (!wrap) return;
  wrap.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, f.grad[0]);
  grad.addColorStop(0.5, f.grad[1]);
  grad.addColorStop(1, f.grad[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // Dark overlay for readability
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, 1080, 1080);

  // Decorative border
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 1020, 1020);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, 980, 980);

  // Festival emoji (big, top)
  ctx.font = '140px serif';
  ctx.textAlign = 'center';
  ctx.fillText(f.emoji, 540, 260);

  // Festival name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 80px Arial, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 20;
  ctx.fillText(f.name, 540, 380);

  // Message text (wrap)
  ctx.font = '38px Arial, sans-serif';
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  wrapCanvasText(ctx, text.substring(0, 220), 540, 500, 900, 58);

  // Bottom emoji strip
  ctx.font = '60px serif';
  ctx.shadowBlur = 0;
  ctx.fillText(f.emoji2, 540, 970);

  // Clarix watermark
  ctx.font = '24px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('Made with Clarix AI · clarix.digital', 540, 1035);

  // Render canvas to preview
  canvas.style.cssText = `
    width:100%; border-radius:16px; display:block;
    box-shadow:0 20px 60px rgba(0,0,0,0.6);
    margin-top:16px;
  `;
  wrap.appendChild(canvas);

  // Download button
  const dlBtn = document.createElement('button');
  dlBtn.textContent = '⬇️ Download Festival Card';
  dlBtn.style.cssText = `
    width:100%; margin-top:12px; padding:14px; border-radius:12px;
    background:linear-gradient(135deg,${f.grad[0]},${f.grad[1]});
    border:none; color:#fff; font-size:15px; font-weight:800;
    cursor:pointer; font-family:var(--font-body);
  `;
  dlBtn.onclick = () => {
    const a = document.createElement('a');
    a.download = `clarix-${selectedFestival.toLowerCase()}-card.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    Toast.show('📥 Festival card downloaded!', 'success');
  };
  wrap.appendChild(dlBtn);

  // WhatsApp share button (mobile)
  const wpBtn = document.createElement('button');
  wpBtn.textContent = '💬 Share on WhatsApp';
  wpBtn.style.cssText = `
    width:100%; margin-top:8px; padding:14px; border-radius:12px;
    background:rgba(37,211,102,0.15); border:1px solid rgba(37,211,102,0.4);
    color:#25d366; font-size:15px; font-weight:800;
    cursor:pointer; font-family:var(--font-body);
  `;
  wpBtn.onclick = () => {
    const msg = encodeURIComponent(text.substring(0, 300));
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };
  wrap.appendChild(wpBtn);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      if (currentY > 900) break; // don't overflow card
    } else { line = testLine; }
  }
  ctx.fillText(line, x, currentY);
}

/* ══════════════════════════════════════════════
   PROMPT BUILDERS
══════════════════════════════════════════════ */

async function buildKidsPrompt({ base64, mime, context, options }) {
  const style = (options['Art Style'] || 'Cartoon / Pixar').replace(/[🎨🖍️📚🦸🌈]\s*/g,'');
  const platform = (options['Platform'] || 'Instagram').replace(/[📸💬🖼️🎂🎬]\s*/g,'');
  const PROMPT = `You are a fun, creative AI prompt writer for children's content.
${base64 ? 'Carefully analyze the uploaded photo.' : ''}
${context ? `Scene to recreate: "${context}"` : ''}

Create 2 joyful, age-appropriate AI image prompts in ${style} style for ${platform}.
Make them bright, colorful, and exciting for kids!

Return JSON only:
{
  "variation1": "Fun ${style} prompt — bright colors, whimsical details, happy mood, perfect for children. If for Midjourney: add --style raw --q 2",  
  "variation2": "Alternative fun angle — different character pose or magical element, equally child-friendly"
}`;
  return callGroqVision(base64, mime, PROMPT);
}

async function buildCorporatePrompt({ base64, mime, context, options }) {
  const type  = (options['Content Type']||'LinkedIn Post').replace(/[📄📊📧🎯👥]\s*/g,'');
  const style = (options['Style']||'Professional & Clean').replace(/[💡🚀🤝🏆]\s*/g,'');
  const PROMPT = `You are a professional brand content strategist.
${base64 ? 'Analyze the uploaded business/brand/team photo carefully.' : ''}
${context ? `Brand context: "${context}"` : ''}

Generate 2 professional AI prompts for ${type} in ${style} style.
Keep them business-appropriate and impactful.

Return JSON only:
{
  "variation1": "First professional prompt — precise, high-quality photography descriptors, business-ready",
  "variation2": "Second — bolder, more dynamic approach for same objective"
}`;
  return callGroqVision(base64, mime, PROMPT);
}

async function buildCulturalPrompt({ context, options, festival }) {
  const langMap = {
    '🇮🇳 English':'English','🇮🇳 Hindi':'Hindi',
    '🇮🇳 Hinglish':'Hinglish (Hindi + English mix)',
    '🎨 Gujarati':'Gujarati','🙏 Marathi':'Marathi','🌙 Urdu':'Urdu'
  };
  const lang    = langMap[options['Language']] || 'English';
  const type    = (options['Content Type']||'WhatsApp Wish').replace(/[💬📱📢🎊]\s*/g,'');
  const cardStyle = options['Card Style'] || '';

  const PROMPT = `You are a warm, culturally expert Indian content writer.
Festival: ${festival}
Language: ${lang}
Content Type: ${type}
${context ? `Personal message: "${context}"` : ''}
${cardStyle ? `Card style tone: ${cardStyle}` : ''}

Write 2 heartfelt, authentic ${festival} messages for ${type} in ${lang}.
${type.includes('Instagram') || type.includes('Story') ? 'Add 6-8 popular relevant hashtags.' : ''}
Keep messages warm, cultural, and Indic in spirit.

Return JSON only:
{
  "variation1": "First message — warm, traditional, culturally rich${type.toLowerCase().includes('instagram') ? ', with hashtags' : ''}",
  "variation2": "Second — slightly different tone (modern/poetic/humorous) still appropriate for ${festival}"
}`;
  return callGroqText(PROMPT);
}

async function buildMultilingualPrompt({ base64, mime, context, options }) {
  if (!base64) { Toast.show('Please upload an image with text', 'error'); throw new Error('No image'); }
  const platform = (options['Output Platform']||'Midjourney').replace(/[🎨🤖📸💼📱]\s*/g,'');
  const PROMPT = `You are an expert multilingual AI analyst.

Analyze this image carefully:
1. Find ALL text in the image (any language — Hindi, Marathi, Gujarati, Tamil, Urdu, Arabic, English, mixed)
2. State the language(s) detected
3. Provide English translation
4. Generate 2 ${platform} prompts based on the image content and text meaning
${context ? `Extra context: "${context}"` : ''}

Return JSON only:
{
  "detected_language": "Language name(s)",
  "text_found": "Exact text from image",
  "translation": "English translation",
  "variation1": "Literal ${platform} prompt — close to original image/text",
  "variation2": "Creative ${platform} prompt — artistic reinterpretation of the theme"
}`;
  const raw = await callGroqVision(base64, mime, PROMPT);
  return {
    variation1: `🌐 Language: ${raw.detected_language||'Detected'}\n📝 Text: "${raw.text_found||''}"\n🔤 Meaning: ${raw.translation||''}\n\n${raw.variation1||''}`,
    variation2: raw.variation2 || ''
  };
}

/* ── GROQ CALLS ── */
async function callGroqVision(base64, mime, prompt) {
  const key = CLARIX_CONFIG.groqApiKey;
  if (!key || key === 'YOUR_GROQ_API_KEY') throw new Error('No Groq key configured');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{'Authorization':`Bearer ${key}`,'content-type':'application/json'},
    body: JSON.stringify({
      model:'meta-llama/llama-4-scout-17b-16e-instruct',
      messages:[{ role:'user', content: base64
        ? [{ type:'image_url', image_url:{ url:`data:${mime};base64,${base64}` } }, { type:'text', text:prompt }]
        : prompt }],
      max_tokens:900, temperature:0.55
    })
  });
  if (!res.ok) {
    const e = await res.json().catch(()=>({}));
    if (typeof Toast !== 'undefined') Toast.show(`⚠️ Groq ${res.status}: ${(e?.error?.message||'').substring(0,50)}`, 'error', 5000);
    throw new Error(e?.error?.message || `Groq ${res.status}`);
  }
  const data = await res.json();
  const raw  = data?.choices?.[0]?.message?.content || '';
  const clean = raw.trim().replace(/^```[a-z]*\n?/,'').replace(/```$/,'').trim();
  const jsonStr = clean.startsWith('{') ? clean : (clean.match(/\{[\s\S]*\}/)||[])[0];
  if (jsonStr) return JSON.parse(jsonStr);
  const lines = clean.split('\n').filter(Boolean);
  return { variation1: lines[0]||clean, variation2: lines[1]||'' };
}
async function callGroqText(p) { return callGroqVision(null, null, p); }

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderStudios();
  document.getElementById('studioOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'studioOverlay') closeStudio();
  });
});
