/* ═══════════════════════════════════════════════
   CLARIX — CONFIG
   AI Engine: Gemini → Groq → Claude → Local
   NOTE: API keys are now securely stored as
         Vercel environment variables (server-side only).
         This file is safe to be public.
═══════════════════════════════════════════════ */

const CLARIX_CONFIG = {
  // ─── AI ENGINE (keys are now on the server) ──
  // All AI calls route through /api/ai (serverless proxy)
  aiEngine: 'auto',

  // Max tokens for local fallback
  maxTokens: 1024,

  // Use local fallback when server is unreachable
  useFallback: true,

  // Free trial prompts (lifetime gift on signup)
  freeTrialLimit: 25,

  // Free daily prompts after trial is exhausted
  freeDailyLimit: 5,

  // ⚡ Razorpay Live Key ID (public — designed to be frontend-visible)
  razorpayKeyId: 'rzp_live_Sau4ZwhVTCtodP',

  // Pro price in paise (1 INR = 100 paise)
  proPriceAmount: 29900,  // ₹299

  // Pro price display
  proPrice: '₹299/month',
  proTrial: '7 days free',

  // Formspree form ID for email capture
  formspreeId: 'mjgplepg'
};
