/* ═══════════════════════════════════════════════
   CLARIX — WRITE PAGE JS V3
   Both-mode dual dropdowns • Language placeholders
   Profanity detection • Output in selected language
   History tracking • Direction generated
═══════════════════════════════════════════════ */

/* ─── PLATFORM DATA ───────────────────────────── */
const AI_PLATFORMS = [
  { value:'ChatGPT',    label:'🤖 ChatGPT',      url:'https://chat.openai.com' },
  { value:'Claude',     label:'🧠 Claude',        url:'https://claude.ai' },
  { value:'Gemini',     label:'♊ Gemini',         url:'https://gemini.google.com' },
  { value:'Grok',       label:'⚡ Grok',           url:'https://grok.x.ai' },
  { value:'DeepSeek',   label:'🌊 DeepSeek',      url:'https://chat.deepseek.com' },
  { value:'Perplexity', label:'🔍 Perplexity',    url:'https://perplexity.ai' },
  { value:'Copilot',    label:'🪟 Copilot',        url:'https://copilot.microsoft.com' },
  { value:'Meta AI',    label:'🤳 Meta AI',        url:'https://meta.ai' },
  { value:'Midjourney', label:'🎨 Midjourney',     url:'https://midjourney.com' },
  { value:'Krutrim',    label:'🇮🇳 Krutrim',       url:'https://krutrim.com' },
];
const SOCIAL_PLATFORMS = [
  { value:'Instagram',  label:'📸 Instagram',     url:'https://instagram.com' },
  { value:'WhatsApp',   label:'💬 WhatsApp',       url:'https://web.whatsapp.com' },
  { value:'LinkedIn',   label:'💼 LinkedIn',       url:'https://linkedin.com' },
  { value:'Twitter/X',  label:'🐦 Twitter/X',      url:'https://x.com' },
  { value:'Facebook',   label:'👥 Facebook',       url:'https://facebook.com' },
  { value:'YouTube',    label:'▶️ YouTube',         url:'https://studio.youtube.com' },
  { value:'Threads',    label:'🧵 Threads',         url:'https://threads.net' },
  { value:'Reddit',     label:'🔴 Reddit',          url:'https://reddit.com' },
  { value:'Telegram',   label:'✈️ Telegram',        url:'https://web.telegram.org' },
  { value:'ShareChat',  label:'🇮🇳 ShareChat',      url:'https://sharechat.com' },
  { value:'Snapchat',   label:'👻 Snapchat',        url:'https://snapchat.com' },
  { value:'Pinterest',  label:'📌 Pinterest',       url:'https://pinterest.com' },
];

/* ─── LANGUAGE PLACEHOLDERS ───────────────────── */
const LANG_PLACEHOLDERS = {
  'hi':    'यहाँ अपना विचार लिखें... उदाहरण: एक professional email लिखो manager को',
  'hi-en': 'Apna idea yahan likho... e.g. ek professional email likhna hai manager ko',
  'mr':    'इथे तुमचा विचार लिहा... उदाहरण: एक व्यावसायिक ईमेल लिहा',
  'bn':    'এখানে আপনার ধারণা লিখুন... উদাহরণ: একটি পেশাদার ইমেইল লিখুন',
  'te':    'ఇక్కడ మీ ఆలోచన రాయండి... ఉదా: ఒక professional email రాయండి',
  'ta':    'உங்கள் யோசனையை இங்கே எழுதுங்கள்... எ.கா: ஒரு professional email எழுதுங்கள்',
  'gu':    'અહીં તમારો વિચાર લખો... ઉદા: એક professional email લખો',
  'kn':    'ಇಲ್ಲಿ ನಿಮ್ಮ ಆಲೋಚನೆ ಬರೆಯಿರಿ... ಉದಾ: ಒಂದು professional email ಬರೆಯಿರಿ',
  'ml':    'ഇവിടെ നിങ്ങളുടെ ആശയം എഴുതുക... ഉദാ: ഒരു professional email എഴുതുക',
  'pa':    'ਇੱਥੇ ਆਪਣਾ ਵਿਚਾਰ ਲਿਖੋ... ਉਦਾ: ਇੱਕ professional email ਲਿਖੋ',
  'ur':    'یہاں اپنا خیال لکھیں... مثال: ایک professional email لکھیں',
  'ar':    'اكتب فكرتك هنا... مثال: اكتب بريداً إلكترونياً احترافياً',
  'ja':    'ここにアイデアを書いてください... 例：プロフェッショナルなメールを書く',
  'zh':    '在这里写下您的想法... 例如：写一封专业邮件',
  'ko':    '여기에 아이디어를 작성하세요... 예: 전문적인 이메일 작성',
  'en':    'Type your idea here... e.g. Write a sick leave email to my manager',
};

/* ─── NATIVE "RE-ENHANCE" BUTTON LABELS ──────── */
const LANG_ENHANCE_LABELS = {
  'hi':    '⚡ हिंदी में पुनः सुधारें',
  'hi-en': '⚡ Hinglish mein re-enhance karo',
  'mr':    '⚡ मराठीत पुन्हा सुधारा',
  'bn':    '⚡ বাংলায় পুনরায় উন্নত করুন',
  'te':    '⚡ తెలుగులో మళ్ళీ మెరుగుపరచండి',
  'ta':    '⚡ தமிழில் மீண்டும் மேம்படுத்துங்கள்',
  'gu':    '⚡ ગુજરાતીમાં ફરી સુધારો',
  'kn':    '⚡ ಕನ್ನಡದಲ್ಲಿ ಮರು-ವರ್ಧಿಸಿ',
  'ml':    '⚡ മലയാളത്തിൽ വീണ്ടും മെച്ചപ്പെടുത്തുക',
  'pa':    '⚡ ਪੰਜਾਬੀ ਵਿੱਚ ਦੁਬਾਰਾ ਸੁਧਾਰੋ',
  'ur':    '⚡ اردو میں دوبارہ بہتر بنائیں',
  'ar':    '⚡ إعادة التحسين بالعربية',
  'ja':    '⚡ 日本語で再強化',
  'zh':    '⚡ 用中文重新优化',
  'ko':    '⚡ 한국어로 다시 향상',
  'es':    '⚡ Re-mejorar en Español',
  'fr':    '⚡ Ré-améliorer en Français',
  'de':    '⚡ Erneut auf Deutsch verbessern',
  'en':    '⚡ Re-enhance in English',
};

