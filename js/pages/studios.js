/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CLARIX â€” CREATIVE STUDIOS v3 (clean rewrite)
   Fixed: pill onclick, festival apostrophe, selectPill
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ Image Compression â”€â”€ */
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

/* â”€â”€ Blank canvas mode state â”€â”€ */
var blankCanvasMode = false;

/* â”€â”€ Festival Config â”€â”€ */
var FESTIVALS = [
  { emoji:'ðŸª”', name:'Diwali',           grad:['#ff6b00','#ffc300','#ff8c00'], emoji2:'âœ¨ðŸª”ðŸŽ‡' },
  { emoji:'ðŸŽŠ', name:'Navratri',         grad:['#d63031','#e17055','#fdcb6e'], emoji2:'ðŸŽŠðŸŒ¸ðŸ’ƒ' },
  { emoji:'ðŸŒ™', name:'Eid',              grad:['#00b894','#00cec9','#6c5ce7'], emoji2:'ðŸŒ™â­ðŸ•Œ' },
  { emoji:'ðŸŽ„', name:'Christmas',        grad:['#2d3436','#00b894','#d63031'], emoji2:'ðŸŽ„â„ï¸ðŸŽ' },
  { emoji:'ðŸŽ†', name:'New Year',         grad:['#2d3436','#6c5ce7','#e17055'], emoji2:'ðŸŽ†ðŸ¥‚âœ¨' },
  { emoji:'ðŸŒˆ', name:'Holi',             grad:['#e84393','#00b894','#fdcb6e'], emoji2:'ðŸŒˆðŸŽ¨ðŸ’¦' },
  { emoji:'ðŸ’', name:'Valentines',       grad:['#d63031','#e84393','#fd79a8'], emoji2:'ðŸ’ðŸŒ¹â¤ï¸' },
  { emoji:'ðŸ‡®ðŸ‡³', name:'Republic Day',    grad:['#ff7043','#ffffff','#1a78c2'], emoji2:'ðŸ‡®ðŸ‡³ðŸŽºðŸŒŸ' },
  { emoji:'ðŸŽ‚', name:'Birthday',         grad:['#a29bfe','#fd79a8','#fdcb6e'], emoji2:'ðŸŽ‚ðŸŽ‰ðŸŽˆ' },
  { emoji:'ðŸ†', name:'Dussehra',         grad:['#e17055','#d63031','#fdcb6e'], emoji2:'ðŸ†ðŸ¹âœ¨' },
  { emoji:'ðŸ™', name:'Ganesh Chaturthi', grad:['#fdcb6e','#e17055','#6c5ce7'], emoji2:'ðŸ™ðŸ˜ðŸŒ¸' },
  { emoji:'ðŸŒ¸', name:'Baisakhi',         grad:['#fdcb6e','#00b894','#e17055'], emoji2:'ðŸŒ¾ðŸŒ¸ðŸŽµ' }
];

/* â”€â”€ Kids Style Previews â”€â”€ */
var KIDS_STYLES = [
  { label:'Cartoon / Pixar',   img:'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=200&q=70', desc:'Fun & colorful' },
  { label:'Sketch & Doodle',   img:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&q=70', desc:'Hand-drawn feel' },
  { label:'Storybook',         img:'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200&q=70', desc:'Fairy tale magic' },
  { label:'Superhero Comic',   img:'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=200&q=70', desc:'Hero power!' },
  { label:'Colorful Pop Art',  img:'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=70', desc:'Bold & vibrant' }
];

/* â”€â”€ Studios Config â”€â”€ */
var STUDIOS = [
  {
    id:'kids', emoji:'\uD83D\uDC76', name:'Kids Creator',
    sub:'Fun cartoon-style prompts for young ones',
    badge:'Fun Zone', css:'studio-kids',
    heroBg:'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&q=60',
    desc:'Turn any photo into fun AI prompts for cartoon art, birthday cards & kids content.',
    tips:['ðŸŽ¨ Paste prompt into Midjourney', 'ðŸ–¨ï¸ Print as poster or birthday card', 'ðŸ’¬ Share as WhatsApp sticker', 'ðŸŽ¬ Use as Reel caption'],
    options:{
      'Art Style':['Cartoon / Pixar','Sketch & Doodle','Storybook','Superhero Comic','Colorful Pop Art'],
      'Platform':['Instagram','WhatsApp Sticker','Print / Poster','Birthday Card','Reel Caption']
    },
    placeholder:'Describe the scene (e.g. "my daughter playing with her puppy in the park")',
    analyzeLabel:'âœ¨ Generate Fun Prompts',
    promptFn:'kids'
  },
  {
    id:'corporate', emoji:'\uD83D\uDCBC', name:'Corporate Creator',
    sub:'Professional content for brands & businesses',
    badge:'Business', css:'studio-corp',
    heroBg:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=60',
    desc:'Professional AI prompts for LinkedIn posts, pitch decks, brand ads & business content.',
    tips:['ðŸ’¼ LinkedIn posts get 3x reach with visuals','ðŸ“Š Use for pitch deck descriptions','ðŸ“§ Email campaign headers','ðŸ† Build premium brand imagery'],
    options:{
      'Content Type':['LinkedIn Post','Pitch Deck Visual','Email Campaign','Brand Ad','Team Photo'],
      'Style':['Professional & Clean','Bold & Dynamic','Friendly & Approachable','Premium Luxury']
    },
    placeholder:'Describe your brand (e.g. "our fintech startup team in a modern Mumbai office")',
    analyzeLabel:'âš¡ Generate Pro Prompts',
    promptFn:'corporate'
  },
  {
    id:'cultural', emoji:'\uD83C\uDF89', name:'Cultural Creator',
    sub:'Festival cards with AI text â€” download & share instantly',
    badge:'Festivals', css:'studio-cultural',
    heroBg:'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=800&q=60',
    desc:'Generate beautiful festival cards with AI â€” download and share on WhatsApp & Instagram.',
    tips:['ðŸ’¬ Send as WhatsApp image instantly','ðŸ“¸ Share as Instagram story','ðŸŒ Available in 6 Indian languages','ðŸŽ¨ Beautiful canvas card generated'],
    options:{
      'Language':['English','Hindi','Hinglish','Gujarati','Marathi','Urdu'],
      'Card Style':['Festive & Warm','Minimal & Elegant','Bold & Vibrant','Premium Dark'],
      'Content Type':['WhatsApp Wish','Instagram Post','Business Greeting','Story Caption']
    },
    placeholder:'Add personal touch (e.g. "from our family to yours" or your name/brand)',
    analyzeLabel:'ðŸŽ‰ Generate Festival Card',
    promptFn:'cultural',
    hasFestivals: true
  },
  {
    id:'multilingual', emoji:'\uD83D\uDD24', name:'Multilingual Analyzer',
    sub:'Image with any language text â†’ 2 creative prompts',
    badge:'Language AI', css:'studio-multi',
    heroBg:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=60',
    desc:'Upload any image with Hindi, Marathi, Gujarati, Tamil, Urdu, or Arabic text. AI reads it and generates prompts.',
    tips:['ðŸ‡®ðŸ‡³ Supports 20+ languages','ðŸ“¸ Works on banners, labels, menus','âœï¸ Literal or creative output','ðŸŒ Auto-detects language â€” no setup'],
    options:{
      'Output Platform':['Midjourney','DALL-E / ChatGPT','Instagram','LinkedIn','WhatsApp'],
      'Variation Style':['Literal (stays close)','Creative (artistic)','Both styles']
    },
    placeholder:'Add context (e.g. "this is a Diwali banner from a Pune shop")',
    analyzeLabel:'ðŸ” Detect Language & Analyze',
    promptFn:'multilingual'
  },
  {
    id:'docanalyzer', emoji:'\uD83D\uDCC4', name:'Document Analyzer',
    sub:'Upload PDF, DOCX or TXT â€” get slides, charts & AI insights',
    badge:'AI Insights', css:'studio-doc',
    heroBg:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60',
    desc:'Turn any business document into a GAMMA-style slide deck with charts, key insights and executive summary.',
    tips:['ðŸ“„ Supports PDF, DOCX & TXT','ðŸ“Š Auto or manual chart type','ðŸ–¥ï¸ Export as HTML slide deck','ðŸ’¼ Perfect for reports & proposals'],
    options:{
      'Output Style':['Slide Deck','Executive Summary','Full Report'],
      'Tone':['Professional','Concise','Detailed']
    },
    placeholder:'Add context (e.g. "Q3 sales report for our SaaS startup in Mumbai")',
    analyzeLabel:'âœ¨ Analyze Document',
    promptFn:'docanalyzer',
    hasDocUpload: true,
    hasUpload: false
  }
];

/* â”€â”€ State â”€â”€ */
var activeStudio = null;
var studioFile = null;
var studioDataUrl = null;
var selectedOptions = {};
var selectedFestival = null;
var selectedVariation = null;
var studioVoiceOn = false;
var studioRecognition = null;
var blankCanvasMode = false;

/* â”€â”€ Document Analyzer State â”€â”€ */
var docExtractedText = '';
var docFileName = '';
var docChartMode = 'auto';
var _currentDocResult = null;
var _currentDocSlideIdx = 0;
var docDirectChartData   = null; /* Real Excel cell data â€” bypasses AI chart estimation */

/* â”€â”€ Studio Templates (shown as dropdown in each studio) â”€â”€ */
var STUDIO_TEMPLATES = {
  'kids': [
    { icon: 'ðŸ•', name: 'Kid with Pet',       text: 'My daughter playing with her golden puppy at the park on a sunny day' },
    { icon: 'ðŸ¦¸', name: 'Superhero Child',   text: 'My son dressed as a superhero flying over the city with a colorful cape' },
    { icon: 'ðŸŽ‚', name: 'Birthday Party',   text: 'Kids birthday party with colorful balloons, big cake and confetti everywhere' },
    { icon: 'ðŸŒ³', name: 'Nature Adventure',  text: 'Children exploring an enchanted forest and discovering magical glowing creatures' },
    { icon: 'ðŸŽ®', name: 'Game World',        text: 'My child as a cartoon game character inside a magical pixel adventure world' },
  ],
  'corporate': [
    { icon: 'ðŸ’¼', name: 'Team at Office',    text: 'Our tech startup team in a modern co-working space in Mumbai' },
    { icon: 'ðŸš€', name: 'Product Launch',    text: 'New product launch event with professional stage setup and company branding' },
    { icon: 'ðŸ“Š', name: 'Pitch Deck Visual', text: 'Business pitch presentation for investors in a sleek boardroom setting' },
    { icon: 'ðŸ¤', name: 'Partnership Deal',  text: 'Professional handshake and collaboration between two business leaders' },
    { icon: 'ðŸ†', name: 'Award Ceremony',   text: 'Company awards night with team celebrating excellence and achievement on stage' },
  ],
  'cultural': [
    { icon: 'ðŸª¤', name: 'Diwali Wish',       text: 'From our family to yours â€” wishing you a bright, prosperous and joyful Diwali' },
    { icon: 'ðŸŒˆ', name: 'Holi Greetings',   text: 'May colours of joy and happiness fill your life â€” Happy Holi from all of us' },
    { icon: 'ðŸŽŠ', name: 'New Year',          text: 'Wishing you success, good health, and endless happiness in the new year ahead' },
    { icon: 'ðŸŒ™', name: 'Eid Mubarak',       text: 'Eid Mubarak! May peace, joy and prosperity be yours always this blessed season' },
    { icon: 'ðŸ‘‰', name: 'Business Greeting', text: 'Warm festival greetings from our team to yours â€” wishing you continued growth' },
  ],
  'multilingual': [
    { icon: 'ðŸª§', name: 'Shop Banner',       text: 'This is a Diwali sale banner from a local sweet shop in Pune with Marathi text' },
    { icon: 'ðŸ’Œ', name: 'Wedding Card',      text: 'Hindu wedding invitation card with Sanskrit blessings and traditional floral patterns' },
    { icon: 'ðŸ·ï¸', name: 'Product Label',    text: 'Ayurvedic product label with Hindi description listing herbal ingredients and benefits' },
    { icon: 'ðŸŽ¨', name: 'Cultural Poster',  text: 'Classical Bharatnatyam dance performance poster in Tamil with event details' },
    { icon: 'ðŸ“°', name: 'News Headline',     text: 'Regional Marathi newspaper headline about a local community festival celebration' },
  ],
};

/* â”€â”€ Card Design State â”€â”€ */
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
  { name: 'ðŸŽ¨ Festival', colors: null },
  { name: 'ðŸŒ… Sunset',   colors: ['#ff6b35','#f79d65','#ffecd2'] },
  { name: 'ðŸŒŠ Ocean',    colors: ['#0077b6','#00b4d8','#90e0ef'] },
  { name: 'ðŸŒŒ Night',    colors: ['#03045e','#023e8a','#7b2d8b'] },
  { name: 'ðŸŒ¹ Rose',     colors: ['#b76e79','#dba098','#f0c8b0'] },
  { name: 'ðŸŒ¿ Forest',   colors: ['#1b4332','#40916c','#95d5b2'] }
];

var FONT_MAP = {
  sans:        'Arial, sans-serif',
  serif:       'Georgia, serif',
  bold:        '"Arial Black", Impact, sans-serif',
  decorative:  '"Palatino Linotype", Georgia, serif'
};

var TEXT_SIZE_MAP = { small: 30, medium: 38, large: 50 };

/* â”€â”€ Render Studio Cards â”€â”€ */
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

/* â”€â”€ Open / Close â”€â”€ */
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
    toggle.textContent = 'âœ• Close Custom Card';
    section.classList.add('visible');
    /* Hide festival picker when in blank mode */
    if (festLabel) festLabel.style.display = 'none';
    if (festGrid)  festGrid.style.display  = 'none';
  } else {
    toggle.classList.remove('active');
    toggle.textContent = 'âœï¸ Create Your Own Card â€” No Festival Needed';
    section.classList.remove('visible');
    if (festLabel) festLabel.style.display = '';
    if (festGrid)  festGrid.style.display  = '';
  }
}

/* Gated blank card generator â€” checks trial before drawing */
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
    Toast.show('ðŸŽ¨ Card created! ' + rem + (inTrial ? ' trial' : ' free') + ' prompts remaining.', 'success', 3500);
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
        Toast.show('ðŸ“¥ Image saved â€” upload it to Facebook!', 'success', 4000);
      }, 700);
    } else if (platform === 'twitter') {
      studioTipAction('download');
      setTimeout(function() {
        window.open('https://x.com/compose/tweet', '_blank', 'noopener noreferrer');
        Toast.show('ðŸ“¥ Image saved â€” attach it in your tweet!', 'success', 4000);
      }, 700);
    } else if (platform === 'linkedin') {
      studioTipAction('download');
      setTimeout(function() {
        window.open('https://www.linkedin.com/feed/', '_blank', 'noopener noreferrer');
        Toast.show('ðŸ“¥ Image saved â€” upload it to LinkedIn!', 'success', 4000);
      }, 700);
    } else {
      /* whatsapp, instagram, share â€” handled by studioTipAction */
      studioTipAction(platform);
    }
  }, 600);
}


