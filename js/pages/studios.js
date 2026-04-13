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

/* ── Blank canvas mode state ── */
var blankCanvasMode = false;

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
var blankCanvasMode = false;

/* ── Studio Templates (shown as dropdown in each studio) ── */
var STUDIO_TEMPLATES = {
  'kids': [
    { icon: '🐕', name: 'Kid with Pet',       text: 'My daughter playing with her golden puppy at the park on a sunny day' },
    { icon: '🦸', name: 'Superhero Child',   text: 'My son dressed as a superhero flying over the city with a colorful cape' },
    { icon: '🎂', name: 'Birthday Party',   text: 'Kids birthday party with colorful balloons, big cake and confetti everywhere' },
    { icon: '🌳', name: 'Nature Adventure',  text: 'Children exploring an enchanted forest and discovering magical glowing creatures' },
    { icon: '🎮', name: 'Game World',        text: 'My child as a cartoon game character inside a magical pixel adventure world' },
  ],
  'corporate': [
    { icon: '💼', name: 'Team at Office',    text: 'Our tech startup team in a modern co-working space in Mumbai' },
    { icon: '🚀', name: 'Product Launch',    text: 'New product launch event with professional stage setup and company branding' },
    { icon: '📊', name: 'Pitch Deck Visual', text: 'Business pitch presentation for investors in a sleek boardroom setting' },
    { icon: '🤝', name: 'Partnership Deal',  text: 'Professional handshake and collaboration between two business leaders' },
    { icon: '🏆', name: 'Award Ceremony',   text: 'Company awards night with team celebrating excellence and achievement on stage' },
  ],
  'cultural': [
    { icon: '🪤', name: 'Diwali Wish',       text: 'From our family to yours — wishing you a bright, prosperous and joyful Diwali' },
    { icon: '🌈', name: 'Holi Greetings',   text: 'May colours of joy and happiness fill your life — Happy Holi from all of us' },
    { icon: '🎊', name: 'New Year',          text: 'Wishing you success, good health, and endless happiness in the new year ahead' },
    { icon: '🌙', name: 'Eid Mubarak',       text: 'Eid Mubarak! May peace, joy and prosperity be yours always this blessed season' },
    { icon: '👉', name: 'Business Greeting', text: 'Warm festival greetings from our team to yours — wishing you continued growth' },
  ],
  'multilingual': [
    { icon: '🪧', name: 'Shop Banner',       text: 'This is a Diwali sale banner from a local sweet shop in Pune with Marathi text' },
    { icon: '💌', name: 'Wedding Card',      text: 'Hindu wedding invitation card with Sanskrit blessings and traditional floral patterns' },
    { icon: '🏷️', name: 'Product Label',    text: 'Ayurvedic product label with Hindi description listing herbal ingredients and benefits' },
    { icon: '🎨', name: 'Cultural Poster',  text: 'Classical Bharatnatyam dance performance poster in Tamil with event details' },
    { icon: '📰', name: 'News Headline',     text: 'Regional Marathi newspaper headline about a local community festival celebration' },
  ],
};

/* ── Card Design State ── */
var cardDesign = {
  bgPreset: 0,          /* 0 = festival theme, 1-5 = presets */
  bgCustom: '',         /* custom hex color */
  fontStyle: 'sans',    /* sans | serif | bold | decorative */
  textSize: 'medium',   /* small | medium | large */
  textColor: '#ffffff', /* hex */
  borderStyle: 'double',/* none | double | glow | gold */
  showWatermark: true
};

var BG_PRESETS = [
  { name: '🎨 Festival', colors: null },
  { name: '🌅 Sunset',   colors: ['#ff6b35','#f79d65','#ffecd2'] },
  { name: '🌊 Ocean',    colors: ['#0077b6','#00b4d8','#90e0ef'] },
  { name: '🌌 Night',    colors: ['#03045e','#023e8a','#7b2d8b'] },
  { name: '🌹 Rose',     colors: ['#b76e79','#dba098','#f0c8b0'] },
  { name: '🌿 Forest',   colors: ['#1b4332','#40916c','#95d5b2'] }
];

var FONT_MAP = {
  sans:        'Arial, sans-serif',
  serif:       'Georgia, serif',
  bold:        '"Arial Black", Impact, sans-serif',
  decorative:  '"Palatino Linotype", Georgia, serif'
};

var TEXT_SIZE_MAP = { small: 30, medium: 38, large: 50 };

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
  blankCanvasMode = false;
}

/* Toggle Blank Canvas mode */
function showBlankCanvas() {
  var toggle  = document.getElementById('blankCanvasToggle');
  var section = document.getElementById('blankCanvasSection');
  var festLabel = document.getElementById('festivalLabel');
  var festGrid  = document.getElementById('festivalGrid');
  if (!toggle || !section) return;

  blankCanvasMode = !blankCanvasMode;

  if (blankCanvasMode) {
    toggle.classList.add('active');
    toggle.textContent = '✕ Close Custom Card';
    section.classList.add('visible');
    /* Hide festival picker when in blank mode */
    if (festLabel) festLabel.style.display = 'none';
    if (festGrid)  festGrid.style.display  = 'none';
  } else {
    toggle.classList.remove('active');
    toggle.textContent = '✏️ Create Your Own Card — No Festival Needed';
    section.classList.remove('visible');
    if (festLabel) festLabel.style.display = '';
    if (festGrid)  festGrid.style.display  = '';
  }
}

