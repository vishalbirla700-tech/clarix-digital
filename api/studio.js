/* ═══════════════════════════════════════════════
   CLARIX — CREATIVE STUDIOS API
   File: /api/studio.js
   Secure proxy for Creative Studio AI calls.
   Keys stay server-side; Firebase auth required.
═══════════════════════════════════════════════ */

const https = require('https');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

/* ── Firebase Admin (singleton) ── */
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    initializeApp({ credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })});
  }
  return { auth: getAuth() };
}

/* ── HTTPS POST helper ── */
function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname, path, method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${raw.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/* ── Parse raw AI JSON response ── */
function parseAIJson(raw) {
  let clean = raw.trim().replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
  let jsonStr = clean.charAt(0) === '{' ? clean : ((clean.match(/\{[\s\S]*\}/) || [])[0]);
  if (jsonStr) { try { return JSON.parse(jsonStr); } catch(e) {} }
  const lines = clean.split('\n').filter(l => l.trim());
  return { variation1: lines[0] || clean, variation2: lines[1] || '' };
}

/* ── MAIN HANDLER ── */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }

  try {
    /* 1. Verify Firebase auth token */
    const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
    if (!token) return res.status(401).json({ error: 'Sign in required to use Creative Studios' });

    try {
      const { auth } = getFirebaseAdmin();
      await auth.verifyIdToken(token);
    } catch(e) {
      return res.status(401).json({ error: 'Invalid session. Please sign in again.' });
    }

    /* 2. Parse request */
    const { prompt, imageBase64, imageMime } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    /* 3. Call Groq (llama-4 scout — supports vision) */
    const key = process.env.GROQ_API_KEY;
    if (!key) return res.status(500).json({ error: 'Studio AI not configured' });

    const content = imageBase64
      ? [
          { type: 'image_url', image_url: { url: `data:${imageMime || 'image/jpeg'};base64,${imageBase64}` } },
          { type: 'text', text: prompt }
        ]
      : prompt;

    const data = await httpsPost(
      'api.groq.com',
      '/openai/v1/chat/completions',
      { 'Authorization': `Bearer ${key}` },
      {
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content }],
        max_tokens: 900,
        temperature: 0.55
      }
    );

    const raw = data?.choices?.[0]?.message?.content || '';
    if (!raw) {
      /* Fallback to Gemini */
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) return res.status(500).json({ error: 'AI unavailable. Please try again.' });
      // Simple gemini text-only fallback (no image support for now)
      const gemData = await httpsPost(
        'generativelanguage.googleapis.com',
        `/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {},
        { contents: [{ role: 'user', parts: [{ text: typeof content === 'string' ? content : prompt }] }],
          generationConfig: { maxOutputTokens: 900, temperature: 0.55 } }
      );
      const gemRaw = gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return res.status(200).json(parseAIJson(gemRaw));
    }

    return res.status(200).json(parseAIJson(raw));

  } catch (err) {
    console.error('[StudioAPI]', err.message);
    return res.status(500).json({ error: err.message || 'Studio error. Please try again.' });
  }
};
