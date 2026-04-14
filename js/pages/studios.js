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
  },
  {
    id:'docanalyzer', emoji:'📄', name:'Document Analyzer',
    sub:'Upload PDF, DOCX or TXT — get slides, charts & AI insights',
    badge:'AI Insights', css:'studio-doc',
    heroBg:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60',
    desc:'Turn any business document into a GAMMA-style slide deck with charts, key insights and executive summary.',
    tips:['📄 Supports PDF, DOCX & TXT','📊 Auto or manual chart type','🖥️ Export as HTML slide deck','💼 Perfect for reports & proposals'],
    options:{
      'Output Style':['Slide Deck','Executive Summary','Full Report'],
      'Tone':['Professional','Concise','Detailed']
    },
    placeholder:'Add context (e.g. "Q3 sales report for our SaaS startup in Mumbai")',
    analyzeLabel:'✨ Analyze Document',
    promptFn:'docanalyzer',
    hasDocUpload: true,
    hasUpload: false
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

/* ── Document Analyzer State ── */
var docExtractedText = '';
var docFileName = '';
var docChartMode = 'auto';
var _currentDocResult = null;
var _currentDocSlideIdx = 0;
var docDirectChartData   = null; /* Real Excel cell data — bypasses AI chart estimation */

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
  docExtractedText = ''; docFileName = '';
  docChartMode = 'auto'; _currentDocResult = null; _currentDocSlideIdx = 0; docDirectChartData = null;
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

  /* ── Document Upload (Document Analyzer only) ── */
  var docUpload = '';
  if (s.hasDocUpload) {
    docUpload = '<div class="studio-options-label">📄 Upload Your Document</div>'
      + '<div class="doc-upload-zone" id="docDropZone"'
      + ' onclick="document.getElementById(\'docFileInput\').click()"'
      + ' ondragover="docDragOver(event)" ondrop="docDrop(event)">'
      + '<div style="font-size:40px">📄</div>'
      + '<div style="font-size:14px;font-weight:700;color:#fff;margin-top:8px">Tap to upload document</div>'
      + '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:6px">PDF, DOCX, TXT, XLSX, XLS, CSV • Max 10MB</div>'
      + '</div>'
      + '<div class="doc-file-status" id="docFileStatus"></div>'
      + '<div class="doc-file-name" id="docFileName"></div>'
      + '<input type="file" id="docFileInput"'
      + ' accept=".pdf,.docx,.txt,.xlsx,.xls,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain,text/csv"'
      + ' style="display:none" onchange="docFileSelected(this.files[0])">';
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

  /* Context + Voice — no templates dropdown, just clean textarea */
  var ctx = '<div class="studio-options-label" style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.9);margin-bottom:8px;">&#10024; Add Your Personal Touch</div>'
    + '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:10px;line-height:1.5;">Add your name, message, or any personal detail to make the output uniquely yours.</div>'
    + '<div class="studio-voice-row">'
    + '<textarea id="studioContext" rows="3" class="studio-textarea" placeholder="' + s.placeholder + '"></textarea>'
    + '<button class="studio-mic-btn" id="studioMicBtn" onclick="toggleStudioVoice()" title="Voice input">🎤</button>'
    + '</div>'
    + '<div class="studio-context-actions">'
    + '<button class="studio-ctx-btn" onclick="clearStudioContext()" title="Clear text">🗑 Clear</button>'
    + '<button class="studio-ctx-btn" onclick="reuseLastContext()" title="Reuse last input">🔄 Reuse Last</button>'
    + '<button class="studio-ctx-btn" onclick="saveStudioDraft()" title="Save as draft" style="color:var(--accent);">💾 Save Draft</button>'
    + '</div>';

  /* Output */
  var out = s.id === 'docanalyzer'
    ? '<div class="studio-output" id="studioOutput"><div id="docAnalyzerOutput"></div></div>'
    : '<div class="studio-output" id="studioOutput">'
      + '<div class="studio-output-label">✨ AI Generated — Choose your variation</div>'
      + '<div id="studioVariations"></div>'
      + (s.id === 'cultural' ? '<div id="festivalCardCanvas" class="festival-canvas-wrap"></div>' : '')
      + '<button class="studio-send-to-write" onclick="sendStudioToWrite()">✍️ Open in Write for more customization →</button>'
      + '</div>';

  document.querySelector('.studio-modal').innerHTML =
    '<button class="studio-modal-close-top" onclick="closeStudio()">✕ Close</button>'
    + hero
    + '<div class="studio-modal-body">'
    + tips + kidsGallery + festSection + upload + docUpload + opts + ctx
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
  /* Document Analyzer: need uploaded doc */
  if (s.id === 'docanalyzer' && !docExtractedText) {
    Toast.show('📄 Please upload a document first', 'error'); return;
  }

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
    else if (s.promptFn === 'docanalyzer') result = await promptDocAnalyzer(context);

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

    if (s.id === 'docanalyzer') {
      renderDocAnalyzerOutput(result);
    } else {
      renderStudioOutput(result);
    }
    saveStudioGenerationToHistory(result);
    if (s.id !== 'docanalyzer') setTimeout(showStudioContinueModal, 1500);
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
  var textWrapMaxY = opts.fromTo ? 800 : 880;
  wrapCanvasText(ctx, text.substring(0, 320), 540, 490, 900, lineHeight, textWrapMaxY);

  /* ── From / To (professional bottom section) ── */
  if (opts.fromTo) {
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    ctx.moveTo(160, 858); ctx.lineTo(920, 858);
    ctx.stroke();
    ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.font = 'italic 29px ' + fontFamily;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(opts.fromTo, 540, 900);
    ctx.shadowBlur = 0;
  }

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

  /* Extract "To: X | From: Y" from AI text — render as professional bottom section */
  var fromTo = '';
  var textClean = text;
  var ftMatch = text.match(/(?:To:\s*\S[\w\s]*(?:\s*[|]\s*From:\s*\S[\w\s]*)?|From:\s*\S[\w\s]*(?:\s*[|]\s*To:\s*\S[\w\s]*)?)/i);
  if (ftMatch) {
    fromTo = ftMatch[0].replace(/\s*[|]+\s*/g, '  ·  ').trim();
    textClean = text.replace(ftMatch[0], '').trim();
  }
  window._festivalFromTo = fromTo;

  var canvas = document.createElement('canvas');
  drawFestivalCanvas(canvas, { festival: festival, text: textClean, design: cardDesign, fromTo: fromTo });

  /* Store globally */
  window._festivalCanvas  = canvas;
  window._festivalText    = textClean;
  window._festivalName    = festival.name;
  window._festivalOpts    = { festival: festival, text: textClean };

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

  /* Build from/to — professional separate section (not embedded in message text) */
  var from = fromEl ? fromEl.value.trim() : '';
  if (!from) from = localStorage.getItem('clarix_uname') || '';
  var to   = toEl   ? toEl.value.trim()   : '';
  var ftParts = [];
  if (to)   ftParts.push('To: ' + to);
  if (from) ftParts.push('From: ' + from);
  var fromToLine = ftParts.join('  ·  ');

  /* Full message — fromToLine is a separate canvas section, not inline */
  var fullText = text;

  var wrap = document.getElementById('blankCardCanvas');
  if (!wrap) return;

  var existing = document.getElementById('blankCanvasEl');
  var canvas = existing || document.createElement('canvas');
  canvas.id = 'blankCanvasEl';

  drawFestivalCanvas(canvas, {
    text: fullText, emoji: emoji, title: cleanTitle,
    emoji2: emoji + '  ' + emoji,
    design: cardDesign,
    fromTo: fromToLine
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
    drawFestivalCanvas(canvasEl, { festival: festival, text: text, design: cardDesign, fromTo: window._festivalFromTo || '' });
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


function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxY) {
  var words = text.split(' ');
  var line = '';
  var curY = y;
  var limit = maxY || 880;
  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var w = ctx.measureText(testLine).width;
    if (w > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
      if (curY > limit) break;
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

/* ═══════════════════════════════════════════════
   DOCUMENT ANALYZER ENGINE
   TXT / DOCX / PDF → AI → GAMMA-style slide deck
═══════════════════════════════════════════════ */

/* ── Lazy CDN script loader ── */
function loadScript(url) {
  return new Promise(function(resolve, reject) {
    if (document.querySelector('script[src="' + url + '"]')) { resolve(); return; }
    var s = document.createElement('script');
    s.src = url; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

/* ── TXT parser ── */
function parseTxtDoc(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(e) { resolve(e.target.result || ''); };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/* ── DOCX parser (via JSZip CDN) ── */
async function parseDocxDoc(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  var buf = await file.arrayBuffer();
  var zip = await JSZip.loadAsync(buf);
  var xmlFile = zip.file('word/document.xml');
  if (!xmlFile) throw new Error('Invalid DOCX file — could not read content.');
  var xml = await xmlFile.async('string');
  /* Strip XML tags and normalise whitespace */
  var text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) throw new Error('No readable text found in this DOCX file.');
  return text;
}

/* ── PDF parser (via PDF.js CDN) ── */
async function parsePdfDoc(file) {
  var PDFJS_URL    = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  if (!window.pdfjsLib) {
    await loadScript(PDFJS_URL);
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  }
  var buf = await file.arrayBuffer();
  var pdf;
  try {
    pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
  } catch(e) {
    if (e.name === 'PasswordException') {
      throw new Error('This PDF is password-protected. Please use an unlocked version.');
    }
    throw new Error('Could not read PDF. Please try a different file.');
  }
  var text = '';
  var maxPages = Math.min(pdf.numPages, 25);
  for (var i = 1; i <= maxPages; i++) {
    var page = await pdf.getPage(i);
    var content = await page.getTextContent();
    text += content.items.map(function(item) { return item.str; }).join(' ') + '\n';
  }
  if (!text.trim()) throw new Error('No readable text in this PDF — it may be a scanned image.');
  return text;
}

/* ── Excel parser (via SheetJS CDN) ── */
async function parseXlsxDoc(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
  var buf = await file.arrayBuffer();
  var workbook = XLSX.read(buf, { type: 'array' });
  var text = '';
  workbook.SheetNames.forEach(function(sheetName) {
    var sheet = workbook.Sheets[sheetName];
    var csv   = XLSX.utils.sheet_to_csv(sheet);
    /* Skip completely empty sheets */
    if (csv.replace(/,+/g, '').trim()) {
      text += '=== Sheet: ' + sheetName + ' ===\n' + csv + '\n\n';
    }
  });
  if (!text.trim()) throw new Error('No data found in this Excel file.');
  /* ╔══ Extract real chart data directly from cells (bypasses AI for charting) ══╗ */
  docDirectChartData = extractXlsxChartData(workbook);
  return text;
}


/* ── Extract real chart-ready data directly from Excel cells ── */
function extractXlsxChartData(workbook) {
  /* Find the sheet with the most numeric values */
  var bestSheet = null, bestScore = -1, bestName = '';
  workbook.SheetNames.forEach(function(name) {
    var sheet = workbook.Sheets[name];
    var rows  = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    var count = 0;
    rows.forEach(function(row) {
      row.forEach(function(cell) { if (typeof cell === 'number') count++; });
    });
    if (count > bestScore) { bestScore = count; bestSheet = sheet; bestName = name; }
  });
  if (!bestSheet || bestScore === 0) return null;

  var rows = XLSX.utils.sheet_to_json(bestSheet, { header: 1 });
  /* Filter out completely empty rows */
  rows = rows.filter(function(r) { return r.some(function(c) { return c !== undefined && c !== ''; }); });
  if (rows.length < 2) return null;

  var headerRow = rows[0];
  var dataRows  = rows.slice(1);
  if (!headerRow || headerRow.length < 2 || dataRows.length === 0) return null;

  /* Row labels = first column */
  var labels = dataRows.map(function(r) {
    var v = r[0];
    if (v === undefined || v === '') return '';
    /* Format date serial numbers (Excel dates) */
    if (typeof v === 'number' && v > 20000) {
      try { return XLSX.SSF.format('d-mmm', v); } catch(e) { return String(v); }
    }
    return String(v);
  }).filter(Boolean).slice(0, 24);

  /* Data series = remaining numeric columns (max 6 series) */
  var datasets = [];
  var maxCols  = Math.min(headerRow.length, 7);
  for (var col = 1; col < maxCols; col++) {
    var seriesLabel = String(headerRow[col] !== undefined ? headerRow[col] : ('Series ' + col));
    var values = dataRows.slice(0, labels.length).map(function(r) {
      var v = r[col];
      if (typeof v === 'number') return v;
      var f = parseFloat(String(v).replace(/[,%$₹£€]/g, ''));
      return isNaN(f) ? 0 : f;
    });
    if (values.some(function(v) { return v !== 0; })) {
      datasets.push({ label: seriesLabel, data: values });
    }
  }
  if (datasets.length === 0) return null;

  /* ── Smart data type detection ── */
  var detectedType   = 'bar';
  var detectedReason = 'Comparison data — Grouped bar chart';
  var logScaleRec    = false;

  /* Check if first column looks like time / dates */
  var timeRx = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|q[1-4]|fy|week|day|hour|min|time|date|\d{4})/i;
  var isTime = labels.some(function(l) { return timeRx.test(String(l).trim()); })
    || dataRows.some(function(r) { var v = r[0]; return typeof v === 'number' && v > 40000 && v < 55000; });

  /* Check if first column is numeric (potential XY scatter) */
  var firstNumeric = dataRows.slice(0, Math.min(dataRows.length, 6)).filter(function(r) { return r[0] !== undefined && r[0] !== ''; }).every(function(r) {
    return typeof r[0] === 'number' || (!isNaN(parseFloat(String(r[0]))) && String(r[0]).trim() !== '');
  });

  /* Collect positive values to check range */
  var posVals = [];
  datasets.forEach(function(ds) { ds.data.forEach(function(v) { if (v > 0) posVals.push(v); }); });
  if (posVals.length > 1) {
    var maxV = Math.max.apply(null, posVals);
    var minV = Math.min.apply(null, posVals);
    logScaleRec = (maxV / minV) > 1000;
  }

  if (isTime) {
    detectedType   = 'line';
    detectedReason = 'Time series detected — Line chart';
  } else if (firstNumeric && datasets.length === 1) {
    detectedType   = 'scatter';
    detectedReason = 'XY / Correlation data detected — Scatter plot';
  } else if (datasets.length > 2) {
    detectedType   = 'bar';
    detectedReason = 'Multi-series comparison (' + datasets.length + ' series) — Grouped bar chart';
  } else {
    detectedType   = 'bar';
    detectedReason = 'Comparison data — Bar chart';
  }
  if (logScaleRec) detectedReason += ' · ⚠️ Wide value range — Log scale may help';

  return { labels: labels, datasets: datasets, sheetName: bestName, detectedType: detectedType, detectedReason: detectedReason, logScaleRec: logScaleRec };
}

/* ── File format router ── */
async function parseUploadedDoc(file) {
  var name = (file.name || '').toLowerCase();
  if (name.endsWith('.txt')  || file.type === 'text/plain')                                   return parseTxtDoc(file);
  if (name.endsWith('.csv')  || file.type === 'text/csv')                                      return parseTxtDoc(file); /* CSV is plain text */
  if (name.endsWith('.docx') || file.type.includes('wordprocessingml'))                        return parseDocxDoc(file);
  if (name.endsWith('.pdf')  || file.type === 'application/pdf')                               return parsePdfDoc(file);
  if (name.endsWith('.xlsx') || file.type.includes('spreadsheetml'))                           return parseXlsxDoc(file);
  if (name.endsWith('.xls')  || file.type === 'application/vnd.ms-excel')                     return parseXlsxDoc(file);
  if (name.endsWith('.doc'))  throw new Error('Old .doc format not supported. Please save as .docx and try again.');
  throw new Error('Unsupported file type. Please upload PDF, DOCX, TXT, XLSX, XLS, or CSV.');
}

/* ── Drag & Drop handlers (for doc upload zone) ── */
function docDragOver(e) { e.preventDefault(); var z = document.getElementById('docDropZone'); if (z) z.classList.add('dragover'); }
function docDrop(e) {
  e.preventDefault();
  var z = document.getElementById('docDropZone');
  if (z) z.classList.remove('dragover');
  var f = e.dataTransfer.files[0];
  if (f) docFileSelected(f);
}

/* ── File selected handler ── */
function docFileSelected(file) {
  if (!file) return;
  var statusEl = document.getElementById('docFileStatus');
  var nameEl   = document.getElementById('docFileName');
  if (nameEl)   nameEl.textContent   = file.name;
  if (statusEl) { statusEl.textContent = '\u23f3 Reading file\u2026'; statusEl.style.color = 'rgba(255,255,255,0.6)'; }

  parseUploadedDoc(file).then(function(text) {
    docExtractedText = text.substring(0, 8000);
    docFileName      = file.name;
    var wordCount    = text.split(/\s+/).length;
    if (statusEl) {
      var baseMsg = '\u2705 Ready \u2014 ~' + wordCount.toLocaleString() + ' words extracted';
      /* For Excel: show data shape + detected chart type */
      if (docDirectChartData) {
        var rows = docDirectChartData.labels.length;
        var cols = docDirectChartData.datasets.length + 1;
        baseMsg = '\u2705 ' + rows + ' rows \u00d7 ' + cols + ' columns \u2014 ' + docDirectChartData.detectedReason;
      }
      statusEl.textContent = baseMsg;
      statusEl.style.color = '#4ade80';
    }
    Toast.show('\ud83d\udcc4 Document loaded! Click Analyze to generate insights.', 'success', 3500);
  }).catch(function(err) {
    docExtractedText = '';
    if (statusEl) { statusEl.textContent = '\u274c ' + (err.message || 'Could not read file'); statusEl.style.color = '#f87171'; }
    Toast.show('\u274c ' + (err.message || 'Could not read file'), 'error');
  });
}

/* ── AI prompt builder for Document Analyzer ── */
async function promptDocAnalyzer(context) {
  if (!docExtractedText) throw new Error('Please upload a document first.');

  var outputStyle = selectedOptions['Output Style'] || 'Slide Deck';
  var tone        = selectedOptions['Tone']         || 'Professional';
  var chartHint   = (docChartMode !== 'auto') ? 'Preferred chart type: ' + docChartMode + '. ' : '';
  var textSample  = docExtractedText.substring(0, 3000);
  var truncated   = docExtractedText.length > 3000;

  var p = 'You are an expert business analyst and presentation designer.\n'
    + 'Analyze this document carefully:\n\n'
    + '--- DOCUMENT START ---\n' + textSample + '\n'
    + (truncated ? '[Document continues \u2014 this is an excerpt]\n' : '')
    + '--- DOCUMENT END ---\n\n'
    + (context ? 'User context: "' + context + '"\n\n' : '')
    + 'Output Style: ' + outputStyle + ' | Tone: ' + tone + '\n'
    + chartHint + '\n'
    + 'Return ONLY valid JSON — no extra text, no markdown fences:\n'
    + '{'
    + '"title":"short doc title (max 8 words)",'
    + '"summary":"3-sentence executive summary",'
    + '"keyPoints":["insight 1","insight 2","insight 3","insight 4","insight 5"],'
    + '"stats":['
    +   '{"label":"Metric name","value":"number or %","trend":"up|down|neutral"},'
    +   '{"label":"Metric 2","value":"value","trend":"neutral"}'
    + '],'
    + '"chartData":{"type":"bar","labels":["label1","label2","label3"],"values":[40,60,30],"unit":"%"},'
    + '"recommendations":["action 1","action 2","action 3"],'
    + '"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5"]'
    + '}\n\n'
    + 'RULES: Extract real numbers from the document. If no numeric data exists, infer plausible metrics. Always return valid JSON only.';

  return groqCall(null, null, p);
}

/* ── Render GAMMA-style output ── */
function renderDocAnalyzerOutput(result) {
  _currentDocResult   = result;
  _currentDocSlideIdx = 0;

  /* Apply manual chart type override */
  if (docChartMode !== 'auto' && result.chartData) result.chartData.type = docChartMode;

  var out       = document.getElementById('studioOutput');
  var container = document.getElementById('docAnalyzerOutput');
  if (!out || !container) return;

  out.classList.add('visible');
  container.innerHTML = buildDocOutputHTML(result);
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  /* Render charts after DOM is ready */
  setTimeout(function() { renderDocChart(result); }, 250);
}

/* ── Build full output HTML ── */
function buildDocOutputHTML(result) {
  var title           = result.title           || 'Document Analysis';
  var summary         = result.summary         || '';
  var keyPoints       = result.keyPoints       || [];
  var stats           = result.stats           || [];
  var recommendations = result.recommendations || [];
  var hashtags        = result.hashtags        || [];

  /* Stats strip */
  var statsHtml = '';
  if (stats.length > 0) {
    statsHtml = '<div class="doc-stats-row">';
    stats.forEach(function(s) {
      var icons = { up: '\u2191', down: '\u2193', neutral: '\u2192' };
      var classes = { up: 'trend-up', down: 'trend-down', neutral: 'trend-neutral' };
      statsHtml += '<div class="doc-stat-card">'
        + '<div class="doc-stat-value">' + s.value
        + ' <span class="doc-stat-trend ' + (classes[s.trend] || 'trend-neutral') + '">' + (icons[s.trend] || '\u2192') + '</span></div>'
        + '<div class="doc-stat-label">' + s.label + '</div>'
        + '</div>';
    });
    statsHtml += '</div>';
  }

  /* Slides data */
  var slides = [
    { idx: 0, type: 'title',  heading: title,                   content: summary },
    { idx: 1, type: 'points', heading: '\ud83d\udd11 Key Insights',       content: keyPoints },
    { idx: 2, type: 'chart',  heading: '\ud83d\udcca Data Analysis',       content: null },
    { idx: 3, type: 'recs',   heading: '\ud83d\ude80 Recommendations',     content: recommendations }
  ];

  var slidesHtml = '<div class="doc-slide-deck" id="docSlideDeck">';
  slides.forEach(function(slide) {
    slidesHtml += '<div class="doc-slide' + (slide.idx === 0 ? ' active' : '') + '" data-idx="' + slide.idx + '">';
    slidesHtml += '<div class="doc-slide-num">Slide ' + (slide.idx + 1) + ' / ' + slides.length + '</div>';
    slidesHtml += '<div class="doc-slide-heading">' + slide.heading + '</div>';

    if (slide.type === 'title') {
      slidesHtml += '<div class="doc-slide-summary">' + slide.content + '</div>';
    } else if (slide.type === 'points') {
      slidesHtml += '<ul class="doc-slide-points">';
      (slide.content || []).forEach(function(pt) { slidesHtml += '<li>' + pt + '</li>'; });
      slidesHtml += '</ul>';
    } else if (slide.type === 'chart') {
      /* Detection banner — shown for Excel uploads */
      slidesHtml += '<div class="doc-detect-banner" id="docDetectBanner">';
      if (docDirectChartData && docDirectChartData.detectedReason) {
        slidesHtml += '\ud83d\udd0d ' + docDirectChartData.detectedReason;
      }
      slidesHtml += '</div>';
      slidesHtml += '<div class="doc-chart-wrap"><canvas id="docMainChart" height="200"></canvas></div>';
      slidesHtml += '<div class="doc-chart-source" id="docChartSource"></div>';
      /* Chart type picker — includes Scatter */
      slidesHtml += '<div class="doc-chart-picker"><span class="doc-chart-picker-label">Chart type:</span>';
      [['auto','\ud83d\udd04 Auto'],['bar','\ud83d\udcca Bar'],['line','\ud83d\udcc8 Line'],['scatter','\u25e6 Scatter'],['pie','\ud83e\udd67 Pie'],['none','\u2296 Hide']].forEach(function(t) {
        slidesHtml += '<button class="doc-chart-type-btn' + (docChartMode === t[0] ? ' active' : '') + '" onclick="setDocChartMode(\'' + t[0] + '\')">'
          + t[1] + '</button>';
      });
      slidesHtml += '</div>';
    } else if (slide.type === 'recs') {
      slidesHtml += '<ol class="doc-slide-recs">';
      (slide.content || []).forEach(function(r) { slidesHtml += '<li>' + r + '</li>'; });
      slidesHtml += '</ol>';
      if (hashtags.length > 0) slidesHtml += '<div class="doc-hashtags">' + hashtags.join(' ') + '</div>';
    }
    slidesHtml += '</div>'; /* .doc-slide */
  });
  slidesHtml += '</div>'; /* .doc-slide-deck */

  /* Navigator */
  var navHtml = '<div class="doc-slide-nav">'
    + '<button class="doc-nav-btn" onclick="navDocSlide(-1)">\u25c4</button>'
    + '<span class="doc-nav-indicator" id="docNavIndicator">Slide 1 / ' + slides.length + '</span>'
    + '<button class="doc-nav-btn" onclick="navDocSlide(1)">\u25ba</button>'
    + '</div>';

  /* Action row */
  var actHtml = '<div class="doc-action-row">'
    + '<button class="doc-action-btn doc-action-primary" onclick="exportDocToPPT()">\ud83c\udfa5 Export PPT</button>'
    + '<button class="doc-action-btn doc-action-secondary" onclick="exportDocToPDF()">\ud83d\udcd1 Export PDF</button>'
    + '<button class="doc-action-btn" onclick="shareDocAnalysis(this)">\ud83d\udd17 Share Link</button>'
    + '<button class="doc-action-btn" onclick="copyDocSummary()">\ud83d\udccb Copy</button>'
    + '</div>';

  return '<div class="doc-output-title">\u2728 ' + title + '</div>'
    + statsHtml + slidesHtml + navHtml + actHtml;
}

/* ── Slide navigation ── */
function navDocSlide(dir) {
  var slides = document.querySelectorAll('.doc-slide');
  if (!slides.length) return;
  slides[_currentDocSlideIdx].classList.remove('active');
  _currentDocSlideIdx = (_currentDocSlideIdx + dir + slides.length) % slides.length;
  slides[_currentDocSlideIdx].classList.add('active');
  var ind = document.getElementById('docNavIndicator');
  if (ind) ind.textContent = 'Slide ' + (_currentDocSlideIdx + 1) + ' / ' + slides.length;
  /* Re-render chart if chart slide is now active */
  if (_currentDocResult && document.querySelector('.doc-slide.active #docMainChart')) {
    setTimeout(function() { renderDocChart(_currentDocResult); }, 100);
  }
}

/* ── Switch chart type (both auto + manual) ── */
function setDocChartMode(type) {
  docChartMode = type;
  document.querySelectorAll('.doc-chart-type-btn').forEach(function(btn) {
    var btnType = btn.getAttribute('onclick').match(/'([^']+)'/);
    btn.classList.toggle('active', btnType && btnType[1] === type);
  });
  if (_currentDocResult) {
    if (_currentDocResult.chartData && type !== 'auto' && type !== 'none') {
      _currentDocResult.chartData.type = type;
    }
    renderDocChart(_currentDocResult);
  }
}

/* ── Render Chart.js chart — uses REAL Excel cell data when available ── */
async function renderDocChart(result) {
  var canvas = document.getElementById('docMainChart');
  if (!canvas) return;
  if (docChartMode === 'none') { canvas.style.display = 'none'; return; }
  canvas.style.display = 'block';

  /* Load Chart.js lazily */
  if (!window.Chart) {
    await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
  }

  /* Destroy previous chart instance */
  if (window._docChartInstance) {
    try { window._docChartInstance.destroy(); } catch(e) {}
    window._docChartInstance = null;
  }

  var palette6 = [
    'rgba(255,112,67,0.85)','rgba(56,189,248,0.85)','rgba(74,222,128,0.85)',
    'rgba(246,173,85,0.85)','rgba(167,139,250,0.85)','rgba(244,114,182,0.85)'
  ];

  /* Decide chart type */
  var chartType;
  if (docChartMode === 'auto') {
    /* For Excel: use detected type. For AI data: use AI suggestion. */
    chartType = docDirectChartData
      ? (docDirectChartData.detectedType || 'bar')
      : ((result && result.chartData && result.chartData.type) || 'bar');
  } else {
    chartType = docChartMode;
  }

  var labels, datasets;

  if (docDirectChartData) {
    /* ╔═ REAL Excel data ═╗ */
    labels = docDirectChartData.labels;

    /* Scatter: combine labels (X) + values (Y) into XY pairs */
    if (chartType === 'scatter') {
      datasets = docDirectChartData.datasets.map(function(ds, i) {
        var c = palette6[i % palette6.length];
        var xVals = docDirectChartData.labels.map(function(l, idx) {
          var n = parseFloat(String(l).replace(/[,%$₹£€]/g, ''));
          return isNaN(n) ? idx : n; /* fall back to row index if X is text */
        });
        return {
          label:           ds.label,
          data:            xVals.map(function(x, idx) { return { x: x, y: ds.data[idx] || 0 }; }),
          backgroundColor: c,
          borderColor:     c,
          pointRadius:     7,
          pointHoverRadius:10,
          showLine:        false
        };
      });
      labels = []; /* Scatter uses numeric X axis, not category labels */
    } else if (chartType === 'pie') {
      /* Pie uses only first series; row labels become slice labels */
      datasets = [{
        label: docDirectChartData.datasets[0].label,
        data:  docDirectChartData.datasets[0].data,
        backgroundColor: palette6,
        borderColor:     'rgba(255,255,255,0.12)',
        borderWidth: 1
      }];
    } else {
      /* Bar / Line: render ALL series (grouped bars or multi-line) */
      datasets = docDirectChartData.datasets.map(function(ds, i) {
        var c = palette6[i % palette6.length];
        return {
          label:           ds.label,
          data:            ds.data,
          backgroundColor: chartType === 'line' ? c.replace('0.85', '0.15') : c,
          borderColor:     c,
          borderWidth:     chartType === 'line' ? 2 : 1,
          fill:            false,
          tension:         0.4,
          pointRadius:     chartType === 'line' ? 4 : 0,
          pointBackgroundColor: c,
          borderRadius:    chartType === 'bar' ? 5 : 0
        };
      });
    }

    /* Update source label */
    var src = document.getElementById('docChartSource');
    if (src) src.textContent = '📊 Real data from sheet: “' + docDirectChartData.sheetName + '”';

  } else if (result && result.chartData) {
    /* ╔═ AI-inferred data (non-Excel files) ═╗ */
    var cd  = result.chartData;
    labels  = cd.labels || ['A','B','C'];
    var unit = cd.unit || '';
    datasets = [{
      label:           result.title || 'Data',
      data:            cd.values   || [40,60,30],
      backgroundColor: chartType === 'line' ? 'rgba(255,112,67,0.1)' : palette6,
      borderColor:     chartType === 'line' ? '#ff7043' : palette6,
      borderWidth:     chartType === 'line' ? 2 : 1,
      fill:            chartType === 'line',
      tension:         0.4,
      pointRadius:     chartType === 'line' ? 5 : 0,
      pointBackgroundColor: '#ff7043'
    }];

    var src2 = document.getElementById('docChartSource');
    if (src2) src2.textContent = '🤖 AI-analyzed data (upload an Excel file for real numbers)';
  } else {
    return; /* Nothing to chart */
  }

  window._docChartInstance = new Chart(canvas, {
    type: chartType,
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartType === 'pie' || datasets.length > 1,
          labels:  { color: '#e0e0e0', font: { size: 11 }, padding: 12 }
        },
        tooltip: {
          mode:      chartType === 'pie' ? 'nearest' : 'index',
          intersect: chartType === 'pie'
        }
      },
      scales: (chartType === 'pie') ? {} : {
        x: {
          type: chartType === 'scatter' ? 'linear' : 'category',
          ticks: { color: 'rgba(255,255,255,0.65)', font: { size: 11 }, maxRotation: 45 },
          grid:  { color: 'rgba(255,255,255,0.05)' }
        },
        y: {
          type: (docDirectChartData && docDirectChartData.logScaleRec && chartType !== 'pie') ? 'logarithmic' : 'linear',
          ticks: { color: 'rgba(255,255,255,0.65)', font: { size: 11 } },
          grid:  { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}

/* ── Download chart as PNG ── */
function downloadDocChart() {
  var canvas = document.getElementById('docMainChart');
  if (!canvas) { Toast.show('Generate analysis first', 'error'); return; }
  var a = document.createElement('a');
  a.download = 'clarix-doc-chart.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  Toast.show('\ud83d\udcca Chart downloaded!', 'success');
}

/* ── Download full HTML deck ── */
function downloadHtmlDeck() {
  var result = _currentDocResult;
  if (!result) { Toast.show('Generate analysis first', 'error'); return; }
  var title = result.title || 'Document Analysis';

  var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + title + ' \u2014 Clarix AI</title>'
    + '<style>'
    + 'body{font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;background:#0d0d0d;color:#fff;margin:0;padding:32px 24px;max-width:800px;margin:0 auto;}'
    + 'h1{font-size:30px;font-weight:900;color:#ff7043;margin-bottom:6px;line-height:1.2;}'
    + '.summary{font-size:15px;line-height:1.8;color:#e0e0e0;margin:16px 0 28px;padding:18px;background:rgba(255,255,255,0.04);border-radius:14px;border-left:4px solid #ff7043;}'
    + '.section-title{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#38bdf8;margin-bottom:12px;}'
    + 'ul,ol{padding-left:20px;}'
    + 'li{margin-bottom:10px;line-height:1.7;color:#e0e0e0;font-size:14px;}'
    + '.stats{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px;}'
    + '.stat{background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:14px;padding:16px;min-width:120px;text-align:center;}'
    + '.stat-val{font-size:26px;font-weight:900;color:#38bdf8;}'
    + '.stat-label{font-size:12px;color:rgba(255,255,255,0.55);margin-top:5px;}'
    + '.hashtags{color:rgba(255,255,255,0.4);font-size:13px;margin-top:16px;}'
    + '.section{margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.06);}'
    + '.footer{margin-top:40px;text-align:center;font-size:12px;color:rgba(255,255,255,0.25);padding-top:16px;}'
    + '</style></head><body>'
    + '<h1>' + title + '</h1>'
    + '<div class="summary">' + (result.summary || '') + '</div>';

  if ((result.stats || []).length > 0) {
    html += '<div class="stats">';
    result.stats.forEach(function(s) {
      html += '<div class="stat"><div class="stat-val">' + s.value + '</div><div class="stat-label">' + s.label + '</div></div>';
    });
    html += '</div>';
  }
  if ((result.keyPoints || []).length > 0) {
    html += '<div class="section"><div class="section-title">\ud83d\udd11 Key Insights</div><ul>';
    result.keyPoints.forEach(function(p) { html += '<li>' + p + '</li>'; });
    html += '</ul></div>';
  }
  if ((result.recommendations || []).length > 0) {
    html += '<div class="section"><div class="section-title">\ud83d\ude80 Recommendations</div><ol>';
    result.recommendations.forEach(function(r) { html += '<li>' + r + '</li>'; });
    html += '</ol></div>';
  }
  if ((result.hashtags || []).length > 0) {
    html += '<div class="hashtags">' + result.hashtags.join(' ') + '</div>';
  }
  html += '<div class="footer">Made with Clarix AI \u00b7 clarix.digital</div></body></html>';

  var blob = new Blob([html], { type: 'text/html' });
  var a = document.createElement('a');
  a.download = 'clarix-' + (title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) + '.html';
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
  Toast.show('\ud83d\udcc4 HTML deck downloaded!', 'success');
}

/* ── Copy summary to clipboard ── */
function copyDocSummary() {
  var result = _currentDocResult;
  if (!result) return;
  var text = (result.title || 'Analysis') + '\n\n'
    + (result.summary || '') + '\n\n'
    + 'Key Insights:\n' + (result.keyPoints || []).map(function(p, i) { return (i + 1) + '. ' + p; }).join('\n') + '\n\n'
    + 'Recommendations:\n' + (result.recommendations || []).map(function(r, i) { return (i + 1) + '. ' + r; }).join('\n');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() { Toast.show('\u2705 Summary copied to clipboard!', 'success'); });
  }
}

/* ═══════════════════════════════════════════════
   EXPORT ENGINE — PPT / PDF / SHARE
═══════════════════════════════════════════════ */

/* ── Helper: navigate to chart slide, capture canvas, restore ── */
async function _captureChartImage() {
  var slides  = document.querySelectorAll('.doc-slide');
  var prevIdx = _currentDocSlideIdx;
  /* Activate the chart slide (index 2) so canvas is visible */
  if (slides.length > 2) {
    slides[prevIdx].classList.remove('active');
    slides[2].classList.add('active');
    _currentDocSlideIdx = 2;
    await renderDocChart(_currentDocResult);
    await new Promise(function(r) { setTimeout(r, 350); });
  }
  var canvas = document.getElementById('docMainChart');
  var imgData = (canvas && window._docChartInstance) ? canvas.toDataURL('image/png', 1.0) : null;
  /* Restore original slide */
  if (slides.length > 2 && prevIdx !== 2) {
    slides[2].classList.remove('active');
    slides[prevIdx].classList.add('active');
    _currentDocSlideIdx = prevIdx;
  }
  return imgData;
}

/* ── Export PowerPoint (.pptx) ── */
async function exportDocToPPT() {
  var result = _currentDocResult;
  if (!result) { Toast.show('Generate analysis first', 'error'); return; }
  Toast.show('\ud83c\udfa5 Building PowerPoint\u2026', 'info', 8000);
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js');
    var chartImg = await _captureChartImage();

    var pptx = new PptxGenJS();
    pptx.layout  = 'LAYOUT_WIDE';
    pptx.title   = result.title || 'Analysis';
    pptx.author  = 'Clarix AI';
    pptx.company = 'clarix.digital';

    var BG = '0f0f1a', C_OR = 'ff7043', C_BL = '38bdf8', C_WH = 'ffffff', C_GR = '9ca3af', C_DK = '1a1a2e';

    function addAccent(slide, color) {
      slide.addShape(pptx.ShapeType ? pptx.ShapeType.rect : 'rect', { x: 0, y: 0, w: '100%', h: 0.07, fill: { color: color } });
    }

    /* Slide 1 – Title */
    var s1 = pptx.addSlide();
    s1.background = { color: BG };
    addAccent(s1, C_OR);
    s1.addText(result.title || 'Document Analysis', {
      x: 0.5, y: 1.6, w: 9, h: 1.4,
      fontSize: 34, bold: true, color: C_WH, align: 'center', wrap: true
    });
    s1.addText('AI-Powered Corporate Analysis', { x: 0.5, y: 3.3, w: 9, h: 0.5, fontSize: 14, color: C_OR, align: 'center' });
    s1.addText('Generated by Clarix AI  \u2022  clarix.digital  \u2022  ' + new Date().toLocaleDateString('en-IN'), {
      x: 0.5, y: 4.9, w: 9, h: 0.4, fontSize: 10, color: C_GR, align: 'center'
    });

    /* Slide 2 – Executive Summary */
    var s2 = pptx.addSlide();
    s2.background = { color: BG };
    addAccent(s2, C_BL);
    s2.addText('Executive Summary', { x: 0.5, y: 0.22, w: 9, h: 0.6, fontSize: 22, bold: true, color: C_BL });
    s2.addText(result.summary || '', { x: 0.5, y: 1.1, w: 9, h: 3.8, fontSize: 14, color: C_WH, wrap: true, valign: 'top', lineSpacingMultiple: 1.5 });

    /* Slide 3 – Key Metrics */
    if ((result.stats || []).length > 0) {
      var s3 = pptx.addSlide();
      s3.background = { color: BG };
      addAccent(s3, C_OR);
      s3.addText('Key Metrics', { x: 0.5, y: 0.22, w: 9, h: 0.6, fontSize: 22, bold: true, color: C_OR });
      var tHead = [[
        { text: 'Metric',  options: { bold: true, color: C_WH, fill: { color: C_DK } } },
        { text: 'Value',   options: { bold: true, color: C_WH, fill: { color: C_DK } } },
        { text: 'Trend',   options: { bold: true, color: C_WH, fill: { color: C_DK } } }
      ]];
      var tRows = result.stats.map(function(s) {
        var t = s.trend === 'up' ? '\u2191 Up' : s.trend === 'down' ? '\u2193 Down' : '\u2192 Stable';
        var tc = s.trend === 'up' ? '4ade80' : s.trend === 'down' ? 'f87171' : C_GR;
        return [
          { text: s.label, options: { color: C_WH } },
          { text: String(s.value), options: { color: C_BL, bold: true } },
          { text: t, options: { color: tc } }
        ];
      });
      s3.addTable(tHead.concat(tRows), {
        x: 1.2, y: 1.1, w: 7.6,
        colW: [4, 2, 1.6],
        border: { type: 'solid', color: '2a2a3e', pt: 1 },
        fill: { color: '16162a' }
      });
    }

    /* Slide 4 – Key Insights */
    if ((result.keyPoints || []).length > 0) {
      var s4 = pptx.addSlide();
      s4.background = { color: BG };
      addAccent(s4, C_BL);
      s4.addText('Key Insights', { x: 0.5, y: 0.22, w: 9, h: 0.6, fontSize: 22, bold: true, color: C_BL });
      var bullets = (result.keyPoints || []).map(function(pt) {
        return { text: pt, options: { bullet: { indent: 15 }, color: C_WH, fontSize: 13, breakLine: true, paraSpaceAfter: 10 } };
      });
      s4.addText(bullets, { x: 0.5, y: 1.1, w: 9, h: 4, valign: 'top', wrap: true });
    }

    /* Slide 5 – Data Analysis (chart image) */
    var s5 = pptx.addSlide();
    s5.background = { color: BG };
    addAccent(s5, C_OR);
    s5.addText('Data Analysis', { x: 0.5, y: 0.22, w: 9, h: 0.6, fontSize: 22, bold: true, color: C_OR });
    if (chartImg) {
      s5.addImage({ data: chartImg, x: 0.8, y: 1.0, w: 8.4, h: 3.8 });
      if (docDirectChartData) {
        s5.addText('Source: ' + docDirectChartData.sheetName, { x: 0.5, y: 5.0, w: 9, h: 0.35, fontSize: 10, color: C_GR, align: 'center' });
      }
    } else {
      s5.addText('Chart data available\u2014navigate to Slide 3 in the app and try again.', { x: 1, y: 2.2, w: 8, h: 1.5, fontSize: 13, color: C_GR, align: 'center' });
    }

    /* Slide 6 – Recommendations */
    if ((result.recommendations || []).length > 0) {
      var s6 = pptx.addSlide();
      s6.background = { color: BG };
      addAccent(s6, C_BL);
      s6.addText('Recommendations', { x: 0.5, y: 0.22, w: 9, h: 0.6, fontSize: 22, bold: true, color: C_BL });
      var recs = (result.recommendations || []).map(function(r, i) {
        return { text: (i + 1) + '.  ' + r, options: { color: C_WH, fontSize: 13, breakLine: true, paraSpaceAfter: 14 } };
      });
      s6.addText(recs, { x: 0.5, y: 1.1, w: 9, h: 4, valign: 'top', wrap: true });
    }

    var fileName = 'Clarix-' + (result.title || 'Analysis').replace(/[^a-zA-Z0-9 ]/g, '').trim() + '.pptx';
    await pptx.writeFile({ fileName: fileName });
    Toast.show('\ud83c\udfa5 PowerPoint downloaded!', 'success');
  } catch(err) {
    console.error('[PPT]', err);
    Toast.show('\u274c PPT export failed: ' + (err.message || 'Unknown error'), 'error');
  }
}

/* ── Export PDF (professional white report) ── */
async function exportDocToPDF() {
  var result = _currentDocResult;
  if (!result) { Toast.show('Generate analysis first', 'error'); return; }
  Toast.show('\ud83d\udcd1 Building PDF report\u2026', 'info', 8000);
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');
    var chartImg = await _captureChartImage();

    var jsPDF = window.jspdf.jsPDF;
    var pdf   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    var W = 210, H = 297, mg = 18, cw = W - mg * 2;
    var y = 0;

    function bg() { pdf.setFillColor(255, 255, 255); pdf.rect(0, 0, W, H, 'F'); }
    function newPage() { pdf.addPage(); y = 22; bg(); }
    function needY(n) { if (y + n > 278) newPage(); }
    function sectionHeader(label, r, g, b) {
      needY(14);
      pdf.setFillColor(r, g, b);
      pdf.rect(mg, y, cw, 7, 'F');
      pdf.setFontSize(10); pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text(label, mg + 4, y + 4.8);
      y += 11;
    }

    /* ── Cover Page ── */
    bg();
    pdf.setFillColor(15, 15, 26);
    pdf.rect(0, 0, W, 46, 'F');
    pdf.setFillColor(255, 112, 67);
    pdf.rect(0, 0, W, 4, 'F');
    pdf.setFontSize(24); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(255, 255, 255);
    var tLines = pdf.splitTextToSize(result.title || 'Document Analysis', cw);
    pdf.text(tLines, W / 2, 20, { align: 'center' });
    pdf.setFontSize(11); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(255, 112, 67);
    pdf.text('AI-Powered Corporate Analysis', W / 2, 20 + tLines.length * 9 + 4, { align: 'center' });

    y = 60;

    /* ── Executive Summary ── */
    sectionHeader('EXECUTIVE SUMMARY', 56, 189, 248);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11); pdf.setTextColor(30, 30, 50);
    var sumLines = pdf.splitTextToSize(result.summary || '', cw);
    sumLines.forEach(function(line) { needY(6); pdf.text(line, mg, y); y += 5.8; });
    y += 8;

    /* ── Key Metrics Table ── */
    if ((result.stats || []).length > 0) {
      sectionHeader('KEY METRICS', 255, 112, 67);
      pdf.autoTable({
        startY: y,
        margin: { left: mg, right: mg },
        head: [['Metric', 'Value', 'Trend']],
        body: result.stats.map(function(s) {
          return [s.label, s.value, s.trend === 'up' ? '\u2191 Up' : s.trend === 'down' ? '\u2193 Down' : '\u2192 Stable'];
        }),
        headStyles: { fillColor: [26, 26, 46], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fillColor: [248, 248, 252], textColor: [30, 30, 50], fontSize: 10 },
        alternateRowStyles: { fillColor: [238, 238, 248] },
        styles: { cellPadding: 4, lineColor: [200, 200, 220], lineWidth: 0.3 },
        columnStyles: { 1: { fontStyle: 'bold' } }
      });
      y = pdf.lastAutoTable.finalY + 10;
    }

    /* ── Key Insights ── */
    if ((result.keyPoints || []).length > 0) {
      sectionHeader('KEY INSIGHTS', 56, 189, 248);
      result.keyPoints.forEach(function(pt, i) {
        var pLines = pdf.splitTextToSize('\u25b8  ' + pt, cw - 6);
        needY(pLines.length * 5.5 + 3);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10.5); pdf.setTextColor(30, 30, 50);
        pdf.text(pLines, mg + 2, y);
        y += pLines.length * 5.5 + 4;
      });
      y += 4;
    }

    /* ── Data Analysis Chart ── */
    if (chartImg) {
      newPage();
      sectionHeader('DATA ANALYSIS', 255, 112, 67);
      var chartH = 82;
      needY(chartH + 10);
      pdf.addImage(chartImg, 'PNG', mg, y, cw, chartH);
      y += chartH + 4;
      if (docDirectChartData) {
        pdf.setFontSize(9); pdf.setFont('helvetica', 'italic'); pdf.setTextColor(120, 120, 160);
        pdf.text('Source: ' + docDirectChartData.sheetName, mg, y);
        y += 8;
      }
    }

    /* ── Recommendations ── */
    if ((result.recommendations || []).length > 0) {
      needY(20);
      sectionHeader('RECOMMENDATIONS', 56, 189, 248);
      result.recommendations.forEach(function(r, i) {
        var rLines = pdf.splitTextToSize((i + 1) + '.  ' + r, cw - 6);
        needY(rLines.length * 5.5 + 4);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10.5); pdf.setTextColor(30, 30, 50);
        pdf.text(rLines, mg + 2, y);
        y += rLines.length * 5.5 + 5;
      });
    }

    /* ── Footer on every page ── */
    var pages = pdf.internal.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      pdf.setPage(p);
      pdf.setDrawColor(200, 200, 220); pdf.line(mg, 286, W - mg, 286);
      pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(150, 150, 180);
      pdf.text('Clarix AI  \u2022  clarix.digital', mg, 291);
      pdf.text('Page ' + p + ' of ' + pages, W - mg, 291, { align: 'right' });
    }

    var fn = 'Clarix-' + (result.title || 'Analysis').replace(/[^a-zA-Z0-9 ]/g, '').trim() + '.pdf';
    pdf.save(fn);
    Toast.show('\ud83d\udcd1 PDF report downloaded!', 'success');
  } catch(err) {
    console.error('[PDF]', err);
    Toast.show('\u274c PDF export failed: ' + (err.message || 'Unknown error'), 'error');
  }
}

/* ── Share Analysis (Firebase Firestore + public link) ── */
async function shareDocAnalysis(btn) {
  var result = _currentDocResult;
  if (!result) { Toast.show('Generate analysis first', 'error'); return; }

  var user = firebase.auth().currentUser;
  if (!user) { Toast.show('\ud83d\udd12 Please sign in to share', 'error'); return; }

  var origText = btn.textContent;
  btn.disabled = true; btn.textContent = '\u23f3 Saving\u2026';

  try {
    var reportData = {
      userId:          user.uid,
      userName:        user.displayName || 'Clarix User',
      title:           result.title || 'Document Analysis',
      summary:         result.summary || '',
      keyPoints:       result.keyPoints || [],
      stats:           result.stats || [],
      recommendations: result.recommendations || [],
      hashtags:        result.hashtags || [],
      chartData:       result.chartData || null,
      directChartData: docDirectChartData || null,
      fileName:        docFileName || '',
      isPublic:        true,
      createdAt:       firebase.firestore.FieldValue.serverTimestamp(),
      expiresAt:       new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) /* 30 days */
    };

    var ref = await firebase.firestore().collection('sharedReports').add(reportData);
    var url = 'https://clarix.digital/view?id=' + ref.id;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      Toast.show('\ud83d\udd17 Share link copied! Valid for 30 days.', 'success', 6000);
    } else {
      window.prompt('Copy this link:', url);
    }

    btn.textContent = '\u2705 Link Copied!';
    btn.style.cssText = 'background:rgba(74,222,128,.18);border-color:#4ade80;color:#4ade80';
    setTimeout(function() {
      btn.disabled = false; btn.textContent = origText; btn.style.cssText = '';
    }, 5000);

  } catch(err) {
    console.error('[Share]', err);
    Toast.show('\u274c Share failed: ' + (err.message || 'Try again'), 'error');
    btn.disabled = false; btn.textContent = origText;
  }
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