/* â”€â”€ Build Modal â”€â”€ */
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

  /* Tips â€” always show with clear label */
  var tips = '<div class="studio-how-to-label">ðŸ“Œ How to use this studio:</div>'
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
    kidsGallery = '<div class="studio-options-label">Style Preview â€” Tap to select</div>'
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
      + 'âœï¸ Create Your Own Card â€” No Festival Needed'
      + '</button>'
      + '<div class="blank-canvas-section" id="blankCanvasSection">'

      /* Card type dropdown */
      + '<div class="bcs-label">ðŸŽ‰ Card Type</div>'
      + '<select class="bcs-input" id="blankCardTitleSelect" onchange="updateBlankCardTitle()">'
      + '<option value="">â€” Select Occasion â€”</option>'
      + '<option value="Happy Birthday! ðŸŽ‚">ðŸŽ‚ Birthday</option>'
      + '<option value="Happy Anniversary! ðŸ’">ðŸ’ Anniversary</option>'
      + '<option value="Congratulations! ðŸŽ‰">ðŸŽ‰ Congratulations</option>'
      + '<option value="Thank You! ðŸ™">ðŸ™ Thank You</option>'
      + '<option value="Get Well Soon! ðŸ’">ðŸ’ Get Well Soon</option>'
      + '<option value="Good Luck! ðŸ€">ðŸ€ Good Luck</option>'
      + '<option value="Welcome! ðŸŽŠ">ðŸŽŠ Welcome</option>'
      + '<option value="Happy Retirement! ðŸŒŸ">ðŸŒŸ Retirement</option>'
      + '<option value="Farewell! ðŸ‘‹">ðŸ‘‹ Farewell</option>'
      + '<option value="Custom">âœï¸ Type my own...</option>'
      + '</select>'
      + '<input class="bcs-input" id="blankCardTitle" placeholder="Type your custom title..." maxlength="40" style="display:none;margin-top:8px">'

      /* From â†’ To */
      + '<div class="bcs-label">ðŸ‘¤ From â†’ To</div>'
      + '<div style="display:flex;gap:8px;align-items:center">'
      + '<input class="bcs-input" id="blankCardFrom" placeholder="From (your name / family)" maxlength="30" style="flex:1">'
      + '<span style="color:rgba(255,255,255,0.4);font-size:18px;flex-shrink:0">â†’</span>'
      + '<input class="bcs-input" id="blankCardTo" placeholder="To (recipient name)" maxlength="30" style="flex:1">'
      + '</div>'

      /* Message with voice */
      + '<div class="bcs-label">ðŸ’¬ Your Message</div>'
      + '<div class="studio-voice-row">'
      + '<textarea class="bcs-input" id="blankCardText" rows="3" placeholder="Type your heartfelt message (or tap ðŸŽ¤ to speak)..."></textarea>'
      + '<button class="studio-mic-btn" id="blankMicBtn" onclick="toggleBlankVoice()" title="Voice input">ðŸŽ¤</button>'
      + '</div>'

      /* Emoji */
      + '<div class="bcs-label">Emoji</div>'
      + '<div class="bcs-row"><input class="bcs-input bcs-emoji" id="blankCardEmoji" placeholder="âœ¨" maxlength="4" value="âœ¨">'
      + '<span style="font-size:12px;color:rgba(255,255,255,.4);align-self:center">Paste any emoji here</span></div>'

      /* Share To platform */
      + '<div class="bcs-label">ðŸ“² Share To</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:4px">'
      + '<button class="bcs-social-btn active" id="bsp-whatsapp"   onclick="selectBlankSocial(\'whatsapp\',this)"  style="background:rgba(37,211,102,0.15);border:1.5px solid rgba(37,211,102,0.5);color:#25d366;border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">ðŸ’¬ WhatsApp</button>'
      + '<button class="bcs-social-btn"        id="bsp-instagram"  onclick="selectBlankSocial(\'instagram\',this)"  style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">ðŸ“¸ Instagram</button>'
      + '<button class="bcs-social-btn"        id="bsp-facebook"   onclick="selectBlankSocial(\'facebook\',this)"   style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">ðŸ“˜ Facebook</button>'
      + '<button class="bcs-social-btn"        id="bsp-twitter"    onclick="selectBlankSocial(\'twitter\',this)"    style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">ðŸ¦ Twitter / X</button>'
      + '<button class="bcs-social-btn"        id="bsp-linkedin"   onclick="selectBlankSocial(\'linkedin\',this)"   style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">ðŸ’¼ LinkedIn</button>'
      + '<button class="bcs-social-btn"        id="bsp-print"      onclick="selectBlankSocial(\'print\',this)"      style="background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:10px;padding:10px 4px;font-size:12px;font-weight:700;cursor:pointer;">ðŸ–¨ï¸ Print</button>'
      + '</div>'

      + '<button class="studio-analyze-btn" id="blankGenerateBtn" onclick="generateBlankCardGated()" style="margin-top:14px">ðŸŽ¨ Create My Card</button>'
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
      + '<div style="font-size:40px">ðŸ“·</div>'
      + '<div style="font-size:14px;font-weight:700;color:#fff;margin-top:8px">Tap to upload photo</div>'
      + '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px">or drag &amp; drop</div>'
      + '</div></div>'
      + '<div class="studio-upload-preview" id="studioPreview">'
      + '<img id="studioPreviewImg" src="" alt="Preview">'
      + '<button class="change-photo" onclick="event.stopPropagation();document.getElementById(\'studioFileInput\').click()">ðŸ“· Change</button>'
      + '</div>'
      + '<input type="file" id="studioFileInput" accept="image/*" style="display:none" onchange="studioFileSelected(this.files[0])">';
  }

  /* â”€â”€ Document Upload (Document Analyzer only) â”€â”€ */
  var docUpload = '';
  if (s.hasDocUpload) {
    docUpload = '<div class="studio-options-label">ðŸ“„ Upload Your Document</div>'
      + '<div class="doc-upload-zone" id="docDropZone"'
      + ' onclick="document.getElementById(\'docFileInput\').click()"'
      + ' ondragover="docDragOver(event)" ondrop="docDrop(event)">'
      + '<div style="font-size:40px">ðŸ“„</div>'
      + '<div style="font-size:14px;font-weight:700;color:#fff;margin-top:8px">Tap to upload document</div>'
      + '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:6px">PDF, DOCX, TXT, XLSX, XLS, CSV â€¢ Max 10MB</div>'
      + '</div>'
      + '<div class="doc-file-status" id="docFileStatus"></div>'
      + '<div class="doc-file-name" id="docFileName"></div>'
      + '<input type="file" id="docFileInput"'
      + ' accept=".pdf,.docx,.txt,.xlsx,.xls,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain,text/csv"'
      + ' style="display:none" onchange="docFileSelected(this.files[0])">';
  }

  /* Options â€” index-based onclick avoids ALL special char issues */
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

  /* Context + Voice â€” no templates dropdown, just clean textarea */
  var ctx = '<div class="studio-options-label" style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.9);margin-bottom:8px;">&#10024; Add Your Personal Touch</div>'
    + '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:10px;line-height:1.5;">Add your name, message, or any personal detail to make the output uniquely yours.</div>'
    + '<div class="studio-voice-row">'
    + '<textarea id="studioContext" rows="3" class="studio-textarea" placeholder="' + s.placeholder + '"></textarea>'
    + '<button class="studio-mic-btn" id="studioMicBtn" onclick="toggleStudioVoice()" title="Voice input">ðŸŽ¤</button>'
    + '</div>'
    + '<div class="studio-context-actions">'
    + '<button class="studio-ctx-btn" onclick="clearStudioContext()" title="Clear text">ðŸ—‘ Clear</button>'
    + '<button class="studio-ctx-btn" onclick="reuseLastContext()" title="Reuse last input">ðŸ”„ Reuse Last</button>'
    + '<button class="studio-ctx-btn" onclick="saveStudioDraft()" title="Save as draft" style="color:var(--accent);">ðŸ’¾ Save Draft</button>'
    + '</div>';

  /* Output */
  var out = s.id === 'docanalyzer'
    ? '<div class="studio-output" id="studioOutput"><div id="docAnalyzerOutput"></div></div>'
    : '<div class="studio-output" id="studioOutput">'
      + '<div class="studio-output-label">âœ¨ AI Generated â€” Choose your variation</div>'
      + '<div id="studioVariations"></div>'
      + (s.id === 'cultural' ? '<div id="festivalCardCanvas" class="festival-canvas-wrap"></div>' : '')
      + '<button class="studio-send-to-write" onclick="sendStudioToWrite()">âœï¸ Open in Write for more customization â†’</button>'
      + '</div>';

  document.querySelector('.studio-modal').innerHTML =
    '<button class="studio-modal-close-top" onclick="closeStudio()">âœ• Close</button>'
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
    + '<div class="fpc-sub">Tap Generate to get your card â†“</div>'
    + '</div>';
}

/* â”€â”€ Selection Handlers â”€â”€ */

/* Pill select â€” uses group-index (gi) and pill-index (pi) â€” no string escaping needed */
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

/* Kids style â€” uses index */
function selectKidsStyle(ki) {
  if (ki >= KIDS_STYLES.length) return;
  selectedOptions['Art Style'] = KIDS_STYLES[ki].label;
  var cards = document.querySelectorAll('.kids-style-card');
  for (var i = 0; i < cards.length; i++) cards[i].classList.toggle('active', i === ki);
}

/* Festival select â€” uses index, no apostrophe issues */
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
    + '<div class="fpc-sub">Tap Generate to get your card â†“</div>'
    + '</div>';
  var existing = document.getElementById('festivalPreviewCard');
  var grid     = document.getElementById('festivalGrid');
  if (existing) existing.outerHTML = newHtml;
  else if (grid) grid.insertAdjacentHTML('afterend', newHtml);
}

