/* ═══════════════════════════════════════════════
   CLARIX — CONFIG
   AI Engine: Gemini → Groq → Local Fallback
═══════════════════════════════════════════════ */

const CLARIX_CONFIG = {
  // ─── GOOGLE GEMINI (Primary AI) ──────────────
  // Get FREE key in 30 sec: aistudio.google.com → "Get API key"
  geminiApiKey: 'AIzaSyBV4urzw3EkRHinMH4LSQAOwxjqRfabC4c',

  // ─── GROQ (Backup AI — Llama 3) ──────────────
  // Get FREE key: console.groq.com → "Create API Key"
  groqApiKey: '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',

  // ─── ANTHROPIC CLAUDE (Legacy) ───────────────
  claudeApiKey: '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',

  // AI Engine priority: 'gemini' | 'groq' | 'claude' | 'local'
  // Clarix auto-tries each in order until one works
  aiEngine: 'auto',

  // Max tokens for responses
  maxTokens: 1024,

  // Use local fallback when all APIs fail
  useFallback: true,

  // Free tier daily limit
  freeLimit: 10,

  // Pro price display
  proPrice: '₹299/month',
  proTrial: '7 days free',

  // Formspree form ID for email capture
  formspreeId: 'mjgplepg'
};
