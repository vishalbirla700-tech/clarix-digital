/* ═══════════════════════════════════════════════
   CLARIX — AI ENGINE V3
   Priority chain: Gemini → Groq → Claude → Local
   Intent-aware • Language-strict • No cinematic spam
═══════════════════════════════════════════════ */

/* ─── INTENT DETECTION ────────────────────────── */
const IMAGE_KEYWORDS = [
  'photo','image','picture','portrait','landscape','cinematic','render',
  'midjourney','dall-e','stable diffusion','sd','illustration','artwork',
  'wallpaper','background','visual','graphic','scene','shot','frame',
  'photography','photorealistic','hyper-detailed','8k','4k','bokeh',
  'depth of field','lighting','composition','wide angle','macro',
  'ek photo','ek image','photo chahiye','image chahiye'
];

function detectIntent(text) {
  const lower = text.toLowerCase();
  return IMAGE_KEYWORDS.some(kw => lower.includes(kw)) ? 'image' : 'text';
}

/* ─── LANGUAGE MAPPING ────────────────────────── */
const LANG_SCRIPT_HINT = {
  'hi':    'HINDI (Devanagari script only — हिंदी में लिखें)',
  'hi-en': 'Hinglish (Roman script, natural mix of Hindi and English)',
  'bn':    'Bengali (বাংলা script)',
  'te':    'Telugu (తెలుగు script)',
  'ta':    'Tamil (தமிழ் script)',
  'mr':    'Marathi (मराठी, Devanagari script)',
  'gu':    'Gujarati (ગુજરાતી script)',
  'kn':    'Kannada (ಕನ್ನಡ script)',
  'ml':    'Malayalam (മലയാളം script)',
  'pa':    'Punjabi (ਪੰਜਾਬੀ, Gurmukhi script)',
  'ur':    'Urdu (اردو script)',
  'ar':    'Arabic (العربية)',
  'ja':    'Japanese (日本語)',
  'zh':    'Chinese Simplified (中文)',
  'ko':    'Korean (한국어)',
  'es':    'Spanish',
  'fr':    'French',
  'de':    'German',
  'en':    'English',
};