/* â”€â”€ Drag & Drop â”€â”€ */
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
    Toast.show('ðŸ’¡ For logos: PNG gives best results. JPG may affect quality.', 'info', 5000);
    /* Show warning banner inside the upload zone */
    setTimeout(function() {
      var zone = document.getElementById('studioDropZone');
      if (zone) {
        var warn = document.getElementById('studioLogoWarn');
        if (!warn) {
          warn = document.createElement('div');
          warn.id = 'studioLogoWarn';
          warn.style.cssText = 'margin-top:8px;padding:8px 12px;background:rgba(255,193,7,0.1);border:1px solid rgba(255,193,7,0.3);border-radius:8px;font-size:12px;color:#ffc107;line-height:1.5;';
          warn.innerHTML = 'âš ï¸ <strong>Logo detected as non-PNG.</strong> For best output quality, upload a transparent PNG logo. Your result will be close but may vary.';
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

/* â”€â”€ Voice â”€â”€ */
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
  if (btn) { btn.textContent = 'ðŸ”´'; btn.style.background = 'rgba(255,50,50,0.2)'; }
  Toast.show('ðŸŽ¤ Listening... speak now', 'info', 5000);
}
function stopStudioVoice() {
  if (studioRecognition) { try { studioRecognition.stop(); } catch(e) {} studioRecognition = null; }
  studioVoiceOn = false;
  var btn = document.getElementById('studioMicBtn');
  if (btn) { btn.textContent = 'ðŸŽ¤'; btn.style.background = ''; }
}

/* â”€â”€ Run Studio â”€â”€ */
async function runStudio() {
  var s = activeStudio;
  var btn = document.getElementById('studioAnalyzeBtn');
  var context = (document.getElementById('studioContext') || {}).value || '';
  context = context.trim();
  stopStudioVoice();

  /* â”€â”€ TRIAL / USAGE GATE â”€â”€ */
  if (!ClarixState.canEnhance()) {
    UpgradeModal.show('You\'ve used all your free Creative Studio prompts!');
    return;
  }

  /* In blank canvas mode OR when template text is provided, skip festival requirement.
     promptCultural() already defaults to 'Diwali' when selectedFestival is null. */
  /* Document Analyzer: need uploaded doc */
  if (s.id === 'docanalyzer' && !docExtractedText) {
    Toast.show('ðŸ“„ Please upload a document first', 'error'); return;
  }

  if (s.hasFestivals && !selectedFestival && !blankCanvasMode && !context) {
    Toast.show('Please select a festival first ðŸŽ‰', 'error'); return;
  }

  btn.disabled = true;
  btn.textContent = 'â³ Generating...';
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

    /* â”€â”€ DEDUCT USAGE after success (not before - so failed calls don't waste credits) â”€â”€ */
    ClarixState.incUsage();
    if (typeof updateUsageCounter === 'function') updateUsageCounter();
    if (typeof Sidebar !== 'undefined' && Sidebar.refresh) Sidebar.refresh();

    /* Show remaining trial count */
    var rem = ClarixState.remainingToday();
    var inTrial = ClarixState.isInTrial();
    if (!ClarixState.isPro) {
      Toast.show('âœ… Done! ' + rem + (inTrial ? ' trial' : ' free') + ' prompts remaining.', 'success', 3500);
    } else {
      Toast.show('âœ… Done! Pick a variation below.', 'success', 3000);
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
    Toast.show('âŒ ' + (err.message || 'Something went wrong. Try again.'), 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = s.analyzeLabel;
  }
}


/* â”€â”€ Render Output â”€â”€ */
function renderStudioOutput(result) {
  var out  = document.getElementById('studioOutput');
  var varD = document.getElementById('studioVariations');
  var vars = Array.isArray(result) ? result : [result.variation1, result.variation2].filter(Boolean);

  var html = '';
  for (var i = 0; i < vars.length; i++) {
    html += '<div class="studio-variation' + (i === 0 ? ' selected' : '') + '" onclick="selectVariation(' + i + ')" id="sv' + i + '">'
      + '<div class="studio-variation-num">Variation ' + (i + 1) + (i === 0 ? ' Â· â˜… Recommended' : '') + '</div>'
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
    navigator.clipboard.writeText(text).then(function() { Toast.show('âœ… Copied!', 'success', 2000); });
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

/* â”€â”€ Clear / Reuse / Save Draft helpers â”€â”€ */
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
  Toast.show('Last input restored âœ“', 'success', 2000);
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
  Toast.show('ðŸ’¾ Draft saved!', 'success', 2000);
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
    + '<div style="font-size:30px;margin-bottom:12px;">âœ¨</div>'
    + '<div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px;font-family:var(--font-head);">Great output!</div>'
    + '<div style="font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:24px;line-height:1.6;">What would you like to do next?</div>'
    + '<div style="display:flex;flex-direction:column;gap:10px;">'
    + '<button onclick="document.getElementById(\'clarix-studio-continue\').remove()" style="background:var(--accent);color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;">ðŸ”„ Refine or Enhance More</button>'
    + '<button onclick="document.getElementById(\'clarix-studio-continue\').remove();clearStudioContext()" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;">ðŸŽ¨ Change Style / Options</button>'
    + '<button onclick="sendStudioToWrite()" style="background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;">âœï¸ Open in Write Studio</button>'
    + '<button onclick="document.getElementById(\'clarix-studio-continue\').remove();closeStudio()" style="background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;font-size:13px;padding:8px;">Back to Apps</button>'
    + '</div></div>';
  document.body.appendChild(el);
  el.addEventListener('click', function(e) { if (e.target === el) el.remove(); });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FESTIVAL CANVAS ENGINE â€” Design-System Aware
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* Core drawing function â€” shared by festival card AND blank canvas */
function drawFestivalCanvas(canvas, opts) {
  /* opts: { festival, text, emoji, title, design } */
  var festival = opts.festival || null;
  var text     = opts.text || '';
  var emoji    = opts.emoji || (festival ? festival.emoji : 'âœ¨');
  var emoji2   = opts.emoji2 || (festival ? festival.emoji2 : 'âœ¨ðŸŒŸâœ¨');
  var title    = opts.title || (festival ? festival.name : 'My Card');
  var d        = opts.design || cardDesign;

  var ctx = canvas.getContext('2d');
  canvas.width = 1080; canvas.height = 1080;

  /* â”€â”€ Background â”€â”€ */
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

  /* â”€â”€ Border / Frame â”€â”€ */
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
  /* borderStyle === 'none' â†’ skip */

  /* â”€â”€ Emoji top â”€â”€ */
  ctx.font = '110px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 0;
  ctx.fillText(emoji, 540, 175);

  /* â”€â”€ Title â”€â”€ */
  var fontFamily = FONT_MAP[d.fontStyle] || 'Arial, sans-serif';
  ctx.font = 'bold 70px ' + fontFamily;
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 20;
  ctx.fillStyle = d.textColor || '#ffffff';
  ctx.fillText(title, 540, 290);

  /* â”€â”€ Secondary emoji strip â”€â”€ */
  ctx.shadowBlur = 0;
  ctx.font = '42px serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(emoji2, 540, 390);

  /* â”€â”€ Divider line â”€â”€ */
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
  ctx.moveTo(100, 428); ctx.lineTo(980, 428);
  ctx.stroke();

  /* â”€â”€ Message text (bottom section) â”€â”€ */
  var fontSize   = TEXT_SIZE_MAP[d.textSize] || 38;
  var lineHeight = Math.round(fontSize * 1.6);
  ctx.font       = fontSize + 'px ' + fontFamily;
  ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.fillStyle  = d.textColor || '#ffffff';
  var textWrapMaxY = opts.fromTo ? 800 : 880;
  wrapCanvasText(ctx, text.substring(0, 320), 540, 490, 900, lineHeight, textWrapMaxY);

  /* â”€â”€ From / To (professional bottom section) â”€â”€ */
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

  /* â”€â”€ Watermark â”€â”€ */
  if (d.showWatermark) {
    ctx.shadowBlur = 0;
    ctx.font = '21px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.fillText('Made with Clarix AI  Â·  clarix.digital', 540, 1050);
  }
}

/* â”€â”€ generateFestivalCard â€” called from renderStudioOutput â”€â”€ */
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

  /* Extract "To: X | From: Y" from AI text â€” render as professional bottom section */
  var fromTo = '';
  var textClean = text;
  var ftMatch = text.match(/(?:To:\s*\S[\w\s]*(?:\s*[|]\s*From:\s*\S[\w\s]*)?|From:\s*\S[\w\s]*(?:\s*[|]\s*To:\s*\S[\w\s]*)?)/i);
  if (ftMatch) {
    fromTo = ftMatch[0].replace(/\s*[|]+\s*/g, '  Â·  ').trim();
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

/* â”€â”€ Blank Canvas helpers â”€â”€ */

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
  if (btn) { btn.textContent = 'ðŸ”´'; btn.style.background = 'rgba(255,50,50,0.2)'; }
  Toast.show('ðŸŽ¤ Listeningâ€¦ speak your message', 'info', 5000);
}

function stopBlankVoice() {
  if (_blankRecognition) { try { _blankRecognition.stop(); } catch(e) {} _blankRecognition = null; }
  _blankVoiceOn = false;
  var btn = document.getElementById('blankMicBtn');
  if (btn) { btn.textContent = 'ðŸŽ¤'; btn.style.background = ''; }
}

/* â”€â”€ Show blank canvas section â”€â”€ */
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

/* â”€â”€ Generate blank card (pure canvas â€” no AI required) â”€â”€ */
function generateBlankCardGated() {
  generateBlankCard();
}

function autoShareBlankCard(platform) {
  studioTipAction(platform || 'whatsapp');
}

/* â”€â”€ Social platform selector â”€â”€ */
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

/* â”€â”€ generateBlankCard â€” reads from/to + dropdown title â”€â”€ */
function generateBlankCard() {
  var textEl   = document.getElementById('blankCardText');
  var emojiEl  = document.getElementById('blankCardEmoji');
  var titleSel = document.getElementById('blankCardTitleSelect');
  var titleInp = document.getElementById('blankCardTitle');
  var fromEl   = document.getElementById('blankCardFrom');
  var toEl     = document.getElementById('blankCardTo');

  var text  = (textEl  ? textEl.value.trim()  : '') || 'Happy Celebrations!';
  var emoji = (emojiEl ? emojiEl.value.trim() : '') || 'âœ¨';

  /* Title: dropdown value OR custom input */
  var titleVal = '';
  if (titleSel) {
    titleVal = (titleSel.value === 'Custom') ? (titleInp ? titleInp.value.trim() : '') : titleSel.value;
  }
  var title = titleVal || 'My Card';

  /* Extract just the text without emoji for canvas title */
  var cleanTitle = title.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim() || title;

  /* Build from/to â€” professional separate section (not embedded in message text) */
  var from = fromEl ? fromEl.value.trim() : '';
  if (!from) from = localStorage.getItem('clarix_uname') || '';
  var to   = toEl   ? toEl.value.trim()   : '';
  var ftParts = [];
  if (to)   ftParts.push('To: ' + to);
  if (from) ftParts.push('From: ' + from);
  var fromToLine = ftParts.join('  Â·  ');

  /* Full message â€” fromToLine is a separate canvas section, not inline */
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

/* â”€â”€ redrawCard â€” live re-render when design changes â”€â”€ */
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

/* â”€â”€ Design Control Panel â”€â”€ */
function renderCardControls(wrap) {
  /* Remove old panel if any */
  var old = document.getElementById('cardDesignPanel');
  if (old) old.remove();

  var panel = document.createElement('div');
  panel.id = 'cardDesignPanel';
  panel.className = 'card-design-panel';
  panel.innerHTML = [
    '<div class="cdp-header" onclick="this.parentElement.classList.toggle(\'open\')">',
      '<span>ðŸŽ¨ Customise Card</span>',
      '<span class="cdp-arrow">â–¼</span>',
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
          + (cardDesign.bgPreset === i ? 'âœ“' : '')
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
      [['#ffffff','White'],['#ffd700','Gold âœ¨'],['#222222','Dark']].map(function(c) {
        return '<button class="cdp-swatch cdp-text-swatch' + (cardDesign.textColor === c[0] ? ' active' : '') + '" '
          + 'style="background:' + c[0] + ';border:2px solid rgba(255,255,255,0.3);" '
          + 'onclick="cardDesign.textColor=\'' + c[0] + '\';updateDesignUI();redrawCard();" title="' + c[1] + '">'
          + (cardDesign.textColor === c[0] ? 'âœ“' : '') + '</button>';
      }).join(''),
      '<input type="color" class="cdp-color-input" id="cdpTextColor" value="#ffffff" title="Custom text color" '
        + 'onchange="cardDesign.textColor=this.value;redrawCard();">',
    '</div>',

    /* Border / Frame */
    '<div class="cdp-label">Border / Frame</div>',
    '<div class="cdp-pill-row">',
      [['none','None'],['double','Classic'],['glow','Glow'],['gold','Gold ðŸŒŸ']].map(function(b) {
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
      cardDesign.borderStyle === txt.replace(' ðŸŒŸ','') ||
      (txt === 'classic' && cardDesign.borderStyle === 'double') ||
      (txt === 'elegant' && cardDesign.fontStyle === 'decorative')
    );
    /* Let onclick handle active class to keep it simple */
  });
}

/* â”€â”€ Share buttons row â”€â”€ */
function appendShareButtons(wrap, gradColors) {
  var existing = wrap.querySelector('.studio-share-row');
  if (existing) existing.remove();

  var btnRow = document.createElement('div');
  btnRow.className = 'studio-share-row';
  btnRow.style.cssText = 'display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;';

  var dlBtn = document.createElement('button');
  dlBtn.textContent = 'â¬‡ï¸ Download';
  dlBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:linear-gradient(135deg,'
    + (gradColors[0]||'#ff7043') + ',' + (gradColors[1]||'#ff5722') + ');border:none;color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  dlBtn.onclick = function() { studioTipAction('download'); };
  btnRow.appendChild(dlBtn);

  var shareBtn = document.createElement('button');
  shareBtn.textContent = 'ðŸ“¤ Share';
  shareBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:rgba(255,112,67,0.15);border:1px solid rgba(255,112,67,0.5);color:#ff7043;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  shareBtn.onclick = function() { studioTipAction('share'); };
  btnRow.appendChild(shareBtn);

  var wpBtn = document.createElement('button');
  wpBtn.textContent = 'ðŸ’¬ WhatsApp';
  wpBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:rgba(37,211,102,0.13);border:1px solid rgba(37,211,102,0.5);color:#25d366;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  wpBtn.onclick = function() { studioTipAction('whatsapp'); };
  btnRow.appendChild(wpBtn);

  var igBtn = document.createElement('button');
  igBtn.textContent = 'ðŸ“¸ Instagram';
  igBtn.style.cssText = 'flex:1;min-width:110px;padding:13px 10px;border-radius:12px;background:rgba(225,48,108,0.12);border:1px solid rgba(225,48,108,0.45);color:#e1306c;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--font-body);';
  igBtn.onclick = function() { studioTipAction('instagram'); };
  btnRow.appendChild(igBtn);

  wrap.appendChild(btnRow);
}

/* â”€â”€ Share / Download Actions â”€â”€ */
function studioTipAction(type) {
  var canvas = window._festivalCanvas;
  var text   = window._festivalText || '';
  var name   = (window._festivalName || 'my-card').toLowerCase().replace(/\s+/g, '-');
  var msg    = text.substring(0, 300) + '\n\nâœ¨ Made with Clarix AI Â· clarix.digital';

  if (!canvas) {
    Toast.show('Generate a card first! ðŸŽ‰', 'error'); return;
  }

  /* â”€â”€ Native Share Sheet (Android/iOS) â”€â”€ */
  if (type === 'share' || (type === 'whatsapp' && navigator.share && navigator.canShare)) {
    canvas.toBlob(function(blob) {
      var file = new File([blob], 'clarix-' + name + '-card.png', { type: 'image/png' });
      var shareData = { files: [file], text: msg, title: 'Festival Card from Clarix AI' };
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
          .then(function() { Toast.show('ðŸŽ‰ Shared successfully!', 'success'); })
          .catch(function(err) {
            if (err.name !== 'AbortError') {
              /* Share was cancelled by user or failed â€” fallback to download */
              studioTipAction('download');
            }
          });
        return;
      }
      /* Desktop fallback â€” download */
      studioTipAction('download');
    }, 'image/png');
    return;
  }

  if (type === 'download') {
    var a = document.createElement('a');
    a.download = 'clarix-' + name + '-card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    Toast.show('ðŸ“¥ Card downloaded!', 'success');

  } else if (type === 'whatsapp') {
    /* Desktop fallback â€” download + open WhatsApp web */
    var a2 = document.createElement('a');
    a2.download = 'clarix-' + name + '-card.png';
    a2.href = canvas.toDataURL('image/png');
    a2.click();
    setTimeout(function() {
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener noreferrer');
      Toast.show('ðŸ“¥ Image saved â€” attach it in WhatsApp!', 'success', 5000);
    }, 700);

  } else if (type === 'instagram') {
    var a3 = document.createElement('a');
    a3.download = 'clarix-' + name + '-card.png';
    a3.href = canvas.toDataURL('image/png');
    a3.click();
    var caption = text.substring(0, 400) + '\n\nâœ¨ Made with Clarix AI Â· clarix.digital';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(caption).then(function() {
        Toast.show('ðŸ“¸ Image saved + caption copied! Upload to Instagram.', 'success', 5000);
      });
    } else {
      Toast.show('ðŸ“¸ Image downloaded! Open Instagram and upload it.', 'success', 4000);
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GROQ PROMPT BUILDERS â€” via /api/studio proxy
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
async function groqCall(base64, mime, prompt) {
  /* Get Firebase auth token.
     Priority: ClarixAuth (compat SDK â€” always resolved by the time user clicks)
               â†’ ClarixFirebase (modular SDK â€” async init, may be slower on mobile) */
  var user = null;

  /* 1. ClarixAuth (compat SDK) â€” fastest, already loaded synchronously */
  if (typeof ClarixAuth !== 'undefined' && ClarixAuth.currentUser) {
    user = ClarixAuth.currentUser;
  }

  /* 2. ClarixFirebase (modular SDK) â€” wait up to 5s if compat SDK not available */
  if (!user && typeof ClarixFirebase !== 'undefined') {
    user = await new Promise(function(resolve) {
      var timer = setTimeout(function() { resolve(ClarixFirebase.getUser()); }, 5000);
      ClarixFirebase.onAuthChange(function(u) { clearTimeout(timer); resolve(u); });
    });
  }

  var token = '';
  if (user && typeof user.getIdToken === 'function') {
    /* forceRefresh:false â€” use cached token (auto-refreshes when < 5 min left).
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
    variation1: 'ðŸŒ Language: ' + (raw.detected_language || 'Detected') + '\nðŸ“ Text: "' + (raw.text_found || '') + '"\nðŸ”¤ Meaning: ' + (raw.translation || '') + '\n\n' + (raw.variation1 || ''),
    variation2: raw.variation2 || ''
  };
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DOCUMENT ANALYZER ENGINE
   TXT / DOCX / PDF â†’ AI â†’ GAMMA-style slide deck
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ Lazy CDN script loader â”€â”€ */
function loadScript(url) {
  return new Promise(function(resolve, reject) {
    if (document.querySelector('script[src="' + url + '"]')) { resolve(); return; }
    var s = document.createElement('script');
    s.src = url; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

/* â”€â”€ TXT parser â”€â”€ */
function parseTxtDoc(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(e) { resolve(e.target.result || ''); };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/* â”€â”€ DOCX parser (via JSZip CDN) â”€â”€ */
async function parseDocxDoc(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  var buf = await file.arrayBuffer();
  var zip = await JSZip.loadAsync(buf);
  var xmlFile = zip.file('word/document.xml');
  if (!xmlFile) throw new Error('Invalid DOCX file â€” could not read content.');
  var xml = await xmlFile.async('string');
  /* Strip XML tags and normalise whitespace */
  var text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) throw new Error('No readable text found in this DOCX file.');
  return text;
}

/* â”€â”€ PDF parser (via PDF.js CDN) â”€â”€ */
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
  if (!text.trim()) throw new Error('No readable text in this PDF â€” it may be a scanned image.');
  return text;
}

/* â”€â”€ Excel parser (via SheetJS CDN) â”€â”€ */
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
  /* â•”â•â• Extract real chart data directly from cells (bypasses AI for charting) â•â•â•— */
  docDirectChartData = extractXlsxChartData(workbook);
  return text;
}


/* â”€â”€ Statistics for one data series â”€â”€ */
/* -- Statistics for one data series (full SPC suite) -- */
function _computeStats(values) {
  var nonZero = values.filter(function(v) { return v !== 0 && !isNaN(v); });
  if (nonZero.length === 0) return null;
  var n    = values.length;
  var mean = values.reduce(function(a, b) { return a + b; }, 0) / n;
  var variance = values.reduce(function(a, v) { return a + Math.pow(v - mean, 2); }, 0) / n;
  var std  = Math.sqrt(variance);
  var min  = Math.min.apply(null, values);
  var max  = Math.max.apply(null, values);
  var ucl  = mean + 3 * std;
  var lcl  = Math.max(0, mean - 3 * std);
  /* Moving range for Shewhart individual charts */
  var mr = [];
  for (var i = 1; i < n; i++) mr.push(Math.abs(values[i] - values[i-1]));
  var mrBar = mr.length > 0 ? mr.reduce(function(a,b){return a+b;},0)/mr.length : 0;
  var sigmaWithin = mrBar / 1.128; /* d2=1.128 for subgroup size 2 */
  /* Cp/Cpk estimation (proxy: data range as tolerance) */
  var dataTol = max - min;
  var cp_est  = dataTol > 0 && std > 0 ? (6 * std) / dataTol : null;
  var cpl_est = std > 0 ? (mean - min) / (3 * std) : null;
  var cpu_est = std > 0 ? (max - mean) / (3 * std) : null;
  var cpk_est = (cpl_est !== null && cpu_est !== null) ? Math.min(cpl_est, cpu_est) : null;
  var cpkNote = n >= 25 ? 'calculable' : 'insufficient_n';
  /* Western Electric Rules */
  var weRules = [];
  var rule1 = values.filter(function(v){ return v > ucl || v < lcl; }).length;
  if (rule1 > 0) weRules.push('Rule1: ' + rule1 + ' point(s) outside 3sigma');
  var sig2u = mean + 2*std, sig2l = mean - 2*std;
  var rule2count = 0;
  for (var j = 2; j < n; j++) {
    var w3 = [values[j-2], values[j-1], values[j]];
    if (w3.filter(function(v){ return v > sig2u || v < sig2l; }).length >= 2) rule2count++;
  }
  if (rule2count > 0) weRules.push('Rule2: ' + rule2count + ' occurrence(s) of 2/3 beyond 2sigma');
  var rule3count = 0;
  for (var k = 5; k < n; k++) {
    var up = true, dn = true;
    for (var m = k-4; m <= k; m++) {
      if (values[m] <= values[m-1]) up = false;
      if (values[m] >= values[m-1]) dn = false;
    }
    if (up || dn) rule3count++;
  }
  if (rule3count > 0) weRules.push('Rule3: ' + rule3count + ' run(s) of 6 consecutive trending points');
  var rule4count = 0;
  for (var r4 = 7; r4 < n; r4++) {
    var sa = true, sb = true;
    for (var rj = r4-7; rj <= r4; rj++) {
      if (values[rj] <= mean) sa = false;
      if (values[rj] >= mean) sb = false;
    }
    if (sa || sb) rule4count++;
  }
  if (rule4count > 0) weRules.push('Rule4: ' + rule4count + ' run(s) of 8 points same side of mean');
  /* Trend: first 10% vs last 10% */
  var slice = Math.max(1, Math.floor(n * 0.1));
  var firstAvg = values.slice(0, slice).reduce(function(a,b){return a+b;},0)/slice;
  var lastAvg  = values.slice(n - slice).reduce(function(a,b){return a+b;},0)/slice;
  var trend    = lastAvg > firstAvg * 1.05 ? 'up' : lastAvg < firstAvg * 0.95 ? 'down' : 'stable';
  var pctChange = firstAvg !== 0 ? ((lastAvg - firstAvg) / firstAvg * 100).toFixed(1) : '0';
  return {
    mean: mean, std: std, ucl: ucl, lcl: lcl, min: min, max: max,
    trend: trend, pctChange: pctChange, n: n,
    mrBar: mrBar, sigmaWithin: sigmaWithin,
    cpk_est: cpk_est, cp_est: cp_est, cpl_est: cpl_est, cpu_est: cpu_est,
    cpkNote: cpkNote, weRules: weRules, inControl: weRules.length === 0
  };
}

/* â”€â”€ Find the real header row in an Excel sheet (skips title/blank rows) â”€â”€ */
function _findHeaderRow(rows) {
  /* Look for the row that has the most numeric-column-label pattern:
     A good header row has >= 2 non-empty cells and at least one looks like a column label (non-numeric short string) */
  for (var i = 0; i < Math.min(rows.length - 1, 10); i++) {
    var row = rows[i];
    var nonEmpty = row.filter(function(c) { return c !== undefined && c !== ''; });
    if (nonEmpty.length < 2) continue;
    /* Check if the NEXT row has numeric data in columns 2+ */
    var nextRow = rows[i + 1];
    if (!nextRow) continue;
    var hasNumericData = false;
    for (var c = 1; c < Math.min(nextRow.length, 6); c++) {
      var v = nextRow[c];
      if (typeof v === 'number' || (!isNaN(parseFloat(v)) && String(v).trim() !== '')) {
        hasNumericData = true; break;
      }
    }
    if (hasNumericData) return i; /* This is the header row index */
  }
  return 0; /* fallback: first row */
}

/* â”€â”€ Extract data from ONE worksheet (helper) â”€â”€ */
function _parseOneSheet(ws, sheetName) {
  var allRows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, blankrows: false });
  allRows = allRows.filter(function(r) { return r.some(function(c) { return c !== undefined && c !== ''; }); });
  if (allRows.length < 2) return null;

  /* Find the real header row (robust: handles title rows above data) */
  var headerIdx = _findHeaderRow(allRows);
  var headerRow = allRows[headerIdx];
  var dataRows  = allRows.slice(headerIdx + 1);

  if (!headerRow || headerRow.length < 2 || dataRows.length === 0) return null;

  /* Row labels = first column */
  var labels = dataRows.map(function(r) {
    var v = r[0];
    if (v === undefined || v === null || v === '') return '';
    /* Format Excel date serial numbers */
    if (typeof v === 'number' && v > 20000) {
      try { return XLSX.SSF.format('d-mmm', v); } catch(e) { return String(v); }
    }
    return String(v);
  }).filter(function(l) { return l !== ''; }).slice(0, 200);

  if (labels.length === 0) return null;

  /* Data series = remaining numeric columns (max 12) */
  var datasets = [];
  var maxCols  = Math.min(headerRow.length, 13);
  for (var col = 1; col < maxCols; col++) {
    var seriesLabel = String(headerRow[col] !== undefined && headerRow[col] !== '' ? headerRow[col] : ('Series ' + col));
    var values = dataRows.slice(0, labels.length).map(function(r) {
      var v = r[col];
      if (typeof v === 'number') return v;
      var f = parseFloat(String(v != null ? v : '').replace(/[,%$\u20b9\u00a3\u20ac\s]/g, ''));
      return isNaN(f) ? 0 : f;
    });
    if (values.some(function(v) { return v !== 0; })) {
      var stats = _computeStats(values);
      datasets.push({ label: seriesLabel, data: values, stats: stats });
    }
  }
  if (datasets.length === 0) return null;

  /* â”€â”€ Industry + chart type detection â”€â”€ */
  var col0Header = String(headerRow[0] || '').toLowerCase().trim();
  var col0IsTime = /^(hour|hours|time|day|days|week|month|year|period|quarter|minute|second|reading|sample|date|sr|no\b)/.test(col0Header);
  var timeRx     = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|q[1-4]|fy|week|day|hour|min|time|date|\d{4})/i;
  var isTime     = col0IsTime
    || labels.some(function(l) { return timeRx.test(String(l).trim()); })
    || dataRows.some(function(r) { var v = r[0]; return typeof v === 'number' && v > 40000 && v < 55000; });

  /* Industry detection from ALL header names */
  var allHeaders = headerRow.map(function(h) { return String(h || '').toLowerCase(); }).join(' ');
  var industry   = 'general';
  if (/\b(bbl|bopd|bwpd|gor|wcut|choke|psi|mcf|reservoir)\b/.test(allHeaders))       industry = 'oil';
  else if (/\b(open|high|low|close|volume|ticker|ohlc)\b/.test(allHeaders))            industry = 'stock';
  else if (/\b(revenue|npa|crar|loan|deposit|interest|profit|ebitda|roe)\b/.test(allHeaders)) industry = 'finance';
  else if (/\b(ph|absorbance|titration|concentration|molarity|turbidity)\b/.test(allHeaders))  industry = 'lab';
  else if (/\b(cw|steam|temp|pressure|flow|kg|m3|bar|rpm|kwh|mw)\b/.test(allHeaders)) industry = 'process';
  else if (/\b(qty|item|bom|material|part|description|unit cost)\b/.test(allHeaders))  industry = 'engineering';

  var firstNumeric = dataRows.slice(0, Math.min(dataRows.length, 6))
    .filter(function(r) { return r[0] !== undefined && r[0] !== ''; })
    .every(function(r) { return typeof r[0] === 'number' || (!isNaN(parseFloat(String(r[0]))) && String(r[0]).trim() !== ''); });

  /* Wide value range check */
  var posVals = [];
  datasets.forEach(function(ds) { ds.data.forEach(function(v) { if (v > 0) posVals.push(v); }); });
  var logScaleRec = false;
  if (posVals.length > 1) {
    var maxV = Math.max.apply(null, posVals), minV = Math.min.apply(null, posVals);
    logScaleRec = (maxV / minV) > 1000;
  }


  /* -- OHLCV detection: find Open/High/Low/Close column indexes -- */
  var ohlcvInfo = null;
  var dsLabels  = datasets.map(function(d) { return d.label.toLowerCase(); });
  var oIdx = -1, hIdx = -1, lIdx = -1, cIdx = -1, vIdx = -1;
  for (var di = 0; di < dsLabels.length; di++) {
    var dl = dsLabels[di];
    if (/^open$|^o$/.test(dl))          oIdx = di;
    else if (/^high$|^h$/.test(dl))     hIdx = di;
    else if (/^low$|^l$/.test(dl))      lIdx = di;
    else if (/^close$|^c$/.test(dl))    cIdx = di;
    else if (/^volume$|^vol$|^v$/.test(dl)) vIdx = di;
  }
  if (hIdx >= 0 && lIdx >= 0 && cIdx >= 0) {
    ohlcvInfo = { openIdx: oIdx, highIdx: hIdx, lowIdx: lIdx, closeIdx: cIdx, volumeIdx: vIdx };
    industry = 'stock';
  }

  var detectedType, detectedReason;
  if (ohlcvInfo) {
    detectedType = 'candlestick'; detectedReason = 'Stock OHLCV - Candlestick chart';
  } else if (isTime) {
    detectedType = 'line'; detectedReason = 'Time series - Line chart per column';
  } else if (firstNumeric && datasets.length === 1) {
    detectedType = 'scatter'; detectedReason = 'XY correlation - Scatter plot';
  } else if (datasets.length > 2) {
    detectedType = 'bar'; detectedReason = 'Multi-series (' + datasets.length + ') - Grouped bar';
  } else {
    detectedType = 'bar'; detectedReason = 'Comparison - Bar chart';
  }
  if (logScaleRec) detectedReason += ' - Wide value range (log scale recommended)';

  return {
    labels: labels, datasets: datasets, sheetName: sheetName,
    detectedType: detectedType, detectedReason: detectedReason,
    logScaleRec: logScaleRec, industry: industry, ohlcvInfo: ohlcvInfo,
    headerRow: headerRow, col0Label: String(headerRow[0] || 'X')
  };
}


/* ══════════════════════════════════════════════════════════════════
   SMA + CANDLESTICK ENGINE  (Point 3 of the Industry Intelligence)
   Handles real stock OHLCV data from Excel:
     - SMA 20 and SMA 50 overlays on Close price
     - Volume bar chart on secondary Y axis
     - Candlestick via custom plugin (or Close line fallback)
══════════════════════════════════════════════════════════════════ */

/* -- Simple Moving Average calculator -- */
function _computeSMA(closes, period) {
  var result = [];
  for (var i = 0; i < closes.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    var sum = 0;
    for (var j = i - period + 1; j <= i; j++) sum += closes[j];
    result.push(parseFloat((sum / period).toFixed(4)));
  }
  return result;
}

/* -- % Return calculator -- */
function _computeReturn(closes) {
  if (!closes || closes.length < 2) return null;
  var first = closes[0], last = closes[closes.length - 1];
  if (!first) return null;
  return ((last - first) / first * 100).toFixed(2);
}

/* -- RSI 14 calculator -- */
function _computeRSI(closes, period) {
  period = period || 14;
  var result = [];
  if (closes.length < period + 1) return closes.map(function() { return null; });
  var gains = 0, losses = 0;
  for (var i = 1; i <= period; i++) {
    var diff = closes[i] - closes[i-1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  var avgGain = gains / period, avgLoss = losses / period;
  result = Array(period).fill(null);
  result.push(avgLoss === 0 ? 100 : parseFloat((100 - 100/(1 + avgGain/avgLoss)).toFixed(2)));
  for (var k = period + 1; k < closes.length; k++) {
    var d = closes[k] - closes[k-1];
    var g = d > 0 ? d : 0, l = d < 0 ? -d : 0;
    avgGain = (avgGain * (period-1) + g) / period;
    avgLoss = (avgLoss * (period-1) + l) / period;
    result.push(avgLoss === 0 ? 100 : parseFloat((100 - 100/(1 + avgGain/avgLoss)).toFixed(2)));
  }
  return result;
}

/* -- Render full stock dashboard (replaces single panel for stock/candlestick) -- */
function _renderStockDashboard(wrapEl, chartData) {
  var d    = chartData;
  var info = d.ohlcvInfo;
  if (!info) { wrapEl.innerHTML = '<p style="color:rgba(255,255,255,.4)">OHLCV column mapping not found</p>'; return; }

  var labels = d.labels;
  var nPts   = labels.length;

  var closes  = info.closeIdx  >= 0 ? d.datasets[info.closeIdx].data  : [];
  var highs   = info.highIdx   >= 0 ? d.datasets[info.highIdx].data   : [];
  var lows    = info.lowIdx    >= 0 ? d.datasets[info.lowIdx].data    : [];
  var opens   = info.openIdx   >= 0 ? d.datasets[info.openIdx].data   : closes;
  var volumes = info.volumeIdx >= 0 ? d.datasets[info.volumeIdx].data : [];

  var sma20 = _computeSMA(closes, 20);
  var sma50 = _computeSMA(closes, 50);
  var rsi14 = _computeRSI(closes, 14);
  var ret   = _computeReturn(closes);

  /* Close stats */
  var closeSt = d.datasets[info.closeIdx] && d.datasets[info.closeIdx].stats;
  var hi      = closeSt ? closeSt.max : Math.max.apply(null, highs.filter(function(v){return v;}));
  var lo      = closeSt ? closeSt.min : Math.min.apply(null, lows.filter(function(v){return v;}));

  /* Candle colors: bullish if close > open, else bearish */
  var candleColors = labels.map(function(_, i) {
    return (opens[i] !== undefined && closes[i] !== undefined && closes[i] >= opens[i])
      ? 'rgba(74,222,128,0.85)' : 'rgba(239,68,68,0.85)';
  });

  /* KPI summary bar */
  var retSign  = parseFloat(ret) >= 0 ? '+' : '';
  var retColor = parseFloat(ret) >= 0 ? '#4ade80' : '#f87171';
  var lastClose = closes[closes.length - 1];
  var lastSMA20 = sma20.filter(function(v){return v!==null;}).pop();
  var bias = lastClose && lastSMA20
    ? (lastClose > lastSMA20 ? 'Bullish (above SMA20)' : 'Bearish (below SMA20)')
    : 'Neutral';

  var html = '<div class="stock-kpi-bar">'
    + '<div class="stock-kpi"><span class="stock-kpi-label">Last Close</span><span class="stock-kpi-val">' + (lastClose ? lastClose.toFixed(2) : 'N/A') + '</span></div>'
    + '<div class="stock-kpi"><span class="stock-kpi-label">Period High</span><span class="stock-kpi-val">' + hi.toFixed(2) + '</span></div>'
    + '<div class="stock-kpi"><span class="stock-kpi-label">Period Low</span><span class="stock-kpi-val">' + lo.toFixed(2) + '</span></div>'
    + '<div class="stock-kpi"><span class="stock-kpi-label">Return</span><span class="stock-kpi-val" style="color:' + retColor + '">' + retSign + ret + '%</span></div>'
    + '<div class="stock-kpi"><span class="stock-kpi-label">Bias (SMA20)</span><span class="stock-kpi-val" style="font-size:12px">' + bias + '</span></div>'
    + '</div>';

  /* Chart 1: Close + SMA20 + SMA50 */
  html += '<div class="stock-chart-panel">';
  html += '<div class="stock-panel-title">📊 Price Chart — Close / SMA20 / SMA50 <span class="stock-panel-meta">' + nPts + ' sessions · ' + labels[0] + ' → ' + labels[labels.length-1] + '</span></div>';
  html += '<div class="stock-panel-canvas-wrap" style="height:300px"><canvas id="stockPriceChart"></canvas></div>';
  html += '</div>';

  /* Chart 2: Volume (if available) */
  if (volumes.length > 0) {
    html += '<div class="stock-chart-panel" style="margin-top:12px">';
    html += '<div class="stock-panel-title">📦 Volume</div>';
    html += '<div class="stock-panel-canvas-wrap" style="height:140px"><canvas id="stockVolumeChart"></canvas></div>';
    html += '</div>';
  }

  /* Chart 3: RSI */
  if (rsi14.some(function(v){return v!==null;})) {
    html += '<div class="stock-chart-panel" style="margin-top:12px">';
    html += '<div class="stock-panel-title">📉 RSI (14) — Overbought >70 · Oversold <30</div>';
    html += '<div class="stock-panel-canvas-wrap" style="height:130px"><canvas id="stockRsiChart"></canvas></div>';
    html += '</div>';
  }

  /* Stats table for all OHLCV columns */
  html += '<div class="doc-stats-table-wrap" style="margin-top:14px">'
    + '<div class="doc-stats-table-title">📊 OHLCV Statistical Summary</div>'
    + '<div style="overflow-x:auto"><table class="doc-stats-table"><thead><tr>'
    + '<th>Column</th><th>N</th><th>Mean</th><th>Min</th><th>Max</th><th>Std Dev</th><th>% Change</th>'
    + '</tr></thead><tbody>';
  d.datasets.forEach(function(ds) {
    if (!ds.stats) return;
    var s = ds.stats;
    var tc = s.trend==='up'?'stat-up':s.trend==='down'?'stat-dn':'';
    var ti = s.trend==='up'?'↑':s.trend==='down'?'↓':'→';
    html += '<tr><td><b>'+ds.label+'</b></td><td>'+s.n+'</td>'
      + '<td>'+s.mean.toFixed(2)+'</td><td>'+s.min.toFixed(2)+'</td><td>'+s.max.toFixed(2)+'</td>'
      + '<td>'+s.std.toFixed(2)+'</td>'
      + '<td class="'+tc+'">'+ti+' '+s.pctChange+'%</td></tr>';
  });
  html += '</tbody></table></div></div>';

  wrapEl.innerHTML = html;

  /* Render charts once DOM is ready */
  setTimeout(function() {
    /* Price chart: Close line + SMA20 + SMA50 */
    var pc = document.getElementById('stockPriceChart');
    if (pc) {
      var tickLimit = Math.min(nPts, 15);
      new Chart(pc, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Close', data: closes, borderColor: 'rgba(56,189,248,.9)', backgroundColor: 'rgba(56,189,248,.05)',
              borderWidth: 1.5, fill: true, tension: 0, pointRadius: nPts>60?0:2, pointHoverRadius: 6, order: 0,
              datalabels: { display: false } },
            { label: 'SMA 20', data: sma20, borderColor: 'rgba(246,173,85,.85)', borderWidth: 1.5,
              borderDash: [5,3], fill: false, tension: 0.2, pointRadius: 0, order: 1,
              datalabels: { display: false } },
            { label: 'SMA 50', data: sma50, borderColor: 'rgba(167,139,250,.85)', borderWidth: 1.5,
              borderDash: [8,4], fill: false, tension: 0.2, pointRadius: 0, order: 1,
              datalabels: { display: false } }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { labels: { color: 'rgba(255,255,255,.6)', font: { size: 11 }, padding: 12 } },
            tooltip: { mode: 'index', intersect: false },
            datalabels: { display: false }
          },
          scales: {
            x: { ticks: { color: 'rgba(255,255,255,.45)', font: { size: 9 }, maxTicksLimit: tickLimit, maxRotation: 45 },
                 grid: { color: 'rgba(255,255,255,.04)' } },
            y: { ticks: { color: 'rgba(255,255,255,.45)', font: { size: 9 } },
                 grid: { color: 'rgba(255,255,255,.04)' } }
          }
        }
      });
    }

    /* Volume chart */
    var vc = document.getElementById('stockVolumeChart');
    if (vc && volumes.length > 0) {
      var volColors = labels.map(function(_, i) {
        return closes[i] >= opens[i] ? 'rgba(74,222,128,.55)' : 'rgba(239,68,68,.55)';
      });
      new Chart(vc, {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: 'Volume', data: volumes,
          backgroundColor: volColors, borderWidth: 0 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, datalabels: { display: false } },
          scales: {
            x: { ticks: { color: 'rgba(255,255,255,.35)', font: { size: 8 }, maxTicksLimit: 10, maxRotation: 45 },
                 grid: { display: false } },
            y: { ticks: { color: 'rgba(255,255,255,.35)', font: { size: 8 },
                   callback: function(v) { return v >= 1e6 ? (v/1e6).toFixed(1)+'M' : v >= 1e3 ? (v/1e3).toFixed(0)+'K' : v; } },
                 grid: { color: 'rgba(255,255,255,.04)' } }
          }
        }
      });
    }

    /* RSI chart */
    var rc = document.getElementById('stockRsiChart');
    if (rc && rsi14.some(function(v){return v!==null;})) {
      new Chart(rc, {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'RSI 14', data: rsi14,
          borderColor: 'rgba(244,114,182,.85)', backgroundColor: 'rgba(244,114,182,.05)',
          borderWidth: 1.5, fill: true, tension: 0.2, pointRadius: 0,
          datalabels: { display: false } }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, datalabels: { display: false },
            annotation: {} },
          scales: {
            x: { ticks: { color: 'rgba(255,255,255,.35)', font: { size: 8 }, maxTicksLimit: 10, maxRotation: 45 },
                 grid: { display: false } },
            y: { min: 0, max: 100,
                 ticks: { color: 'rgba(255,255,255,.45)', font: { size: 8 },
                   callback: function(v) { return v === 30 ? '30 OS' : v === 70 ? '70 OB' : v === 50 ? '50' : ''; } },
                 grid: { color: 'rgba(255,255,255,.04)' } }
          }
        },
        plugins: [{
          id: 'rsiZones',
          afterDraw: function(chart) {
            var ctx = chart.ctx, ya = chart.scales.y, xa = chart.scales.x;
            var y70 = ya.getPixelForValue(70), y30 = ya.getPixelForValue(30);
            ctx.save();
            ctx.fillStyle = 'rgba(239,68,68,.08)';
            ctx.fillRect(xa.left, chart.chartArea.top, xa.right - xa.left, y70 - chart.chartArea.top);
            ctx.fillStyle = 'rgba(74,222,128,.08)';
            ctx.fillRect(xa.left, y30, xa.right - xa.left, chart.chartArea.bottom - y30);
            ctx.strokeStyle = 'rgba(239,68,68,.35)'; ctx.lineWidth = 1; ctx.setLineDash([4,3]);
            ctx.beginPath(); ctx.moveTo(xa.left, y70); ctx.lineTo(xa.right, y70); ctx.stroke();
            ctx.strokeStyle = 'rgba(74,222,128,.35)';
            ctx.beginPath(); ctx.moveTo(xa.left, y30); ctx.lineTo(xa.right, y30); ctx.stroke();
            ctx.restore();
          }
        }]
      });
    }
  }, 100);
}


/* â”€â”€ Extract real chart-ready data from ALL Excel sheets â”€â”€ */
function extractXlsxChartData(workbook) {
  var allSheets = [];

  workbook.SheetNames.forEach(function(name) {
    var ws = workbook.Sheets[name];
    if (!ws) return;
    var result = _parseOneSheet(ws, name);
    if (result) allSheets.push(result);
  });

  if (allSheets.length === 0) return null;

  /* Set active to the sheet with the most data rows */
  var bestIdx = 0;
  allSheets.forEach(function(s, i) {
    if (s.labels.length > allSheets[bestIdx].labels.length) bestIdx = i;
  });

  var active = allSheets[bestIdx];
  return {
    labels:          active.labels,
    datasets:        active.datasets,
    sheetName:       active.sheetName,
    detectedType:    active.detectedType,
    detectedReason:  active.detectedReason,
    logScaleRec:     active.logScaleRec,
    allSheets:       allSheets,
    activeSheetIdx:  bestIdx,
    industry:        active.industry || 'general',
    ohlcvInfo:       active.ohlcvInfo || null,
    col0Label:       active.col0Label || 'X'
  };
}

/* â”€â”€ File format router â”€â”€ */
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

/* â”€â”€ Drag & Drop handlers (for doc upload zone) â”€â”€ */
function docDragOver(e) { e.preventDefault(); var z = document.getElementById('docDropZone'); if (z) z.classList.add('dragover'); }
function docDrop(e) {
  e.preventDefault();
  var z = document.getElementById('docDropZone');
  if (z) z.classList.remove('dragover');
  var f = e.dataTransfer.files[0];
  if (f) docFileSelected(f);
}

/* â”€â”€ File selected handler â”€â”€ */
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
      if (docDirectChartData) {
        var sc = docDirectChartData.allSheets ? docDirectChartData.allSheets.length : 1;
        if (sc > 1) {
          var names = docDirectChartData.allSheets.map(function(s) { return s.sheetName; }).join(', ');
          baseMsg = '\u2705 ' + sc + ' sheets found: ' + names;
        } else {
          baseMsg = '\u2705 ' + docDirectChartData.labels.length + ' rows \u00d7 '
            + (docDirectChartData.datasets.length + 1) + ' columns \u2014 ' + docDirectChartData.detectedReason;
        }
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

/* â”€â”€ Build statistical context block from real Excel data â”€â”€ */
function _buildStatsContext() {
  if (!docDirectChartData || !docDirectChartData.datasets) return '';
  var d = docDirectChartData;
  var lines = ['REAL EXCEL DATA EXTRACTED (' + d.labels.length + ' rows Ã— ' + (d.datasets.length + 1) + ' columns):'];
  lines.push('X-axis column: ' + (d.col0Label || 'Row') + ' | Range: ' + d.labels[0] + ' â†’ ' + d.labels[d.labels.length - 1]);
  lines.push('');
  d.datasets.forEach(function(ds) {
    if (!ds.stats) return;
    var s = ds.stats;
    var trendStr = s.trend === 'up' ? 'â†‘ Rising (+' + s.pctChange + '%)' : s.trend === 'down' ? 'â†“ Falling (' + s.pctChange + '%)' : 'â†’ Stable';
    lines.push('  Column: ' + ds.label);
    lines.push('    Mean=' + s.mean.toFixed(2) + '  Std Dev=' + s.std.toFixed(2) + '  Min=' + s.min.toFixed(2) + '  Max=' + s.max.toFixed(2));
    lines.push('    UCL(+3Ïƒ)=' + s.ucl.toFixed(2) + '  LCL(-3Ïƒ)=' + (s.lcl > 0 ? s.lcl.toFixed(2) : '0') + '  Trend: ' + trendStr);
    /* Detect breaches */
    var breaches = ds.data.filter(function(v) { return v > s.ucl; });
    if (breaches.length > 0) lines.push('    âš ï¸ UCL BREACHES: ' + breaches.length + ' readings exceeded UCL (max breach: ' + Math.max.apply(null, breaches).toFixed(2) + ')');
  });
  return lines.join('\n');
}

/* â”€â”€ Industry-specific expert prompt builder â”€â”€ */
function _buildIndustryPrompt(industry, statsContext, textSample, context, tone, truncated) {
  var industryRole = {
    'process': 'You are a Senior Process/Chemical Engineer with 20 years of experience in industrial plant operations and process control.',
    'lab':     'You are an expert Lab/QC Analyst and Statistical Process Control (SPC) specialist.',
    'oil':     'You are a Petroleum/Reservoir Engineer specializing in production optimization and decline curve analysis.',
    'stock':   'You are a Chartered Market Analyst (CMA) specializing in technical analysis and equity research.',
    'finance': 'You are a Chartered Accountant (CA) and Senior Financial Analyst specializing in corporate finance and credit analysis.',
    'engineering': 'You are a Senior Mechanical/Civil Engineer specializing in project management and BOM analysis.',
    'general': 'You are a Senior Business Analyst and Management Consultant with expertise across multiple industries.'
  };
  var role = industryRole[industry] || industryRole['general'];

  var industryQuestions = {
    'process': [
      'Assess process STABILITY â€” were readings within UCL/LCL control limits? What % of time was in control?',
      'Identify distinct PHASES: startup ramp-up, steady state, any shutdown or anomaly periods',
      'Analyse CORRELATION between columns (e.g. Steam vs CW relationship, efficiency ratios)',
      'Flag any OPERATIONAL ANOMALIES â€” sudden spikes, gradual drift, step changes',
      'Assess EQUIPMENT PERFORMANCE â€” are readings consistent with healthy equipment?',
      'Provide 3 specific OPERATIONAL RECOMMENDATIONS for the plant operator'
    ],
    'lab': [
      'SPC ASSESSMENT â€” is the process in statistical control? Calculate Cp/Cpk if spec limits detectable',
      'Identify OUT-OF-CONTROL signals: any runs, trends, or UCL/LCL breaches?',
      'Recommend CORRECTIVE ACTIONS for any non-conformances found',
      'Assess MEASUREMENT SYSTEM â€” consistency and repeatability of readings',
      'Compliance statement: what % of readings fall within acceptable range?'
    ],
    'oil': [
      'PRODUCTION TREND analysis â€” is production declining, stable, or increasing?',
      'Calculate implied DECLINE RATE if time vs production data present',
      'Analyse GOR (Gas-Oil Ratio) trends if present â€” implications for reservoir health',
      'WATER CUT progression â€” implications for well performance',
      'Cumulative production estimate from the data',
      'Well intervention recommendations based on trends'
    ],
    'stock': [
      'PRICE TREND assessment â€” bullish, bearish, or sideways?',
      'Calculate % return over the data period',
      'Identify KEY SUPPORT and RESISTANCE levels from the data',
      'Volatility assessment (high/low/normal)',
      'Volume trend analysis if available â€” confirming or diverging from price?',
      'Trading outlook: short-term and medium-term bias'
    ],
    'finance': [
      'KEY FINANCIAL RATIOS â€” calculate CAGR, YoY growth, profit margins from the data',
      'Balance sheet HEALTH â€” liquidity, solvency, leverage assessment',
      'TREND ANALYSIS â€” revenue, profit, and key metric trajectories',
      'RED FLAGS or POSITIVE indicators from the numbers',
      'Benchmark comparison â€” how do these metrics compare to industry norms?',
      'Credit/investment RECOMMENDATION with supporting rationale'
    ],
    'engineering': [
      'BOM/PROJECT SUMMARY â€” categorize items, identify high-value or critical items',
      'COST DISTRIBUTION analysis if cost data present',
      'PROCUREMENT RISK â€” any single-source or high-cost dependencies?',
      'Schedule compliance if timeline data present',
      'Value engineering OPPORTUNITIES â€” areas for cost or time optimization'
    ],
    'general': [
      'Key INSIGHTS from the data with specific numbers',
      'Trend analysis â€” what is improving, what is declining?',
      'Critical RISK FACTORS identified',
      'TOP 3 actionable RECOMMENDATIONS',
      'Executive summary suitable for C-suite presentation'
    ]
  };
  var questions = industryQuestions[industry] || industryQuestions['general'];

  var p = role + '\n\n';
  if (statsContext) {
    p += '=== STATISTICAL ANALYSIS (calculated from real Excel data) ===\n' + statsContext + '\n\n';
    p += 'IMPORTANT: The stats above are CALCULATED FROM REAL DATA. Reference specific numbers in your analysis.\n\n';
  }
  p += '=== DOCUMENT/DATA CONTENT ===\n' + textSample + '\n';
  if (truncated) p += '[Data continues â€” excerpt shown]\n';
  p += '\n';
  if (context) p += 'User notes: "' + context + '"\n\n';
  p += 'Tone: ' + tone + ' | Industry: ' + industry.toUpperCase() + '\n\n';
  p += 'Provide expert ' + industry.toUpperCase() + ' analysis covering:\n';
  questions.forEach(function(q, i) { p += (i + 1) + '. ' + q + '\n'; });
  p += '\nReturn ONLY valid JSON â€” no markdown, no extra text:\n';
  p += '{'
    + '"title":"concise report title (max 8 words)",'
    + '"summary":"3-sentence expert executive summary with specific numbers from the data",'
    + '"keyPoints":["specific finding 1 with number","finding 2","finding 3","finding 4","finding 5"],'
    + '"stats":['
    +   '{"label":"Key metric name","value":"specific number or %","trend":"up|down|neutral"},'
    +   '{"label":"Second metric","value":"value","trend":"neutral"},'
    +   '{"label":"Third metric","value":"value","trend":"up"}'
    + '],'
    + '"chartData":{"type":"line","labels":["label1","label2","label3"],"values":[40,60,30],"unit":""},'
    + '"recommendations":["specific action 1","action 2","action 3","action 4"],'
    + '"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5"]'
    + '}\n\n'
    + 'CRITICAL: Extract REAL numbers from the data. Do NOT make up numbers. Use the statistical analysis provided.';
  return p;
}

/* â”€â”€ AI prompt builder for Document Analyzer â”€â”€ */
async function promptDocAnalyzer(context) {
  if (!docExtractedText) throw new Error('Please upload a document first.');

  var outputStyle = selectedOptions['Output Style'] || 'Slide Deck';
  var tone        = selectedOptions['Tone']         || 'Professional';
  var textSample  = docExtractedText.substring(0, 5000);
  var truncated   = docExtractedText.length > 5000;

  /* Detect industry from real Excel data (most accurate) OR from text keywords */
  var industry = 'general';
  if (docDirectChartData && docDirectChartData.industry) {
    industry = docDirectChartData.industry;
  } else {
    var txt = textSample.toLowerCase();
    if (/\b(bbl|bopd|bwpd|gor|reservoir|wellhead|psi|mcf)\b/.test(txt))       industry = 'oil';
    else if (/\b(open|high|low|close|volume|nse|bse|sensex|nifty|equity)\b/.test(txt)) industry = 'stock';
    else if (/\b(revenue|npa|crar|ebitda|loan|deposit|balance sheet)\b/.test(txt)) industry = 'finance';
    else if (/\b(ph|titration|absorbance|molarity|reagent|sample|qc)\b/.test(txt)) industry = 'lab';
    else if (/\b(cw|steam|pressure|flow rate|kg.hr|m3.hr|rpm|kwh)\b/.test(txt)) industry = 'process';
    else if (/\b(bom|bill of material|part no|item|qty|material|specification)\b/.test(txt)) industry = 'engineering';
  }

  /* Build statistical context from real Excel data */
  var statsContext = _buildStatsContext();

  /* ▶ Finance industry: use banking-specific prompt with pre-calculated ratios */
  if (industry === 'finance') {
    var finRatios = calcFinancialRatios(docDirectChartData);
    var finPrompt = _buildFinancePrompt(finRatios, statsContext, textSample, context, tone, truncated);
    return groqCall(null, null, finPrompt);
  }

  var p = _buildIndustryPrompt(industry, statsContext, textSample, context, tone, truncated);
  return groqCall(null, null, p);
}

/* â”€â”€ Render GAMMA-style output â”€â”€ */
function renderDocAnalyzerOutput(result) {
  _currentDocResult   = result;
  _currentDocSlideIdx = 0;

  /* Route finance data to specialist Banking & Finance renderer */
  var _industry = (docDirectChartData && docDirectChartData.industry) || '';
  if (_industry === 'finance') {
    renderBankingOutput(result);
    return;
  }

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

/* â”€â”€ Build full output HTML â”€â”€ */
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
      /* No-Excel warning OR detection banner */
      if (!docDirectChartData) {
        slidesHtml += '<div class="doc-detect-banner doc-detect-warn" id="docDetectBanner">\u26a0\ufe0f Upload the actual <strong>.xlsx</strong> file (not PDF) to see all real data points plotted here</div>';
      } else {
        slidesHtml += '<div class="doc-detect-banner" id="docDetectBanner">\ud83d\udd0d ' + (docDirectChartData.detectedReason || '') + '</div>';
      }
      /* Series toggles â€” shown only when multiple data columns exist */
      if (docDirectChartData && docDirectChartData.datasets && docDirectChartData.datasets.length > 1) {
        slidesHtml += '<div class="doc-series-toggles" id="docSeriesToggleRow"><span class="doc-sheet-tabs-label">Columns:</span>';
        docDirectChartData.datasets.forEach(function(ds, i) {
          slidesHtml += '<button class="doc-series-btn active" id="docSeriesBtn_' + i + '" onclick="toggleDocSeries(' + i + ')">' + ds.label + '</button>';
        });
        slidesHtml += '</div>';
      }
      /* Sheet tabs */
      if (docDirectChartData && docDirectChartData.allSheets && docDirectChartData.allSheets.length > 1) {
        slidesHtml += '<div class="doc-sheet-tabs" id="docSheetTabs"><span class="doc-sheet-tabs-label">\ud83d\uddc2 Sheets:</span>';
        docDirectChartData.allSheets.forEach(function(sheet, i) {
          slidesHtml += '<button class="doc-sheet-tab' + (i === (docDirectChartData.activeSheetIdx || 0) ? ' active' : '') + '" onclick="selectDocSheet(' + i + ')">' + sheet.sheetName + '</button>';
        });
        slidesHtml += '</div>';
      }
      /* Multi-chart grid (real Excel) OR single canvas (AI fallback) */
      slidesHtml += '<div id="docMultiChartWrap"></div>';
      slidesHtml += '<canvas id="docMainChart" style="display:none;max-height:240px"></canvas>';
      slidesHtml += '<div class="doc-chart-source" id="docChartSource"></div>';
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

/* â”€â”€ Slide navigation â”€â”€ */
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

/* â”€â”€ Switch chart type (both auto + manual) â”€â”€ */
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

/* â”€â”€ Switch active sheet tab â”€â”€ */
function selectDocSheet(idx) {
  if (!docDirectChartData || !docDirectChartData.allSheets) return;
  var sheet = docDirectChartData.allSheets[idx];
  if (!sheet) return;

  /* Update active data */
  docDirectChartData.activeSheetIdx = idx;
  docDirectChartData.labels        = sheet.labels;
  docDirectChartData.datasets      = sheet.datasets;
  docDirectChartData.sheetName     = sheet.sheetName;
  docDirectChartData.detectedType  = sheet.detectedType;
  docDirectChartData.detectedReason = sheet.detectedReason;
  docDirectChartData.logScaleRec   = sheet.logScaleRec;

  /* Update tab active states */
  document.querySelectorAll('.doc-sheet-tab').forEach(function(btn, i) {
    btn.classList.toggle('active', i === idx);
  });

  /* Update detection banner */
  var banner = document.getElementById('docDetectBanner');
  if (banner) banner.textContent = sheet.detectedReason ? ('ðŸ” ' + sheet.detectedReason) : '';

  /* Update chart source */
  var src = document.getElementById('docChartSource');
  if (src) src.textContent = 'ðŸ“Š Real data from sheet: "' + sheet.sheetName + '"';

  /* Re-render chart with new sheet data */
  renderDocChart(_currentDocResult);
}

/* â”€â”€ Toggle individual data series visibility â”€â”€ */
var _hiddenSeries = {};
function toggleDocSeries(idx) {
  _hiddenSeries[idx] = !_hiddenSeries[idx];
  var btn = document.getElementById('docSeriesBtn_' + idx);
  if (btn) btn.classList.toggle('active', !_hiddenSeries[idx]);
  /* Re-render with hidden series filtered out */
  renderDocChart(_currentDocResult);
}

/* â”€â”€ Multi-chart dashboard: one chart per data series â”€â”€ */
async function renderDocChart(result) {
  /* Load Chart.js + datalabels */
  if (!window.Chart) {
    await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
  }
  if (!window.ChartDataLabels) {
    await loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js');
    if (window.ChartDataLabels) Chart.register(ChartDataLabels);
  }

  /* â”€â”€ CASE 1: Real Excel data â†’ multi-chart per series â”€â”€ */
  if (docDirectChartData && docDirectChartData.datasets && docDirectChartData.datasets.length > 0) {
    _renderMultiCharts(docDirectChartData, docChartMode);
    return;
  }

  /* â”€â”€ CASE 2: AI-inferred data (non-Excel or failed parse) â†’ single chart â”€â”€ */
  var canvas = document.getElementById('docMainChart');
  if (!canvas) return;
  if (docChartMode === 'none') { canvas.style.display = 'none'; return; }
  canvas.style.display = 'block';

  if (window._docChartInstance) {
    try { window._docChartInstance.destroy(); } catch(e) {}
    window._docChartInstance = null;
  }

  if (!result || !result.chartData) return;
  var cd = result.chartData;
  var chartType = (docChartMode === 'auto' || docChartMode === 'none') ? (cd.type || 'bar') : docChartMode;
  var palette6  = ['rgba(255,112,67,0.85)','rgba(56,189,248,0.85)','rgba(74,222,128,0.85)',
                   'rgba(246,173,85,0.85)','rgba(167,139,250,0.85)','rgba(244,114,182,0.85)'];
  var labels   = cd.labels || ['A','B','C'];
  var datasets = [{
    label: result.title || 'Data', data: cd.values || [40,60,30],
    backgroundColor: palette6, borderColor: palette6, borderWidth: 1.5,
    fill: false, tension: 0, pointRadius: 4, pointHoverRadius: 7
  }];
  var src2 = document.getElementById('docChartSource');
  if (src2) src2.textContent = 'âš ï¸ AI-estimated data â€” upload the actual .xlsx file for real chart';

  window._docChartInstance = new Chart(canvas, {
    type: chartType, data: { labels: labels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
        datalabels: { display: true, color: 'rgba(255,255,255,0.8)', font: { size: 9, weight: '700' },
                      formatter: function(v) { return v; }, anchor: 'end', align: 'top', offset: 2 }
      },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MULTI-CHART ENGINE â€” one Chart.js panel per data series
   Each panel: line chart + UCL (red dashed) + Mean (green dashed) + LCL (red dashed)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
var _multiChartInstances = [];

function _renderMultiCharts(data, mode) {
  /* Destroy all previous instances */
  _multiChartInstances.forEach(function(c) { try { c.destroy(); } catch(e) {} });
  _multiChartInstances = [];

  var wrap = document.getElementById('docMultiChartWrap');
  if (!wrap) return;

  var labels   = data.labels;
  var xLabel   = data.col0Label || 'X';
  var chartType = (mode === 'auto' || !mode) ? (data.detectedType || 'line') : mode;
  if (chartType === 'none') { wrap.innerHTML = ''; return; }
  /* Route candlestick to full stock dashboard */
  if (chartType === 'candlestick' && data.ohlcvInfo) { _renderStockDashboard(wrap, data); return; }

  var nPts = labels.length;
  var palette = ['rgba(56,189,248,0.9)','rgba(255,112,67,0.9)','rgba(74,222,128,0.9)',
                 'rgba(246,173,85,0.9)','rgba(167,139,250,0.9)','rgba(244,114,182,0.9)'];

  /* Filter hidden series */
  var visibleSeries = data.datasets.filter(function(_, i) { return !_hiddenSeries[i]; });
  if (visibleSeries.length === 0) { wrap.innerHTML = '<p style="color:rgba(255,255,255,.4);padding:16px">All series hidden â€” click a column button above to show</p>'; return; }

  /* Build HTML: one chart-panel per series */
  var panelH = nPts > 60 ? 300 : (nPts > 30 ? 270 : 240);
  var html = '<div class="doc-multi-grid" style="--panel-h:' + panelH + 'px">';
  visibleSeries.forEach(function(ds, i) {
    html += '<div class="doc-chart-panel">';
    html += '<div class="doc-chart-panel-title">' + ds.label + '</div>';
    if (ds.stats) {
      var s = ds.stats;
      var trendIcon = s.trend === 'up' ? 'â†‘' : s.trend === 'down' ? 'â†“' : 'â†’';
      var trendCls  = s.trend === 'up' ? 'stat-up' : s.trend === 'down' ? 'stat-dn' : 'stat-neu';
      html += '<div class="doc-panel-kpi">'
        + '<span>Avg: <b>' + s.mean.toFixed(1) + '</b></span>'
        + '<span>Max: <b>' + s.max.toFixed(1) + '</b></span>'
        + '<span>Min: <b>' + s.min.toFixed(1) + '</b></span>'
        + '<span class="' + trendCls + '">' + trendIcon + ' ' + s.pctChange + '%</span>'
        + '</div>';
    }
    html += '<div class="doc-panel-canvas-wrap"><canvas id="docPanelChart_' + i + '"></canvas></div>';
    html += '</div>';
  });
  html += '</div>';

  /* Stats summary table */
  html += '<div class="doc-stats-table-wrap">';
  html += '<div class="doc-stats-table-title">ðŸ“Š Statistical Summary</div>';
  html += '<table class="doc-stats-table"><thead><tr>'
    + '<th>Column</th><th>Points</th><th>Mean</th><th>Std Dev</th>'
    + '<th>Min</th><th>Max</th><th>UCL (+3Ïƒ)</th><th>LCL (âˆ’3Ïƒ)</th><th>Trend</th>'
    + '</tr></thead><tbody>';
  data.datasets.forEach(function(ds) {
    if (!ds.stats) return;
    var s = ds.stats;
    var trendTxt = s.trend === 'up' ? 'â†‘ +' + s.pctChange + '%' : s.trend === 'down' ? 'â†“ ' + s.pctChange + '%' : 'â†’ Stable';
    var trendCls = s.trend === 'up' ? 'stat-up' : s.trend === 'down' ? 'stat-dn' : '';
    html += '<tr>'
      + '<td><b>' + ds.label + '</b></td>'
      + '<td>' + s.n + '</td>'
      + '<td>' + s.mean.toFixed(2) + '</td>'
      + '<td>' + s.std.toFixed(2) + '</td>'
      + '<td>' + s.min.toFixed(2) + '</td>'
      + '<td>' + s.max.toFixed(2) + '</td>'
      + '<td class="ucl-cell">' + s.ucl.toFixed(2) + '</td>'
      + '<td class="lcl-cell">' + (s.lcl > 0 ? s.lcl.toFixed(2) : '0') + '</td>'
      + '<td class="' + trendCls + '">' + trendTxt + '</td>'
      + '</tr>';
  });
  html += '</tbody></table></div>';

  wrap.innerHTML = html;

  /* Update source label */
  var src = document.getElementById('docChartSource');
  if (src) src.textContent = 'ðŸ“Š Real data Â· Sheet: "' + data.sheetName + '" Â· ' + nPts + ' data points Ã— ' + data.datasets.length + ' columns';

  /* Now render each Chart.js instance */
  visibleSeries.forEach(function(ds, i) {
    var canvas = document.getElementById('docPanelChart_' + i);
    if (!canvas) return;

    var st = ds.stats;
    var c  = palette[i % palette.length];

    /* Build datasets: main line + UCL + Mean + LCL */
    var chartDatasets = [{
      label:               ds.label,
      data:                ds.data,
      borderColor:         c,
      backgroundColor:     c.replace('0.9', '0.1'),
      borderWidth:         2,
      fill:                true,
      tension:             0,
      pointRadius:         nPts > 80 ? 2 : (nPts > 40 ? 3 : 4),
      pointHoverRadius:    7,
      pointBackgroundColor: c,
      order: 0
    }];

    if (st && chartType === 'line') {
      /* UCL â€” red dashed */
      chartDatasets.push({ label: 'UCL (' + st.ucl.toFixed(1) + ')',
        data: labels.map(function() { return st.ucl; }),
        borderColor: 'rgba(239,68,68,0.75)', borderWidth: 1.5,
        borderDash: [6,4], pointRadius: 0, fill: false, tension: 0, order: 1,
        datalabels: { display: false } });
      /* Mean â€” green dashed */
      chartDatasets.push({ label: 'Mean (' + st.mean.toFixed(1) + ')',
        data: labels.map(function() { return st.mean; }),
        borderColor: 'rgba(74,222,128,0.75)', borderWidth: 1.5,
        borderDash: [4,3], pointRadius: 0, fill: false, tension: 0, order: 1,
        datalabels: { display: false } });
      /* LCL â€” red dashed (only if > 0) */
      if (st.lcl > 0) {
        chartDatasets.push({ label: 'LCL (' + st.lcl.toFixed(1) + ')',
          data: labels.map(function() { return st.lcl; }),
          borderColor: 'rgba(239,68,68,0.75)', borderWidth: 1.5,
          borderDash: [6,4], pointRadius: 0, fill: false, tension: 0, order: 1,
          datalabels: { display: false } });
      }
    }

    /* Data labels config for main series */
    var dlCfg = {
      display: function(ctx) {
        if (ctx.datasetIndex !== 0) return false; /* only on main series */
        if (nPts > 120) return false;
        if (nPts > 60)  return ctx.dataIndex % 3 === 0;
        if (nPts > 30)  return ctx.dataIndex % 2 === 0;
        return true;
      },
      color:     'rgba(255,255,255,0.85)',
      font:      { size: nPts > 60 ? 7 : (nPts > 30 ? 8 : 9), weight: '700' },
      formatter: function(v) { return (v === 0 || v == null) ? '' : (typeof v === 'number' ? v.toFixed(v % 1 === 0 ? 0 : 1) : v); },
      anchor: 'end', align: 'top', offset: 1,
      rotation: nPts > 30 ? -60 : 0, clip: false
    };

    var inst = new Chart(canvas, {
      type: chartType === 'scatter' ? 'scatter' : 'line',
      data: { labels: labels, datasets: chartDatasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        layout: { padding: { top: nPts > 30 ? 30 : 18, right: 8 } },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true, labels: { color: 'rgba(255,255,255,0.6)', font: { size: 10 }, padding: 10,
            filter: function(item) { return item.datasetIndex === 0 || (st && chartType === 'line'); } } },
          tooltip: { mode: 'index', intersect: false,
            callbacks: { label: function(ctx) {
              var v = ctx.parsed.y;
              return ctx.dataset.label + ': ' + (typeof v === 'number' ? v.toFixed(2) : v);
            }}},
          datalabels: dlCfg
        },
        scales: {
          x: {
            title: { display: true, text: xLabel, color: 'rgba(255,255,255,0.45)', font: { size: 10 } },
            ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 9 },
              maxTicksLimit: Math.min(nPts, 15), maxRotation: 45 },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            title: { display: true, text: ds.label, color: 'rgba(255,255,255,0.45)', font: { size: 10 } },
            ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 9 } },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
    _multiChartInstances.push(inst);
  });
}

/* â”€â”€ Download chart as PNG â”€â”€ */
function downloadDocChart() {
  var canvas = document.getElementById('docMainChart');
  if (!canvas) { Toast.show('Generate analysis first', 'error'); return; }
  var a = document.createElement('a');
  a.download = 'clarix-doc-chart.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  Toast.show('\ud83d\udcca Chart downloaded!', 'success');
}

/* â”€â”€ Download full HTML deck â”€â”€ */
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

/* â”€â”€ Copy summary to clipboard â”€â”€ */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   EXPORT ENGINE â€” PPT / PDF / SHARE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ Helper: navigate to chart slide, capture canvas, restore â”€â”€ */
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

/* â”€â”€ Export PowerPoint (.pptx) â”€â”€ */
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

    /* Slide 1 â€“ Title */
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

    /* Slide 2 â€“ Executive Summary */
    var s2 = pptx.addSlide();
    s2.background = { color: BG };
    addAccent(s2, C_BL);
    s2.addText('Executive Summary', { x: 0.5, y: 0.22, w: 9, h: 0.6, fontSize: 22, bold: true, color: C_BL });
    s2.addText(result.summary || '', { x: 0.5, y: 1.1, w: 9, h: 3.8, fontSize: 14, color: C_WH, wrap: true, valign: 'top', lineSpacingMultiple: 1.5 });

    /* Slide 3 â€“ Key Metrics */
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

    /* Slide 4 â€“ Key Insights */
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

    /* Slide 5 â€“ Data Analysis (chart image) */
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

    /* Slide 6 â€“ Recommendations */
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

/* â”€â”€ Export PDF (professional white report) â”€â”€ */
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

    /* â”€â”€ Cover Page â”€â”€ */
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

    /* â”€â”€ Executive Summary â”€â”€ */
    sectionHeader('EXECUTIVE SUMMARY', 56, 189, 248);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11); pdf.setTextColor(30, 30, 50);
    var sumLines = pdf.splitTextToSize(result.summary || '', cw);
    sumLines.forEach(function(line) { needY(6); pdf.text(line, mg, y); y += 5.8; });
    y += 8;

    /* â”€â”€ Key Metrics Table â”€â”€ */
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

    /* â”€â”€ Key Insights â”€â”€ */
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

    /* â”€â”€ Data Analysis Chart â”€â”€ */
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

    /* â”€â”€ Recommendations â”€â”€ */
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

    /* â”€â”€ Footer on every page â”€â”€ */
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

/* â”€â”€ Share Analysis (Firebase Firestore + public link) â”€â”€ */
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

/* ═══════════════════════════════════════════════════════════════
   BANKING & FINANCE INTELLIGENCE ENGINE  (Phase 3)
   Activated when industry === 'finance' detected from Excel headers
═══════════════════════════════════════════════════════════════ */

/* ── RBI Benchmark Norms (fixed v1) ── */
var FINANCE_BENCHMARKS = {
  'Net Profit Margin':  { good: 15,  warn: 8,   unit: '%',  dir: 'up',   label: 'Industry norm > 15%' },
  'Revenue CAGR':       { good: 10,  warn: 5,   unit: '%',  dir: 'up',   label: 'Healthy > 10% CAGR' },
  'ROE':                { good: 15,  warn: 8,   unit: '%',  dir: 'up',   label: 'Industry norm > 15%' },
  'Current Ratio':      { good: 1.5, warn: 1.0, unit: 'x',  dir: 'up',   label: 'Safe > 1.5x' },
  'Debt-Equity Ratio':  { good: 2.0, warn: 3.0, unit: 'x',  dir: 'down', label: 'Conservative < 2x' },
  'NPA %':              { good: 3,   warn: 6,   unit: '%',  dir: 'down', label: 'RBI norm < 3%' },
  'CRAR %':             { good: 15,  warn: 11,  unit: '%',  dir: 'up',   label: 'RBI minimum > 11%' },
  'YoY Revenue Growth': { good: 10,  warn: 0,   unit: '%',  dir: 'up',   label: 'Healthy > 10%' }
};

/* ── Benchmark status: 'good' | 'warn' | 'bad' | 'na' ── */
function _getBenchmarkStatus(ratioName, value) {
  var bm = FINANCE_BENCHMARKS[ratioName];
  if (!bm || value === null || isNaN(value)) return 'na';
  var v = parseFloat(value);
  if (bm.dir === 'up') {
    if (v >= bm.good) return 'good';
    if (v >= bm.warn) return 'warn';
    return 'bad';
  } else {
    if (v <= bm.good) return 'good';
    if (v <= bm.warn) return 'warn';
    return 'bad';
  }
}

/* ── Financial Ratio Calculator (pure JS, uses docDirectChartData) ── */
function calcFinancialRatios(chartData) {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) return null;
  var ds = chartData.datasets;
  var labels = chartData.labels || [];

  function findCol(keywords) {
    var kw = Array.isArray(keywords) ? keywords : [keywords];
    for (var i = 0; i < ds.length; i++) {
      var lbl = (ds[i].label || '').toLowerCase();
      for (var j = 0; j < kw.length; j++) {
        if (lbl.indexOf(kw[j].toLowerCase()) >= 0) return ds[i];
      }
    }
    return null;
  }

  var revCol    = findCol(['revenue', 'income', 'sales', 'turnover', 'total income']);
  var profCol   = findCol(['net profit', 'pat', 'profit after tax', 'net income', 'profit']);
  var ebitdaCol = findCol(['ebitda', 'operating profit', 'ebit', 'gross profit']);
  var equityCol = findCol(['equity', 'net worth', 'shareholders']);
  var debtCol   = findCol(['debt', 'borrowing', 'loan', 'total liabilities']);
  var caCol     = findCol(['current asset', 'current assets']);
  var clCol     = findCol(['current liab', 'current liabilities']);
  var npaCol    = findCol(['npa', 'gnpa', 'non performing']);
  var loanCol   = findCol(['advances', 'total loan', 'total credit', 'total advances']);
  var crarCol   = findCol(['crar', 'capital adequacy', 'car']);

  var ratios = [];
  var nYears = ds[0] ? ds[0].data.length : 0;
  var yearsDetected = labels.slice(0, nYears).map(String);

  function val(col, idx) {
    if (!col || col.data[idx] === undefined) return null;
    var v = parseFloat(col.data[idx]);
    return isNaN(v) ? null : v;
  }

  /* Revenue CAGR */
  if (revCol && nYears >= 2) {
    var r0 = val(revCol, 0), rN = val(revCol, nYears - 1);
    if (r0 && rN && r0 > 0) {
      var cagr = (Math.pow(rN / r0, 1 / (nYears - 1)) - 1) * 100;
      ratios.push({ name: 'Revenue CAGR', value: cagr.toFixed(1), unit: '%', raw: cagr,
        note: yearsDetected[0] + ' to ' + yearsDetected[nYears - 1] });
    }
  }

  /* YoY Revenue Growth */
  if (revCol && nYears >= 2) {
    var rv1 = val(revCol, nYears - 2), rv2 = val(revCol, nYears - 1);
    if (rv1 && rv2 && rv1 > 0) {
      var yoy = ((rv2 - rv1) / rv1) * 100;
      ratios.push({ name: 'YoY Revenue Growth', value: yoy.toFixed(1), unit: '%', raw: yoy,
        note: 'Latest year vs prior' });
    }
  }

  /* Net Profit Margin */
  if (revCol && profCol && nYears >= 1) {
    var lastRev = val(revCol, nYears - 1), lastProf = val(profCol, nYears - 1);
    if (lastRev && lastProf) {
      var npm = (lastProf / lastRev) * 100;
      ratios.push({ name: 'Net Profit Margin', value: npm.toFixed(1), unit: '%', raw: npm, note: 'Latest year' });
    }
  }

  /* ROE */
  if (profCol && equityCol && nYears >= 1) {
    var lp = val(profCol, nYears - 1), le = val(equityCol, nYears - 1);
    if (lp && le && le > 0) {
      var roe = (lp / le) * 100;
      ratios.push({ name: 'ROE', value: roe.toFixed(1), unit: '%', raw: roe, note: 'Return on Equity' });
    }
  }

  /* Debt-Equity */
  if (debtCol && equityCol && nYears >= 1) {
    var ld = val(debtCol, nYears - 1), leq = val(equityCol, nYears - 1);
    if (ld !== null && leq && leq > 0) {
      var de = ld / leq;
      ratios.push({ name: 'Debt-Equity Ratio', value: de.toFixed(2), unit: 'x', raw: de, note: 'Latest year' });
    }
  }

  /* Current Ratio */
  if (caCol && clCol && nYears >= 1) {
    var lca = val(caCol, nYears - 1), lcl = val(clCol, nYears - 1);
    if (lca && lcl && lcl > 0) {
      var cr = lca / lcl;
      ratios.push({ name: 'Current Ratio', value: cr.toFixed(2), unit: 'x', raw: cr, note: 'Liquidity measure' });
    }
  }

  /* NPA % */
  if (npaCol && loanCol && nYears >= 1) {
    var ln = val(npaCol, nYears - 1), ll = val(loanCol, nYears - 1);
    if (ln !== null && ll && ll > 0) {
      var npa = (ln / ll) * 100;
      ratios.push({ name: 'NPA %', value: npa.toFixed(2), unit: '%', raw: npa, note: 'RBI norm < 3%' });
    }
  }

  /* CRAR */
  if (crarCol && nYears >= 1) {
    var lc = val(crarCol, nYears - 1);
    if (lc !== null) {
      ratios.push({ name: 'CRAR %', value: lc.toFixed(2), unit: '%', raw: lc, note: 'RBI minimum 11%' });
    }
  }

  /* Time series for charts */
  var timeSeries = { years: yearsDetected };
  if (revCol)    timeSeries.revenue = revCol.data.slice(0, nYears);
  if (profCol)   timeSeries.profit  = profCol.data.slice(0, nYears);
  if (ebitdaCol) timeSeries.ebitda  = ebitdaCol.data.slice(0, nYears);

  /* Waterfall (latest year) */
  var waterfall = [];
  if (revCol) {
    var rev = val(revCol, nYears - 1);
    if (rev) waterfall.push({ label: 'Revenue', value: rev, type: 'start' });
  }
  if (ebitdaCol) {
    var revV = revCol ? val(revCol, nYears - 1) : null;
    var eV   = val(ebitdaCol, nYears - 1);
    if (revV && eV) {
      waterfall.push({ label: 'EBITDA', value: eV, type: 'positive' });
      waterfall.push({ label: 'Operating Costs', value: -(revV - eV), type: 'negative' });
    }
  }
  if (profCol) {
    var pV = val(profCol, nYears - 1);
    if (pV !== null) waterfall.push({ label: 'Net Profit', value: pV, type: 'end' });
  }

  return {
    ratios: ratios,
    yearsDetected: timeSeries.years,
    timeSeries: timeSeries,
    waterfall: waterfall,
    columnsFound: {
      revenue: !!revCol, profit: !!profCol, equity: !!equityCol,
      debt: !!debtCol, ebitda: !!ebitdaCol, npa: !!npaCol
    }
  };
}

/* ── Finance-enriched AI prompt builder ── */
function _buildFinancePrompt(ratios, statsContext, textSample, context, tone, truncated) {
  var ratioSummary = '';
  if (ratios && ratios.ratios.length > 0) {
    ratioSummary = '\n=== PRE-CALCULATED FINANCIAL RATIOS (use exact numbers) ===\n';
    ratios.ratios.forEach(function(r) {
      var st = _getBenchmarkStatus(r.name, r.raw);
      var flag = st === 'good' ? 'PASS' : st === 'warn' ? 'CAUTION' : st === 'bad' ? 'FLAG' : '';
      var bm = FINANCE_BENCHMARKS[r.name];
      var benchmark = bm ? ' (Benchmark: ' + bm.label + ')' : '';
      ratioSummary += '  ' + r.name + ': ' + r.value + r.unit + '  [' + flag + ']' + benchmark + '\n';
    });
    ratioSummary += 'Period: ' + (ratios.yearsDetected[0] || '') + ' to ' + (ratios.yearsDetected[ratios.yearsDetected.length - 1] || '') + ' (' + ratios.yearsDetected.length + ' years)\n\n';
  }
  var p = 'You are a Chartered Accountant (CA) and Senior Credit Analyst specialising in corporate banking and investment analysis.\n\n';
  if (ratioSummary) {
    p += ratioSummary;
    p += 'IMPORTANT: The ratios above are CALCULATED FROM ACTUAL EXCEL DATA. Reference specific numbers.\n\n';
  }
  if (statsContext) p += '=== RAW DATA SUMMARY ===\n' + statsContext + '\n\n';
  p += '=== FINANCIAL DATA ===\n' + textSample + '\n';
  if (truncated) p += '[Data continues - excerpt shown]\n';
  if (context) p += '\nUser notes: "' + context + '"\n';
  p += '\nTone: ' + tone + '\n\n';
  p += 'Provide expert CREDIT ANALYST analysis (2-3 sentences each point):\n';
  p += '1. EXECUTIVE SUMMARY - overall financial health referencing specific ratio numbers\n';
  p += '2. KEY RATIOS - comment on each calculated ratio vs benchmark\n';
  p += '3. TREND ANALYSIS - revenue, profit, key metric trajectories\n';
  p += '4. RED FLAGS - 2-3 concerns from the numbers\n';
  p += '5. STRENGTHS - 2-3 positive indicators\n';
  p += '6. CREDIT/INVESTMENT RECOMMENDATION - clear actionable verdict\n';
  p += '\nReturn ONLY valid JSON:\n';
  p += '{"title":"concise report title max 8 words",';
  p += '"summary":"3-sentence expert executive summary with specific ratio numbers",';
  p += '"keyPoints":["ratio finding 1","ratio finding 2","trend finding 3","red flag 4","strength 5"],';
  p += '"stats":[{"label":"Net Profit Margin","value":"XX.X%","trend":"up"},{"label":"Revenue CAGR","value":"X.X%","trend":"up"},{"label":"ROE","value":"XX%","trend":"neutral"}],';
  p += '"recommendations":["specific credit action 1","action 2","action 3","action 4"],';
  p += '"hashtags":["#Finance","#CreditAnalysis","#Banking","#Investment","#FinancialHealth"]}';
  p += '\n\nCRITICAL: Use pre-calculated ratios. Do NOT fabricate numbers.';
  return p;
}

/* ── KPI Cards renderer ── */
function renderFinanceKPICards(container, ratios) {
  if (!ratios || ratios.ratios.length === 0) {
    container.innerHTML = '<div style="color:rgba(255,255,255,0.4);font-size:13px;padding:16px 0">Upload an Excel with financial columns (Revenue, Profit, Equity, NPA) to calculate live ratios.</div>';
    return;
  }
  var icons   = { good: '\u2705', warn: '\u26a0\ufe0f', bad: '\u274c', na: '\u2014' };
  var colors  = { good: '#4ade80', warn: '#fbbf24', bad: '#f87171', na: 'rgba(255,255,255,0.4)' };
  var borders = { good: 'rgba(74,222,128,0.3)', warn: 'rgba(251,191,36,0.3)', bad: 'rgba(248,113,113,0.3)', na: 'rgba(255,255,255,0.1)' };

  var html = '<div class="fin-kpi-grid">';
  ratios.ratios.forEach(function(r) {
    var st  = _getBenchmarkStatus(r.name, r.raw);
    var bm  = FINANCE_BENCHMARKS[r.name];
    var bmNote = bm ? bm.label : (r.note || '');
    html += '<div class="fin-kpi-card" style="border-color:' + borders[st] + '">'
      + '<div class="fin-kpi-status">' + (icons[st] || '\u2014') + '</div>'
      + '<div class="fin-kpi-value" style="color:' + colors[st] + '">' + r.value + r.unit + '</div>'
      + '<div class="fin-kpi-name">' + r.name + '</div>'
      + '<div class="fin-kpi-bm">' + bmNote + '</div>'
      + '</div>';
  });
  html += '</div>';

  /* Columns found note */
  if (ratios.columnsFound) {
    var cf = ratios.columnsFound;
    var found = [];
    if (cf.revenue) found.push('Revenue');
    if (cf.profit)  found.push('Profit');
    if (cf.equity)  found.push('Equity');
    if (cf.debt)    found.push('Debt');
    if (cf.ebitda)  found.push('EBITDA');
    if (cf.npa)     found.push('NPA');
    if (found.length > 0) {
      html += '<div class="fin-cols-found">\ud83d\udcca Detected: <strong>' + found.join(', ') + '</strong>';
      if (ratios.yearsDetected.length >= 2) {
        html += ' \u00b7 <span style="color:#4ade80">' + ratios.yearsDetected.length + ' years of data</span>';
      } else {
        html += ' \u00b7 <span style="color:#fbbf24">\u26a0\ufe0f Upload multi-year data for CAGR</span>';
      }
      html += '</div>';
    }
  }
  container.innerHTML = html;
}

/* ── Format large financial numbers ── */
function _fmtFinNum(v) {
  if (v === null || v === undefined || isNaN(v)) return 'N/A';
  var n = Math.abs(v), sign = v < 0 ? '-' : '';
  if (n >= 1e7)  return sign + (n / 1e7).toFixed(1) + ' Cr';
  if (n >= 1e5)  return sign + (n / 1e5).toFixed(1) + ' L';
  if (n >= 1e3)  return sign + (n / 1e3).toFixed(1) + 'K';
  return sign + n.toFixed(1);
}

/* ── Waterfall P&L Chart ── */
async function renderWaterfallChart(canvasId, waterfallData) {
  if (!window.Chart) await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
  if (!window.ChartDataLabels) await loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js');
  var canvas = document.getElementById(canvasId);
  if (!canvas || !waterfallData || waterfallData.length === 0) return;

  var labels = [], bases = [], values = [], colors = [], running = 0;
  waterfallData.forEach(function(item) {
    labels.push(item.label);
    if (item.type === 'start') {
      bases.push(0); values.push(item.value); colors.push('rgba(255,112,67,0.85)'); running = item.value;
    } else if (item.type === 'end') {
      bases.push(0); values.push(item.value); colors.push('rgba(56,189,248,0.85)');
    } else if (item.value >= 0) {
      bases.push(running); values.push(item.value); colors.push('rgba(74,222,128,0.8)'); running += item.value;
    } else {
      running += item.value; bases.push(running); values.push(-item.value); colors.push('rgba(248,113,113,0.8)');
    }
  });

  var existing = canvas._chartInstance;
  if (existing) { existing.destroy(); canvas._chartInstance = null; }

  try { Chart.register(ChartDataLabels); } catch(e) {}

  canvas._chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Base', data: bases, backgroundColor: 'transparent', borderWidth: 0,
          datalabels: { display: false } },
        { label: 'Value', data: values, backgroundColor: colors, borderRadius: 4, borderSkipped: false,
          datalabels: { anchor: 'end', align: 'top', color: '#fff', font: { size: 11, weight: 'bold' },
            formatter: function(v, ctx) {
              var raw = waterfallData[ctx.dataIndex];
              var sign = (raw && raw.value < 0) ? '-' : '';
              return sign + _fmtFinNum(Math.abs(v));
            }
          }
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(ctx) {
          var raw = waterfallData[ctx.dataIndex];
          return raw ? (raw.label + ': ' + _fmtFinNum(Math.abs(raw.value))) : '';
        }}}
      },
      scales: {
        x: { stacked: true, ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } }, grid: { display: false } },
        y: { stacked: true, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 9 },
               callback: function(v) { return _fmtFinNum(v); } }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