/* Gated blank card generator — checks trial before drawing */
function generateBlankCardGated() {
  if (!ClarixState.canEnhance()) {
    UpgradeModal.show('You\'ve used all your free prompts!');
    return;
  }
  generateBlankCard();
  ClarixState.incUsage();
  if (typeof updateUsageCounter === 'function') updateUsageCounter();
  var rem = ClarixState.remainingToday();
  var inTrial = ClarixState.isInTrial();
  if (!ClarixState.isPro) {
    Toast.show('🎨 Card created! ' + rem + (inTrial ? ' trial' : ' free') + ' prompts remaining.', 'success', 3500);
  }
  /* Auto-trigger selected social platform */
  var platform = _blankSocialPlatform || 'whatsapp';
  setTimeout(function() {
    if (platform === 'print') {
      studioTipAction('download');
    } else if (platform === 'facebook') {
      studioTipAction('download');
      setTimeout(function() {
        window.open('https://www.facebook.com/', '_blank', 'noopener noreferrer');
        Toast.show('📥 Image saved — upload it to Facebook!', 'success', 4000);
      }, 700);
    } else if (platform === 'twitter') {
      studioTipAction('download');
      setTimeout(function() {
        window.open('https://x.com/compose/tweet', '_blank', 'noopener noreferrer');
        Toast.show('📥 Image saved — attach it in your tweet!', 'success', 4000);
      }, 700);
    } else if (platform === 'linkedin') {
      studioTipAction('download');
      setTimeout(function() {
        window.open('https://www.linkedin.com/feed/', '_blank', 'noopener noreferrer');
        Toast.show('📥 Image saved — upload it to LinkedIn!', 'success', 4000);
      }, 700);
    } else {
      /* whatsapp, instagram, share — handled by studioTipAction */
      studioTipAction(platform);
    }
  }, 600);
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

  /* Tips — always show with clear label */
  var tips = '<div class="studio-how-to-label">📌 How to use this studio:</div>'
    + '<div class="studio-tips-strip">';
  for (var t = 0; t < s.tips.length; t++) {
    var tip = s.tips[t];
    var tipAction = '';
    if (s.id === 'cultural') {
      if (tip.indexOf('WhatsApp') !== -1) tipAction = ' onclick="studioTipAction(\'whatsapp\')"';
      else if (tip.indexOf('Instagram') !== -1) tipAction = ' onclick="studioTipAction(\'instagram\')"';
    }
    tips += '<div class="studio-tip' + (tipAction ? ' studio-tip-btn' : '') + '"' + tipAction + '>' + tip + '</div>';
  }
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

  /* Festival picker + Blank Canvas toggle for Cultural Creator */
  var festSection = '';
  if (s.hasFestivals) {
    /* Blank canvas toggle */
    festSection = '<button class="blank-canvas-toggle" id="blankCanvasToggle" onclick="showBlankCanvas()">'
      + '✏️ Create Your Own Card — No Festival Needed'
      + '</button>'
      + '<div class="blank-canvas-section" id="blankCanvasSection">'

      /* Card type dropdown */
      + '<div class="bcs-label">🎉 Card Type</div>'
      + '<select class="bcs-input" id="blankCardTitleSelect" onchange="updateBlankCardTitle()">'
      + '<option value="">— Select Occasion —</option>'
      + '<option value="Happy Birthday! 🎂">🎂 Birthday</option>'
      + '<option value="Happy Anniversary! 💍">💍 Anniversary</option>'
      + '<option value="Congratulations! 🎉">🎉 Congratulations</option>'
      + '<option value="Thank You! 🙏">🙏 Thank You</option>'
      + '<option value="Get Well Soon! 💐">💐 Get Well Soon</option>'
      + '<option value="Good Luck! 🍀">🍀 Good Luck</option>'
      + '<option value="Welcome! 🎊">🎊 Welcome</option>'
      + '<option value="Happy Retirement! 🌟">🌟 Retirement</option>'
      + '<option value="Farewell! 👋">👋 Farewell</option>'
      + '<option value="Custom">✏️ Type my own...</option>'
      + '</select>'
      + '<input class="bcs-input" id="blankCardTitle" placeholder="Type your custom title..." maxlength="40" style="display:none;margin-top:8px">'

      /* From → To */
      + '<div class="bcs-label">👤 From → To</div>'
      + '<div style="display:flex;gap:8px;align-items:center">'
      + '<input class="bcs-input" id="blankCardFrom" placeholder="From (your name / family)" maxlength="30" style="flex:1">'
      + '<span style="color:rgba(255,255,255,0.4);font-size:18px;flex-shrink:0">→</span>'
      + '<input class="bcs-input" id="blankCardTo" placeholder="To (recipient name)" maxlength="30" style="flex:1">'
      + '</div>'

      /* Message with voice */
      + '<div class="bcs-label">💬 Your Message</div>'
      + '<div class="studio-voice-row">'
      + '<textarea class="bcs-input" id="blankCardText" rows="3" placeholder="Type your heartfelt message (or tap 🎤 to speak)..."></textarea>'
      + '<button class="studio-mic-btn" id="blankMicBtn" onclick="toggleBlankVoice()" title="Voice input">🎤</button>'
      + '</div>'

      /* Emoji */
      + '<div class="bcs-label">Emoji</div>'
      + '<div class="bcs-row"><input class="bcs-input bcs-emoji" id="blankCardEmoji" placeholder="✨" maxlength="4" value="✨">'
      + '<span style="font-size:12px;color:rgba(255,255,255,.4);align-self:center">Paste any emoji here</span></div>'

      /* Share To platform */
      + '<div class="bcs-label">📲 Share To</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:4px">'
      + '<button class="bcs-social-btn active" id="bsp-whatsapp"   onclick="selectBlankSocial(\'whatsapp\',this)"  style="background:rgba(37,211,102,0.15);border:1.5px solid rgba(37,211,102,0.5);color:#25d366;border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">💬 WhatsApp</button>'
      + '<button class="bcs-social-btn"        id="bsp-instagram"  onclick="selectBlankSocial(\'instagram\',this)"  style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">📸 Instagram</button>'
      + '<button class="bcs-social-btn"        id="bsp-facebook"   onclick="selectBlankSocial(\'facebook\',this)"   style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">📘 Facebook</button>'
      + '<button class="bcs-social-btn"        id="bsp-twitter"    onclick="selectBlankSocial(\'twitter\',this)"    style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">🐦 Twitter / X</button>'
      + '<button class="bcs-social-btn"        id="bsp-linkedin"   onclick="selectBlankSocial(\'linkedin\',this)"   style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">💼 LinkedIn</button>'
      + '<button class="bcs-social-btn"        id="bsp-print"      onclick="selectBlankSocial(\'print\',this)"      style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">🖨️ Print</button>'
      + '</div>'

      + '<button class="studio-analyze-btn" id="blankGenerateBtn" onclick="generateBlankCardGated()" style="margin-top:14px">🎨 Create My Card</button>'
      + '<div id="blankCardCanvas"></div>'
      + '</div>';

    /* Festival grid */
    festSection += '<div class="studio-options-label" id="festivalLabel">Choose Your Festival</div>'
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

  /* Context + Templates + Voice */
  var studioId = s.id;
  var tpls = (STUDIO_TEMPLATES[studioId] || []);
  var tplDropdown = '';
  if (tpls.length) {
    tplDropdown = '<div style="position:relative;margin-bottom:8px" id="studioTplWrap">'
      + '<button class="btn btn-ghost btn-sm" id="studioTplBtn" onclick="studioToggleTemplates()" style="font-size:12px">\uD83D\uDCCB Templates \u25BE</button>'
      + '<div id="studioTplDropdown" style="display:none;position:absolute;top:calc(100%+6px);left:0;z-index:60;background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:8px;min-width:260px;box-shadow:0 12px 40px rgba(0,0,0,0.6)">'
      + '<div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);padding:4px 8px 8px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:6px">Quick Templates</div>';
    for (var ti = 0; ti < tpls.length; ti++) {
      var tp = tpls[ti];
      tplDropdown += '<div onclick="studioApplyTemplate(\'' + studioId + '\',' + ti + ')"'
        + ' style="display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;transition:background .15s;font-size:13px;color:rgba(255,255,255,0.8)"'
        + ' onmouseover="this.style.background=\'rgba(255,112,67,0.1)\'" onmouseout="this.style.background=\'\'">'
        + '<span style="font-size:16px;width:22px;text-align:center;flex-shrink:0">' + tp.icon + '</span>'
        + '<span>' + tp.name + '</span></div>';
    }
    tplDropdown += '</div></div>';
  }
  var ctx = '<div class="studio-options-label">Add Your Personal Touch</div>'
    + tplDropdown
    + '<div class="studio-voice-row">'
    + '<textarea id="studioContext" rows="3" class="studio-textarea" placeholder="' + s.placeholder + '"></textarea>'
    + '<button class="studio-mic-btn" id="studioMicBtn" onclick="toggleStudioVoice()" title="Voice input">🎤</button>'
    + '</div>'
    + '<div class="studio-context-actions">'
    + '<button class="studio-ctx-btn" onclick="clearStudioContext()" title="Clear text">🗑 Clear</button>'
    + '<button class="studio-ctx-btn" onclick="reuseLastContext()" title="Reuse last input">🔄 Reuse Last</button>'
    + '<button class="studio-ctx-btn" onclick="saveStudioDraft()" title="Save as draft" style="color:var(--accent);">💾 Save Draft</button>'
    + '</div>';

  /* Close templates dropdown when clicking outside */
  setTimeout(function() {
    document.addEventListener('click', function _studioTplClose(e) {
      var wrap = document.getElementById('studioTplWrap');
      if (!wrap || !wrap.contains(e.target)) {
        var dd = document.getElementById('studioTplDropdown');
        if (dd) dd.style.display = 'none';
        document.removeEventListener('click', _studioTplClose);
      }
    });
  }, 100);

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
  /* Logo PNG Quality Warning */
  if (file.type !== 'image/png') {
    Toast.show('💡 For logos: PNG gives best results. JPG may affect quality.', 'info', 5000);
    /* Show warning banner inside the upload zone */
    setTimeout(function() {
      var zone = document.getElementById('studioDropZone');
      if (zone) {
        var warn = document.getElementById('studioLogoWarn');
        if (!warn) {
          warn = document.createElement('div');
          warn.id = 'studioLogoWarn';
          warn.style.cssText = 'margin-top:8px;padding:8px 12px;background:rgba(255,193,7,0.1);border:1px solid rgba(255,193,7,0.3);border-radius:8px;font-size:12px;color:#ffc107;line-height:1.5;';
          warn.innerHTML = '⚠️ <strong>Logo detected as non-PNG.</strong> For best output quality, upload a transparent PNG logo. Your result will be close but may vary.';
          zone.parentNode.insertBefore(warn, zone.nextSibling);
        }
      }
    }, 300);
  } else {
    var warn = document.getElementById('studioLogoWarn');
    if (warn) warn.remove();
  }
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

  /* ── TRIAL / USAGE GATE ── */
  if (!ClarixState.canEnhance()) {
    UpgradeModal.show('You\'ve used all your free Creative Studio prompts!');
    return;
  }

  /* In blank canvas mode OR when template text is provided, skip festival requirement.
     promptCultural() already defaults to 'Diwali' when selectedFestival is null. */
  if (s.hasFestivals && !selectedFestival && !blankCanvasMode && !context) {
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
    if (s.promptFn === 'kids')             result = await promptKids(base64, mime, context);
    else if (s.promptFn === 'corporate')   result = await promptCorporate(base64, mime, context);
    else if (s.promptFn === 'cultural')    result = await promptCultural(context);
    else if (s.promptFn === 'multilingual')result = await promptMultilingual(base64, mime, context);

    /* ── DEDUCT USAGE after success (not before - so failed calls don't waste credits) ── */
    ClarixState.incUsage();
    if (typeof updateUsageCounter === 'function') updateUsageCounter();
    if (typeof Sidebar !== 'undefined' && Sidebar.refresh) Sidebar.refresh();

    /* Show remaining trial count */
    var rem = ClarixState.remainingToday();
    var inTrial = ClarixState.isInTrial();
    if (!ClarixState.isPro) {
      Toast.show('✅ Done! ' + rem + (inTrial ? ' trial' : ' free') + ' prompts remaining.', 'success', 3500);
    } else {
      Toast.show('✅ Done! Pick a variation below.', 'success', 3000);
    }

    renderStudioOutput(result);
    saveStudioGenerationToHistory(result);
    /* Show Continue or Change modal after 1.5s */
    setTimeout(showStudioContinueModal, 1500);
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
  var text = window._studioVars[selectedVariation];
  localStorage.setItem('clarix_intent', text);
  localStorage.setItem('clarix_intent_source', 'studio');
  closeStudio();
  window.location.href = 'write.html';
}

/* ── Clear / Reuse / Save Draft helpers ── */
function clearStudioContext() {
  var ta = document.getElementById('studioContext');
  if (ta) { ta.value = ''; ta.focus(); }
  Toast.show('Cleared', 'info', 1500);
}

/* ── Studio Template Helpers ── */
function studioToggleTemplates() {
  var dd = document.getElementById('studioTplDropdown');
  if (!dd) return;
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}

function studioApplyTemplate(studioId, idx) {
  var tpls = STUDIO_TEMPLATES[studioId] || [];
  if (idx >= tpls.length) return;
  var ta = document.getElementById('studioContext');
  if (ta) { ta.value = tpls[idx].text; ta.focus(); }
  var dd = document.getElementById('studioTplDropdown');
  if (dd) dd.style.display = 'none';
  Toast.show('Template "' + tpls[idx].name + '" loaded', 'success', 2000);
}


function reuseLastContext() {
  var last = localStorage.getItem('clarix_last_context') || '';
  var ta = document.getElementById('studioContext');
  if (!last) { Toast.show('No previous input found', 'info', 2000); return; }
  if (ta) { ta.value = last; ta.focus(); }
  Toast.show('Last input restored ✓', 'success', 2000);
}

function saveStudioDraft() {
  var ta = document.getElementById('studioContext');
  var text = ta ? ta.value.trim() : '';
  if (!text) { Toast.show('Nothing to save yet', 'info', 2000); return; }
  localStorage.setItem('clarix_last_context', text);
  /* Save to Firestore history if logged in */
  try {
    var uid = localStorage.getItem('clarix_uid');
    if (uid && typeof firebase !== 'undefined' && firebase.firestore) {
      firebase.firestore().collection('users').doc(uid)
        .collection('drafts').add({
          text: text,
          studio: activeStudio ? activeStudio.id : 'unknown',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
  } catch(e) {}
  Toast.show('💾 Draft saved!', 'success', 2000);
}

/* Save studio generation result to Firestore history */
function saveStudioGenerationToHistory(result) {
  try {
    var uid = localStorage.getItem('clarix_uid');
    var text = Array.isArray(result) ? result[0] : (result.variation1 || '');
    var context = (document.getElementById('studioContext') || {}).value || '';
    /* localStorage backup */
    var saved = JSON.parse(localStorage.getItem('clarix_saved') || '[]');
    saved.unshift({
      text: text, source: 'studio',
      studio: activeStudio ? activeStudio.id : 'unknown',
      context: context,
      time: new Date().toISOString()
    });
    if (saved.length > 100) saved.pop();
    localStorage.setItem('clarix_saved', JSON.stringify(saved));
    localStorage.setItem('clarix_last_context', context);
    /* Firestore cloud save */
    if (uid && typeof firebase !== 'undefined' && firebase.firestore) {
      firebase.firestore().collection('users').doc(uid)
        .collection('history').add({
          text: text, source: 'studio',
          studio: activeStudio ? activeStudio.id : 'unknown',
          context: context,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
  } catch(e) {}
}

/* Studio Continue or Change modal */
function showStudioContinueModal() {
  var existing = document.getElementById('clarix-studio-continue');
  if (existing) existing.remove();
  var el = document.createElement('div');
  el.id = 'clarix-studio-continue';
  el.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;';
  var studioName = activeStudio ? activeStudio.name : 'Studio';
  el.innerHTML = '<div style="background:#111;border:1px solid rgba(255,112,67,0.3);border-radius:20px;padding:32px 28px;max-width:380px;width:100%;text-align:center;">'
    + '<div style="font-size:30px;margin-bottom:12px;">✨</div>'
    + '<div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px;font-family:var(--font-head);">Great output!</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:24px;line-height:1.6;">What would you like to do next?</div>'
    + '<div style="display:flex;flex-direction:column;gap:10px;">'
    + '<button onclick="document.getElementById(\'clarix-studio-continue\').remove()" style="background:var(--accent);color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;">🔄 Refine or Enhance More</button>'
    + '<button onclick="document.getElementById(\'clarix-studio-continue\').remove();clearStudioContext()" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;">🎨 Change Style / Options</button>'
    + '<button onclick="sendStudioToWrite()" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;">✍️ Open in Write Studio</button>'
    + '<button onclick="document.getElementById(\'clarix-studio-continue\').remove();closeStudio()" style="background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;font-size:13px;padding:8px;">Back to Apps</button>'
    + '</div></div>';
  document.body.appendChild(el);
  el.addEventListener('click', function(e) { if (e.target === el) el.remove(); });
}

/* ════════════════════════════════════════════
   FESTIVAL CANVAS ENGINE — Design-System Aware
════════════════════════════════════════════ */

/* Core drawing function — shared by festival card AND blank canvas */
function drawFestivalCanvas(canvas, opts) {
  /* opts: { festival, text, emoji, title, design } */
  var festival = opts.festival || null;
  var text     = opts.text || '';
  var emoji    = opts.emoji || (festival ? festival.emoji : '✨');
  var emoji2   = opts.emoji2 || (festival ? festival.emoji2 : '✨🌟✨');
  var title    = opts.title || (festival ? festival.name : 'My Card');
  var d        = opts.design || cardDesign;

  var ctx = canvas.getContext('2d');
  canvas.width = 1080; canvas.height = 1080;

  /* ── Background ── */
  var bgColors;
  if (d.bgPreset === 0 && festival) {
    bgColors = festival.grad;
  } else if (d.bgPreset > 0 && BG_PRESETS[d.bgPreset] && BG_PRESETS[d.bgPreset].colors) {
    bgColors = BG_PRESETS[d.bgPreset].colors;
  } else if (d.bgCustom) {
    bgColors = [d.bgCustom, d.bgCustom, d.bgCustom];
  } else {
    bgColors = ['#1a1a2e','#16213e','#0f3460'];
  }
  var grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0,   bgColors[0]);
  grad.addColorStop(0.5, bgColors[1] || bgColors[0]);
  grad.addColorStop(1,   bgColors[2] || bgColors[0]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  /* Dark overlay for legibility */
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(0, 0, 1080, 1080);

  /* ── Border / Frame ── */
  if (d.borderStyle === 'double') {
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 6;
    ctx.strokeRect(28, 28, 1024, 1024);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';  ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 984, 984);
  } else if (d.borderStyle === 'glow') {
    ctx.shadowColor = d.textColor || '#fff'; ctx.shadowBlur = 30;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 1016, 1016);
    ctx.shadowBlur = 0;
  } else if (d.borderStyle === 'gold') {
    var goldGrad = ctx.createLinearGradient(0,0,1080,1080);
    goldGrad.addColorStop(0,'#ffd700'); goldGrad.addColorStop(0.5,'#fff5b0'); goldGrad.addColorStop(1,'#ffd700');
    ctx.strokeStyle = goldGrad; ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, 1032, 1032);
    ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1000, 1000);
  }
  /* borderStyle === 'none' → skip */

  /* ── Emoji top ── */
  ctx.font = '110px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 0;
  ctx.fillText(emoji, 540, 175);

  /* ── Title ── */
  var fontFamily = FONT_MAP[d.fontStyle] || 'Arial, sans-serif';
  ctx.font = 'bold 70px ' + fontFamily;
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 20;
  ctx.fillStyle = d.textColor || '#ffffff';
  ctx.fillText(title, 540, 290);

  /* ── Secondary emoji strip ── */
  ctx.shadowBlur = 0;
  ctx.font = '42px serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(emoji2, 540, 390);

  /* ── Divider line ── */
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
  ctx.moveTo(100, 428); ctx.lineTo(980, 428);
  ctx.stroke();

  /* ── Message text (bottom section) ── */
  var fontSize   = TEXT_SIZE_MAP[d.textSize] || 38;
  var lineHeight = Math.round(fontSize * 1.6);
  ctx.font       = fontSize + 'px ' + fontFamily;
  ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.fillStyle  = d.textColor || '#ffffff';
  wrapCanvasText(ctx, text.substring(0, 320), 540, 490, 900, lineHeight);

  /* ── Watermark ── */
  if (d.showWatermark) {
    ctx.shadowBlur = 0;
    ctx.font = '21px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.fillText('Made with Clarix AI  ·  clarix.digital', 540, 1050);
  }
}

/* ── generateFestivalCard — called from renderStudioOutput ── */
function generateFestivalCard(text) {
  var festival = null;
  for (var i = 0; i < FESTIVALS.length; i++) {
    if (FESTIVALS[i].name === selectedFestival) { festival = FESTIVALS[i]; break; }
  }
  if (!festival) return;

  var wrap = document.getElementById('festivalCardCanvas');
  if (!wrap) return;
  wrap.innerHTML = '';

  /* Reset design to festival theme on new generate */
  cardDesign.bgPreset = 0;

  var canvas = document.createElement('canvas');
  drawFestivalCanvas(canvas, { festival: festival, text: text, design: cardDesign });

  /* Store globally */
  window._festivalCanvas  = canvas;
  window._festivalText    = text;
  window._festivalName    = festival.name;
  window._festivalOpts    = { festival: festival, text: text };

  canvas.style.cssText = 'width:100%;border-radius:16px;display:block;box-shadow:0 20px 60px rgba(0,0,0,0.6);margin-top:16px;';
  canvas.id = 'festivalCanvasEl';
  wrap.appendChild(canvas);

  appendShareButtons(wrap, festival.grad);
  renderCardControls(wrap);
}

/* ── Blank Canvas helpers ── */

function updateBlankCardTitle() {
  var sel = document.getElementById('blankCardTitleSelect');
  var inp = document.getElementById('blankCardTitle');
  if (!sel || !inp) return;
  if (sel.value === 'Custom') {
    inp.style.display = 'block';
    inp.value = '';
    inp.focus();
  } else {
    inp.style.display = 'none';
  }
}

var _blankVoiceOn = false;
var _blankRecognition = null;

function toggleBlankVoice() {
  if (_blankVoiceOn) { stopBlankVoice(); return; }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { Toast.show('Voice not supported on this browser', 'error'); return; }
  _blankRecognition = new SR();
  _blankRecognition.continuous = false;
  _blankRecognition.interimResults = true;
  _blankRecognition.lang = 'en-IN';
  _blankRecognition.onresult = function(e) {
    var t = '';
    for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    var ta = document.getElementById('blankCardText');
    if (ta) ta.value = t;
  };
  _blankRecognition.onend = function() { stopBlankVoice(); };
  _blankRecognition.start();
  _blankVoiceOn = true;
  var btn = document.getElementById('blankMicBtn');
  if (btn) { btn.textContent = '🔴'; btn.style.background = 'rgba(255,50,50,0.2)'; }
  Toast.show('🎤 Listening… speak your message', 'info', 5000);
}

function stopBlankVoice() {
  if (_blankRecognition) { try { _blankRecognition.stop(); } catch(e) {} _blankRecognition = null; }
  _blankVoiceOn = false;
  var btn = document.getElementById('blankMicBtn');
  if (btn) { btn.textContent = '🎤'; btn.style.background = ''; }
}

/* ── Show blank canvas section ── */
function showBlankCanvas() {
  blankCanvasMode = true;
  var section = document.getElementById('blankCanvasSection');
  var toggle  = document.getElementById('blankCanvasToggle');
  var festLabel = document.getElementById('festivalLabel');
  var festGrid  = document.getElementById('festivalGrid');
  if (section) { section.style.display = 'block'; }
  if (toggle)   { toggle.style.display = 'none'; }
  if (festLabel){ festLabel.style.display = 'none'; }
  if (festGrid) { festGrid.style.display = 'none'; }

  /* Auto-fill FROM with signed-in user name */
  var fromEl = document.getElementById('blankCardFrom');
  if (fromEl && !fromEl.value) {
    var uname = localStorage.getItem('clarix_uname') || '';
    if (uname) fromEl.value = uname;
  }
}

/* ── Generate blank card (pure canvas — no AI required) ── */
function generateBlankCardGated() {
  generateBlankCard();
}

function autoShareBlankCard(platform) {
  studioTipAction(platform || 'whatsapp');
}

/* ── Social platform selector ── */
var _blankSocialPlatform = 'whatsapp'; /* default */

function selectBlankSocial(platform, btn) {
  _blankSocialPlatform = platform;

  /* Reset all buttons to unselected style */
  var allBtns = document.querySelectorAll('.bcs-social-btn');
  allBtns.forEach(function(b) {
    b.style.background = 'rgba(255,255,255,0.04)';
    b.style.borderColor = 'rgba(255,255,255,0.12)';
    b.style.color = 'rgba(255,255,255,0.7)';
  });

  /* Highlight selected button */
  var colors = {
    whatsapp:  ['rgba(37,211,102,0.15)',  'rgba(37,211,102,0.5)',  '#25d366'],
    instagram: ['rgba(225,48,108,0.15)',  'rgba(225,48,108,0.5)',  '#e1306c'],
    facebook:  ['rgba(24,119,242,0.15)',  'rgba(24,119,242,0.5)',  '#1877f2'],
    twitter:   ['rgba(29,161,242,0.15)',  'rgba(29,161,242,0.5)',  '#1da1f2'],
    linkedin:  ['rgba(10,102,194,0.15)',  'rgba(10,102,194,0.5)',  '#0a66c2'],
    print:     ['rgba(255,112,67,0.15)',  'rgba(255,112,67,0.5)',  '#ff7043']
  };
  var c = colors[platform] || colors.whatsapp;
  if (btn) {
    btn.style.background   = c[0];
    btn.style.borderColor  = c[1];
    btn.style.color        = c[2];
  }
}

/* ── generateBlankCard — reads from/to + dropdown title ── */
function generateBlankCard() {
  var textEl   = document.getElementById('blankCardText');
  var emojiEl  = document.getElementById('blankCardEmoji');
  var titleSel = document.getElementById('blankCardTitleSelect');
  var titleInp = document.getElementById('blankCardTitle');
  var fromEl   = document.getElementById('blankCardFrom');
  var toEl     = document.getElementById('blankCardTo');

  var text  = (textEl  ? textEl.value.trim()  : '') || 'Happy Celebrations!';
  var emoji = (emojiEl ? emojiEl.value.trim() : '') || '✨';

  /* Title: dropdown value OR custom input */
  var titleVal = '';
  if (titleSel) {
    titleVal = (titleSel.value === 'Custom') ? (titleInp ? titleInp.value.trim() : '') : titleSel.value;
  }
  var title = titleVal || 'My Card';

  /* Extract just the text without emoji for canvas title */
  var cleanTitle = title.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim() || title;

  /* Build from/to line — auto-fill FROM with user name if empty */
  var from = fromEl ? fromEl.value.trim() : '';
  if (!from) from = localStorage.getItem('clarix_uname') || '';
  var to   = toEl   ? toEl.value.trim()   : '';
  var fromToLine = '';
  if (to)   fromToLine += 'To: ' + to;
  if (from) fromToLine += (fromToLine ? '  |  ' : '') + 'From: ' + from;

  /* Full message on card */
  var fullText = text + (fromToLine ? '\n\n' + fromToLine : '');

  var wrap = document.getElementById('blankCardCanvas');
  if (!wrap) return;

  var existing = document.getElementById('blankCanvasEl');
  var canvas = existing || document.createElement('canvas');
  canvas.id = 'blankCanvasEl';

  drawFestivalCanvas(canvas, {
    text: fullText, emoji: emoji, title: cleanTitle,
    emoji2: emoji + '  ' + emoji,
    design: cardDesign
  });

  if (!existing) {
    canvas.style.cssText = 'width:100%;border-radius:16px;display:block;box-shadow:0 20px 60px rgba(0,0,0,0.6);margin-top:16px;';
    wrap.appendChild(canvas);
    appendShareButtons(wrap, ['#ff7043','#ff5722','#bf360c']);
    renderCardControls(wrap);
  }

  /* Store globally */
  window._festivalCanvas = canvas;
  window._festivalText   = fullText;
  window._festivalName   = cleanTitle || 'my-card';
}

/* ── redrawCard — live re-render when design changes ── */
function redrawCard() {
  var canvasEl = document.getElementById('festivalCanvasEl') || document.getElementById('blankCanvasEl');
  if (!canvasEl) return;
  var opts = window._festivalOpts || {};
  if (blankCanvasMode) {
    generateBlankCard();
  } else {
    var text = window._festivalText || '';
    var festival = null;
    for (var i = 0; i < FESTIVALS.length; i++) {
      if (FESTIVALS[i].name === selectedFestival) { festival = FESTIVALS[i]; break; }
    }
    if (!festival) return;
    drawFestivalCanvas(canvasEl, { festival: festival, text: text, design: cardDesign });
    window._festivalCanvas = canvasEl;
  }
}

/* ── Design Control Panel ── */
function renderCardControls(wrap) {
  /* Remove old panel if any */
  var old = document.getElementById('cardDesignPanel');
  if (old) old.remove();

  var panel = document.createElement('div');
  panel.id = 'cardDesignPanel';
  panel.className = 'card-design-panel';
  panel.innerHTML = [
    '<div class="cdp-header" onclick="this.parentElement.classList.toggle(\'open\')">',
      '<span>🎨 Customise Card</span>',
      '<span class="cdp-arrow">▼</span>',
    '</div>',
    '<div class="cdp-body">',

    /* Background presets */
    '<div class="cdp-label">Background</div>',
    '<div class="cdp-row">',
      BG_PRESETS.map(function(p, i) {
        var bg = p.colors
          ? 'background:linear-gradient(135deg,' + p.colors.join(',') + ')'
          : 'background:linear-gradient(135deg,#ff6b00,#ffc300)';
        return '<button class="cdp-swatch' + (cardDesign.bgPreset === i ? ' active' : '') + '" '
          + 'style="' + bg + '" onclick="cardDesign.bgPreset=' + i + ';updateDesignUI();redrawCard();" title="' + p.name + '">'
          + (cardDesign.bgPreset === i ? '✓' : '')
          + '</button>';
      }).join(''),
      '<input type="color" class="cdp-color-input" id="cdpBgColor" value="#1a1a2e" title="Custom color" '
        + 'onchange="cardDesign.bgPreset=-1;cardDesign.bgCustom=this.value;redrawCard();">',
    '</div>',

    /* Font style */
    '<div class="cdp-label">Font Style</div>',
    '<div class="cdp-pill-row">',
      [['sans','Modern'],['serif','Classic'],['bold','Bold'],['decorative','Elegant']].map(function(f) {
        return '<button class="cdp-pill' + (cardDesign.fontStyle === f[0] ? ' active' : '') + '" '
          + 'onclick="cardDesign.fontStyle=\'' + f[0] + '\';updateDesignUI();redrawCard();">' + f[1] + '</button>';
      }).join(''),
    '</div>',

    /* Text size */
    '<div class="cdp-label">Text Size</div>',
    '<div class="cdp-pill-row">',
      [['small','Small'],['medium','Medium'],['large','Large']].map(function(s) {
        return '<button class="cdp-pill' + (cardDesign.textSize === s[0] ? ' active' : '') + '" '
          + 'onclick="cardDesign.textSize=\'' + s[0] + '\';updateDesignUI();redrawCard();">' + s[1] + '</button>';
      }).join(''),
    '</div>',

    /* Text colour */
    '<div class="cdp-label">Text Colour</div>',
    '<div class="cdp-row">',
      [['#ffffff','White'],['#ffd700','Gold ✨'],['#222222','Dark']].map(function(c) {
        return '<button class="cdp-swatch cdp-text-swatch' + (cardDesign.textColor === c[0] ? ' active' : '') + '" '
          + 'style="background:' + c[0] + ';border:2px solid rgba(255,255,255,0.3);" '
          + 'onclick="cardDesign.textColor=\'' + c[0] + '\';updateDesignUI();redrawCard();" title="' + c[1] + '">'
          + (cardDesign.textColor === c[0] ? '✓' : '') + '</button>';
      }).join(''),
      '<input type="color" class="cdp-color-input" id="cdpTextColor" value="#ffffff" title="Custom text color" '
        + 'onchange="cardDesign.textColor=this.value;redrawCard();">',
    '</div>',

    /* Border / Frame */
    '<div class="cdp-label">Border / Frame</div>',
    '<div class="cdp-pill-row">',
      [['none','None'],['double','Classic'],['glow','Glow'],['gold','Gold 🌟']].map(function(b) {
        return '<button class="cdp-pill' + (cardDesign.borderStyle === b[0] ? ' active' : '') + '" '
          + 'onclick="cardDesign.borderStyle=\'' + b[0] + '\';updateDesignUI();redrawCard();">' + b[1] + '</button>';
      }).join(''),
    '</div>',

    /* Watermark toggle */
    '<div class="cdp-label">Watermark</div>',
    '<div class="cdp-row">',
      '<label class="cdp-toggle"><input type="checkbox" id="cdpWatermark"' + (cardDesign.showWatermark ? ' checked' : '') + ' '
        + 'onchange="cardDesign.showWatermark=this.checked;redrawCard();"> Show "Made with Clarix AI"</label>',
    '</div>',

    '</div>' /* cdp-body */
  ].join('');

  wrap.appendChild(panel);
}

function updateDesignUI() {
  /* Refresh active states on all swatches/pills without full re-render */
  var panel = document.getElementById('cardDesignPanel');
  if (!panel) return;
  panel.querySelectorAll('.cdp-pill').forEach(function(el) {
    var txt = el.textContent.trim().toLowerCase();
    var isActive = (
      cardDesign.fontStyle === txt.split(' ')[0] ||
      cardDesign.textSize  === txt ||
      cardDesign.borderStyle === txt.replace(' 🌟','') ||
      (txt === 'classic' && cardDesign.borderStyle === 'double') ||
      (txt === 'elegant' && cardDesign.fontStyle === 'decorative')
    );
    /* Let onclick handle active class to keep it simple */
  });
}

/* ── Share buttons row ── */
function appendShareButtons(wrap, gradColors) {
  var existing = wrap.querySelector('.studio-share-row');
  if (existing) existing.remove();

  var btnRow = document.createElement('div');
  btnRow.className = 'studio-share-row';
  btnRow.style.cssText = 'display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;';

  var dlBtn = document.createElement('button');
  dlBtn.textContent = '⬇️ Download';
  dlBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:linear-gradient(135deg,'
    + (gradColors[0]||'#ff7043') + ',' + (gradColors[1]||'#ff5722') + ');border:none;color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  dlBtn.onclick = function() { studioTipAction('download'); };
  btnRow.appendChild(dlBtn);

  var shareBtn = document.createElement('button');
  shareBtn.textContent = '📤 Share';
  shareBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:rgba(255,112,67,0.15);border:1px solid rgba(255,112,67,0.5);color:#ff7043;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  shareBtn.onclick = function() { studioTipAction('share'); };
  btnRow.appendChild(shareBtn);

  var wpBtn = document.createElement('button');
  wpBtn.textContent = '💬 WhatsApp';
  wpBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:rgba(37,211,102,0.13);border:1px solid rgba(37,211,102,0.5);color:#25d366;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  wpBtn.onclick = function() { studioTipAction('whatsapp'); };
  btnRow.appendChild(wpBtn);

  var igBtn = document.createElement('button');
  igBtn.textContent = '📸 Instagram';
  igBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:rgba(225,48,108,0.12);border:1px solid rgba(225,48,108,0.45);color:#e1306c;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  igBtn.onclick = function() { studioTipAction('instagram'); };
  btnRow.appendChild(igBtn);

  wrap.appendChild(btnRow);
}

/* ── Share / Download Actions ── */
function studioTipAction(type) {
  var canvas = window._festivalCanvas;
  var text   = window._festivalText || '';
  var name   = (window._festivalName || 'my-card').toLowerCase().replace(/\s+/g, '-');
  var msg    = text.substring(0, 300) + '\n\n✨ Made with Clarix AI · clarix.digital';

  if (!canvas) {
    Toast.show('Generate a card first! 🎉', 'error'); return;
  }

  /* ── Native Share Sheet (Android/iOS) ── */
  if (type === 'share' || (type === 'whatsapp' && navigator.share && navigator.canShare)) {
    canvas.toBlob(function(blob) {
      var file = new File([blob], 'clarix-' + name + '-card.png', { type: 'image/png' });
      var shareData = { files: [file], text: msg, title: 'Festival Card from Clarix AI' };
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
          .then(function() { Toast.show('🎉 Shared successfully!', 'success'); })
          .catch(function(err) {
            if (err.name !== 'AbortError') {
              /* Share was cancelled by user or failed — fallback to download */
              studioTipAction('download');
            }
          });
        return;
      }
      /* Desktop fallback — download */
      studioTipAction('download');
    }, 'image/png');
    return;
  }

  if (type === 'download') {
    var a = document.createElement('a');
    a.download = 'clarix-' + name + '-card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    Toast.show('📥 Card downloaded!', 'success');

  } else if (type === 'whatsapp') {
    /* Desktop fallback — download + open WhatsApp web */
    var a2 = document.createElement('a');
    a2.download = 'clarix-' + name + '-card.png';
    a2.href = canvas.toDataURL('image/png');
    a2.click();
    setTimeout(function() {
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener noreferrer');
      Toast.show('📥 Image saved — attach it in WhatsApp!', 'success', 5000);
    }, 700);

  } else if (type === 'instagram') {
    var a3 = document.createElement('a');
    a3.download = 'clarix-' + name + '-card.png';
    a3.href = canvas.toDataURL('image/png');
    a3.click();
    var caption = text.substring(0, 400) + '\n\n✨ Made with Clarix AI · clarix.digital';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(caption).then(function() {
        Toast.show('📸 Image saved + caption copied! Upload to Instagram.', 'success', 5000);
      });
    } else {
      Toast.show('📸 Image downloaded! Open Instagram and upload it.', 'success', 4000);
    }
    setTimeout(function() { window.open('https://www.instagram.com/', '_blank', 'noopener noreferrer'); }, 900);
  }
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
   GROQ PROMPT BUILDERS — via /api/studio proxy
════════════════════════════════════════════ */
async function groqCall(base64, mime, prompt) {
  /* Get Firebase auth token.
     Priority: ClarixAuth (compat SDK — always resolved by the time user clicks)
               → ClarixFirebase (modular SDK — async init, may be slower on mobile) */
  var user = null;

  /* 1. ClarixAuth (compat SDK) — fastest, already loaded synchronously */
  if (typeof ClarixAuth !== 'undefined' && ClarixAuth.currentUser) {
    user = ClarixAuth.currentUser;
  }

  /* 2. ClarixFirebase (modular SDK) — wait up to 5s if compat SDK not available */
  if (!user && typeof ClarixFirebase !== 'undefined') {
    user = await new Promise(function(resolve) {
      var timer = setTimeout(function() { resolve(ClarixFirebase.getUser()); }, 5000);
      ClarixFirebase.onAuthChange(function(u) { clearTimeout(timer); resolve(u); });
    });
  }

  var token = '';
  if (user && typeof user.getIdToken === 'function') {
    /* forceRefresh:false — use cached token (auto-refreshes when < 5 min left).
       forceRefresh:true caused network round-trip on every Generate click,
       which failed on slow mobile connections. */
    try { token = await user.getIdToken(false); } catch(e) { token = ''; }
  }
  if (!token) {
    throw new Error('Please sign in to use Creative Studios.');
  }

  var res = await fetch('/api/studio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      prompt:      prompt,
      imageBase64: base64 || null,
      imageMime:   mime   || null
    })
  });

  if (!res.ok) {
    var errData = {};
    try { errData = await res.json(); } catch(e) {}
    throw new Error(errData.error || 'Studio error ' + res.status);
  }

  return res.json();
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
