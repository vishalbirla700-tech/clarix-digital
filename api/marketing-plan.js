/* ═══════════════════════════════════════════════
   CLARIX — /api/marketing-plan
   Generates a personalised 30-day marketing plan
   + channel-specific content for any startup
   Uses Groq (primary) → Claude (fallback)
═══════════════════════════════════════════════ */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, startup } = req.body || {};

  if (!startup || !startup.name) {
    return res.status(400).json({ error: 'Startup details required' });
  }

  const startupContext = `
Startup Name: ${startup.name}
What it does: ${startup.description}
Target Audience: ${startup.audience}
Key USP / Differentiator: ${startup.usp}
Primary Goal: ${startup.goal}
Budget: ${startup.budget}
Industry: ${startup.industry || 'Tech / SaaS'}
`.trim();

  let prompt = '';

  if (action === 'plan') {
    prompt = `You are a world-class startup marketing strategist specialising in zero-budget growth for Indian startups.

A startup has given you their details:
${startupContext}

Generate a detailed 30-day marketing plan. Return ONLY valid JSON in exactly this format:
{
  "summary": "2-3 sentence executive summary of the strategy",
  "primaryChannel": "The #1 channel to focus on this month",
  "weeklyGoal": "One measurable goal per week as an array of 4 strings",
  "days": [
    {
      "day": 1,
      "week": 1,
      "title": "Short action title",
      "description": "What to do today (2-3 sentences)",
      "channel": "reddit|linkedin|twitter|whatsapp|producthunt|press|email|content|seo|community",
      "effort": "low|medium|high",
      "impact": "low|medium|high",
      "clarixTool": "write|inspire|apps|library|community|none",
      "clarixHint": "How to use Clarix to help with this task (1 sentence)"
    }
  ]
}

Include all 30 days. Make the plan specific to "${startup.name}" — not generic advice. Mix channels across the 30 days. Focus on free/low-cost tactics first.`;

  } else if (action === 'content') {
    const { channel, dayTitle, dayDescription } = req.body;
    prompt = `You are an expert content writer for Indian startups.

Startup details:
${startupContext}

Task: Write marketing content for day "${dayTitle}". Context: ${dayDescription}

Channel: ${channel}

Return ONLY valid JSON in exactly this format:
{
  "channel": "${channel}",
  "content": {
    "headline": "Attention-grabbing headline or title",
    "body": "Full post body text — ready to copy and paste. Include emojis where appropriate. For Twitter, format as a numbered thread (1/, 2/, etc.). For Reddit, include a clear title and body. For WhatsApp, keep it short and punchy.",
    "hashtags": ["tag1", "tag2", "tag3"],
    "callToAction": "Exact CTA line to use",
    "tip": "One pro tip specific to this channel"
  }
}`;

  } else {
    return res.status(400).json({ error: 'Invalid action. Use "plan" or "content"' });
  }

  /* ── Try Groq first ── */
  try {
    const key = (process.env.GROQ_API_KEY || '').trim();
    if (!key) throw new Error('GROQ_API_KEY not set');

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: action === 'plan' ? 4000 : 800,
        temperature: 0.7
      })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(`Groq HTTP ${r.status}: ${JSON.stringify(data?.error)}`);

    let text = data?.choices?.[0]?.message?.content || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(text);
    return res.status(200).json({ ok: true, engine: 'groq', result: parsed });

  } catch (groqErr) {
    console.warn('Groq failed, trying Claude:', groqErr.message);
  }

  /* ── Fallback: Claude ── */
  try {
    const key = (process.env.CLAUDE_API_KEY || '').trim();
    if (!key) throw new Error('CLAUDE_API_KEY not set');

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: action === 'plan' ? 4000 : 800,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(`Claude HTTP ${r.status}: ${JSON.stringify(data?.error)}`);

    let text = data?.content?.[0]?.text || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(text);
    return res.status(200).json({ ok: true, engine: 'claude', result: parsed });

  } catch (claudeErr) {
    console.error('Both AI engines failed:', claudeErr.message);
    return res.status(500).json({ error: 'AI generation failed. Please try again.' });
  }
};
