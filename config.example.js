/* ═══════════════════════════════════════════════
   CLARIX — CONFIG (TEMPLATE)
   Copy this file to config.js and add your keys
   NEVER commit config.js to GitHub!
═══════════════════════════════════════════════ */

const CLARIX_CONFIG = {
  // ─── GOOGLE GEMINI (Primary AI) ──────────────
  // Get FREE key: aistudio.google.com → "Get API key"
  geminiApiKey: '',

  // ─── GROQ (Backup AI — Llama 3) ──────────────
  // Get FREE key: console.groq.com → "Create API Key"
  groqApiKey: '',

  // ─── ANTHROPIC CLAUDE (Optional) ─────────────
  // Get key: console.anthropic.com
  claudeApiKey: '',

  // AI Engine priority: 'gemini' | 'groq' | 'claude' | 'local'
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