/* ── YoY Grouped Bar Chart ── */
async function renderYoYGroupedBar(canvasId, timeSeries) {
  if (!window.Chart) await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
  var canvas = document.getElementById(canvasId);
  if (!canvas || !timeSeries || !timeSeries.years || timeSeries.years.length === 0) return;

  var palette = ['rgba(255,112,67,0.85)', 'rgba(56,189,248,0.85)', 'rgba(74,222,128,0.85)', 'rgba(251,191,36,0.85)'];
  var datasets = [], pi = 0;
  var showLabels = timeSeries.years.length <= 6;

  if (timeSeries.revenue && timeSeries.revenue.length > 0) {
    datasets.push({ label: 'Revenue', data: timeSeries.revenue, backgroundColor: palette[pi++ % palette.length],
      borderRadius: 4,
      datalabels: { display: showLabels, anchor: 'end', align: 'top', color: '#fff',
        font: { size: 9, weight: 'bold' }, formatter: function(v) { return _fmtFinNum(v); } }
    });
  }
  if (timeSeries.ebitda && timeSeries.ebitda.length > 0) {
    datasets.push({ label: 'EBITDA', data: timeSeries.ebitda, backgroundColor: palette[pi++ % palette.length],
      borderRadius: 4, datalabels: { display: false } });
  }
  if (timeSeries.profit && timeSeries.profit.length > 0) {
    datasets.push({ label: 'Net Profit', data: timeSeries.profit, backgroundColor: palette[pi++ % palette.length],
      borderRadius: 4, datalabels: { display: false } });
  }
  if (datasets.length === 0) return;

  var existing = canvas._chartInstance;
  if (existing) { existing.destroy(); canvas._chartInstance = null; }

  try { Chart.register(ChartDataLabels); } catch(e) {}

  canvas._chartInstance = new Chart(canvas, {
    type: 'bar',
    data: { labels: timeSeries.years, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: 'rgba(255,255,255,0.65)', font: { size: 10 }, padding: 12 } },
        tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ' + _fmtFinNum(ctx.parsed.y); } } }
      },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 9 },
               callback: function(v) { return _fmtFinNum(v); } }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