/* ─── SHARED SYSTEM PROMPT BUILDER ───────────────*/
function buildSystemPrompt(platform, mode, langCode, langName, intent, socialPlatform) {
  const langHint   = LANG_SCRIPT_HINT[langCode] || langName;
  const intentRule = intent === 'image'
    ? 'This is an IMAGE/VISUAL prompt. Enhance with photographic and artistic descriptors.'
    : 'This is a TEXT/WRITING request (email, message, post, etc.). DO NOT add cinematic or visual terms. Fix grammar, replace inappropriate words, improve clarity — stay faithful to original intent.';

  // Social platform-specific rules for hashtags/emojis
  const socialRules = {
    'Instagram':  'Add 5-8 relevant Instagram hashtags at the end. Use 2-3 relevant emojis. Make it visually engaging.',
    'Twitter/X':  'Keep under 280 characters. Add 1-2 hashtags. Use 1-2 punchy emojis. Hook in first 7 words.',
    'LinkedIn':   'Professional tone. No hashtags needed unless topically relevant (max 3). No casual emojis.',
    'WhatsApp':   'Warm, conversational tone. 1-2 emojis max. No hashtags. Keep under 150 words.',
    'Facebook':   'Friendly tone. 2-3 emojis. 2-4 hashtags at the end.',
    'YouTube':    'Add a compelling hook, call-to-action, and 3-5 relevant hashtags for YouTube description.',
    'Threads':    'Casual, conversational. 1-3 emojis. 2-3 hashtags.',
    'Reddit':     'No hashtags. Conversational, community-first tone. Bold key points.',
    'Telegram':   'Conversational. Emojis for structure. No hashtags needed.',
    'ShareChat':  'Friendly Indian tone. 3-5 relevant hashtags. Use emojis naturally.',
    'Snapchat':   'Very short and punchy. 1-2 emojis. No hashtags.',
    'Pinterest':  'Descriptive and inspirational. 3-5 topic hashtags.',
  };

  const activeSocial = socialPlatform || (mode === 'social' ? platform : null);
  const socialNote   = activeSocial && socialRules[activeSocial]
    ? `\n6. SOCIAL FORMAT for ${activeSocial}: ${socialRules[activeSocial]}`
    : '';

  return `You are Clarix, an expert AI prompt assistant for Indian creators.
STRICT RULES:
1. OUTPUT LANGUAGE: Write ALL output in ${langHint}. No exceptions.
2. INTENT: ${intentRule}
3. PROFANITY: Replace any foul/inappropriate words with professional alternatives silently.
4. FAITHFULNESS: Stay true to what the user wrote. Do not add unrelated content.${socialNote}
5. Return ONLY valid JSON — no markdown, no code fences, just raw JSON:
{
  "enhanced": "the refined output IN ${langName.toUpperCase()}",
  "score": 85,
  "lang": "${langName}",
  "platformTip": "brief tip for ${platform || 'general use'}",
  "variations": ["variation1 IN ${langName}", "variation2 IN ${langName}", "variation3 IN ${langName}"],
  "socialCaption": "${activeSocial ? `ready-to-post caption for ${activeSocial} with emojis and hashtags as required` : 'social caption if applicable'}",
  "breakdown": {
    "mainPrompt": "same as enhanced",
    "settings": {"style": "...", "lighting": "...", "camera": "...", "quality": "...", "platformTip": "..."},
    "proPrompt": "advanced version",
    "platforms": [{"name":"ChatGPT","match":88,"reason":"..."},{"name":"Claude","match":92,"reason":"..."},{"name":"Midjourney","match":85,"reason":"..."}]
  }
}`;
}

function buildUserMessage(text, platform, mode, langCode, langName, intent, socialPlatform) {
  const langHint = LANG_SCRIPT_HINT[langCode] || langName;
  return `Platform: ${platform || 'general'}
Mode: ${mode}${socialPlatform ? `\nSocialPlatform: ${socialPlatform}` : ''}
Intent: ${intent}
OutputLanguage: ${langName} (${langHint})
UserInput: ${text}`;
}

function parseAIResponse(raw) {
  // Strip markdown code fences if present
  let str = raw.trim();
  if (str.startsWith('```')) str = str.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
  const jsonStr = str.startsWith('{') ? str : (str.match(/\{[\s\S]*\}/) || [])[0];
  if (!jsonStr) throw new Error('No JSON in response');
  return JSON.parse(jsonStr);
}

/* ─── 1. GEMINI API ───────────────────────────── */
async function geminiEnhance(text, platform, mode, langCode, langName, intent, socialPlatform) {
  const key = CLARIX_CONFIG.geminiApiKey;
  if (!key || key === 'YOUR_GEMINI_API_KEY') return null;

  const systemPrompt = buildSystemPrompt(platform, mode, langCode, langName, intent, socialPlatform);
  const userMsg      = buildUserMessage(text, platform, mode, langCode, langName, intent, socialPlatform);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
      })
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!raw) throw new Error('Gemini: empty response');

  const parsed = parseAIResponse(raw);
  parsed.lang  = langName;
  parsed._engine = 'Gemini';
  return parsed;
}

/* ─── 2. GROQ API (Llama 3.1 70B) ────────────── */
async function groqEnhance(text, platform, mode, langCode, langName, intent, socialPlatform) {
  const key = CLARIX_CONFIG.groqApiKey;
  if (!key || key === 'YOUR_GROQ_API_KEY') return null;

  const systemPrompt = buildSystemPrompt(platform, mode, langCode, langName, intent, socialPlatform);
  const userMsg      = buildUserMessage(text, platform, mode, langCode, langName, intent, socialPlatform);

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMsg }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const raw  = data?.choices?.[0]?.message?.content || '';
  if (!raw) throw new Error('Groq: empty response');

  const parsed = parseAIResponse(raw);
  parsed.lang  = langName;
  parsed._engine = 'Groq';
  return parsed;
}

