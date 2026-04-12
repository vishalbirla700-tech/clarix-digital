/* ═══════════════════════════════════════════════
   CLARIX — INSPIRE PAGE JS
   Gallery, Editor Panel, Claude Vision
═══════════════════════════════════════════════ */

/* ─── GALLERY DATA ────────────────────────────── */
const GALLERY = [
  { id:1,  cat:'cinematic', title:'Neon Cityscape',      prompt:'A rain-drenched cyberpunk city at midnight, neon signs reflecting on wet streets, atmospheric fog, lone figure in foreground',              img:'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80&auto=format&fit=crop' },
  { id:2,  cat:'nature',    title:'Misty Mountains',     prompt:'Breathtaking mountain range at dawn, layers of fog filling the valleys, golden sunrise rays piercing through peaks',                       img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop' },
  { id:3,  cat:'fashion',   title:'Portrait Gold',       prompt:'High-fashion editorial portrait, dramatic golden hour backlight, luxury silk fabric, film grain, Vogue magazine aesthetic',               img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&auto=format&fit=crop' },
  { id:4,  cat:'cinematic', title:'Ocean Storm',         prompt:'Massive ocean waves crashing against rocky cliffs at dusk, dramatic storm clouds, cinematic wide angle, raw power of nature',             img:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80&auto=format&fit=crop' },
  { id:5,  cat:'3d',        title:'Sci-Fi Portal',       prompt:'A glowing dimensional portal in a futuristic space station, ethereal energy beams, floating debris, cinematic sci-fi concept art',       img:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80&auto=format&fit=crop' },
  { id:6,  cat:'nature',    title:'Forest Cathedral',    prompt:'Ancient redwood forest with shafts of golden light piercing the canopy, misty ground fog, ethereal dreamlike atmosphere',                img:'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80&auto=format&fit=crop' },
  { id:7,  cat:'fashion',   title:'Desert Editorial',    prompt:'Fashion editorial set in Sahara desert, model in flowing white fabric against red sand dunes, golden hour, minimalist, editorial',       img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&auto=format&fit=crop' },
  { id:8,  cat:'cinematic', title:'Abandoned City',      prompt:'Post-apocalyptic abandoned city overgrown with vegetation, golden hour light, moody cinematic atmosphere, hyperdetailed',                 img:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80&auto=format&fit=crop' },
  { id:9,  cat:'3d',        title:'Crystal Cave',        prompt:'Enormous underground crystal cave with giant amethyst formations, bioluminescent glow, otherworldly atmosphere, photorealistic',          img:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop' },
  { id:10, cat:'video',     title:'Drone Coastline',     prompt:'Aerial drone shot of dramatic coastline at sunrise, turquoise water crashing white foam on black volcanic rocks, cinematic color grade',  img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop' },
  { id:11, cat:'blog',      title:'Minimal Workspace',   prompt:'Minimalist flat-lay workspace, MacBook, coffee, succulents, natural window light, clean white background, editorial lifestyle photography',img:'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80&auto=format&fit=crop' },
  { id:12, cat:'nature',    title:'Aurora Borealis',     prompt:'Magnificent Northern Lights display over snow-covered pine forest, vivid green and purple aurora, starry night sky, long exposure',       img:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80&auto=format&fit=crop' },
  { id:13, cat:'cinematic', title:'Epic Landscape',      prompt:'Dramatic canyon at golden hour, towering red rock formations, sweeping vista, god rays through storm clouds, cinematic wide',            img:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80&auto=format&fit=crop' },
  { id:14, cat:'fashion',   title:'Urban Street Style',  prompt:'Street fashion editorial in urban alley, dramatic shadows, high-contrast noir lighting, film grain, bold attitude',                       img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&auto=format&fit=crop' },
  { id:15, cat:'3d',        title:'Holographic UI',      prompt:'Futuristic holographic interface floating in dark space, translucent data panels, electric blue and orange UI elements, sci-fi tech',     img:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop' },
  { id:16, cat:'nature',    title:'Underwater World',    prompt:'Stunning underwater coral reef scene, vibrant tropical fish, shafts of turquoise light from surface, sea turtle, National Geographic',    img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop' },
  { id:17, cat:'video',     title:'Storm Timelapse',     prompt:'Cinematic timelapse of a supercell thunderstorm forming over flat plains, lightning bolts, churning dark clouds, dramatic wide angle',    img:'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&q=80&auto=format&fit=crop' },
  { id:18, cat:'blog',      title:'Coffee Art',          prompt:'Artisan latte art in rustic ceramic cup, warm coffee shop bokeh background, natural window light, moody editorial food photography',      img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop' },
  { id:19, cat:'cinematic', title:'Golden Architecture', prompt:'Ancient temple complex at golden hour, warm amber light bathing intricate carved stone, rising incense smoke, spiritual atmosphere',      img:'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&q=80&auto=format&fit=crop' },
  { id:20, cat:'3d',        title:'Robot Portrait',      prompt:'Hyperrealistic portrait of a humanoid robot with expressive eyes, chrome surfaces with subsurface scattering, bokeh background, epic',   img:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80&auto=format&fit=crop' },
  { id:21, cat:'fashion',   title:'Neon Glow',           prompt:'Fashion portrait in a neon-lit room, subject bathed in electric pink and blue light, glossy wet look, editorial glam, cinematic crop',   img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80&auto=format&fit=crop' },
  { id:22, cat:'nature',    title:'Volcano Eruption',    prompt:'Active volcano erupting at night, rivers of glowing lava flowing down dark slopes, billowing ash clouds lit from below by fire',          img:'https://images.unsplash.com/photo-1567634618278-2bda4cc19730?w=600&q=80&auto=format&fit=crop' },
  { id:23, cat:'blog',      title:'City Skyline',        prompt:'Panoramic city skyline at blue hour, reflections on a glass-calm river, warm office lights against cool sky, urban serenity',           img:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80&auto=format&fit=crop' },
  { id:24, cat:'cinematic', title:'Night Market',        prompt:'Vibrant Indian street market at night, golden fairy lights, colorful spices and textiles, bokeh crowd, warm cinematic color grade',      img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80&auto=format&fit=crop' },
  { id:25, cat:'3d',        title:'Space Station',       prompt:'Interior of a futuristic space station, astronaut floating weightless, Earth visible through massive window, golden hour from orbit',     img:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80&auto=format&fit=crop' },
  { id:26, cat:'nature',    title:'Desert Dunes',        prompt:'Vast Sahara desert at golden hour, perfect rippling sand dunes casting long shadows, lone camel silhouette, cinematic panoramic',       img:'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80&auto=format&fit=crop' },
];



const ENHANCE_CHIPS = [
  'Cinematic', 'Golden Hour', 'Bokeh', 'Film Grain', 'Moody',
  '8K Detail', 'Wide Angle', 'Neon Glow', 'Dramatic Light', 'Ethereal'
];

/* ─── STATE ───────────────────────────────────── */
let activeItem = null;
let selectedChips = [];
let editorResult = '';

/* ─── INIT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderGallery(GALLERY);
  renderEditorChips();
  setupPaste();
  // intercept back button
  history.pushState({ page: 'gallery' }, '');
  window.addEventListener('popstate', (e) => {
    if (document.getElementById('editorOverlay').classList.contains('open')) {
      closeEditor(); history.pushState({ page: 'gallery' }, '');
    } else if (document.getElementById('lightboxOverlay').classList.contains('open')) {
      closeLightbox();
    }
  });
  // Escape key closes lightbox or editor
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('editorOverlay').classList.contains('open')) closeEditor();
      else closeLightbox();
    }
  });
});

/* ─── GALLERY ─────────────────────────────────── */
function renderGallery(items) {
  const grid = document.getElementById('galleryGrid');
  // Gradient placeholders for broken/slow images — keyed by category
  const CAT_GRADS = {
    cinematic: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
    fashion:   'linear-gradient(135deg,#c94b4b,#4b134f)',
    nature:    'linear-gradient(135deg,#134e5e,#71b280)',
    '3d':      'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
    video:     'linear-gradient(135deg,#232526,#414345)',
    blog:      'linear-gradient(135deg,#f5af19,#f12711)',
    uploaded:  'linear-gradient(135deg,#ff7043,#ff9800)'
  };
  grid.innerHTML = items.map((item, idx) => {
    const grad = CAT_GRADS[item.cat] || 'linear-gradient(135deg,#1a1a2e,#373b44)';
    const loadAttr = idx < 6 ? 'eager' : 'lazy';
    return `
    <div class="gallery-card" onclick="openLightbox(${item.id})" data-cat="${item.cat}">
      <img class="gallery-card-img"
           src="${item.img}"
           alt="${item.title}"
           loading="${loadAttr}"
           onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='${grad}'">
      <div class="gallery-card-cat">${item.cat}</div>
      <div class="gallery-card-overlay">
        <div class="gallery-card-title">${item.title}</div>
        <div class="gallery-card-prompt">${item.prompt}</div>
        <button class="gallery-card-open-btn">🔍 Preview →</button>
      </div>
    </div>`;
  }).join('');
}

function filterCategory(cat) {
  document.querySelectorAll('[data-cat]').forEach(el => {
    if (el.classList.contains('chip')) el.classList.toggle('active', el.dataset.cat === cat);
  });
  const filtered = cat === 'all' ? GALLERY : GALLERY.filter(g => g.cat === cat);
  renderGallery(filtered);
}

/* ─── LIGHTBOX ────────────────────────────────── */
function openLightbox(id) {
  const item = GALLERY.find(g => g.id === id);
  if (!item) return;
  activeItem = item;

  document.getElementById('lightboxImg').src = item.img;
  document.getElementById('lightboxImg').alt = item.title;
  document.getElementById('lightboxTitle').textContent = item.title;
  document.getElementById('lightboxCat').textContent = item.cat.toUpperCase();
  document.getElementById('lightboxOpenEditor').onclick = () => {
    closeLightbox();
    setTimeout(() => openEditor(id), 250);
  };
  document.getElementById('lightboxOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightboxOverlay').classList.remove('open');
  document.body.style.overflow = '';
  activeItem = null;
}

function closeLightboxOnBackdrop(e) {
  if (e.target === document.getElementById('lightboxOverlay')) closeLightbox();
}

/* ─── EDITOR ──────────────────────────────────── */
function openEditor(id) {
  const item = GALLERY.find(g => g.id === id);
  if (!item) return;
  activeItem = item;
  selectedChips = [];
  editorResult = '';

  document.getElementById('editorImg').src = item.img;
  document.getElementById('editorImg').alt = item.title;
  document.getElementById('editorImgMeta').textContent = `${item.title} · ${item.cat}`;
  document.getElementById('editorPrompt').value = item.prompt;
  document.getElementById('editorResult').style.display = 'none';
  document.getElementById('editorDirection').style.display = 'none';
  document.getElementById('editorExport').style.display = 'none';
  document.getElementById('editorOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  updateEditorChips();
}

function closeEditor() {
  document.getElementById('editorOverlay').classList.remove('open');
  document.body.style.overflow = '';
  activeItem = null;
}

/* ─── CHIPS ───────────────────────────────────── */
function renderEditorChips() {
  document.getElementById('editorChips').innerHTML = ENHANCE_CHIPS.map(c => `
    <div class="chip" onclick="toggleEditorChip('${c}')" data-echip="${c}">${c}</div>
  `).join('');
}
function toggleEditorChip(chip) {
  const idx = selectedChips.indexOf(chip);
  if (idx === -1) selectedChips.push(chip); else selectedChips.splice(idx, 1);
  updateEditorChips();
  const ta = document.getElementById('editorPrompt');
  if (activeItem) {
    ta.value = activeItem.prompt + (selectedChips.length ? ', ' + selectedChips.join(', ').toLowerCase() : '');
  }
}
function updateEditorChips() {
  document.querySelectorAll('[data-echip]').forEach(el => {
    el.classList.toggle('active', selectedChips.includes(el.dataset.echip));
  });
}

/* ─── ENHANCE EDITOR ──────────────────────────── */
async function enhanceEditorPrompt() {
  const text = document.getElementById('editorPrompt').value.trim();
  if (!text) return;
  if (!ClarixState.canEnhance()) { UpgradeModal.show(); return; }

  const btn = document.getElementById('editorEnhanceBtn');
  btn.classList.add('loading'); btn.disabled = true;

  // Pass the user's selected language so AI respects it
  const langCode = (typeof LangState !== 'undefined' && LangState.code) ? LangState.code : 'en';
  const langName = (typeof LangState !== 'undefined' && LangState.name) ? LangState.name : 'English';

  try {
    const result = await enhancePrompt(text, 'Midjourney', 'ai', langCode, langName);
    if (!result) return;
    editorResult = result.enhanced;
    document.getElementById('editorResultText').textContent = result.enhanced;
    document.getElementById('editorResult').style.display = 'block';
    document.getElementById('editorExport').style.display = 'flex';
    Toast.show('⚡ Prompt enhanced!', 'success');
    ClarixState.incUsage();
    ClarixState.inc();
    updateUsageCounter();
    // Scroll to result
    setTimeout(() => {
      document.getElementById('editorResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  } finally {
    btn.classList.remove('loading'); btn.disabled = false;
  }
}

async function rewriteEditorPrompt() {
  const ta   = document.getElementById('editorPrompt');
  const text = ta.value.trim();
  // Use editorResult (enhanced text) if available, otherwise use textarea text
  const sourceText = editorResult || text;
  if (!sourceText) return;

  const btn = document.querySelector('.editor-actions .btn-secondary');
  if (btn) { btn.textContent = '🔄 Rewriting...'; btn.disabled = true; }

  // Show a loading state in result panel
  const resultEl = document.getElementById('editorResult');
  const resultText = document.getElementById('editorResultText');
  resultEl.style.display = 'block';
  resultText.textContent = '🔄 AI rewriting with fresh perspective...';
  resultText.style.opacity = '0.5';

  try {
    if (!ClarixState.canEnhance()) { UpgradeModal.show(); return; }
    const result = await enhancePrompt(
      'Give this image prompt a completely fresh creative rewrite — new perspective, richer descriptors, more vivid sensory details. Keep the core subject but transform the style and framing. Original: ' + sourceText,
      'Midjourney', 'ai', 'en', 'English'
    );
    if (result && result.enhanced) {
      editorResult = result.enhanced;
      resultText.textContent = result.enhanced;
      resultText.style.opacity = '1';
      document.getElementById('editorExport').style.display = 'flex';
      Toast.show('🔄 Prompt rewritten with fresh perspective!', 'success');
      ClarixState.incUsage();
      ClarixState.inc();
      updateUsageCounter();
    } else {
      // Fallback to local
      const rewrites = [
        (p) => `Cinematic render: ${p}. Shot on IMAX 70mm, masterful composition, award-winning.`,
        (p) => `${p} — captured at the decisive moment. Hyperdetailed, dreamlike quality, 8K resolution.`,
        (p) => `Visualize: ${p}. Perfect lighting, professional grade, emotionally resonant.`
      ];
      const rewritten = rewrites[Math.floor(Math.random() * rewrites.length)](sourceText);
      editorResult = rewritten;
      resultText.textContent = rewritten;
      resultText.style.opacity = '1';
      Toast.show('Prompt rewritten!', 'success');
    }
    // Issue 2+3 fix: always scroll to the result after rewrite
    setTimeout(() => {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  } catch(e) {
    resultText.textContent = 'Rewrite failed. Please try again.';
    resultText.style.opacity = '0.5';
    Toast.show('Rewrite failed. Try again.', 'error');
  } finally {
    if (btn) { btn.textContent = '🔄 AI Rewrite'; btn.disabled = false; }
  }
}

async function generateCreativeDirection() {
  if (!editorResult && !activeItem) return;
  const directions = [
    'Open with a sweeping wide shot that establishes the full atmosphere.',
    'Camera slowly pushes in, drawing the eye to the focal point.',
    'Lighting: dramatic chiaroscuro with warm practical sources.',
    'Color grade: teal shadows, amber highlights — cinematic split-toning.',
    'Pacing: slow and deliberate, allowing each frame to breathe.',
    'Final frame: a quiet, powerful close that lingers.'
  ];
  document.getElementById('editorDirectionText').textContent = directions.join('\n');
  document.getElementById('editorDirection').style.display = 'block';
}

function copyEditorPrompt() {
  const text = editorResult || document.getElementById('editorPrompt').value;
  copyText(text);
}

function sendEditorToWrite() {
  const text = editorResult || document.getElementById('editorPrompt').value;
  localStorage.setItem('clarix_intent', text);
  window.location.href = 'write.html';
}

function exportEditorTXT() {
  const text = editorResult || document.getElementById('editorPrompt').value;
  downloadFile('clarix-inspire-prompt.txt', `CLARIX INSPIREME EXPORT\n${'='.repeat(40)}\n\nPROMPT:\n${text}\n\n${'='.repeat(40)}\nGenerated by Clarix`);
  Toast.show('Exported!', 'success');
}

function clearEditorPrompt() {
  if (activeItem) {
    document.getElementById('editorPrompt').value = activeItem.prompt;
    selectedChips = [];
    updateEditorChips();
  } else {
    document.getElementById('editorPrompt').value = '';
  }
  document.getElementById('editorResult').style.display = 'none';
  document.getElementById('editorExport').style.display = 'none';
  editorResult = '';
  Toast.show('Cleared — original prompt restored', 'info');
}

function saveInspireToHistory() {
  const text = editorResult || document.getElementById('editorPrompt').value;
  if (!text) return;
  /* Save to localStorage library */
  const saved = JSON.parse(localStorage.getItem('clarix_saved') || '[]');
  saved.unshift({
    text: text,
    source: 'inspire',
    title: activeItem ? activeItem.title : 'Inspired Prompt',
    time: new Date().toISOString()
  });
  if (saved.length > 100) saved.pop();
  localStorage.setItem('clarix_saved', JSON.stringify(saved));
  /* Also save to Firestore if logged in */
  try {
    const uid = localStorage.getItem('clarix_uid');
    if (uid && typeof firebase !== 'undefined' && firebase.firestore) {
      firebase.firestore().collection('users').doc(uid)
        .collection('history').add({
          text, source: 'inspire',
          title: activeItem ? activeItem.title : 'Inspired Prompt',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
  } catch(e) { /* Firestore not available, localStorage fallback used */ }
  Toast.show('💾 Saved to your history!', 'success');
  showContinueOrChangeModal(text);
}

function showContinueOrChangeModal(savedText) {
  const existing = document.getElementById('clarix-continue-modal');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'clarix-continue-modal';
  el.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;padding:20px;
  `;
  el.innerHTML = `
    <div style="background:#111;border:1px solid rgba(255,112,67,0.3);border-radius:20px;padding:32px 28px;max-width:380px;width:100%;text-align:center;">
      <div style="font-size:32px;margin-bottom:12px;">✨</div>
      <div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px;font-family:var(--font-head);">Prompt Saved!</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:28px;line-height:1.6;">What would you like to do next?</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button onclick="document.getElementById('clarix-continue-modal').remove()" style="background:var(--accent);color:#fff;border:none;border-radius:12px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;">
          🔄 Enhance This Further
        </button>
        <button onclick="document.getElementById('clarix-continue-modal').remove();clearEditorPrompt()" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;">
          🎨 Try a Different Image
        </button>
        <button onclick="localStorage.setItem('clarix_intent',${JSON.stringify(savedText)});window.location.href='write.html'" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;">
          ✍️ Open in Write Studio
        </button>
        <button onclick="document.getElementById('clarix-continue-modal').remove();closeEditor()" style="background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;font-size:13px;padding:8px;">Back to Gallery</button>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}

/* ─── IMAGE UPLOAD / VISION ───────────────────── */
function handleDragOver(e) { e.preventDefault(); document.getElementById('uploadZone').classList.add('dragover'); }
function handleDragLeave()  { document.getElementById('uploadZone').classList.remove('dragover'); }
function handleDrop(e) {
  e.preventDefault(); document.getElementById('uploadZone').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) processVisionImage(file);
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processVisionImage(file);
  // Reset input so same file can be re-selected
  e.target.value = '';
}
function setupPaste() {
  document.addEventListener('paste', e => {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
    if (item) { e.preventDefault(); processVisionImage(item.getAsFile()); }
  });
}
/* Entry point — shows platform picker then runs analysis */
function processVisionImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    Toast.show('Please select an image file.', 'error');
    return;
  }
  showPlatformPicker(file);
}

/* ─── IMAGE COMPRESSION ─────────────────────── */
/* Mobile phone photos are 10-20MB+ — Gemini fails on large base64.
   We compress to max 1024px wide/tall and quality 0.85 before sending. */
function compressImage(file, maxPx, quality) {
  maxPx   = maxPx   || 1024;
  quality = quality || 0.85;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        // Scale down if either dimension exceeds maxPx
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
          else       { w = Math.round(w * maxPx / h); h = maxPx; }
        }
        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        // Always export as JPEG for smaller file size
        canvas.toBlob(
          (blob) => {
            const fr = new FileReader();
            fr.onload = (e) => resolve({
              base64: e.target.result.split(',')[1],
              mime:   'image/jpeg',
              dataUrl: e.target.result,
              originalSize: file.size,
              compressedSize: blob.size
            });
            fr.readAsDataURL(blob);
          },
          'image/jpeg', quality
        );
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}




/* ─── PLATFORM PICKER (shown before analysis) ─── */
function showPlatformPicker(pendingFile) {
  // Store pending file on window so the button onclick can access it
  window._visionPendingFile = pendingFile;

  // Remove existing picker
  const old = document.getElementById('visionPlatformPicker');
  if (old) old.remove();

  const picker = document.createElement('div');
  picker.id = 'visionPlatformPicker';
  picker.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.88); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  `;
  picker.innerHTML = `
    <div style="background:#111; border:1px solid rgba(255,112,67,0.3); border-radius:20px; padding:28px 24px; max-width:400px; width:100%; text-align:center;">
      <div style="font-size:30px; margin-bottom:8px;">🔍</div>
      <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:#fff; margin-bottom:8px;">Analyze This Photo</div>
      <div style="font-size:13px; color:rgba(255,255,255,0.75); margin-bottom:20px; line-height:1.5;">Gemini Vision will read your photo and generate an accurate prompt. Choose your platform:</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        <button onclick="_visionPick('Midjourney')" style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:16px 10px; cursor:pointer; color:#fff; text-align:center; font-family:var(--font-body); transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(255,112,67,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'">
          <div style="font-size:22px; margin-bottom:5px;">🎨</div>
          <div style="font-weight:700; font-size:14px; color:#fff;">Midjourney</div>
          <div style="font-size:11px; color:rgba(255,255,255,0.6); margin-top:3px;">AI image prompt</div>
        </button>
        <button onclick="_visionPick('Instagram')" style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:16px 10px; cursor:pointer; color:#fff; text-align:center; font-family:var(--font-body); transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(255,112,67,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'">
          <div style="font-size:22px; margin-bottom:5px;">📸</div>
          <div style="font-weight:700; font-size:14px; color:#fff;">Instagram</div>
          <div style="font-size:11px; color:rgba(255,255,255,0.6); margin-top:3px;">Caption + hashtags</div>
        </button>
        <button onclick="_visionPick('DALL-E')" style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:16px 10px; cursor:pointer; color:#fff; text-align:center; font-family:var(--font-body); transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(255,112,67,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'">
          <div style="font-size:22px; margin-bottom:5px;">🖼️</div>
          <div style="font-weight:700; font-size:14px; color:#fff;">DALL-E</div>
          <div style="font-size:11px; color:rgba(255,255,255,0.6); margin-top:3px;">OpenAI prompt</div>
        </button>
        <button onclick="_visionPick('General')" style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:16px 10px; cursor:pointer; color:#fff; text-align:center; font-family:var(--font-body); transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(255,112,67,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'">
          <div style="font-size:22px; margin-bottom:5px;">✨</div>
          <div style="font-weight:700; font-size:14px; color:#fff;">General</div>
          <div style="font-size:11px; color:rgba(255,255,255,0.6); margin-top:3px;">Creative prompt</div>
        </button>
      </div>
      <button onclick="document.getElementById('visionPlatformPicker').remove(); window._visionPendingFile=null;" style="background:none; border:none; color:rgba(255,255,255,0.45); cursor:pointer; font-size:13px; padding:8px;">Cancel</button>
    </div>
  `;
  document.body.appendChild(picker);
}

/* Global function called by picker buttons — mobile-safe */
function _visionPick(platform) {
  const file = window._visionPendingFile;
  window._visionPendingFile = null;
  const picker = document.getElementById('visionPlatformPicker');
  if (picker) picker.remove();
  if (file) runVisionAnalysis(file, platform);
}



async function runVisionAnalysis(file, platform) {
  Toast.show('🔍 Compressing & analyzing your photo...', 'info', 10000);

  try {
    // STEP 1: Compress image (mobile photos = 10-20MB, APIs need < 4MB)
    // 512px keeps payload small (~30-60KB) while being detectable by Vision AI
    const compressed = await compressImage(file, 512, 0.80);

    const origMB  = (compressed.originalSize   / 1024 / 1024).toFixed(1);
    const compKB  = (compressed.compressedSize / 1024).toFixed(0);
    console.info(`[Vision] Compressed: ${origMB}MB → ${compKB}KB`);

    // STEP 2: Analyze with Gemini Vision
    const result  = await analyzeImage(compressed.base64, compressed.mime, platform);
    const imgUrl  = compressed.dataUrl;
    console.info('[Vision] Engine:', result._engine);

    // STEP 3: Build platform-appropriate prompt
    const promptText = platform === 'Midjourney'
      ? (result.midjourney || result.enhanced || result.prompt)
      : platform === 'Instagram'
      ? (result.instagram  || result.enhanced || result.prompt)
      : (result.enhanced   || result.prompt);

    // STEP 4: Build analysis tag summary
    const analysisTags = [
      result.subject  ? `👤 ${result.subject}` : null,
      result.setting  ? `📍 ${result.setting}` : null,
      result.lighting ? `💡 ${result.lighting}` : null,
      result.mood     ? `🎭 ${result.mood}` : null,
      result.colors   ? `🎨 ${result.colors}` : null,
    ].filter(Boolean);

    // STEP 5: Clean up previous upload and create new gallery item
    const prevIdx = GALLERY.findIndex(g => g.id === 99);
    if (prevIdx !== -1) GALLERY.splice(prevIdx, 1);

    const customItem = {
      id: 99, cat: 'uploaded',
      title: `Your Photo · ${platform}`,
      prompt: promptText,
      img: imgUrl,
      _analysis: result,
      _analysisTags: analysisTags,
      _platform: platform,
      _engine: result._engine || 'Vision AI'
    };
    GALLERY.unshift(customItem);

    // STEP 6: Open editor with real photo
    openEditor(99);
    document.getElementById('editorPrompt').value = promptText;
    showVisionAnalysisPanel(customItem);

    // STEP 7: Pre-fill enhanced result panel
    if (result.enhanced) {
      editorResult = result.enhanced;
      document.getElementById('editorResultText').textContent = result.enhanced;
      document.getElementById('editorResult').style.display  = 'block';
      document.getElementById('editorExport').style.display  = 'flex';
    }

    const engine = result._engine || 'Vision AI';
    Toast.show(`✅ Analyzed with ${engine}! Prompt ready.`, 'success', 4000);

  } catch (err) {
    console.error('[InspireMe Vision]', err);
    Toast.show('❌ Analysis failed. Please try again.', 'error');
  }
}


/* ─── VISION ANALYSIS PANEL ──────────────────── */
function showVisionAnalysisPanel(item) {
  // Remove old panel
  const old = document.getElementById('visionAnalysisPanel');
  if (old) old.remove();

  if (!item._analysisTags || !item._analysisTags.length) return;

  const panel = document.createElement('div');
  panel.id = 'visionAnalysisPanel';
  panel.style.cssText = `
    background: rgba(255,112,67,0.06); border: 1px solid rgba(255,112,67,0.2);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 12px;
  `;
  panel.innerHTML = `
    <div style="font-size:11px; font-weight:800; color:var(--accent); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:10px;">
      🔍 Photo Analysis · ${item._platform} · ${item._engine || 'Vision AI'}
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      ${item._analysisTags.map(tag => `
        <div style="font-size:12px; color:#fff; background:rgba(255,255,255,0.07);
                    border:1px solid rgba(255,255,255,0.1); border-radius:8px;
                    padding:5px 10px; line-height:1.4;">
          ${tag}
        </div>`).join('')}
    </div>
    ${item._analysis?.midjourney && item._platform !== 'Midjourney' ? `
    <div style="margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);">
      <div style="font-size:11px; color:rgba(255,255,255,0.5); margin-bottom:6px;">🎨 Midjourney version also available:</div>
      <div style="font-size:12px; color:rgba(255,255,255,0.8); line-height:1.5; cursor:pointer;"
           onclick="navigator.clipboard?.writeText('${(item._analysis.midjourney || '').replace(/'/g,"\\'")}'); Toast.show('Midjourney prompt copied!','success')">
        ${(item._analysis.midjourney || '').substring(0, 120)}... <span style="color:var(--accent);">Tap to copy →</span>
      </div>
    </div>` : ''}
  `;

  // ── Insert at TOP of scrollable editor-right-scroll area (not the image side)
  const scrollArea = document.getElementById('editorRightScroll');
  if (scrollArea) {
    scrollArea.insertBefore(panel, scrollArea.firstChild);
    // Scroll to top so user sees the analysis first
    const rightPanel = document.querySelector('.editor-right');
    if (rightPanel) rightPanel.scrollTop = 0;
  }
}

