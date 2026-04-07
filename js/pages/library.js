/* ═══════════════════════════════════════════════
   CLARIX — LIBRARY PAGE JS
   18 prompt cards, filter, load to Write
═══════════════════════════════════════════════ */

const LIBRARY_PROMPTS = [
  { id:1,  cat:'email',    tier:'free',     title:'Sick Leave Email',         preview:'A professional, empathetic email requesting sick leave without over-explaining.',        text:'Write a professional sick leave email to my manager. I need tomorrow off due to illness. Keep it concise, empathetic, and reassure that work is covered.' },
  { id:2,  cat:'email',    tier:'free',     title:'Salary Negotiation',       preview:'Confident email asking for a raise with data-backed reasoning.',                        text:'Write a professional email to negotiate a 20% salary increase. Include value delivered, market rate research, and a confident but polite tone.' },
  { id:3,  cat:'social',   tier:'free',     title:'Instagram Caption Hook',   preview:'Viral-worthy Instagram caption with strong hook and hashtags.',                         text:'Write 3 Instagram caption options for a sunset photo at the beach. Include a strong hook, emotional appeal, and 5 relevant hashtags for each.' },
  { id:4,  cat:'social',   tier:'free',     title:'LinkedIn Thought Leader',  preview:'Insight-driven LinkedIn post that positions you as an expert.',                         text:'Write a LinkedIn post about one key lesson I learned from a recent failure. Personal story format, professional insight, conversational tone, 200 words.' },
  { id:5,  cat:'coding',   tier:'free',     title:'Bug Debug Request',        preview:'Structured prompt to get maximum clarity from any AI debugger.',                       text:'I have a bug in my code. Help me debug it: [PASTE CODE]. Explain what the error means, why it occurs, and provide the corrected version with explanation.' },
  { id:6,  cat:'coding',   tier:'advanced', title:'Code Review Prompt',       preview:'Get a thorough, senior-developer-level code review from AI.',                          text:'Please review this code like a senior software engineer: [PASTE CODE]. Check for bugs, performance issues, security vulnerabilities, and code style improvements.' },
  { id:7,  cat:'business', tier:'free',     title:'Startup Pitch',            preview:'One-paragraph investor pitch that hooks in the first sentence.',                        text:'Write a compelling one-paragraph startup pitch for [YOUR STARTUP]. Include the problem, solution, target market, and why now. Strong opening hook required.' },
  { id:8,  cat:'business', tier:'advanced', title:'Business Proposal Email',  preview:'Professional B2B proposal email with clear value proposition.',                         text:'Write a business proposal email for a potential client in [INDUSTRY]. Include our value proposition, relevant case studies, pricing overview, and a clear CTA.' },
  { id:9,  cat:'study',    tier:'free',     title:'Explain Like I\'m 5',      preview:'Get any complex concept explained in the simplest possible way.',                       text:'Explain [CONCEPT] like I am a 10-year-old. Use a simple analogy, avoid jargon, and give one real-world example I can relate to.' },
  { id:10, cat:'study',    tier:'free',     title:'Study Plan Creator',       preview:'Personalised study plan with timeline, resources, and daily goals.',                    text:'Create a 30-day study plan to learn [TOPIC] from scratch. Include daily goals, recommended resources, practice exercises, and weekly milestones.' },
  { id:11, cat:'creative', tier:'free',     title:'Story Opener',             preview:'A gripping first paragraph that makes readers unable to stop.',                          text:'Write a gripping opening paragraph for a short story about [THEME]. Use vivid sensory detail, introduce tension immediately, and end with a hook that demands more.' },
  { id:12, cat:'creative', tier:'advanced', title:'Character Description',    preview:'Deep, cinematic character description for fiction writing.',                             text:'Write a detailed character description for [CHARACTER NAME]: physical appearance, personality, backstory, flaws, motivations, and a memorable quirk. Literary fiction style.' },
  { id:13, cat:'ai',       tier:'free',     title:'Midjourney Cinematic',     preview:'Pro-level Midjourney prompt with aspect ratio, style, and quality flags.',              text:'[YOUR SUBJECT], cinematic wide angle, dramatic golden hour lighting, shallow depth of field, hyperdetailed textures, moody atmosphere, anamorphic lens flare, --ar 16:9 --style raw --q 2' },
  { id:14, cat:'ai',       tier:'free',     title:'ChatGPT Roleplay',         preview:'Set ChatGPT into expert mode for any domain.',                                          text:'You are an expert [ROLE] with 20 years of experience. Answer all my questions from the perspective of a world-class professional. Be direct, specific, and avoid vague generalities.' },
  { id:15, cat:'ai',       tier:'pro',      title:'DALL-E Hyperrealistic',    preview:'Hyperrealistic DALL-E prompt with lighting, camera, and texture specifics.',            text:'Hyperrealistic DALL-E photograph: [SUBJECT], shot with a Canon EOS R5 85mm f/1.4, golden hour back lighting, natural bokeh, fine skin/texture detail, editorial retouching, 8K resolution' },
  { id:16, cat:'ai',       tier:'pro',      title:'Claude Analysis Prompt',   preview:'Deep analytical framework prompt to get structured, expert Claude responses.',          text:'Analyse [TOPIC/DOCUMENT] across these dimensions: (1) Key insights (2) Hidden assumptions (3) Counterarguments (4) Actionable takeaways (5) What\'s missing. Be the world\'s sharpest analyst.' },
  { id:17, cat:'business', tier:'pro',      title:'Investor Cold Email',      preview:'Cold email to angel investors that actually gets replies.',                              text:'Write a cold email to an angel investor about my startup [NAME]: [ONE LINE DESCRIPTION]. Include a compelling hook, traction metrics, the ask, and a low-friction CTA. Under 150 words.' },
  { id:18, cat:'creative', tier:'pro',      title:'Video Script (60s)',       preview:'High-energy 60-second YouTube/Reel script with hook, value, CTA.',                      text:'Write a 60-second high-energy video script for [TOPIC]. Structure: 0-5s hook (pattern interrupt), 5-45s value delivery (3 key points), 45-60s CTA. Punchy, direct, conversational.' },
];

