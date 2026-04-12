/* ═══════════════════════════════════════════════
   CLARIX — VERCEL SERVERLESS API PROXY
   File: /api/ai.js
   
   - Hides ALL API keys (Gemini, Groq, Claude)
   - Validates Firebase Auth token (prevents abuse)
   - Rate limits: 10 req/min per user, 50/day
   - Input sanitization
   - CORS protected
═══════════════════════════════════════════════ */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

/* ── Firebase Admin init (singleton) ── */
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    /* Handle multiple possible formats of FIREBASE_PRIVATE_KEY */
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    /* Vercel may store literal \n as the chars \ and n */
    privateKey = privateKey.replace(/\\n/g, '\n');
    /* Also handle double-escaped */
    privateKey = privateKey.replace(/\\\\n/g, '\n');
    
    initializeApp({
      credential: cert({
        projectId:    process.env.FIREBASE_PROJECT_ID,
        clientEmail:  process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:   privateKey
      })
    });
  }
  return { auth: getAuth(), db: getFirestore() };
}

/* ── In-memory rate limiter (per UID) ── */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;  /* 1 minute */
const RATE_LIMIT_MAX       = 10;          /* max 10 req/min */

function checkRateLimit(uid) {
  const now = Date.now();
  const entry = rateLimitMap.get(uid) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    /* New window */
    rateLimitMap.set(uid, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  rateLimitMap.set(uid, entry);
  return true;
}

/* ── Sanitize input ── */
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '')           /* strip HTML */
    .replace(/javascript:/gi, '')      /* strip JS injection */
    .replace(/on\w+\s*=/gi, '')        /* strip event handlers */
    .substring(0, 2000)               /* max length */
    .trim();
}

/* ── CORS headers ── */
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://clarix.digital');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/* ── Call Gemini ── */
async function callGemini(systemPrompt, userMsg) {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  if (!key) throw new Error('Gemini key not configured');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
      })
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${JSON.stringify(data?.error || data).substring(0,150)}`);
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!raw) throw new Error('Gemini empty response');
  return { raw, engine: 'Gemini' };
}

/* ── Call Groq ── */
async function callGroq(systemPrompt, userMsg) {
  const key = (process.env.GROQ_API_KEY || '').trim();
  if (!key) throw new Error('Groq key not configured');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
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
  const data = await res.json();
  if (!res.ok) throw new Error(`Groq HTTP ${res.status}: ${JSON.stringify(data?.error || data).substring(0,150)}`);
  const raw = data?.choices?.[0]?.message?.content || '';
  if (!raw) throw new Error('Groq empty response');
  return { raw, engine: 'Groq' };
}

/* ── Call Claude ── */
async function callClaude(systemPrompt, userMsg) {
  const key = (process.env.CLAUDE_API_KEY || '').trim();
  if (!key) throw new Error('Claude key not configured');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMsg }]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Claude HTTP ${res.status}: ${JSON.stringify(data?.error || data).substring(0,150)}`);
  const raw = data?.content?.[0]?.text || '';
  if (!raw) throw new Error('Claude empty response');
  return { raw, engine: 'Claude' };
}

/* ── Parse AI JSON response ── */
function parseAIResponse(raw) {
  let str = raw.trim();
  if (str.startsWith('```')) str = str.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
  const jsonStr = str.startsWith('{') ? str : (str.match(/\{[\s\S]*\}/) || [])[0];
  if (!jsonStr) throw new Error('No JSON in response');
  return JSON.parse(jsonStr);
}