/* ── Build Banking Output HTML ── */
function buildBankingOutputHTML(result, ratios) {
  var title = result.title || 'Financial Intelligence Report';

  var header = '<div class="fin-report-header">'
    + '<div class="fin-report-badge">\ud83c\udfe6 Banking &amp; Finance Intelligence</div>'
    + '<div class="fin-report-title">\u2728 ' + title + '</div>'
    + (docFileName ? '<div class="fin-report-file">\ud83d\udcc4 ' + docFileName + '</div>' : '')
    + '</div>';

  var kpiSection = '<div class="fin-section">'
    + '<div class="fin-section-heading">\ud83d\udcca Financial Ratios \u2014 Live Calculated vs RBI Benchmarks</div>'
    + '<div id="finKpiCards"></div>'
    + '</div>';

  var hasWaterfall = ratios && ratios.waterfall && ratios.waterfall.length >= 2;
  var hasYoY = ratios && ratios.timeSeries && ratios.yearsDetected && ratios.yearsDetected.length >= 2;

  var chartsSection = '';
  if (hasWaterfall || hasYoY) {
    chartsSection = '<div class="fin-charts-row">';
    if (hasWaterfall) {
      chartsSection += '<div class="fin-chart-panel">'
        + '<div class="fin-chart-title">\ud83c\udf0a P&amp;L Waterfall \u2014 Latest Year</div>'
        + '<div class="fin-chart-wrap"><canvas id="finWaterfallChart"></canvas></div>'
        + '</div>';
    }
    if (hasYoY) {
      chartsSection += '<div class="fin-chart-panel">'
        + '<div class="fin-chart-title">\ud83d\udcc8 Year-on-Year Comparison</div>'
        + '<div class="fin-chart-wrap"><canvas id="finYoYChart"></canvas></div>'
        + '</div>';
    }
    chartsSection += '</div>';
  }

  var kp   = result.keyPoints       || [];
  var recs = result.recommendations || [];

  var summarySection = '<div class="fin-section">'
    + '<div class="fin-section-heading">\ud83e\udd16 AI Expert Analysis <span class="fin-badge-ca">Credit Analyst</span></div>'
    + '<div class="fin-summary-box">' + (result.summary || '') + '</div>'
    + '</div>';

  var insightsSection = '';
  if (kp.length > 0 || recs.length > 0) {
    insightsSection = '<div class="fin-two-col">';
    if (kp.length > 0) {
      insightsSection += '<div class="fin-section"><div class="fin-section-heading">\ud83d\udd11 Key Findings</div>'
        + '<ul class="fin-points-list">';
      kp.forEach(function(p) { insightsSection += '<li>' + p + '</li>'; });
      insightsSection += '</ul></div>';
    }
    if (recs.length > 0) {
      insightsSection += '<div class="fin-section"><div class="fin-section-heading">\ud83c\udfaf Recommendations</div>'
        + '<ol class="fin-recs-list">';
      recs.forEach(function(r) { insightsSection += '<li>' + r + '</li>'; });
      insightsSection += '</ol></div>';
    }
    insightsSection += '</div>';
  }

  var actSection = '<div class="doc-action-row" style="margin-top:20px">'
    + '<button class="doc-action-btn doc-action-primary" onclick="exportBankingToPDF()">\ud83d\udcd1 Credit Report PDF</button>'
    + '<button class="doc-action-btn doc-action-secondary" onclick="exportDocToPPT()">\ud83c\udfa5 Export PPT</button>'
    + '<button class="doc-action-btn" onclick="shareDocAnalysis(this)">\ud83d\udd17 Share Link</button>'
    + '<button class="doc-action-btn" onclick="copyDocSummary()">\ud83d\udccb Copy</button>'
    + '</div>';

  /* Legal disclaimer — mandatory for financial output (SEBI/RBI compliance) */
  var disclaimer = '<div class="fin-legal-disclaimer">'
    + '\u26a0\ufe0f <strong>Important Disclaimer:</strong> This analysis is generated by an AI tool for '
    + '<strong>informational purposes only</strong>. It does <strong>not</strong> constitute financial, '
    + 'investment, credit, or professional advice. Clarix is not a registered investment advisor, '
    + 'credit rating agency, or financial institution. Ratios are calculated from user-uploaded data '
    + 'and may contain errors. Always consult a qualified CA, banker, or SEBI-registered advisor '
    + 'before making financial decisions. Clarix assumes no liability for decisions made based on '
    + 'this output.'
    + '</div>';

  return header + disclaimer + kpiSection + chartsSection + summarySection + insightsSection + actSection;
}

