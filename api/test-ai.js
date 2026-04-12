/* ── /api/test-ai — Quick diagnostic: test each AI engine ── */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const results = {};
  const simple = 'Say "ok" in JSON: {"enhanced":"ok","score":90,"lang":"English","platformTip":"test","variations":["ok","ok","ok"],"socialCaption":"ok"}';

  /* Test Gemini */
  try {
    const key = (process.env.GEMINI_API_KEY || '').trim();
    if (!key) throw new Error('GEMINI_API_KEY not set');
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: simple }] }],
          generationConfig: { maxOutputTokens: 100 }
        })
      }
    );
    const data = await r.json();
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${JSON.stringify(data?.error).substring(0,200)}`);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    results.Gemini = text ? `✅ OK: ${text.substring(0,50)}` : '❌ Empty response';
  } catch(e) { results.Gemini = `❌ ${e.message}`; }

  /* Test Groq */
  try {
    const key = (process.env.GROQ_API_KEY || '').trim();
    if (!key) throw new Error('GROQ_API_KEY not set');
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: simple }],
        max_tokens: 100
      })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${JSON.stringify(data?.error).substring(0,200)}`);
    const text = data?.choices?.[0]?.message?.content || '';
    results.Groq = text ? `✅ OK: ${text.substring(0,50)}` : '❌ Empty response';
  } catch(e) { results.Groq = `❌ ${e.message}`; }

  /* Test Claude */
  try {
    const key = (process.env.CLAUDE_API_KEY || '').trim();
    if (!key) throw new Error('CLAUDE_API_KEY not set');
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [{ role: 'user', content: simple }]
      })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${JSON.stringify(data?.error).substring(0,200)}`);
    const text = data?.content?.[0]?.text || '';
    results.Claude = text ? `✅ OK: ${text.substring(0,50)}` : '❌ Empty response';
  } catch(e) { results.Claude = `❌ ${e.message}`; }

  return res.status(200).json({ results, nodeVersion: process.version });
};