/* ── MAIN HANDLER ── */
module.exports = async function handler(req, res) {
  /* CORS preflight */
  setCORSHeaders(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  /* Only POST allowed — but add GET health check */
  if (req.method === 'GET') {
    /* Health check: show which env vars are configured (values hidden) */
    return res.status(200).json({
      status: 'Clarix API is running',
      env: {
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        GROQ_API_KEY: !!process.env.GROQ_API_KEY,
        CLAUDE_API_KEY: !!process.env.CLAUDE_API_KEY,
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
        FIREBASE_PRIVATE_KEY_LENGTH: (process.env.FIREBASE_PRIVATE_KEY || '').length
      }
    });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    /* 1. Verify Firebase Auth token */
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '').trim();
    if (!idToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let uid;
    try {
      const { auth } = getFirebaseAdmin();
      const decoded = await auth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch (authErr) {
      console.error('[ClarixAPI] Auth verification failed:', authErr.message);
      return res.status(401).json({ 
        error: 'Invalid authentication token', 
        detail: authErr.message.substring(0, 100),
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY
      });
    }

    /* 2. Rate limit check */
    if (!checkRateLimit(uid)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
    }

    /* 3. Parse + validate request body */
    const body = req.body || {};
    const text           = sanitizeInput(body.text || '');
    const platform       = sanitizeInput(body.platform || '');
    const mode           = sanitizeInput(body.mode || 'ai');
    const langCode       = sanitizeInput(body.langCode || 'en');
    const langName       = sanitizeInput(body.langName || 'English');
    const socialPlatform = sanitizeInput(body.socialPlatform || '');

    if (!text || text.length < 2) {
      return res.status(400).json({ error: 'Please enter some text to enhance.' });
    }

    /* 4. Check user trial limit in Firestore */
    const { db } = getFirebaseAdmin();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const FREE_TRIAL_LIMIT = 25;
    const FREE_DAILY_LIMIT = 5;
    const trialUsed = userData.trialUsed || 0;
    const today = new Date().toDateString();
    const dailyUsage = userData.dailyUsage || { date: '', count: 0 };
    const dailyCount = dailyUsage.date === today ? dailyUsage.count : 0;
    const isPro = userData.isPro === true;

    /* Admin bypass — owner gets unlimited usage for testing */
    const ADMIN_EMAILS = ['vishalbirla700@gmail.com'];
    const userEmail = userData.email || '';
    const isAdmin = ADMIN_EMAILS.includes(userEmail.toLowerCase());

    /* If admin's trials were inflated by bugs, reset them */
    if (isAdmin && trialUsed > 10) {
      await userRef.update({ trialUsed: 0, dailyUsage: { date: '', count: 0 } });
      console.log('[ClarixAPI] Admin trial reset for:', userEmail);
    }

    if (!isPro && !isAdmin) {
      if (trialUsed >= FREE_TRIAL_LIMIT && dailyCount >= FREE_DAILY_LIMIT) {
        return res.status(403).json({ error: 'Trial limit reached. Please upgrade to Pro.' });
      }
    }

    /* 5. Build AI prompts (same logic as client ai.js) */
    const LANG_HINT = {
      'hi':'HINDI (Devanagari script)','gu':'Gujarati (ગુજરાત)','mr':'Marathi (मराठी)',
      'ta':'Tamil (தமிழ்)','te':'Telugu (తెలుగు)','kn':'Kannada (ಕನ್ನಡ)',
      'pa':'Punjabi (ਪੰਜਾਬੀ)','bn':'Bengali (বাংলা)','ur':'Urdu (اردو)',
      'ar':'Arabic (العربية)','en':'English','es':'Spanish','fr':'French','zh':'Chinese','ms':'Malay'
    };
    const langHint = LANG_HINT[langCode] || langName;
    const isImage = ['photo','image','picture','portrait','render','midjourney','dall-e','illustration'].some(kw => text.toLowerCase().includes(kw));
    const intentRule = isImage
      ? 'This is an IMAGE prompt. Enhance with photographic descriptors.'
      : 'This is a TEXT request. Fix grammar, improve clarity, stay faithful to intent. No cinematic terms.';

    const systemPrompt = `You are Clarix, an expert AI prompt assistant.
STRICT RULES:
1. OUTPUT LANGUAGE: Write ALL output in ${langHint}. No exceptions.
2. INTENT: ${intentRule}
3. PROFANITY: Replace inappropriate words silently.
4. Return ONLY valid JSON — no markdown:
{
  "enhanced": "refined output in ${langName}",
  "score": 85,
  "lang": "${langName}",
  "platformTip": "brief tip",
  "variations": ["v1 in ${langName}", "v2 in ${langName}", "v3 in ${langName}"],
  "socialCaption": "social ready caption"
}`;

    const userMsg = `Platform: ${platform || 'general'}\nMode: ${mode}\nLanguage: ${langName}\nInput: ${text}`;

    /* 6. Try AI engines in order: Gemini → Groq → Claude */
    let result = null;
    let engineUsed = 'Local';
    const engineErrors = {};

    const engines = [
      { name: 'Groq',   fn: () => callGroq(systemPrompt, userMsg) },
      { name: 'Gemini', fn: () => callGemini(systemPrompt, userMsg) },
      { name: 'Claude', fn: () => callClaude(systemPrompt, userMsg) }
    ];

    for (const engine of engines) {
      try {
        const { raw, engine: eng } = await engine.fn();
        result = parseAIResponse(raw);
        result._engine = eng;
        engineUsed = eng;
        break;
      } catch (e) {
        engineErrors[engine.name] = e.message;
        console.warn(`[ClarixAPI] ${engine.name} failed:`, e.message);
      }
    }

    /* Local fallback */
    if (!result) {
      console.error('[ClarixAPI] ALL engines failed:', JSON.stringify(engineErrors));
      result = {
        enhanced: text + '.',
        score: 70,
        lang: langName,
        platformTip: 'Keep it specific and purposeful.',
        variations: [text + ' (version 1)', text + ' (version 2)', text + ' (version 3)'],
        socialCaption: text.substring(0, 100),
        _engine: 'Local',
        _engineErrors: engineErrors
      };
      engineUsed = 'Local';
    }

    /* 7. Increment usage in Firestore (server-side — tamper-proof) */
    const newTrialUsed = Math.min(trialUsed + 1, FREE_TRIAL_LIMIT + 100);
    const newDailyCount = dailyCount + 1;
    await userRef.update({
      trialUsed:  newTrialUsed,
      dailyUsage: { date: today, count: newDailyCount }
    });

    /* 8. Return result */
    result.remaining = isPro ? 9999 : Math.max(0, FREE_TRIAL_LIMIT - newTrialUsed);
    result.inTrial   = newTrialUsed < FREE_TRIAL_LIMIT;
    result._engine   = engineUsed;

    return res.status(200).json(result);

  } catch (err) {
    console.error('[ClarixAPI] Unhandled error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