/* ─── PROFANITY LIST (common Hindi + English) ─── */
const PROFANITY_WORDS = [
  'bc','mc','bkl','chutiya','madarchod','bhenchod','gandu','harami','randi',
  'fuck','shit','ass','bitch','bastard','crap',
  'saala','sala','bsdk','lodu','gaand','chut','teri maa',
  'boobs','boob','dick','penis','vagina','sex','nude','naked','porn',
];

/* Maps profanity → clean replacement — context-aware */
const PROFANITY_REPLACE = {
  'chutiya':'senseless','madarchod':'disrespectful','bhenchod':'disrespectful',
  'gandu':'incompetent','harami':'irresponsible','randi':'disrespectful',
  'fuck':'mess up','shit':'issue','ass':'person','bitch':'person','bastard':'person','crap':'problem',
  'saala':'person','sala':'person','bsdk':'disrespectful','lodu':'incompetent','gaand':'behind','chut':'person',
  'teri maa':'your family',
  // body parts — replaced with [REDACTED] so AI re-writes contextually
  'boobs':'[REDACTED]','boob':'[REDACTED]','dick':'[REDACTED]','penis':'[REDACTED]',
  'vagina':'[REDACTED]','sex':'[REDACTED]','nude':'[REDACTED]','naked':'[REDACTED]','porn':'[REDACTED]',
  'bc':'disrespectful','mc':'disrespectful','bkl':'disrespectful',
};

/* Cleans text — replaces profanity with professional alternatives */
function cleanProfanityFromText(text) {
  let cleaned = text;
  // Multi-word phrases first
  cleaned = cleaned.replace(/teri maa/gi, 'your family');
  // Single words
  PROFANITY_WORDS.forEach(word => {
    if (word.includes(' ')) return; // already handled above
    const replacement = PROFANITY_REPLACE[word.toLowerCase()] || '***';
    const rx = new RegExp('(?<![\\w\u0900-\u097F])' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w\u0900-\u097F])', 'gi');
    cleaned = cleaned.replace(rx, replacement);
  });
  return cleaned;
}

/* ─── TEMPLATES ───────────────────────────────── */
const TEMPLATES = [
  { icon:'🤒', name:'Sick Leave Email',   text:'Manager ko ek professional sick leave email likhna hai kal ke liye. Brief aur empathetic rakhna.' },
  { icon:'💼', name:'LinkedIn Post',      text:'Ek LinkedIn post likhna hai jo ek key professional lesson ke baare mein ho jo maine is hafte seekha.' },
  { icon:'📸', name:'Instagram Caption',  text:'Golden hour mein sunset photo ke liye ek creative Instagram caption likhna hai.' },
  { icon:'💬', name:'WhatsApp Message',   text:'Ek purane dost ko reconnect karne ke liye warm WhatsApp message likhna hai.' },
  { icon:'📝', name:'Blog Intro',         text:'AI tools ke baare mein ek engaging blog post introduction likhna hai Indian creators ke liye.' },
  { icon:'💰', name:'Salary Negotiation', text:'Manager ko ek professional email likhna hai 25% salary increase ke liye, confident lekin respectful tone mein.' },
  { icon:'🎬', name:'60-sec Script',      text:'60 second YouTube Shorts script likhna hai 3 morning habits ke baare mein jo productivity improve karti hain.' },
  { icon:'🚀', name:'Startup Pitch',      text:'Ek compelling one-paragraph startup pitch likhna hai AI productivity app ke liye Indian college students ke liye.' },
  { icon:'💻', name:'Code Debug',         text:'Mujhe is code ko debug karne mein madad chahiye. Error explain karo aur corrected version do with explanation.' },
  { icon:'🎨', name:'Image Prompt',       text:'Create a detailed image prompt for a futuristic Indian city at night with neon lights and rain. Hyper-realistic.' },
];

/* ─── STATE ───────────────────────────────────── */
let currentMode     = 'ai';
let currentResult   = null;
let selectedVariIdx = 0;

/* ─── INIT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Sidebar.init();
  Onboarding.init();
  renderPlatforms();
  renderSocialPlatforms();
  restoreLang();
  checkIncoming();
  setStep(1);

  document.addEventListener('click', e => {
    if (!document.getElementById('templatesWrap')?.contains(e.target))
      document.getElementById('templatesDropdown')?.classList.remove('open');
  });

  let suggestTimer;
  document.getElementById('promptInput')?.addEventListener('input', e => {
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(() => renderAutoSuggest(e.target.value), 1200);
    setStep(3);
    // Restore enhance button when user edits
    var enhBtn = document.getElementById('enhanceBtn');
    if (enhBtn && enhBtn.dataset.state === 'done') {
      enhBtn.dataset.state = '';
      enhBtn.innerHTML = '\u26A1 Enhance with AI';
    }
  });

  // Issue 7 fix: auto-select platform if coming from Apps with a preset
  const incomingPlatform = localStorage.getItem('clarix_intent_platform');
  if (incomingPlatform) {
    localStorage.removeItem('clarix_intent_platform');
    const aiSel = document.getElementById('platformSelect');
    const socSel = document.getElementById('socialPlatformSelect');
    const isAI   = AI_PLATFORMS.find(p => p.value === incomingPlatform);
    const isSoc  = SOCIAL_PLATFORMS.find(p => p.value === incomingPlatform);
    if (isAI && aiSel) {
      setMode('ai');
      aiSel.value = incomingPlatform;
      aiSel.dispatchEvent(new Event('change'));
    } else if (isSoc && socSel) {
      setMode('social');
      socSel.value = incomingPlatform;
      socSel.dispatchEvent(new Event('change'));
    }
  }
});

/* ─── STEPPER ─────────────────────────────────── */
function setStep(n) {
  document.querySelectorAll('.ws-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 < n)  el.classList.add('done');
    if (i + 1 === n) el.classList.add('active');
  });
}