/* ── Render Banking Output (entry point) ── */
function renderBankingOutput(result) {
  _currentDocResult   = result;
  _currentDocSlideIdx = 0;
  var out       = document.getElementById('studioOutput');
  var container = document.getElementById('docAnalyzerOutput');
  if (!out || !container) return;

  var ratios = calcFinancialRatios(docDirectChartData);
  out.classList.add('visible');
  container.innerHTML = buildBankingOutputHTML(result, ratios);
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  var kpiEl = document.getElementById('finKpiCards');
  if (kpiEl) renderFinanceKPICards(kpiEl, ratios);

  setTimeout(function() {
    if (ratios && ratios.waterfall && ratios.waterfall.length >= 2) {
      renderWaterfallChart('finWaterfallChart', ratios.waterfall);
    }
    if (ratios && ratios.timeSeries && ratios.yearsDetected && ratios.yearsDetected.length >= 2) {
      renderYoYGroupedBar('finYoYChart', ratios.timeSeries);
    }
  }, 350);
}

/* ── Export Banking Credit Report PDF ── */
async function exportBankingToPDF() {
  var result = _currentDocResult;
  if (!result) { Toast.show('Generate analysis first', 'error'); return; }
  Toast.show('\ud83d\udcd1 Building Credit Report PDF\u2026', 'info', 8000);
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');
    var ratios = calcFinancialRatios(docDirectChartData);
    var pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    var W = 210, mg = 14, cw = W - mg * 2, y = 18;
    function newPage() { pdf.addPage(); y = 18; }
    function needY(h) { if (y + h > 270) newPage(); }

    /* Cover */
    pdf.setFillColor(15, 15, 26); pdf.rect(0, 0, W, 52, 'F');
    pdf.setFillColor(255, 112, 67); pdf.rect(0, 0, W, 4, 'F');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(20); pdf.setTextColor(255, 255, 255);
    pdf.text(result.title || 'Financial Intelligence Report', mg, 22);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.setTextColor(255, 112, 67);
    pdf.text('Credit Analysis Report  \u2022  Powered by Clarix AI', mg, 31);
    pdf.setFontSize(9); pdf.setTextColor(180, 180, 200);
    var dateLine = (docFileName ? docFileName + '  \u2022  ' : '') + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    pdf.text(dateLine, mg, 39);
    if (ratios && ratios.yearsDetected.length > 0) {
      pdf.text('Period: ' + ratios.yearsDetected[0] + ' \u2192 ' + ratios.yearsDetected[ratios.yearsDetected.length - 1]
        + ' (' + ratios.yearsDetected.length + ' year' + (ratios.yearsDetected.length > 1 ? 's' : '') + ')', mg, 46);
    }
    y = 62;

    function sectionHeader(label, r, g, b) {
      needY(12);
      pdf.setFillColor(r, g, b); pdf.rect(mg, y, cw, 0.8, 'F');
      y += 4;
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(r, g, b);
      pdf.text(label, mg, y);
      y += 6; pdf.setTextColor(30, 30, 50);
    }

    /* Executive Summary */
    sectionHeader('EXECUTIVE SUMMARY', 56, 189, 248);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11);
    var sumLines = pdf.splitTextToSize(result.summary || '', cw);
    sumLines.forEach(function(line) { needY(6); pdf.text(line, mg, y); y += 5.8; });
    y += 8;

    /* Financial Ratios Table */
    if (ratios && ratios.ratios.length > 0) {
      sectionHeader('FINANCIAL RATIOS \u2014 RBI BENCHMARK ANALYSIS', 255, 112, 67);
      pdf.autoTable({
        startY: y, margin: { left: mg, right: mg },
        head: [['Ratio', 'Value', 'Benchmark', 'Status']],
        body: ratios.ratios.map(function(r) {
          var st = _getBenchmarkStatus(r.name, r.raw);
          var bm = FINANCE_BENCHMARKS[r.name];
          var statusLabel = st === 'good' ? 'PASS' : st === 'warn' ? 'CAUTION' : st === 'bad' ? 'FLAG' : 'N/A';
          return [r.name, r.value + r.unit, bm ? bm.label : (r.note || '\u2014'), statusLabel];
        }),
        headStyles: { fillColor: [26, 26, 46], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fillColor: [248, 248, 252], textColor: [30, 30, 50], fontSize: 10 },
        alternateRowStyles: { fillColor: [238, 238, 248] },
        styles: { cellPadding: 4, lineColor: [200, 200, 220], lineWidth: 0.3 }
      });
      y = pdf.lastAutoTable.finalY + 10;
    }

    /* Key Findings */
    if ((result.keyPoints || []).length > 0) {
      sectionHeader('KEY FINDINGS', 56, 189, 248);
      result.keyPoints.forEach(function(pt) {
        var lines = pdf.splitTextToSize('\u25b8  ' + pt, cw - 6);
        needY(lines.length * 5.5 + 3);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10.5); pdf.setTextColor(30, 30, 50);
        pdf.text(lines, mg + 2, y); y += lines.length * 5.5 + 4;
      }); y += 4;
    }

    /* Recommendations */
    if ((result.recommendations || []).length > 0) {
      needY(20);
      sectionHeader('CREDIT / INVESTMENT RECOMMENDATIONS', 255, 112, 67);
      result.recommendations.forEach(function(r, i) {
        var rLines = pdf.splitTextToSize((i + 1) + '.  ' + r, cw - 6);
        needY(rLines.length * 5.5 + 4);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10.5); pdf.setTextColor(30, 30, 50);
        pdf.text(rLines, mg + 2, y); y += rLines.length * 5.5 + 5;
      });
    }

    /* Footer on all pages */
    var pages = pdf.internal.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      pdf.setPage(p);
      pdf.setDrawColor(200, 200, 220); pdf.line(mg, 286, W - mg, 286);
      pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(150, 150, 180);
      pdf.text('Clarix AI Credit Analysis  \u2022  clarix.digital', mg, 291);
      pdf.text('Page ' + p + ' of ' + pages, W - mg, 291, { align: 'right' });
    }
    var fn = 'Clarix-Credit-' + (result.title || 'Report').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-') + '.pdf';
    pdf.save(fn);
    Toast.show('\ud83d\udcd1 Credit Report PDF downloaded!', 'success');
  } catch(err) {
    console.error('[BankingPDF]', err);
    Toast.show('\u274c PDF export failed: ' + (err.message || 'Unknown error'), 'error');
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

