/* ═══════════════════════════════════════════════
   CLARIX — INSPIRE PAGE JS
   Gallery, Editor Panel, Claude Vision
═══════════════════════════════════════════════ */

/* ─── GALLERY DATA ────────────────────────────── */
const GALLERY = [
  { id:1,  cat:'cinematic', title:'Neon Cityscape',     prompt:'A rain-drenched cyberpunk city at midnight, neon signs reflecting on wet streets, atmospheric fog, lone figure in foreground',              img:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80' },
  { id:2,  cat:'nature',    title:'Misty Mountains',    prompt:'Breathtaking mountain range at dawn, layers of fog filling the valleys, golden sunrise rays piercing through peaks',                       img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
  { id:3,  cat:'fashion',   title:'Portrait Gold',      prompt:'High-fashion editorial portrait, dramatic golden hour backlight, luxury silk fabric, film grain, Vogue magazine aesthetic',               img:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80' },
  { id:4,  cat:'cinematic', title:'Ocean Storm',        prompt:'Massive ocean waves crashing against rocky cliffs at dusk, dramatic storm clouds, cinematic wide angle, raw power of nature',             img:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80' },
  { id:5,  cat:'3d',        title:'Sci-Fi Portal',      prompt:'A glowing dimensional portal in a futuristic space station, ethereal energy beams, floating debris, cinematic sci-fi concept art',       img:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80' },
  { id:6,  cat:'nature',    title:'Forest Cathedral',   prompt:'Ancient redwood forest with shafts of golden light piercing the canopy, misty ground fog, ethereal dreamlike atmosphere',                img:'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80' },
  { id:7,  cat:'fashion',   title:'Desert Queen',       prompt:'Fashion editorial set in Sahara desert, model in flowing white fabric against red sand dunes, golden hour, minimalist, editorial',       img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80' },
  { id:8,  cat:'cinematic', title:'Abandoned City',     prompt:'Post-apocalyptic abandoned city overgrown with vegetation, golden hour light, moody cinematic atmosphere, hyperdetailed',                 img:'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=600&q=80' },
  { id:9,  cat:'3d',        title:'Crystal Cave',       prompt:'Enormous underground crystal cave with giant amethyst formations, bioluminescent glow, otherworldly atmosphere, photorealistic',          img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id:10, cat:'video',     title:'Drone Coastline',    prompt:'Aerial drone shot of dramatic coastline at sunrise, turquoise water crashing white foam on black volcanic rocks, cinematic color grade',  img:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80' },
  { id:11, cat:'blog',      title:'Minimal Workspace',  prompt:'Minimalist flat-lay workspace, MacBook, coffee, succulents, natural window light, clean white background, editorial lifestyle photography',img:'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80' },
  { id:12, cat:'nature',    title:'Aurora Borealis',    prompt:'Magnificent Northern Lights display over snow-covered pine forest, vivid green and purple aurora, starry night sky, long exposure',       img:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80' },
  { id:13, cat:'cinematic', title:'Epic Battle',        prompt:'Epic fantasy battle scene at sunset, armies clashing on a burning plain, dramatic storm clouds, god rays piercing through smoke',         img:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80' },
  { id:14, cat:'fashion',   title:'Urban Grunge',       prompt:'Street fashion editorial in gritty New York alley, neon signs, dramatic shadows, high-contrast noir lighting, film grain, attitude',     img:'https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=600&q=80' },
  { id:15, cat:'3d',        title:'Holographic UI',     prompt:'Futuristic holographic interface floating in dark space, translucent data panels, electric blue and orange UI elements, sci-fi tech',     img:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
  { id:16, cat:'nature',    title:'Underwater World',   prompt:'Stunning underwater coral reef scene, vibrant tropical fish, shafts of turquoise light from surface, sea turtle, National Geographic',    img:'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80' },
  { id:17, cat:'video',     title:'Time Lapse Storm',   prompt:'Cinematic time-lapse of a supercell thunderstorm forming over flat plains, lightning bolts, churning dark clouds, dramatic wide angle',   img:'https://images.unsplash.com/photo-1469908801-61b0c37b85db?w=600&q=80' },
  { id:18, cat:'blog',      title:'Coffee Art',         prompt:'Artisan latte art in rustic ceramic cup, warm coffee shop bokeh background, natural window light, moody editorial food photography',      img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
  { id:19, cat:'cinematic', title:'Golden Architecture',prompt:'Ancient temple complex at golden hour, warm amber light bathing intricate carved stone, rising incense smoke, spiritual atmosphere',      img:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80' },
  { id:20, cat:'3d',        title:'Robot Portrait',     prompt:'Hyperrealistic portrait of a humanoid robot with expressive eyes, chrome surfaces with subsurface scattering, bokeh background, epic',   img:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80' },
  { id:21, cat:'fashion',   title:'Neon Glow',          prompt:'Fashion portrait in a neon-lit room, subject bathed in electric pink and blue light, glossy wet look, editorial glam, cinematic crop',   img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
  { id:22, cat:'nature',    title:'Volcano Eruption',   prompt:'Active volcano erupting at night, rivers of glowing lava flowing down dark slopes, billowing ash clouds lit from below by fire',          img:'https://images.unsplash.com/photo-1472817081201-5e1e7c4c8fc5?w=600&q=80' },
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
  grid.innerHTML = items.map(item => `
    <div class="gallery-card" onclick="openLightbox(${item.id})" data-cat="${item.cat}">
      <img class="gallery-card-img" src="${item.img}" alt="${item.title}" loading="lazy">
      <div class="gallery-card-cat">${item.cat}</div>
      <div class="gallery-card-overlay">
        <div class="gallery-card-title">${item.title}</div>
        <div class="gallery-card-prompt">${item.prompt}</div>
        <button class="gallery-card-open-btn">🔍 Preview →</button>
      </div>
    </div>
  `).join('');
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

  try {
    const result = await enhancePrompt(text, 'Midjourney', 'ai');
    if (!result) return;
    editorResult = result.enhanced;
    document.getElementById('editorResultText').textContent = result.enhanced;
    document.getElementById('editorResult').style.display = 'block';
    document.getElementById('editorExport').style.display = 'flex';
    Toast.show('⚡ Prompt enhanced!', 'success');
    // Issue 2 fix: scroll to result
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
}
function setupPaste() {
  document.addEventListener('paste', e => {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
    if (item) { e.preventDefault(); processVisionImage(item.getAsFile()); }
  });
}

async function processVisionImage(file) {
  Toast.show('Analyzing image with Claude Vision...', 'info', 5000);
  const reader = new FileReader();
  reader.onload = async (ev) => {
    const base64 = ev.target.result.split(',')[1];
    const mime = file.type;
    try {
      const result = await claudeVision(base64, mime);
      // Open editor with this image and generated prompt
      const url = ev.target.result;
      const customItem = {
        id: 99, cat: 'uploaded', title: 'Uploaded Image',
        prompt: result.prompt || 'Uploaded image', img: url
      };
      GALLERY.unshift(customItem);
      openEditor(99);
      document.getElementById('editorPrompt').value = result.enhanced || result.prompt;
      Toast.show('Image analyzed! Prompt generated.', 'success');
    } catch { Toast.show('Vision analysis failed. Try again.', 'error'); }
  };
  reader.readAsDataURL(file);
}