/* ─── LANGUAGE ────────────────────────────────── */
function restoreLang() {
  const sel = document.getElementById('writeLangSelect');
  if (!sel) return;
  const code = LangState.code;
  for (const opt of sel.options) {
    if (opt.value.startsWith(code + '|')) { sel.value = opt.value; break; }
  }
  updateLangUI(LangState.flag, LangState.name, LangState.code);
}

function onLangChange(sel) {
  const [code, name, flag, native] = sel.value.split('|');
  LangState.set(code, name, flag, native);
  updateLangUI(flag, name, code);
  setStep(2);

  // If results are already showing, warn the user and prompt re-enhance
  // Only show re-enhance nudge in the RESULTS panel (right side) — NOT on the main enhance button
  if (currentResult) {
    // Update the language pill in the score row
    const scorePills = document.querySelectorAll('#scoresRow .score-pill.orange');
    if (scorePills.length) scorePills[0].textContent = flag + ' ' + name;

    // Native-language label for the re-enhance button
    var nativeLabel = LANG_ENHANCE_LABELS[code] || ('⚡ Re-enhance in ' + name);

    // Show re-enhance nudge if not already there
    let nudge = document.getElementById('langChangeNudge');
    if (!nudge) {
      nudge = document.createElement('div');
      nudge.id = 'langChangeNudge';
      nudge.style.cssText = 'background:rgba(255,152,0,0.06);border:1px solid rgba(255,152,0,0.25);border-radius:12px;padding:12px 16px;font-size:13px;color:#cc5500;margin-bottom:10px;animation:fadeUp 0.3s ease both';
      nudge.innerHTML = '<div style="margin-bottom:8px">🌐 Language changed to <strong>' + name + '</strong>. Tap to get output in the new language.</div>' +
        '<button class="btn btn-primary btn-sm" style="width:100%;padding:10px" onclick="handleEnhance();document.getElementById(\'langChangeNudge\')?.remove()">' + nativeLabel + '</button>';
      const scoresRow = document.getElementById('scoresRow');
      if (scoresRow) scoresRow.insertAdjacentElement('afterend', nudge);
    } else {
      nudge.querySelector('strong').textContent = name;
      var nudgeBtn = nudge.querySelector('button');
      if (nudgeBtn) nudgeBtn.textContent = nativeLabel;
    }
  }
}

function updateLangUI(flag, name, code) {
  document.getElementById('writeLangFlag').textContent = flag;
  document.getElementById('langBadge').textContent = flag + ' ' + name;
  // Update textarea placeholder based on language
  const ta = document.getElementById('promptInput');
  if (ta) {
    ta.placeholder = LANG_PLACEHOLDERS[code] || LANG_PLACEHOLDERS['en'];
    // Highlight in light orange if non-English
    ta.style.background = (code !== 'en')
      ? 'linear-gradient(135deg, #fff 0%, #fff9f7 100%)'
      : '#fff';
    ta.style.borderColor = (code !== 'en') ? 'rgba(255,112,67,0.35)' : '';
  }
}

/* ─── PLATFORM MODE ───────────────────────────── */
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));

  const aiRow     = document.getElementById('aiPlatformRow');
  const socialRow = document.getElementById('socialPlatformRow');

  if (mode === 'ai') {
    aiRow.style.display     = 'flex';
    socialRow.style.display = 'none';
    renderPlatforms();
  } else if (mode === 'social') {
    aiRow.style.display     = 'none';
    socialRow.style.display = 'flex';
    renderSocialPlatforms();
  } else { // both
    aiRow.style.display     = 'flex';
    socialRow.style.display = 'flex';
    renderPlatforms();
    renderSocialPlatforms();
  }
  setStep(2);
}

