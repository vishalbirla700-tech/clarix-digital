/* ═══════════════════════════════════════════════
   CLARIX — CREATIVE STUDIOS v3 (clean rewrite)
   Fixed: pill onclick, festival apostrophe, selectPill
═══════════════════════════════════════════════ */

/* ── Image Compression ── */
function studioCompressImage(file, maxPx, quality) {
  maxPx = maxPx || 512; quality = quality || 0.80;
  return new Promise(function(resolve, reject) {
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function() {
      URL.revokeObjectURL(url);
      var scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      var w = Math.round(img.width * scale);
      var h = Math.round(img.height * scale);
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({
        base64: dataUrl.split(',')[1],
        dataUrl: dataUrl,
        mime: 'image/jpeg',
        originalSize: file.size,
        compressedSize: Math.round(dataUrl.length * 0.75)
      });
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* ── Festival Config ── */
var FESTIVALS = [
  { emoji:'🪔', name:'Diwali',           grad:['#ff6b00','#ffc300','#ff8c00'], emoji2:'✨🪔🎇' },
  { emoji:'🎊', name:'Navratri',         grad:['#d63031','#e17055','#fdcb6e'], emoji2:'🎊🌸💃' },
  { emoji:'🌙', name:'Eid',              grad:['#00b894','#00cec9','#6c5ce7'], emoji2:'🌙⭐🕌' },
  { emoji:'🎄', name:'Christmas',        grad:['#2d3436','#00b894','#d63031'], emoji2:'🎄❄️🎁' },
  { emoji:'🎆', name:'New Year',         grad:['#2d3436','#6c5ce7','#e17055'], emoji2:'🎆🥂✨' },
  { emoji:'🌈', name:'Holi',             grad:['#e84393','#00b894','#fdcb6e'], emoji2:'🌈🎨💦' },
  { emoji:'💝', name:'Valentines',       grad:['#d63031','#e84393','#fd79a8'], emoji2:'💝🌹❤️' },
  { emoji:'🇮🇳', name:'Republic Day',    grad:['#ff7043','#ffffff','#1a78c2'], emoji2:'🇮🇳🎺🌟' },
  { emoji:'🎂', name:'Birthday',         grad:['#a29bfe','#fd79a8','#fdcb6e'], emoji2:'🎂🎉🎈' },
  { emoji:'🏆', name:'Dussehra',         grad:['#e17055','#d63031','#fdcb6e'], emoji2:'🏆🏹✨' },
  { emoji:'🙏', name:'Ganesh Chaturthi', grad:['#fdcb6e','#e17055','#6c5ce7'], emoji2:'🙏🐘🌸' },
  { emoji:'🌸', name:'Baisakhi',         grad:['#fdcb6e','#00b894','#e17055'], emoji2:'🌾🌸🎵' }
];

/* ── Kids Style Previews ── */
var KIDS_STYLES = [
  { label:'Cartoon / Pixar',   img:'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=200&q=70', desc:'Fun & colorful' },
  { label:'Sketch & Doodle',   img:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&q=70', desc:'Hand-drawn feel' },
  { label:'Storybook',         img:'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200&q=70', desc:'Fairy tale magic' },
  { label:'Superhero Comic',   img:'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=200&q=70', desc:'Hero power!' },
  { label:'Colorful Pop Art',  img:'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=70', desc:'Bold & vibrant' }
];

/* ── Studios Config ── */
var STUDIOS = [
  {
    id:'kids', emoji:'👶', name:'Kids Creator',
    sub:'Fun cartoon-style prompts for young ones',
    badge:'Fun Zone', css:'studio-kids',
    heroBg:'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&q=60',
    desc:'Turn any photo into fun AI prompts for cartoon art, birthday cards & kids content.',
    tips:['🎨 Paste prompt into Midjourney', '🖨️ Print as poster or birthday card', '💬 Share as WhatsApp sticker', '🎬 Use as Reel caption'],
    options:{
      'Art Style':['Cartoon / Pixar','Sketch & Doodle','Storybook','Superhero Comic','Colorful Pop Art'],
      'Platform':['Instagram','WhatsApp Sticker','Print / Poster','Birthday Card','Reel Caption']
    },
    placeholder:'Describe the scene (e.g. "my daughter playing with her puppy in the park")',
    analyzeLabel:'✨ Generate Fun Prompts',
    promptFn:'kids'
  },
  {
    id:'corporate', emoji:'💼', name:'Corporate Creator',
    sub:'Professional content for brands & businesses',
    badge:'Business', css:'studio-corp',
    heroBg:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=60',
    desc:'Professional AI prompts for LinkedIn posts, pitch decks, brand ads & business content.',
    tips:['💼 LinkedIn posts get 3x reach with visuals','📊 Use for pitch deck descriptions','📧 Email campaign headers','🏆 Build premium brand imagery'],
    options:{
      'Content Type':['LinkedIn Post','Pitch Deck Visual','Email Campaign','Brand Ad','Team Photo'],
      'Style':['Professional & Clean','Bold & Dynamic','Friendly & Approachable','Premium Luxury']
    },
    placeholder:'Describe your brand (e.g. "our fintech startup team in a modern Mumbai office")',
    analyzeLabel:'⚡ Generate Pro Prompts',
    promptFn:'corporate'
  },
  {
    id:'cultural', emoji:'🎉', name:'Cultural Creator',
    sub:'Festival cards with AI text — download & share instantly',
    badge:'Festivals', css:'studio-cultural',
    heroBg:'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=800&q=60',
    desc:'Generate beautiful festival cards with AI — download and share on WhatsApp & Instagram.',
    tips:['💬 Send as WhatsApp image instantly','📸 Share as Instagram story','🌏 Available in 6 Indian languages','🎨 Beautiful canvas card generated'],
    options:{
      'Language':['English','Hindi','Hinglish','Gujarati','Marathi','Urdu'],
      'Card Style':['Festive & Warm','Minimal & Elegant','Bold & Vibrant','Premium Dark'],
      'Content Type':['WhatsApp Wish','Instagram Post','Business Greeting','Story Caption']
    },
    placeholder:'Add personal touch (e.g. "from our family to yours" or your name/brand)',
    analyzeLabel:'🎉 Generate Festival Card',
    promptFn:'cultural',
    hasFestivals: true
  },
  {
    id:'multilingual', emoji:'🔤', name:'Multilingual Analyzer',
    sub:'Image with any language text → 2 creative prompts',
    badge:'Language AI', css:'studio-multi',
    heroBg:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=60',
    desc:'Upload any image with Hindi, Marathi, Gujarati, Tamil, Urdu, or Arabic text. AI reads it and generates prompts.',
    tips:['🇮🇳 Supports 20+ languages','📸 Works on banners, labels, menus','✍️ Literal or creative output','🌐 Auto-detects language — no setup'],
    options:{
      'Output Platform':['Midjourney','DALL-E / ChatGPT','Instagram','LinkedIn','WhatsApp'],
      'Variation Style':['Literal (stays close)','Creative (artistic)','Both styles']
    },
    placeholder:'Add context (e.g. "this is a Diwali banner from a Pune shop")',
    analyzeLabel:'🔍 Detect Language & Analyze',
    promptFn:'multilingual'
  }
];

/* ── State ── */
var activeStudio = null;
var studioFile = null;
var studioDataUrl = null;
var selectedOptions = {};
var selectedFestival = null;
var selectedVariation = null;
var studioVoiceOn = false;
var studioRecognition = null;

/* ── Render Studio Cards ── */
function renderStudios() {
  var grid = document.getElementById('studiosGrid');
  if (!grid) return;
  var html = '';
  for (var i = 0; i < STUDIOS.length; i++) {
    var s = STUDIOS[i];
    html += '<div class="studio-card ' + s.css + '" onclick="openStudio(\'' + s.id + '\')" style="animation-delay:' + (i * 0.07) + 's">'
      + '<span class="studio-arrow">&#8599;</span>'
      + '<div class="studio-emoji">' + s.emoji + '</div>'
      + '<div class="studio-name">' + s.name + '</div>'
      + '<div class="studio-desc">' + s.sub + '</div>'
      + '<div class="studio-badge">' + s.badge + '</div>'
      + '</div>';
  }
  grid.innerHTML = html;
}

/* ── Open / Close ── */
function openStudio(id) {
  for (var i = 0; i < STUDIOS.length; i++) {
    if (STUDIOS[i].id === id) { activeStudio = STUDIOS[i]; break; }
  }
  studioFile = null; studioDataUrl = null;
  selectedOptions = {}; selectedFestival = null; selectedVariation = null;
  /* pre-select first option in each group */
  var keys = Object.keys(activeStudio.options || {});
  for (var k = 0; k < keys.length; k++) {
    selectedOptions[keys[k]] = activeStudio.options[keys[k]][0];
  }
  buildStudioModal();
  document.getElementById('studioOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStudio() {
  document.getElementById('studioOverlay').classList.remove('open');
  document.body.style.overflow = '';
  stopStudioVoice();
}

/* ── Build Modal ── */
function buildStudioModal() {
  var s = activeStudio;

  /* Hero */
  var hero = '<div class="studio-hero" style="background-image:url(\'' + s.heroBg + '\')">'
    + '<div class="studio-hero-overlay"></div>'
    + '<div class="studio-hero-content">'
    + '<div class="studio-hero-emoji">' + s.emoji + '</div>'
    + '<div class="studio-hero-title">' + s.name + '</div>'
    + '<div class="studio-hero-sub">' + s.desc + '</div>'
    + '</div></div>';

  /* Tips */
  var tips = '<div class="studio-tips-strip">';
  for (var t = 0; t < s.tips.length; t++) tips += '<div class="studio-tip">' + s.tips[t] + '</div>';
  tips += '</div>';

  /* Kids gallery */
  var kidsGallery = '';
  if (s.id === 'kids') {
    kidsGallery = '<div class="studio-options-label">Style Preview — Tap to select</div>'
      + '<div class="kids-style-gallery">';
    for (var ki = 0; ki < KIDS_STYLES.length; ki++) {
      var ks = KIDS_STYLES[ki];
      var isActive = selectedOptions['Art Style'] === ks.label ? ' active' : '';
      kidsGallery += '<div class="kids-style-card' + isActive + '" onclick="selectKidsStyle(' + ki + ')">'
        + '<img src="' + ks.img + '" alt="' + ks.label + '" loading="lazy">'
        + '<div class="ks-label">' + ks.label + '</div>'
        + '<div class="ks-desc">' + ks.desc + '</div>'
        + '</div>';
    }
    kidsGallery += '</div>';
  }

  /* Festival picker */
  var festSection = '';
  if (s.hasFestivals) {
    festSection = '<div class="studio-options-label">Choose Your Festival</div>'
      + '<div class="festival-grid" id="festivalGrid">';
    for (var fi = 0; fi < FESTIVALS.length; fi++) {
      var f = FESTIVALS[fi];
      var isSelected = selectedFestival === f.name;
      var fStyle = isSelected
        ? 'background:linear-gradient(135deg,' + f.grad[0] + '33,' + f.grad[1] + '22);border-color:' + f.grad[0] + '88'
        : '';
      festSection += '<div class="festival-card' + (isSelected ? ' selected' : '') + '"'
        + ' data-fidx="' + fi + '"'
        + ' onclick="selectFestival(' + fi + ')"'
        + ' style="' + fStyle + '">'
        + '<div class="fi-emoji">' + f.emoji + '</div>'
        + '<div class="fi-name">' + f.name + '</div>'
        + '</div>';
    }
    festSection += '</div>';
    if (selectedFestival) festSection += buildFestivalPreview();
  }

  /* Upload */
  var upload = '';
  if (s.hasUpload !== false && s.id !== 'cultural') {
    upload = '<div class="studio-options-label">Upload Photo <span style="color:rgba(255,255,255,0.4);font-weight:400">(optional)</span></div>'
      + '<div class="studio-upload-zone" id="studioDropZone" onclick="document.getElementById(\'studioFileInput\').click()" ondragover="studioDragOver(event)" ondrop="studioDrop(event)">'
      + '<div id="studioUploadInner" style="text-align:center">'
      + '<div style="font-size:40px">📷</div>'
      + '<div style="font-size:14px;font-weight:700;color:#fff;margin-top:8px">Tap to upload photo</div>'
      + '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px">or drag &amp; drop</div>'
      + '</div></div>'
      + '<div class="studio-upload-preview" id="studioPreview">'
      + '<img id="studioPreviewImg" src="" alt="Preview">'
      + '<button class="change-photo" onclick="event.stopPropagation();document.getElementById(\'studioFileInput\').click()">📷 Change</button>'
      + '</div>'
      + '<input type="file" id="studioFileInput" accept="image/*" style="display:none" onchange="studioFileSelected(this.files[0])">';
  }

  /* Options — index-based onclick avoids ALL special char issues */
  var opts = '';
  var grpKeys = Object.keys(s.options || {});
  for (var gi = 0; gi < grpKeys.length; gi++) {
    var grp = grpKeys[gi];
    var pills = s.options[grp];
    opts += '<div class="studio-options-label">' + grp + '</div>'
      + '<div class="studio-pill-group" data-gi="' + gi + '">';
    for (var pi = 0; pi < pills.length; pi++) {
      var isActivePill = selectedOptions[grp] === pills[pi] ? ' active' : '';
      opts += '<div class="studio-pill' + isActivePill + '" data-gi="' + gi + '" data-pi="' + pi + '" onclick="selectPill(' + gi + ',' + pi + ')">' + pills[pi] + '</div>';
    }
    opts += '</div>';
  }

  /* Context + Voice */
  var ctx = '<div class="studio-options-label">Add Your Personal Touch</div>'
    + '<div class="studio-voice-row">'
    + '<textarea id="studioContext" rows="3" class="studio-textarea" placeholder="' + s.placeholder + '"></textarea>'
    + '<button class="studio-mic-btn" id="studioMicBtn" onclick="toggleStudioVoice()" title="Voice input">🎤</button>'
    + '</div>';

  /* Output */
  var out = '<div class="studio-output" id="studioOutput">'
    + '<div class="studio-output-label">✨ AI Generated — Choose your variation</div>'
    + '<div id="studioVariations"></div>'
    + (s.id === 'cultural' ? '<div id="festivalCardCanvas" class="festival-canvas-wrap"></div>' : '')
    + '<button class="studio-send-to-write" onclick="sendStudioToWrite()">✍️ Open in Write for more customization →</button>'
    + '</div>';

  document.querySelector('.studio-modal').innerHTML =
    '<button class="studio-modal-close-top" onclick="closeStudio()">✕ Close</button>'
    + hero
    + '<div class="studio-modal-body">'
    + tips + kidsGallery + festSection + upload + opts + ctx
    + '<button class="studio-analyze-btn" id="studioAnalyzeBtn" onclick="runStudio()">' + s.analyzeLabel + '</button>'
    + out
    + '</div>';

  /* Restore preview if image was selected */
  if (studioDataUrl) {
    var prev = document.getElementById('studioPreview');
    var prevImg = document.getElementById('studioPreviewImg');
    var inner = document.getElementById('studioUploadInner');
    if (prev && prevImg) { prevImg.src = studioDataUrl; prev.classList.add('visible'); }
    if (inner) inner.style.display = 'none';
  }
}

function buildFestivalPreview() {
  var f = null;
  for (var i = 0; i < FESTIVALS.length; i++) {
    if (FESTIVALS[i].name === selectedFestival) { f = FESTIVALS[i]; break; }
  }
  if (!f) return '';
  return '<div class="festival-preview-card" id="festivalPreviewCard" style="background:linear-gradient(135deg,' + f.grad[0] + ',' + f.grad[1] + ',' + f.grad[2] + ')">'
    + '<div class="fpc-emojis">' + f.emoji2 + '</div>'
    + '<div class="fpc-name">' + f.name + '</div>'
    + '<div class="fpc-sub">Tap Generate to get your card ↓</div>'
    + '</div>';
}

/* ── Selection Handlers ── */

/* Pill select — uses group-index (gi) and pill-index (pi) — no string escaping needed */
function selectPill(gi, pi) {
  var s = activeStudio;
  if (!s) return;
  var grpKeys = Object.keys(s.options || {});
  if (gi >= grpKeys.length) return;
  var grp = grpKeys[gi];
  var pills = s.options[grp];
  if (pi >= pills.length) return;
  selectedOptions[grp] = pills[pi];

  /* Update active class only on pills in this group */
  var allPills = document.querySelectorAll('.studio-pill[data-gi="' + gi + '"]');
  for (var i = 0; i < allPills.length; i++) {
    allPills[i].classList.toggle('active', parseInt(allPills[i].dataset.pi, 10) === pi);
  }
}

/* Kids style — uses index */
function selectKidsStyle(ki) {
  if (ki >= KIDS_STYLES.length) return;
  selectedOptions['Art Style'] = KIDS_STYLES[ki].label;
  var cards = document.querySelectorAll('.kids-style-card');
  for (var i = 0; i < cards.length; i++) cards[i].classList.toggle('active', i === ki);
}

/* Festival select — uses index, no apostrophe issues */
function selectFestival(fi) {
  if (fi >= FESTIVALS.length) return;
  var f = FESTIVALS[fi];
  selectedFestival = f.name;

  /* Update card styles */
  var cards = document.querySelectorAll('.festival-card');
  for (var i = 0; i < cards.length; i++) {
    var isMatch = parseInt(cards[i].dataset.fidx, 10) === fi;
    cards[i].classList.toggle('selected', isMatch);
    cards[i].style.cssText = isMatch
      ? 'background:linear-gradient(135deg,' + f.grad[0] + '33,' + f.grad[1] + '22);border-color:' + f.grad[0] + '88'
      : '';
  }

  /* Insert / update preview card */
  var newHtml = '<div class="festival-preview-card" id="festivalPreviewCard" style="background:linear-gradient(135deg,' + f.grad[0] + ',' + f.grad[1] + ',' + f.grad[2] + ')">'
    + '<div class="fpc-emojis">' + f.emoji2 + '</div>'
    + '<div class="fpc-name">' + f.name + '</div>'
    + '<div class="fpc-sub">Tap Generate to get your card ↓</div>'
    + '</div>';
  var existing = document.getElementById('festivalPreviewCard');
  var grid     = document.getElementById('festivalGrid');
  if (existing) existing.outerHTML = newHtml;
  else if (grid) grid.insertAdjacentHTML('afterend', newHtml);
}

/* ── Drag & Drop ── */
function studioDragOver(e) { e.preventDefault(); document.getElementById('studioDropZone').classList.add('dragover'); }
function studioDrop(e) {
  e.preventDefault();
  document.getElementById('studioDropZone').classList.remove('dragover');
  var f = e.dataTransfer.files[0];
  if (f && f.type.indexOf('image/') === 0) studioFileSelected(f);
}
function studioFileSelected(file) {
  if (!file) return;
  studioFile = file;
  var reader = new FileReader();
  reader.onload = function(ev) {
    studioDataUrl = ev.target.result;
    var prev = document.getElementById('studioPreview');
    var img  = document.getElementById('studioPreviewImg');
    var inn  = document.getElementById('studioUploadInner');
    if (prev && img) { img.src = studioDataUrl; prev.classList.add('visible'); }
    if (inn) inn.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

/* ── Voice ── */
function toggleStudioVoice() {
  if (studioVoiceOn) { stopStudioVoice(); return; }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { Toast.show('Voice not supported on this browser', 'error'); return; }
  studioRecognition = new SR();
  studioRecognition.continuous = false;
  studioRecognition.interimResults = true;
  studioRecognition.lang = 'en-IN';
  studioRecognition.onresult = function(e) {
    var t = '';
    for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    var ta = document.getElementById('studioContext');
    if (ta) ta.value = t;
  };
  studioRecognition.onend = function() { stopStudioVoice(); };
  studioRecognition.start();
  studioVoiceOn = true;
  var btn = document.getElementById('studioMicBtn');
  if (btn) { btn.textContent = '🔴'; btn.style.background = 'rgba(255,50,50,0.2)'; }
  Toast.show('🎤 Listening... speak now', 'info', 5000);
}
function stopStudioVoice() {
  if (studioRecognition) { try { studioRecognition.stop(); } catch(e) {} studioRecognition = null; }
  studioVoiceOn = false;
  var btn = document.getElementById('studioMicBtn');
  if (btn) { btn.textContent = '🎤'; btn.style.background = ''; }
}

/* ── Run Studio ── */
async function runStudio() {
  var s = activeStudio;
  var btn = document.getElementById('studioAnalyzeBtn');
  var context = (document.getElementById('studioContext') || {}).value || '';
  context = context.trim();
  stopStudioVoice();

  if (s.hasFestivals && !selectedFestival) {
    Toast.show('Please select a festival first 🎉', 'error'); return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Generating...';
  Toast.show(s.emoji + ' Creating your content...', 'info', 12000);

  try {
    var base64 = null, mime = 'image/jpeg';
    if (studioFile) {
      var compressed = await studioCompressImage(studioFile, 512, 0.80);
      base64 = compressed.base64; mime = compressed.mime;
    }

    var result;
    if (s.promptFn === 'kids')         result = await promptKids(base64, mime, context);
    else if (s.promptFn === 'corporate') result = await promptCorporate(base64, mime, context);
    else if (s.promptFn === 'cultural')  result = await promptCultural(context);
    else if (s.promptFn === 'multilingual') result = await promptMultilingual(base64, mime, context);

    renderStudioOutput(result);
    Toast.show('✅ Done! Pick a variation below.', 'success', 3000);
  } catch(err) {
    console.error('[Studio]', err);
    Toast.show('❌ ' + (err.message || 'Something went wrong. Try again.'), 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = s.analyzeLabel;
  }
}

/* ── Render Output ── */
function renderStudioOutput(result) {
  var out  = document.getElementById('studioOutput');
  var varD = document.getElementById('studioVariations');
  var vars = Array.isArray(result) ? result : [result.variation1, result.variation2].filter(Boolean);

  var html = '';
  for (var i = 0; i < vars.length; i++) {
    html += '<div class="studio-variation' + (i === 0 ? ' selected' : '') + '" onclick="selectVariation(' + i + ')" id="sv' + i + '">'
      + '<div class="studio-variation-num">Variation ' + (i + 1) + (i === 0 ? ' · ★ Recommended' : '') + '</div>'
      + '<div class="studio-variation-text">' + vars[i].replace(/\n/g, '<br>') + '</div>'
      + '<button class="studio-variation-copy" onclick="event.stopPropagation();copyVar(' + i + ')">Copy</button>'
      + '</div>';
  }
  varD.innerHTML = html;

  window._studioVars = vars;
  selectedVariation = 0;
  out.classList.add('visible');

  /* Generate canvas card for Cultural */
  if (activeStudio.id === 'cultural' && selectedFestival && vars[0]) {
    generateFestivalCard(vars[0]);
  }

  out.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function selectVariation(i) {
  var cards = document.querySelectorAll('.studio-variation');
  for (var j = 0; j < cards.length; j++) cards[j].classList.toggle('selected', j === i);
  selectedVariation = i;
  if (activeStudio.id === 'cultural' && window._studioVars && window._studioVars[i]) {
    generateFestivalCard(window._studioVars[i]);
  }
}

function copyVar(i) {
  var text = (window._studioVars || [])[i] || '';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() { Toast.show('✅ Copied!', 'success', 2000); });
  } else {
    Toast.show('Select and copy the text manually', 'error');
  }
}

function sendStudioToWrite() {
  if (!window._studioVars || selectedVariation === null) return;
  localStorage.setItem('clarix_intent', window._studioVars[selectedVariation]);
  localStorage.setItem('clarix_intent_source', 'studio');
  closeStudio();
  window.location.href = 'write.html';
}

/* ════════════════════════════════════════════
   FESTIVAL CANVAS CARD GENERATOR
   100% browser Canvas — no image API needed
════════════════════════════════════════════ */
function generateFestivalCard(text) {
  var festival = null;
  for (var i = 0; i < FESTIVALS.length; i++) {
    if (FESTIVALS[i].name === selectedFestival) { festival = FESTIVALS[i]; break; }
  }
  if (!festival) return;

  var wrap = document.getElementById('festivalCardCanvas');
  if (!wrap) return;
  wrap.innerHTML = '';

  var canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1080;
  var ctx = canvas.getContext('2d');

  /* Background gradient */
  var grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, festival.grad[0]);
  grad.addColorStop(0.5, festival.grad[1]);
  grad.addColorStop(1, festival.grad[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  /* Dark overlay */
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.fillRect(0, 0, 1080, 1080);

  /* Border frames */
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, 1024, 1024);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, 984, 984);

  /* Festival emoji (large) */
  ctx.font = '130px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(festival.emoji, 540, 240);

  /* Festival name */
  ctx.font = 'bold 76px Arial, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(festival.name, 540, 360);

  /* AI message text (wrapped) */
  ctx.font = '36px Arial, sans-serif';
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  wrapCanvasText(ctx, text.substring(0, 250), 540, 480, 880, 56);

  /* Bottom emoji strip */
  ctx.shadowBlur = 0;
  ctx.font = '56px serif';
  ctx.fillText(festival.emoji2, 540, 958);

  /* Watermark */
  ctx.font = '22px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.fillText('Made with Clarix AI  ·  clarix.digital', 540, 1030);

  /* Show canvas */
  canvas.style.cssText = 'width:100%;border-radius:16px;display:block;box-shadow:0 20px 60px rgba(0,0,0,0.6);margin-top:16px;';
  wrap.appendChild(canvas);

  /* Download button */
  var dlBtn = document.createElement('button');
  dlBtn.textContent = '⬇️ Download Festival Card';
  dlBtn.style.cssText = 'width:100%;margin-top:12px;padding:14px;border-radius:12px;background:linear-gradient(135deg,'
    + festival.grad[0] + ',' + festival.grad[1] + ');border:none;color:#fff;font-size:15px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  dlBtn.onclick = function() {
    var a = document.createElement('a');
    a.download = 'clarix-' + festival.name.toLowerCase() + '-card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    Toast.show('📥 Festival card downloaded!', 'success');
  };
  wrap.appendChild(dlBtn);

  /* WhatsApp share */
  var wpBtn = document.createElement('button');
  wpBtn.textContent = '💬 Share on WhatsApp';
  wpBtn.style.cssText = 'width:100%;margin-top:8px;padding:14px;border-radius:12px;background:rgba(37,211,102,0.15);border:1px solid rgba(37,211,102,0.4);color:#25d366;font-size:15px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  wpBtn.onclick = function() {
    window.open('https://wa.me/?text=' + encodeURIComponent(text.substring(0, 300)), '_blank');
  };
  wrap.appendChild(wpBtn);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';
  var curY = y;
  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var w = ctx.measureText(testLine).width;
    if (w > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
      if (curY > 880) break;
    } else { line = testLine; }
  }
  ctx.fillText(line, x, curY);
}

/* ════════════════════════════════════════════
   GROQ PROMPT BUILDERS
════════════════════════════════════════════ */
async function groqCall(base64, mime, prompt) {
  var key = CLARIX_CONFIG.groqApiKey;
  if (!key || key === 'YOUR_GROQ_API_KEY') throw new Error('Groq API key not configured');

  var content = base64
    ? [{ type:'image_url', image_url:{ url:'data:' + mime + ';base64,' + base64 } }, { type:'text', text:prompt }]
    : prompt;

  var res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{ 'Authorization':'Bearer ' + key, 'content-type':'application/json' },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages:[{ role:'user', content:content }],
      max_tokens:900, temperature:0.55
    })
  });

  if (!res.ok) {
    var errData = {}; try { errData = await res.json(); } catch(e) {}
    var msg = (errData.error && errData.error.message) ? errData.error.message : 'Groq error ' + res.status;
    Toast.show('⚠️ ' + msg.substring(0, 60), 'error', 5000);
    throw new Error(msg);
  }

  var data = await res.json();
  var raw  = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
  var clean = raw.trim().replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
  var jsonStr = clean.charAt(0) === '{' ? clean : ((clean.match(/\{[\s\S]*\}/) || [])[0]);
  if (jsonStr) { try { return JSON.parse(jsonStr); } catch(e) {} }
  var lines = clean.split('\n').filter(function(l) { return l.trim(); });
  return { variation1: lines[0] || clean, variation2: lines[1] || '' };
}

async function promptKids(base64, mime, context) {
  var style = selectedOptions['Art Style'] || 'Cartoon / Pixar';
  var platform = selectedOptions['Platform'] || 'Instagram';
  var p = 'You are a fun creative AI prompt writer for children.\n'
    + (base64 ? 'Analyze the uploaded photo carefully.\n' : '')
    + (context ? 'Scene: "' + context + '"\n' : '')
    + 'Generate 2 joyful child-friendly AI image prompts in ' + style + ' style for ' + platform + '.\n'
    + 'Return JSON only: {"variation1":"...fun prompt...","variation2":"...alternative fun angle..."}';
  return groqCall(base64, mime, p);
}

async function promptCorporate(base64, mime, context) {
  var type = selectedOptions['Content Type'] || 'LinkedIn Post';
  var style = selectedOptions['Style'] || 'Professional & Clean';
  var p = 'You are a professional brand content strategist.\n'
    + (base64 ? 'Analyze the uploaded business photo.\n' : '')
    + (context ? 'Brand context: "' + context + '"\n' : '')
    + 'Generate 2 professional AI prompts for ' + type + ' in ' + style + ' style.\n'
    + 'Return JSON only: {"variation1":"...professional prompt...","variation2":"...bolder approach..."}';
  return groqCall(base64, mime, p);
}

async function promptCultural(context) {
  var langMap = { 'English':'English','Hindi':'Hindi','Hinglish':'Hinglish (Hindi+English mix)','Gujarati':'Gujarati','Marathi':'Marathi','Urdu':'Urdu' };
  var lang = langMap[selectedOptions['Language']] || 'English';
  var type = selectedOptions['Content Type'] || 'WhatsApp Wish';
  var fest = selectedFestival || 'Diwali';
  var p = 'You are a warm Indian cultural content expert.\n'
    + 'Festival: ' + fest + '\nLanguage: ' + lang + '\nContent Type: ' + type + '\n'
    + (context ? 'Personal message: "' + context + '"\n' : '')
    + 'Write 2 heartfelt ' + fest + ' messages in ' + lang + ' for ' + type + '.\n'
    + (type === 'Instagram Post' ? 'Add 6-8 hashtags.\n' : '')
    + 'Return JSON only: {"variation1":"...warm message...","variation2":"...different tone..."}';
  return groqCall(null, null, p);
}

async function promptMultilingual(base64, mime, context) {
  if (!base64) {
    Toast.show('Please upload an image with text', 'error');
    throw new Error('No image uploaded for language detection');
  }
  var platform = selectedOptions['Output Platform'] || 'Midjourney';
  var p = 'You are an expert multilingual AI analyst.\n'
    + 'Analyze this image:\n'
    + '1. Find ALL text (Hindi, Marathi, Gujarati, Tamil, Urdu, Arabic, English, etc.)\n'
    + '2. State language detected\n'
    + '3. Translate to English\n'
    + '4. Generate 2 ' + platform + ' prompts\n'
    + (context ? 'Context: "' + context + '"\n' : '')
    + 'Return JSON only: {"detected_language":"...","text_found":"...","translation":"...","variation1":"literal ' + platform + ' prompt","variation2":"creative ' + platform + ' prompt"}';
  var raw = await groqCall(base64, mime, p);
  return {
    variation1: '🌐 Language: ' + (raw.detected_language || 'Detected') + '\n📝 Text: "' + (raw.text_found || '') + '"\n🔤 Meaning: ' + (raw.translation || '') + '\n\n' + (raw.variation1 || ''),
    variation2: raw.variation2 || ''
  };
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  renderStudios();
  var overlay = document.getElementById('studioOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target.id === 'studioOverlay') closeStudio();
    });
  }
});