/* ─── 3. CLAUDE API (Legacy fallback) ────────── */
async function claudeEnhance(text, platform, mode, langCode, langName, intent, socialPlatform) {
  const key = CLARIX_CONFIG.claudeApiKey;
  if (!key || key === 'YOUR_CLAUDE_API_KEY_HERE') return null;

  const systemPrompt = buildSystemPrompt(platform, mode, langCode, langName, intent, socialPlatform);
  const userMsg      = buildUserMessage(text, platform, mode, langCode, langName, intent, socialPlatform);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: CLARIX_CONFIG.maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMsg }]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Claude ${res.status}: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const raw  = data?.content?.[0]?.text || '';
  if (!raw) throw new Error('Claude: empty response');

  const parsed = parseAIResponse(raw);
  parsed.lang  = langName;
  parsed._engine = 'Claude';
  return parsed;
}

/* ─── LOCAL FALLBACK ENGINE ───────────────────── */
const IMG_QUALITY  = ['ultra-detailed','hyper-detailed','8K resolution','photorealistic','studio quality'];
const IMG_LIGHTING = ['golden hour lighting','dramatic rim light','cinematic lighting','soft diffused light','volumetric rays'];
const IMG_CAMERA   = ['shallow depth of field','anamorphic lens','bokeh background','cinematic 35mm lens','wide angle shot'];
const IMG_MOOD     = ['ethereal atmosphere','dramatic tension','moody ambiance','epic scale','intimate lighting'];
const IMG_STYLE    = ['award-winning photography','editorial style','concept art','fine art aesthetic'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function capitalizeFirst(str) { if (!str) return str; return str.charAt(0).toUpperCase() + str.slice(1); }

function localEnhance(text, platform, mode, langCode, langName, intent) {
  var base  = text.trim();
  var score = Math.min(94, 65 + Math.floor(Math.random() * 28));
  var tip   = getPlatformTip(platform);
  var enhanced, v1, v2, v3, apiNote = '';

  if (intent === 'image') {
    enhanced = base + ', ' + [pick(IMG_QUALITY), pick(IMG_LIGHTING), pick(IMG_CAMERA), pick(IMG_MOOD), pick(IMG_STYLE)].join(', ');
    v1 = base + ', cinematic composition, ' + pick(IMG_QUALITY) + ', ' + pick(IMG_LIGHTING);
    v2 = base + ', ' + pick(IMG_STYLE) + ', ' + pick(IMG_MOOD) + ', ultra-realistic';
    v3 = base + ', ' + pick(IMG_CAMERA) + ', ' + pick(IMG_QUALITY) + ', professional grade';
  } else {
    if (langCode === 'hi') {
      var hindiOut = base
        .replace(/muje|mujhe/gi,'मुझे').replace(/bukar|bukhar/gi,'बुखार')
        .replace(/bimar|bemar/gi,'बीमार').replace(/\bhai\b/gi,'है')
        .replace(/\bhain\b/gi,'हैं').replace(/boss|manager/gi,'प्रबंधक')
        .replace(/\baaj\b/gi,'आज').replace(/nahi|nai\b/gi,'नहीं')
        .replace(/please|plz/gi,'कृपया').replace(/help/gi,'सहायता')
        .replace(/karo|karna|kar do/gi,'करें').replace(/likhna|likhni/gi,'लिखना')
        .replace(/email/gi,'ईमेल').replace(/photo|image/gi,'फ़ोटो')
        .replace(/chahiye/gi,'चाहिए');
      enhanced = hindiOut.trim() + ' — कृपया इसे व्यावसायिक और स्पष्ट रूप से लिखें।';
      v1 = 'विषय: ' + hindiOut.trim() + '। कृपया इस विषय पर एक औपचारिक ईमेल लिखें।';
      v2 = hindiOut.trim() + ' इसे सरल, स्पष्ट और शिष्ट भाषा में लिखें।';
      v3 = 'प्रिय प्रबंधक, ' + hindiOut.trim() + ' — आपका विश्वासपात्र, [आपका नाम]';
    } else if (langCode === 'hi-en') {
      var hout = base.replace(/muje\b/gi,'mujhe').replace(/bukar\b/gi,'bukhar')
        .replace(/nai\b/gi,'nahi').replace(/plz\b/gi,'please');
      enhanced = capitalizeFirst(hout.replace(/\s+/g,' ').trim()) + '.';
      v1 = 'Subject: Request. ' + capitalizeFirst(hout) + '. Aaj available nahi hoon.';
      v2 = capitalizeFirst(hout) + ' — please isko professional tarike se present karo.';
      v3 = 'Dear Manager, ' + capitalizeFirst(hout) + '. Regards, [Aapka Naam]';
    } else if (['mr','ta','te','gu','kn','ml','pa','bn','ur'].includes(langCode)) {
      var engClean = capitalizeFirst(base.replace(/\s+/g,' ').trim());
      apiNote  = '[API_NOTE]';
      enhanced = engClean + '.';
      v1 = 'Professional version: ' + engClean + '.';
      v2 = 'Formal: ' + engClean + '. Please review and adjust tone as needed.';
      v3 = engClean + ' — clear, concise, and ready to use.';
    } else {
      var base2 = capitalizeFirst(base.replace(/\s+/g,' ').trim());
      enhanced = base2 + '.';
      v1 = 'Professional version: ' + base2 + '. Please ensure proper formatting before use.';
      v2 = 'Formal tone: ' + base2 + '. Keep it concise and purposeful.';
      v3 = base2 + ' — edited for clarity, grammar, and professional flow.';
    }
  }

  var socialCaption = intent === 'image'
    ? '✨ ' + base.slice(0,80) + (base.length > 80 ? '...' : '') + ' #AIArt #Clarix'
    : base.slice(0,100) + (base.length > 100 ? '...' : '');

  return {
    enhanced, score, lang: langName, platformTip: tip,
    variations: [v1, v2, v3], socialCaption,
    breakdown: generateBreakdown(enhanced, platform, intent),
    _apiNote: apiNote, _langName: langName, _engine: 'Local'
  };
}

function getPlatformTip(platform) {
  const tips = {
    'ChatGPT':   'Structure your request clearly with context first.',
    'Claude':    'Add constraints and role context for best results.',
    'Gemini':    'Be specific — Gemini works well with visual descriptions.',
    'Midjourney':'Add --ar 16:9 --style raw --q 2 at the end.',
    'Instagram': 'Lead with a visual hook. End with a CTA or question.',
    'LinkedIn':  'Share your insight first, then the lesson.',
    'WhatsApp':  'Keep it warm and conversational, under 150 words.',
    'Twitter/X': 'Hook in first 7 words. Punchy, under 280 chars.',
  };
  return tips[platform] || 'Keep it specific and purposeful.';
}

function generateBreakdown(prompt, platform, intent) {
  return {
    mainPrompt: prompt,
    settings: {
      style:       intent === 'image' ? pick(['Cinematic Realism','Editorial Photography']) : 'Professional Writing',
      lighting:    intent === 'image' ? pick(['Golden Hour','Studio Three-Point']) : 'N/A',
      camera:      intent === 'image' ? pick(['Wide Angle 24mm','Portrait 85mm f/1.4']) : 'N/A',
      quality:     intent === 'image' ? pick(['8K Ultra HD','4K Hyper-Detail']) : 'Grammatically Correct',
      platformTip: platform ? 'Optimised for ' + platform + ' — ' + getPlatformTip(platform) : 'Works across all platforms'
    },
    proPrompt: intent === 'image'
      ? '[ADVANCED] ' + prompt + ', highly detailed, perfect composition, award-winning photography, trending ArtStation'
      : prompt,
    platforms: [
      { name: 'Midjourney', match: intent === 'image' ? 98 : 55, reason: 'Best for artistic image generation' },
      { name: 'ChatGPT',    match: 88, reason: 'Great for text and creative writing' },
      { name: 'Claude',     match: 92, reason: 'Ideal for nuanced, language-aware tasks' },
      { name: 'Gemini',     match: 85, reason: 'Good for multimodal and visual contexts' },
      { name: 'DALL-E',     match: intent === 'image' ? 82 : 40, reason: 'Photo-realistic image outputs' },
    ]
  };
}

/* ─── IMAGE ANALYSIS (Gemini Vision → Claude → Fallback) ─── */

/**
 * analyzeImage()
 * Analyzes a real photo using Gemini Vision → Claude Vision → local fallback.
 * Image must be pre-compressed before calling (max 1024px, JPEG).
 */
async function analyzeImage(base64Image, mimeType, platform) {
  mimeType = mimeType || 'image/jpeg';
  platform = platform || 'Midjourney';

  // Concise prompt = more reliable JSON from vision models
  const PROMPT = `Analyze this photo carefully. Return ONLY raw JSON (no markdown, no explanation):
{
  "subject": "who/what is in the photo (person description, objects, animals)",
  "setting": "location and background (restaurant, park, beach, bedroom, etc.)",
  "lighting": "lighting type and quality",
  "mood": "emotional atmosphere of the photo",
  "colors": "dominant color palette",
  "style": "photography style (portrait, candid, landscape, editorial, etc.)",
  "prompt": "One sentence describing this photo accurately",
  "enhanced": "40-60 word ${platform} prompt that recreates this photo: describe the subject, setting, lighting, mood, colors, and add quality terms like 'hyperdetailed, cinematic, bokeh, 8K'",
  "instagram": "Instagram caption for this photo with 5 hashtags",
  "midjourney": "${platform === 'Midjourney' ? 'Full Midjourney prompt with --ar ratio and --style raw' : 'Midjourney version of the prompt'}"
}`;

  // ── 1. Gemini 1.5 Flash Vision (best for real photos) ──────────────────
  const geminiKey = CLARIX_CONFIG.geminiApiKey;
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: mimeType, data: base64Image } },
                { text: PROMPT }
              ]
            }],
            generationConfig: { maxOutputTokens: 800, temperature: 0.3 }
          })
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const errMsg  = errBody?.error?.message || res.statusText;
        console.error('[Vision] Gemini error', res.status, errMsg);
        // Show visible error so we can debug
        if (typeof Toast !== 'undefined') Toast.show(`⚠️ Vision API: ${res.status} — ${errMsg.substring(0,60)}`, 'error', 6000);
      } else {
        const data = await res.json();
        const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (raw) {
          const clean   = raw.trim().replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
          const jsonStr = clean.startsWith('{') ? clean : (clean.match(/\{[\s\S]*\}/) || [])[0];
          if (jsonStr) {
            const parsed = JSON.parse(jsonStr);
            parsed._engine = 'Gemini Vision';
            console.info('[Vision] Gemini ✅ subject:', parsed.subject);
            return parsed;
          } else {
            console.warn('[Vision] Gemini returned non-JSON:', raw.substring(0, 200));
          }
        }
      }
    } catch (err) {
      console.error('[Vision] Gemini exception:', err.message);
    }
  }

  // ── 2. Claude Vision (fallback) ─────────────────────────────────────────
  const claudeKey = CLARIX_CONFIG.claudeApiKey;
  if (claudeKey && claudeKey !== 'YOUR_CLAUDE_API_KEY_HERE') {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': claudeKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 800,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Image } },
            { type: 'text', text: PROMPT }
          ]}]
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('[Vision] Claude error', res.status, errBody?.error?.message);
      } else {
        const data    = await res.json();
        const raw     = data.content?.[0]?.text?.trim() || '';
        const clean   = raw.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
        const jsonStr = clean.startsWith('{') ? clean : (clean.match(/\{[\s\S]*\}/) || [])[0];
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          parsed._engine = 'Claude Vision';
          console.info('[Vision] Claude ✅ subject:', parsed.subject);
          return parsed;
        }
      }
    } catch (err) {
      console.error('[Vision] Claude exception:', err.message);
    }
  }

  // ── 3. Local fallback ────────────────────────────────────────────────────
  console.warn('[Vision] All APIs failed — local fallback');
  if (typeof Toast !== 'undefined') Toast.show('⚠️ Vision AI unavailable — using basic prompt. Check console for errors.', 'error', 5000);
  return {
    subject: 'uploaded photo',
    prompt: 'Scene from uploaded photo',
    enhanced: 'Professional photograph, ultra-detailed, cinematic lighting, 8K resolution, hyperdetailed',
    midjourney: 'Professional photograph, ultra-detailed, cinematic lighting, 8K resolution --ar 4:5 --style raw',
    instagram: '✨ Captured this moment 📸 #photography #aesthetic #vibes #photo #instagood',
    _engine: 'Local Fallback'
  };
}