let activeLibCat = 'all';

document.addEventListener('DOMContentLoaded', () => renderLib(LIBRARY_PROMPTS));

function filterLib(cat) {
  activeLibCat = cat;
  document.querySelectorAll('[data-libcat]').forEach(el => el.classList.toggle('active', el.dataset.libcat === cat));
  const filtered = cat === 'all' ? LIBRARY_PROMPTS : LIBRARY_PROMPTS.filter(p => p.cat === cat);
  renderLib(filtered);
}

function renderLib(items) {
  const tierColors = { free: 'tier-free', advanced: 'tier-advanced', pro: 'tier-pro' };
  const tierLabels = { free: 'Free', advanced: 'Advanced', pro: 'Pro ✦' };
  const catIcons   = { email:'📧', social:'📱', coding:'💻', business:'💼', study:'📚', creative:'🎨', ai:'🤖' };

  document.getElementById('libGrid').innerHTML = items.map((p, i) => {
    const isPro = p.tier === 'pro' && !ClarixState.isPro;
    return `
    <div class="lib-card${isPro ? ' locked' : ''}" style="animation-delay:${(i % 9) * 0.05}s" onclick="${isPro ? 'UpgradeModal.show()' : `usePrompt(${p.id})`}">
      <div class="lib-card-header">
        <div class="lib-card-title">${p.title}</div>
        <div class="lib-card-badges">
          <span class="tier-badge ${tierColors[p.tier]}">${tierLabels[p.tier]}</span>
        </div>
      </div>
      <div class="lib-card-preview">${p.preview}</div>
      <div class="lib-card-footer">
        <span class="lib-card-cat">${catIcons[p.cat] || ''} ${p.cat}</span>
        <button class="lib-use-btn" onclick="event.stopPropagation();${isPro ? 'UpgradeModal.show()' : `usePrompt(${p.id})`}">
          ${isPro ? '🔒 Pro' : 'Use Prompt →'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function usePrompt(id) {
  const prompt = LIBRARY_PROMPTS.find(p => p.id === id);
  if (!prompt) return;
  localStorage.setItem('clarix_intent', prompt.text);
  Toast.show(`"${prompt.title}" loaded in Write!`, 'success');
  setTimeout(() => { window.location.href = 'write.html'; }, 600);
}