function renderPlatforms() {
  const sel = document.getElementById('platformSelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Select AI Tool —</option>' +
    AI_PLATFORMS.map(p => '<option value="' + p.value + '">' + p.label + '</option>').join('');
  const def = localStorage.getItem('clarix_default_platform') || '';
  if (def && AI_PLATFORMS.find(p => p.value === def)) sel.value = def;
  sel.onchange = () => {
    const icon = AI_PLATFORMS.find(p => p.value === sel.value)?.label?.split(' ')[0] || '';
    document.getElementById('platformBadge').textContent = icon;
    document.getElementById('platformName').textContent = sel.value || 'AI';
    setStep(2);
  };
  sel.onchange();
}

function renderSocialPlatforms() {
  const sel = document.getElementById('socialPlatformSelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Select Social Platform —</option>' +
    SOCIAL_PLATFORMS.map(p => '<option value="' + p.value + '">' + p.label + '</option>').join('');
  sel.onchange = () => {
    const icon = SOCIAL_PLATFORMS.find(p => p.value === sel.value)?.label?.split(' ')[0] || '';
    document.getElementById('socialPlatformBadge').textContent = icon;
    setStep(2);
  };
}

/* ─── PROFANITY CHECK ─────────────────────────── */
function checkProfanity(text) {
  const lower = text.toLowerCase();
  const found = PROFANITY_WORDS.filter(w => {
    if (w.includes(' ')) {
      // Multi-word phrases: plain includes check
      return lower.includes(w);
    }
    // Single words: Unicode-safe boundary (not \b which fails for Indic chars)
    const rx = new RegExp('(?<![\\w\u0900-\u097F])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w\u0900-\u097F])', 'i');
    return rx.test(lower);
  });
  return found;
}

function showProfanityWarning(words) {
  // Create a non-blocking banner warning
  const existing = document.getElementById('profanityBanner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'profanityBanner';
  banner.innerHTML = '⚠️ Inappropriate language detected and cleaned in output. Keep it respectful — Clarix will handle it professionally.';
  banner.style.cssText = 'background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:10px 14px;font-size:12px;color:#dc2626;margin-bottom:10px;animation:fadeUp 0.3s ease both;';
  const block = document.querySelector('.write-section-block:last-of-type');
  if (block) block.insertAdjacentElement('afterbegin', banner);
  setTimeout(() => banner?.remove(), 5000);
}

/* ─── PROMPT INPUT ──────────────────────────── */
let _profTimer = null;
function onPromptInput(el) {
  const len = el.value.length;
  document.getElementById('charCounter').textContent = len + ' / 2000';
  // Real-time profanity detection — instant inline warning
  clearTimeout(_profTimer);
  _profTimer = setTimeout(() => renderProfanityInline(el.value), 250);
}
function onVoiceFinal() { onPromptInput(document.getElementById('promptInput')); }

function renderProfanityInline(text) {
  let strip = document.getElementById('profanityInlineStrip');
  if (!strip) {
    strip = document.createElement('div');
    strip.id = 'profanityInlineStrip';
    const wrap = document.querySelector('.prompt-textarea-wrap');
    if (wrap) wrap.insertAdjacentElement('afterend', strip);
  }
  const found = checkProfanity(text);
  if (!found.length) { strip.innerHTML = ''; return; }
  strip.innerHTML = '<div style="background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.22);border-radius:8px;padding:8px 12px;font-size:12px;color:#ef4444;display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px">' +
    '<span>⚠️ Inappropriate words detected:</span>' +
    found.map(w => '<span style="background:rgba(239,68,68,0.15);padding:2px 8px;border-radius:4px;font-weight:700;letter-spacing:0.03em">' + w + '</span>').join('') +
    '<span style="color:#999">— Fix them now or we will auto-clean in output.</span>' +
  '</div>';
}

/* ─── TEMPLATES ───────────────────────────────── */
function renderTemplates() {
  document.getElementById('templatesList').innerHTML = TEMPLATES.map((t, i) =>
    '<div class="template-item" onclick="applyTemplate(' + i + ')">' +
    '<span class="template-icon">' + t.icon + '</span><span>' + t.name + '</span></div>'
  ).join('');
}
function toggleTemplates() { document.getElementById('templatesDropdown')?.classList.toggle('open'); }
function applyTemplate(idx) {
  const ta = document.getElementById('promptInput');
  ta.value = TEMPLATES[idx].text; onPromptInput(ta); toggleTemplates(); setStep(3);
  Toast.show('Template "' + TEMPLATES[idx].name + '" loaded', 'success');
}

/* ─── AUTO-SUGGEST ────────────────────────────── */
function renderAutoSuggest(text) {
  const strip = document.getElementById('autosuggestStrip');
  if (!strip || text.length < 8) { if (strip) strip.innerHTML = ''; return; }
  const platform = document.getElementById('platformSelect')?.value || 'AI';
  const lang     = LangState.name;
  const suggestions = [
    'Make it more professional',
    'Add emotional impact',
    'Optimise for ' + platform,
  ];
  strip.innerHTML = suggestions.map(s =>
    '<div class="autosuggest-chip" onclick="applySuggest(\'' + text.replace(/'/g,"\\'").slice(0,60) + ' — ' + s + '\')">' +
    '✦ ' + s + '</div>'
  ).join('');
}
function applySuggest(text) {
  const ta = document.getElementById('promptInput');
  ta.value = text; onPromptInput(ta);
  document.getElementById('autosuggestStrip').innerHTML = '';
}

/* ─── ENHANCE ─────────────────────────────────── */
async function handleEnhance() {
  var input   = document.getElementById('promptInput');
  var rawText = input ? input.value.trim() : '';
  if (!rawText) { Toast.show('Type your prompt first!', 'info'); if (input) input.focus(); return; }

  // ── Issue 1: Platform must be selected before enhancing ──
  var aiPlatform     = document.getElementById('platformSelect')?.value || '';
  var socialPlatform = document.getElementById('socialPlatformSelect')?.value || '';

  if (currentMode === 'ai' && !aiPlatform) {
    Toast.show('⚠️ Please select an AI Tool first (Step 2)', 'warning');
    // Visually highlight the dropdown
    const sel = document.getElementById('platformSelect');
    if (sel) {
      sel.style.borderColor = '#ff4444';
      sel.style.boxShadow   = '0 0 0 3px rgba(255,68,68,0.2)';
      sel.focus();
      setTimeout(() => { sel.style.borderColor = ''; sel.style.boxShadow = ''; }, 2500);
    }
    return;
  }
  if (currentMode === 'social' && !socialPlatform) {
    Toast.show('⚠️ Please select a Social Platform first (Step 2)', 'warning');
    const sel = document.getElementById('socialPlatformSelect');
    if (sel) {
      sel.style.borderColor = '#ff4444';
      sel.style.boxShadow   = '0 0 0 3px rgba(255,68,68,0.2)';
      sel.focus();
      setTimeout(() => { sel.style.borderColor = ''; sel.style.boxShadow = ''; }, 2500);
    }
    return;
  }
  if (currentMode === 'both' && (!aiPlatform || !socialPlatform)) {
    Toast.show('⚠️ Please select both AI Tool and Social Platform (Step 2)', 'warning');
    if (!aiPlatform) {
      const sel = document.getElementById('platformSelect');
      if (sel) { sel.style.borderColor = '#ff4444'; sel.style.boxShadow = '0 0 0 3px rgba(255,68,68,0.2)'; setTimeout(() => { sel.style.borderColor = ''; sel.style.boxShadow = ''; }, 2500); }
    }
    if (!socialPlatform) {
      const sel = document.getElementById('socialPlatformSelect');
      if (sel) { sel.style.borderColor = '#ff4444'; sel.style.boxShadow = '0 0 0 3px rgba(255,68,68,0.2)'; setTimeout(() => { sel.style.borderColor = ''; sel.style.boxShadow = ''; }, 2500); }
    }
    return;
  }

  if (!ClarixState.canEnhance()) { UpgradeModal.show(); return; }

  // Profanity check + clean BEFORE passing to AI
  var badWords = checkProfanity(rawText);
  if (badWords.length) showProfanityWarning(badWords);
  var textToEnhance = badWords.length ? cleanProfanityFromText(rawText) : rawText;

  // Add a note to the AI if profanity was detected, so it fully reconstructs the sentence
  if (badWords.length) {
    textToEnhance = '[REPHRASE TASK] The following text contains typos, grammatical errors, and inappropriate language. ' +
      'Please: (1) Fix ALL spelling/grammar mistakes, (2) Replace ALL inappropriate/profane words with professional alternatives, ' +
      '(3) Reconstruct the message to be fully clear, natural, and professional while preserving the original intent. ' +
      'Do NOT include any inappropriate words in output. Original text: ' + textToEnhance;
  }

  var activePlatform = currentMode === 'social' ? socialPlatform : aiPlatform;

  // Language — always use what user selected
  var langCode = LangState.code || 'en';
  var langName = LangState.name || 'English';

  var btn = document.getElementById('enhanceBtn');
  btn.classList.add('loading'); btn.disabled = true;
  setStep(4);

  try {
    // Pass mode + both platforms for social hashtag/emoji context
    var result = await enhancePrompt(textToEnhance, activePlatform, currentMode, langCode, langName, socialPlatform);
    if (!result) return;
    currentResult   = result;
    selectedVariIdx = 0;
    renderResults(result, aiPlatform, socialPlatform);
    saveToHistory(Object.assign({}, result, { text: rawText, platform: activePlatform, lang: langName, langFlag: LangState.flag }));
    // Track analytics
    if (typeof ProfileAnalytics !== 'undefined') {
      ProfileAnalytics.track(activePlatform, langName);
    }
    /* Only count usage client-side if server didn't already count it */
    if (!result._serverCounted) {
      ClarixState.incUsage();
      ClarixState.inc();
    }
    updateUsageCounter();
    if (window.innerWidth <= 900)
      document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth' });
  } catch(e) {
    Toast.show('Enhancement failed. Try again.', 'error');
    console.error(e);
  } finally {
    btn.classList.remove('loading'); btn.disabled = false;
  }
}

/* ─── RENDER RESULTS ──────────────────────────── */
function renderResults(r, aiPlatform, socialPlatform) {
  document.getElementById('resultsEmpty').style.display   = 'none';
  document.getElementById('resultsContent').style.display = 'block';

  // Remove old language nudge when fresh results come in
  document.getElementById('langChangeNudge')?.remove();

  // Show friendly tip if local fallback handled a non-English language
  var apiNoteEl = document.getElementById('apiLanguageNote');
  if (r._apiNote === '[API_NOTE]') {
    if (!apiNoteEl) {
      apiNoteEl = document.createElement('div');
      apiNoteEl.id = 'apiLanguageNote';
      apiNoteEl.style.cssText = 'background:rgba(255,112,67,0.05);border:1px solid rgba(255,112,67,0.18);border-radius:12px;padding:12px 16px;font-size:13px;color:rgba(0,0,0,0.7);margin-bottom:12px;line-height:1.7;display:flex;align-items:flex-start;gap:10px;';
      document.getElementById('resultsContent').insertAdjacentElement('afterbegin', apiNoteEl);
    }
    var langDisplay = r._langName || LangState.name;
    apiNoteEl.innerHTML = '<span style="font-size:18px;margin-top:1px">✨</span><span><strong style="color:#ff7043;">Enhancing in ' + langDisplay + '</strong> — Clarix AI has prepared your prompt. For fully native ' + langDisplay + ' output, connect an AI platform (ChatGPT, Claude, etc.) above and paste the prompt there.</span>';
  } else if (apiNoteEl) {
    apiNoteEl.remove();
  }

  // Score + lang — ALWAYS use LangState.name, NEVER r.lang from AI
  var displayLang = LangState.flag + ' ' + LangState.name;
  var platformPill = (currentMode === 'both' && aiPlatform && socialPlatform)
    ? '<div class="score-pill orange">🤖 ' + aiPlatform + ' + 📱 ' + socialPlatform + '</div>' : '';

  document.getElementById('scoresRow').innerHTML =
    '<div class="score-pill green">Score: ' + r.score + '/100</div>' +
    '<div class="score-pill orange">' + displayLang + '</div>' +
    platformPill;

  // Intent mode badge (above variations)
  var intentBadge = (r.intent === 'image')
    ? '<div class="intent-mode-badge intent-image">🎨 Image Mode — cinematic terms applied</div>'
    : '<div class="intent-mode-badge intent-text">📝 Text Mode — faithful output, no cinematic additions</div>';

  var existingBadge = document.getElementById('intentModeBadge');
  if (existingBadge) existingBadge.remove();
  var badgeEl = document.createElement('div');
  badgeEl.id = 'intentModeBadge';
  badgeEl.innerHTML = intentBadge;
  document.getElementById('variationsSection').insertAdjacentElement('beforebegin', badgeEl);

  // 3 variation cards
  var allVars = [r.enhanced].concat((r.variations || []).slice(0, 2));
  var labels  = ['Refined Prompt', 'Variation 2', 'Variation 3'];
  document.getElementById('variationsList').innerHTML = allVars.map(function(v, i) {
    return '<div class="variation-card' + (i === 0 ? ' selected' : '') + '" id="vc-' + i + '" onclick="selectVariation(' + i + ')">' +
      '<div class="variation-card-header">' +
        '<div class="variation-num-badge">' + (i + 1) + '</div>' +
        '<div class="variation-card-label">' + labels[i] + '</div>' +
      '</div>' +
      '<div class="variation-card-text">' + escHtml(v) + '</div>' +
      '<span class="variation-selected-tick">✓</span>' +
    '</div>';
  }).join('');

  showSelectedActions(allVars[0], aiPlatform || socialPlatform);

  // Social caption (if Both or Social mode)
  if (r.socialCaption && currentMode !== 'ai') {
    document.getElementById('socialText').textContent = r.socialCaption;
    document.getElementById('socialSection').style.display = 'block';
  } else {
    document.getElementById('socialSection').style.display = 'none';
  }

  // Platform tip
  if (r.platformTip) {
    document.getElementById('tipText').textContent = r.platformTip;
    document.getElementById('tipSection').style.display = 'block';
  }

  // Direction (always show)
  showDirection(r);

  // Breakdown CTA
  document.getElementById('breakdownCta').style.display = 'flex';

  // After results appear: replace Enhance button with two clear post-output actions
  // injected below results — "Add Personal Touch" and "Start Fresh"
  var enhBtn = document.getElementById('enhanceBtn');
  if (enhBtn) {
    enhBtn.style.opacity = '';
    enhBtn.style.transform = '';
    enhBtn.dataset.state = 'done';
    enhBtn.innerHTML = '&#9889; Re-Enhance';
    enhBtn.title = 'Run enhancement again for a fresh result';
  }

  // Inject post-output action bar (Start Fresh + Add Personal Touch)
  var existingPostBar = document.getElementById('postOutputBar');
  if (existingPostBar) existingPostBar.remove();
  var postBar = document.createElement('div');
  postBar.id = 'postOutputBar';
  postBar.style.cssText = 'display:flex;gap:10px;margin-bottom:16px;animation:fadeUp 0.4s var(--ease) both;flex-wrap:wrap;';
  postBar.innerHTML =
    '<button class="btn btn-secondary light" style="flex:1;min-width:140px;padding:12px 16px;font-size:13px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:6px;" onclick="addPersonalTouch()">'+
    '&#10024; Add Personal Touch</button>'+
    '<button class="btn" style="flex:1;min-width:140px;padding:12px 16px;font-size:13px;font-weight:700;border-radius:12px;background:rgba(34,197,94,0.09);border:1.5px solid rgba(34,197,94,0.25);color:#15803d;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;" onclick="clearWrite()">'+
    '&#128260; Start Fresh</button>';
  var scoresRow = document.getElementById('scoresRow');
  if (scoresRow) scoresRow.insertAdjacentElement('beforebegin', postBar);
}


function showDirection(r) {
  // Generate a creative direction card
  const dir = r.breakdown?.settings?.style
    ? 'Direction: ' + r.breakdown.settings.style + (r.breakdown.settings.lighting ? ' | Lighting: ' + r.breakdown.settings.lighting : '')
    : 'Direction: Keep the output natural, clear, and faithful to your original intent. No cinematic embellishments added.';

  let dirSection = document.getElementById('directionSection');
  if (!dirSection) {
    dirSection = document.createElement('div');
    dirSection.id = 'directionSection';
    dirSection.className = 'result-section tip-section';
    dirSection.style.display = 'none';
    document.getElementById('breakdownCta').insertAdjacentElement('beforebegin', dirSection);
  }
  dirSection.innerHTML = '<div class="tip-label">🧭 Direction Generated</div><div class="tip-text">' + dir + '</div>';
  dirSection.style.display = 'block';
}

function selectVariation(idx) {
  selectedVariIdx = idx;
  document.querySelectorAll('.variation-card').forEach(function(el, i) { el.classList.toggle('selected', i === idx); });
  const allVars = [currentResult?.enhanced, ...(currentResult?.variations || []).slice(0, 2)];
  const platform = document.getElementById('platformSelect')?.value || document.getElementById('socialPlatformSelect')?.value || '';
  showSelectedActions(allVars[idx], platform);
}

function showSelectedActions(text, platform) {
  document.getElementById('selectedText').textContent = text || '';
  document.getElementById('selectedActions').style.display = 'block';
  document.getElementById('platformName').textContent = platform || 'AI';
}

/* ─── MODIFY SELECTED ↔ load back into editor ───── */
function modifySelected() {
  const text = document.getElementById('selectedText').textContent;
  if (!text) return;
  const ta = document.getElementById('promptInput');
  ta.value = text;
  onPromptInput(ta);
  ta.focus();
  // Scroll to the textarea, not langBlock
  ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  // Pulse the enhance button so user knows to click it
  const btn = document.getElementById('enhanceBtn');
  if (btn) {
    btn.style.animation = 'none';
    btn.style.boxShadow = '0 0 0 4px rgba(255,112,67,0.35)';
    setTimeout(() => { btn.style.boxShadow = ''; }, 2000);
  }
  Toast.show('Loaded into editor — modify and re-enhance! ↑', 'success');
  setStep(3);
}

/* ─── ADD PERSONAL TOUCH ─────────────────────── */
function addPersonalTouch() {
  // Remove existing panel if open (toggle)
  var existing = document.getElementById('personalTouchPanel');
  if (existing) { existing.remove(); return; }

  var panel = document.createElement('div');
  panel.id = 'personalTouchPanel';
  panel.style.cssText = 'background:linear-gradient(135deg,rgba(255,112,67,0.06),rgba(255,152,0,0.04));border:1.5px solid rgba(255,112,67,0.25);border-radius:16px;padding:18px 20px;margin-bottom:14px;animation:fadeUp 0.3s var(--ease) both;';
  panel.innerHTML =
    '<div style="font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px;">&#10024; Add Your Personal Touch</div>'+
    '<div style="font-size:13px;color:#555;margin-bottom:12px;line-height:1.6;">Add your name, brand, message or any personal note — AI will weave it into the output.</div>'+
    '<textarea id="personalTouchInput" rows="3" style="width:100%;padding:12px 14px;border:1.5px solid rgba(255,112,67,0.25);border-radius:10px;background:#fff;font-size:14px;line-height:1.6;color:#222;font-family:var(--font-body);resize:vertical;box-sizing:border-box;outline:none;" placeholder="e.g. \"From our family to yours\" or \"For my brand CoolBrand, tone: playful\""></textarea>'+
    '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">'+
    '<button class="btn btn-primary" style="flex:1;min-width:140px;" onclick="applyPersonalTouch()">&#9889; Refine with Touch</button>'+
    '<button class="btn btn-secondary light btn-sm" onclick="document.getElementById(\'personalTouchPanel\').remove()">Cancel</button>'+
    '</div>';

  var scoresRow = document.getElementById('scoresRow');
  if (scoresRow) scoresRow.insertAdjacentElement('afterend', panel);
  setTimeout(() => { var ta = document.getElementById('personalTouchInput'); if (ta) ta.focus(); }, 100);
}

async function applyPersonalTouch() {
  var note = (document.getElementById('personalTouchInput')?.value || '').trim();
  if (!note) { Toast.show('Type your personal note first!', 'info'); return; }
  if (!currentResult) return;

  var selectedText = document.getElementById('selectedText')?.textContent || currentResult.enhanced;
  var aiPlatform   = document.getElementById('platformSelect')?.value || 'ChatGPT';
  var langCode     = LangState.code || 'en';
  var langName     = LangState.name || 'English';

  if (!ClarixState.canEnhance()) { UpgradeModal.show(); return; }

  var refineBtn = document.querySelector('#personalTouchPanel .btn-primary');
  if (refineBtn) { refineBtn.textContent = '⏳ Refining...'; refineBtn.disabled = true; }

  try {
    var result = await enhancePrompt(
      'Refine this prompt by seamlessly incorporating this personal detail: "' + note + '". Keep the same style and intent but make it feel personal and authentic: ' + selectedText,
      aiPlatform, currentMode, langCode, langName
    );
    if (result && result.enhanced) {
      currentResult.enhanced = result.enhanced;
      document.getElementById('selectedText').textContent = result.enhanced;
      var vc0Text = document.querySelector('#vc-0 .variation-card-text');
      if (vc0Text) vc0Text.textContent = result.enhanced;
      if (!result._serverCounted) { ClarixState.incUsage(); ClarixState.inc(); }
      updateUsageCounter();
      Toast.show('✨ Personal touch applied!', 'success');
      document.getElementById('personalTouchPanel')?.remove();
    }
  } catch(e) {
    Toast.show('Refinement failed. Try again.', 'error');
  } finally {
    if (refineBtn) { refineBtn.textContent = '⚡ Refine with Touch'; refineBtn.disabled = false; }
  }
}

/* ─── AI REWRITE SELECTED ─────────────────── */
async function aiRewriteSelected() {
  const text = document.getElementById('selectedText').textContent;
  if (!text || !currentResult) return;

  const aiPlatform  = document.getElementById('platformSelect')?.value || 'ChatGPT';
  const langCode    = LangState.code || 'en';
  const langName    = LangState.name || 'English';

  const rewriteBtn = document.getElementById('aiRewriteBtn');
  if (rewriteBtn) { rewriteBtn.textContent = '🔄 Rewriting...'; rewriteBtn.disabled = true; }

  try {
    if (!ClarixState.canEnhance()) { UpgradeModal.show(); return; }
    const result = await enhancePrompt(
      'Rewrite this with a fresh angle, improving structure and impact while keeping the same intent: ' + text,
      aiPlatform, currentMode, langCode, langName
    );
    if (result && result.enhanced) {
      // Replace current variation with the rewrite and show it
      currentResult.enhanced = result.enhanced;
      document.getElementById('selectedText').textContent = result.enhanced;
      document.querySelector('#vc-0 .variation-card-text').textContent = result.enhanced;
      if (!result._serverCounted) {
        ClarixState.incUsage();
        ClarixState.inc();
      }
      updateUsageCounter();
      Toast.show('🔄 AI rewrite done!', 'success');
    }
  } catch(e) {
    Toast.show('Rewrite failed. Try again.', 'error');
  } finally {
    if (rewriteBtn) { rewriteBtn.textContent = '🔄 AI Rewrite'; rewriteBtn.disabled = false; }
  }
}

/* ─── COPY / SAVE / OPEN ──────────────────────── */
function copySelected() {
  const text = document.getElementById('selectedText').textContent;
  copyText(text);
}

function saveSelected() {
  const text  = document.getElementById('selectedText').textContent;
  const saved = JSON.parse(localStorage.getItem('clarix_saved') || '[]');
  saved.unshift({ text, time: new Date().toISOString() });
  if (saved.length > 50) saved.pop();
  localStorage.setItem('clarix_saved', JSON.stringify(saved));
  Toast.show('Prompt saved!', 'success');
}

function shareSelected() {
  const text = document.getElementById('selectedText').textContent;
  if (!text) { Toast.show('Select a prompt first', 'info'); return; }
  const platform = document.getElementById('platformSelect')?.value || '';
  if (typeof SharePrompt !== 'undefined') {
    SharePrompt.showModal(text, platform);
  } else {
    copyText(text);
    Toast.show('Link copied!', 'success');
  }
}

function openInPlatform() {
  const aiPlatform     = document.getElementById('platformSelect')?.value;
  const socialPlatform = document.getElementById('socialPlatformSelect')?.value;
  const text           = document.getElementById('selectedText').textContent;
  if (!text) return;

  // Copy first
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});

  const allPlatforms = [...AI_PLATFORMS, ...SOCIAL_PLATFORMS];

  if (currentMode === 'both' && aiPlatform && socialPlatform) {
    // BUG-8 FIX: Only open first platform immediately (user gesture).
    // Second platform shown as a toast action link to avoid popup blocker.
    const ai = allPlatforms.find(p => p.value === aiPlatform);
    const sc = allPlatforms.find(p => p.value === socialPlatform);
    if (ai) window.open(ai.url, '_blank', 'noopener');
    // Show toast with clickable link for second platform
    const toastEl = document.getElementById('clarix-toast');
    Toast.show('Prompt copied! Opening ' + aiPlatform + '...', 'success');
    if (sc) {
      setTimeout(() => {
        const el = document.getElementById('clarix-toast');
        if (el) {
          el.querySelector('.toast-msg').innerHTML =
            'Also open in <a href="' + sc.url + '" target="_blank" rel="noopener" style="color:#ff9800;font-weight:700;text-decoration:underline">' + socialPlatform + ' ↗</a>?';
          el.classList.add('show');
        }
      }, 1800);
    }
  } else {
    const chosen = currentMode === 'social' ? socialPlatform : aiPlatform;
    const p = allPlatforms.find(pl => pl.value === chosen);
    Toast.show('Prompt copied! Opening ' + (chosen || 'platform') + '...', 'success');
    if (p) setTimeout(() => window.open(p.url, '_blank', 'noopener'), 400);
  }
}

/* ─── EXPERT BREAKDOWN (NEW TAB) ──────────────── */
function openBreakdown() {
  if (!currentResult) return;
  const breakdownData = {
    ...currentResult,
    text:     document.getElementById('promptInput').value,
    platform: document.getElementById('platformSelect')?.value,
    lang:     LangState.name,
    langFlag: LangState.flag,
    model:    CLARIX_CONFIG.model
  };
  localStorage.setItem('clarix_breakdown_data', JSON.stringify(breakdownData));
  setStep(6);
  window.open('breakdown.html', '_blank');
}

/* ─── CLEAR (Start Fresh) ─────────────────────── */
function clearWrite() {
  const ta = document.getElementById('promptInput');
  if (ta) { ta.value = ''; ta.style.border = ''; ta.style.background = '#fff'; ta.style.borderColor = ''; }
  document.getElementById('charCounter').textContent = '0 / 2000';
  document.getElementById('autosuggestStrip').innerHTML = '';
  document.getElementById('resultsEmpty').style.display  = 'flex';
  document.getElementById('resultsContent').style.display = 'none';
  document.getElementById('profanityBanner')?.remove();
  document.getElementById('profanityInlineStrip')?.remove();
  document.getElementById('langChangeNudge')?.remove();
  document.getElementById('apiLanguageNote')?.remove();
  document.getElementById('postOutputBar')?.remove();
  document.getElementById('personalTouchPanel')?.remove();
  document.getElementById('intentModeBadge')?.remove();
  document.getElementById('directionSection')?.remove();
  // Reset enhance button to original state
  var enhBtn = document.getElementById('enhanceBtn');
  if (enhBtn) { enhBtn.dataset.state = ''; enhBtn.innerHTML = '&#9889; Enhance with AI'; }
  currentResult = null;
  selectedVariIdx = 0;
  setStep(1);
  // Scroll back to top of input on mobile
  if (window.innerWidth <= 900) {
    document.getElementById('langBlock')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ─── UTILS ───────────────────────────────────── */
function escHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function checkIncoming() {
  const stored = localStorage.getItem('clarix_hero_prompt');
  const intent = localStorage.getItem('clarix_intent');
  const src    = stored || intent;
  if (src) {
    const el = document.getElementById('promptInput');
    if (el) { el.value = src; onPromptInput(el); }
    if (stored) localStorage.removeItem('clarix_hero_prompt');
    if (intent) localStorage.removeItem('clarix_intent');
    if (window.location.search.includes('from=hero')) setTimeout(() => handleEnhance(), 600);
  }
}

/* ─── SAVE TO HISTORY (also used by history.html) */
function saveToHistory(item) {
  const history = JSON.parse(localStorage.getItem('clarix_history') || '[]');
  history.unshift({
    id:           Date.now().toString(),
    time:         new Date().toISOString(),
    text:         item.text         || '',
    enhanced:     item.enhanced     || '',
    score:        item.score        || 0,
    platform:     item.platform     || '',
    lang:         item.lang         || 'English',
    langFlag:     item.langFlag     || '',
    variations:   item.variations   || [],
    socialCaption:item.socialCaption|| '',
    fav: false
  });
  if (history.length > 200) history.pop();
  localStorage.setItem('clarix_history', JSON.stringify(history));
}