/* ─── Legacy alias (keep for any other callers) ──── */
async function claudeVision(base64Image, mimeType) {
  return analyzeImage(base64Image, mimeType, 'Midjourney');
}



/* ─── MAIN ENGINE: Gemini → Groq → Claude → Local */
async function enhancePrompt(text, platform, mode, langCode, langName, socialPlatform) {
  platform     = platform     || '';
  mode         = mode         || 'ai';
  langCode     = langCode     || 'en';
  langName     = langName     || 'English';
  socialPlatform = socialPlatform || '';

  if (!ClarixState.canEnhance()) { UpgradeModal.show('Daily limit reached'); return null; }

  const intent = detectIntent(text);
  let result   = null;
  let engineUsed = 'Local';

  // ── Try Gemini first ──
  try {
    result = await geminiEnhance(text, platform, mode, langCode, langName, intent, socialPlatform);
    if (result) { engineUsed = 'Gemini ✦'; console.info('[Clarix] Engine: Gemini ✅'); }
  } catch (e) {
    console.warn('[Clarix] Gemini failed:', e.message);
  }

  // ── Try Groq if Gemini failed ──
  if (!result) {
    try {
      result = await groqEnhance(text, platform, mode, langCode, langName, intent, socialPlatform);
      if (result) { engineUsed = 'Groq ⚡'; console.info('[Clarix] Engine: Groq ✅'); }
    } catch (e) {
      console.warn('[Clarix] Groq failed:', e.message);
    }
  }

  // ── Try Claude if both failed ──
  if (!result) {
    try {
      result = await claudeEnhance(text, platform, mode, langCode, langName, intent, socialPlatform);
      if (result) { engineUsed = 'Claude 🧠'; console.info('[Clarix] Engine: Claude ✅'); }
    } catch (e) {
      console.warn('[Clarix] Claude failed:', e.message);
    }
  }

  // ── Local fallback ──
  if (!result) {
    console.warn('[Clarix] All AI APIs failed — using local fallback');
    result = localEnhance(text, platform, mode, langCode, langName, intent);
    engineUsed = 'Local';
  }

  result.intent    = intent;
  result._engine   = engineUsed;

  if (engineUsed !== 'Local') {
    Toast.show('Enhanced with ' + engineUsed, 'success', 2000);
  }

  ClarixState.incUsage();
  ClarixState.inc();
  updateUsageCounter();
  return result;
}
