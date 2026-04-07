/* ═══════════════════════════════════════════════
   CLARIX — COMMUNITY LIBRARY PAGE
   50+ curated prompts across 7 categories
   Search, filter, copy, use, share
═══════════════════════════════════════════════ */

const COMMUNITY_PROMPTS = [

  /* ───── 🎨 ART & IMAGE ───────────────────────── */
  {
    id: 'art-001', cat: 'art', title: 'Cinematic Dragon',
    emoji: '🐉', platform: 'Midjourney',
    lang: 'English', score: 97, uses: 3841,
    prompt: 'A colossal ancient dragon engulfed in emerald fire, perched atop a crumbling obsidian spire at dusk, dramatic chiaroscuro lighting, volumetric smoke, cinematic 35mm lens, hyperdetailed scales, 8K photorealistic, award-winning concept art'
  },
  {
    id: 'art-002', cat: 'art', title: 'Cyberpunk Mumbai',
    emoji: '🌆', platform: 'Midjourney',
    lang: 'English', score: 95, uses: 2190,
    prompt: 'Neon-drenched cyberpunk Mumbai in 2089, massive holographic Ganesh above Marine Drive, monsoon rain on chrome streets, street food stalls with bioluminescent pakoras, hyper-detailed, blade runner aesthetic, cinematic lighting, 8K'
  },
  {
    id: 'art-003', cat: 'art', title: 'Rajasthani Queen Portrait',
    emoji: '👑', platform: 'Midjourney',
    lang: 'English', score: 94, uses: 1876,
    prompt: 'A regal Rajasthani queen in red and gold lehenga, standing in a vast marble palace at golden hour, intricate jewelry, peacock motifs, soft bokeh, editorial fashion photography style, Vogue India cover quality'
  },
  {
    id: 'art-004', cat: 'art', title: 'Space Ganesh',
    emoji: '✨', platform: 'DALL·E 3',
    lang: 'English', score: 96, uses: 4200,
    prompt: 'Lord Ganesha meditating in deep space, golden cosmic aura surrounding him, galaxies and nebulae in the background, ultra-detailed divine figure, photorealistic yet ethereal, volumetric God rays, 8K HDR'
  },
  {
    id: 'art-005', cat: 'art', title: 'Underwater Delhi',
    emoji: '🌊', platform: 'Midjourney',
    lang: 'English', score: 92, uses: 987,
    prompt: 'India Gate submerged underwater, coral reefs growing along its pillars, schools of tropical fish swimming through, bioluminescent plankton lighting the murky depths, moody teal light rays from the surface, hyperrealistic aquatic photography'
  },
  {
    id: 'art-006', cat: 'art', title: 'Hindi Dragon Prompt',
    emoji: '🔥', platform: 'Midjourney',
    lang: 'Hindi', score: 93, uses: 1543,
    prompt: 'एक विशाल अग्नि ड्रैगन हिमालय की चोटी पर बैठा है, सूर्यास्त के नारंगी प्रकाश में, नाटकीय cinematic कोण, hyperdetailed तराजू, 8K photorealistic concept art'
  },

  /* ───── 📝 WRITING & CONTENT ─────────────────── */
  {
    id: 'write-001', cat: 'writing', title: 'Viral LinkedIn Post',
    emoji: '💼', platform: 'ChatGPT',
    lang: 'English', score: 91, uses: 5621,
    prompt: 'Write a viral LinkedIn post about a failure I turned into a lesson. Tone: humble yet inspiring, conversational. Include a hook first line, 3 numbered lessons, a relatable CTA. No corporate jargon. End with a question to drive comments. 200 words max.'
  },
  {
    id: 'write-002', cat: 'writing', title: 'YouTube Script Hook',
    emoji: '📹', platform: 'Claude',
    lang: 'English', score: 93, uses: 2876,
    prompt: 'Write a compelling YouTube video script opening (first 60 seconds) for a video about [TOPIC]. Hook viewers in the first 3 seconds with a shocking statement, then present the problem, tease the solution, and end with a "so stay till the end" moment. Conversational, energetic tone.'
  },
  {
    id: 'write-003', cat: 'writing', title: 'Instagram Reel Caption',
    emoji: '📸', platform: 'ChatGPT',
    lang: 'Hinglish', score: 89, uses: 3204,
    prompt: 'Instagram reel caption likho jo viral ho jaye — funny aur relatable, Gen Z vibe, 3-4 line mein, ek strong hook se shuru, end mein question ya CTA, relevant emojis use karo, 5 hashtags add karo jo trending hon'
  },
  {
    id: 'write-004', cat: 'writing', title: 'Cold Email Template',
    emoji: '📧', platform: 'Claude',
    lang: 'English', score: 94, uses: 1892,
    prompt: 'Write a cold outreach email for a [PRODUCT/SERVICE] targeting [TARGET AUDIENCE]. Make it feel personal, not salesy. Structure: personalized opener referencing their work, one sentence problem statement, one sentence solution value, specific social proof, soft CTA. Maximum 5 sentences. Subject line included.'
  },
  {
    id: 'write-005', cat: 'writing', title: 'Twitter Thread Maker',
    emoji: '🧵', platform: 'ChatGPT',
    lang: 'English', score: 92, uses: 2341,
    prompt: 'Create a 10-tweet thread about [TOPIC] that will go viral. Tweet 1: shocking hook. Tweets 2-9: one insight each, starting with a number. Tweet 10: summary + CTA. Each tweet max 240 chars. Use line breaks for readability. Include relevant emojis. No hashtags except last tweet.'
  },
  {
    id: 'write-006', cat: 'writing', title: 'Product Description',
    emoji: '🛍️', platform: 'ChatGPT',
    lang: 'English', score: 90, uses: 1654,
    prompt: 'Write an ecommerce product description for [PRODUCT] targeting [AUDIENCE]. Start with a benefit-led headline. 3 bullet points of key features (benefit-first, not feature-first). Short paragraph of emotional storytelling. Urgency CTA. SEO-friendly, 150 words max.'
  },

  /* ───── 💼 BUSINESS & STARTUPS ───────────────── */
  {
    id: 'biz-001', cat: 'business', title: 'Startup Pitch Deck',
    emoji: '🚀', platform: 'Claude',
    lang: 'English', score: 95, uses: 3102,
    prompt: 'Create a 10-slide startup pitch deck outline for [STARTUP NAME], a [CATEGORY] startup solving [PROBLEM]. Include: Problem, Solution, Market Size (TAM/SAM/SOM), Product Demo slide, Business Model, Traction, Team, Financials, Ask, Why Now. Use investor-ready language. Indian market context.'
  },
  {
    id: 'biz-002', cat: 'business', title: 'Business Plan (India)',
    emoji: '📊', platform: 'ChatGPT',
    lang: 'English', score: 93, uses: 1987,
    prompt: 'Write a 1-page lean business plan for a [TYPE] business in India targeting [CITY/REGION]. Include: value proposition, target customer persona, 3 revenue streams, key costs, competitive advantage, 90-day action plan. Format as a clean table. Be specific with Indian market context.'
  },
  {
    id: 'biz-003', cat: 'business', title: 'SWOT Analysis',
    emoji: '⚖️', platform: 'ChatGPT',
    lang: 'English', score: 88, uses: 876,
    prompt: 'Conduct a thorough SWOT analysis for [COMPANY/PRODUCT] in the Indian [INDUSTRY] sector. For each quadrant, provide 5 specific, actionable points. Consider Indian regulatory environment, competitor landscape, and consumer behavior. Present in a clean markdown table.'
  },
  {
    id: 'biz-004', cat: 'business', title: 'Marketing Strategy',
    emoji: '📣', platform: 'Claude',
    lang: 'English', score: 94, uses: 2234,
    prompt: 'Create a 90-day digital marketing strategy for [BRAND] targeting [AUDIENCE] in India. Platform mix: Instagram, YouTube, WhatsApp. Weekly content calendar outline (3 content types per platform). Budget allocation for ₹50,000/month. KPIs to track. Vernacular content strategy included.'
  },

  /* ───── 🎓 EDUCATION & LEARNING ──────────────── */
  {
    id: 'edu-001', cat: 'education', title: 'Study Plan Generator',
    emoji: '📚', platform: 'ChatGPT',
    lang: 'English', score: 92, uses: 4512,
    prompt: 'Create a structured 30-day study plan for [EXAM/SUBJECT] for a [GRADE/LEVEL] student. Daily schedule with morning/evening sessions, topic breakdown per week, revision strategy, practice test schedule, recommended resources (books + YouTube channels). Indian curriculum context.'
  },
  {
    id: 'edu-002', cat: 'education', title: 'Concept Explainer',
    emoji: '🔬', platform: 'Claude',
    lang: 'Hinglish', score: 90, uses: 2876,
    prompt: '[CONCEPT] ko mujhe bilkul simple language mein samjhao jaise main 10 saal ka baccha hoon. Phir ek real-life Indian example do jo relate karna aasan ho. Phir thoda technical detail add karo. End mein 3 key takeaways do.'
  },
  {
    id: 'edu-003', cat: 'education', title: 'JEE Problem Solver',
    emoji: '🧮', platform: 'ChatGPT',
    lang: 'English', score: 91, uses: 3241,
    prompt: 'Solve this JEE-level [PHYSICS/CHEMISTRY/MATH] problem step by step: [PROBLEM]. Show: conceptual approach, formula identification, substitution, calculation, unit check, and the final boxed answer. Then explain which JEE chapter this falls under and list 2 similar problem types to practice.'
  },
  {
    id: 'edu-004', cat: 'education', title: 'Essay Writer (UPSC)',
    emoji: '✍️', platform: 'Claude',
    lang: 'English', score: 93, uses: 1654,
    prompt: 'Write a UPSC Mains-style essay on "[TOPIC]" (1000 words). Structure: Strong introduction with a quote, 3 body sections with subheadings, each with Indian examples and data points, balanced perspective showing both sides, conclusion with a forward-looking statement. Formal academic tone.'
  },

  /* ───── 🎮 GAMING & ENTERTAINMENT ───────────── */
  {
    id: 'game-001', cat: 'gaming', title: 'Game Character Bio',
    emoji: '⚔️', platform: 'ChatGPT',
    lang: 'English', score: 91, uses: 2109,
    prompt: 'Create a detailed character profile for a video game set in mythological India. Character: [NAME], [CLASS/ROLE]. Include: backstory rooted in Indian mythology, special abilities (3 active, 2 passive), weapon with unique lore, character arc across 3 acts, dialogue style, and signature battle cry.'
  },
  {
    id: 'game-002', cat: 'gaming', title: 'Game World Builder',
    emoji: '🗺️', platform: 'Claude',
    lang: 'English', score: 94, uses: 1432,
    prompt: 'Design a fantasy game world inspired by ancient India. Include: 5 distinct regions (each with unique geography, culture, and dangers), a central conflict, 3 factions with opposing ideologies, the main villain\'s motivation rooted in Indian philosophy, and 10 unique flora/fauna with in-world names. Lore-rich and internally consistent.'
  },
  {
    id: 'game-003', cat: 'gaming', title: 'DnD Campaign (India)',
    emoji: '🎲', platform: 'ChatGPT',
    lang: 'English', score: 90, uses: 987,
    prompt: 'Write a one-shot D&D adventure set in ancient India. Hook: [SCENARIO]. Include: 3-act structure, 4 encounter rooms with stat blocks, 1 boss fight inspired by an Asura from Hindu mythology, unique magic items rooted in Indian culture, and read-aloud boxed text for each scene.'
  },

  /* ───── 🇮🇳 INDIA SPECIAL ────────────────────── */
  {
    id: 'india-001', cat: 'india', title: 'Festive Brand Campaign',
    emoji: '🪔', platform: 'ChatGPT',
    lang: 'English', score: 94, uses: 2987,
    prompt: 'Create a Diwali marketing campaign for [BRAND] targeting urban millennials in India. Include: Campaign name, core emotional theme, 5 social media post ideas (Instagram + WhatsApp), one 30-second video script, WhatsApp broadcast message, and email subject lines. Tone: warm, nostalgic, premium.'
  },
  {
    id: 'india-002', cat: 'india', title: 'Jugaad Innovation Pitch',
    emoji: '💡', platform: 'Claude',
    lang: 'Hinglish', score: 92, uses: 1876,
    prompt: 'Mujhe ek innovative jugaad solution chahiye [PROBLEM] ke liye jo India ke tier-2/3 cities mein kaam kare. Solution affordable hona chahiye (under ₹500), low-tech ya no-tech, local materials se banaye, aur aasaan explain kiya ja sake. 5 creative ideas do with pros/cons.'
  },
  {
    id: 'india-003', cat: 'india', title: 'Hindi Story Writer',
    emoji: '📖', platform: 'ChatGPT',
    lang: 'Hindi', score: 91, uses: 2341,
    prompt: 'एक छोटी हिंदी कहानी लिखो जो [THEME] पर आधारित हो। पात्र: एक युवा भारतीय जो अपने सपनों के लिए संघर्ष कर रहा है। कहानी में: एक दादी का ज्ञान, एक मुश्किल मोड़, और एक उम्मीद भरा अंत शामिल करो। भाषा सरल और दिल को छूने वाली हो। 500 शब्द।'
  },
  {
    id: 'india-004', cat: 'india', title: 'Startup Idea Validator',
    emoji: '🧪', platform: 'Claude',
    lang: 'English', score: 95, uses: 3102,
    prompt: 'Critically validate this Indian startup idea: [IDEA]. Analysis: Problem-solution fit, TAM in India (with numbers), top 3 Indian competitors, unfair advantage needed to win, biggest risk factors, regulatory challenges, unit economics estimate, and honest verdict (go/no-go with reasoning).'
  },
  {
    id: 'india-005', cat: 'india', title: 'IPL Fantasy Strategy',
    emoji: '🏏', platform: 'ChatGPT',
    lang: 'Hinglish', score: 87, uses: 4521,
    prompt: 'Aaj ke IPL match mein best Dream11 team banao: [TEAM A] vs [TEAM B]. Pitch report, weather, aur recent form consider karo. Captain aur vice-captain suggestion with reason. Budget ₹100 credits mein best 11 players ka lineup, backup players bhi batao.'
  },

  /* ───── 🤖 AI & PRODUCTIVITY ─────────────────── */
  {
    id: 'prod-001', cat: 'productivity', title: 'AI Meeting Notes',
    emoji: '📝', platform: 'Claude',
    lang: 'English', score: 92, uses: 2108,
    prompt: 'Convert this meeting transcript into structured notes: [PASTE TRANSCRIPT]. Output: Meeting summary (3 sentences), key decisions made, action items (person + task + deadline), open questions, and next meeting agenda. Professional format, remove filler words.'
  },
  {
    id: 'prod-002', cat: 'productivity', title: 'Resume Rewriter',
    emoji: '📄', platform: 'Claude',
    lang: 'English', score: 96, uses: 5432,
    prompt: 'Rewrite my resume bullet points to be ATS-optimized and achievement-focused. Original bullets: [PASTE BULLETS]. For each: Start with a strong action verb, quantify impact, highlight skills matching [JOB DESCRIPTION]. Avoid passive voice. Target: [COMPANY TYPE] in [INDUSTRY]. Keep same number of bullets.'
  },
  {
    id: 'prod-003', cat: 'productivity', title: 'Code Debugger',
    emoji: '🐛', platform: 'Claude',
    lang: 'English', score: 93, uses: 3876,
    prompt: 'Debug this code and explain the fix: [PASTE CODE]. Provide: 1) Exact bug location and type, 2) Why it\'s failing, 3) Fixed code with comments, 4) How to prevent this class of bug in future, 5) Any other potential issues noticed. Language: [LANGUAGE].'
  },
  {
    id: 'prod-004', cat: 'productivity', title: 'Excel Formula Builder',
    emoji: '📊', platform: 'ChatGPT',
    lang: 'English', score: 90, uses: 2765,
    prompt: 'Write an Excel/Google Sheets formula to [DESCRIBE WHAT YOU WANT TO DO]. Explain: the formula, how each part works, edge cases it handles, and an alternative approach. Also suggest if a pivot table or other feature would work better for this use case.'
  },
  {
    id: 'prod-005', cat: 'productivity', title: '30-Day Habit Plan',
    emoji: '🎯', platform: 'ChatGPT',
    lang: 'English', score: 89, uses: 1987,
    prompt: 'Create a science-backed 30-day habit stacking plan to help me [GOAL]. Include: habit cue-routine-reward loops, exact implementation intentions (when/where/how), weekly progress check-ins, potential obstacles and solutions, tracking method, and how to bounce back after missing a day. Indian lifestyle context.'
  },

  /* ───── 🎨 DESIGN & CREATIVE ────────────────── */
  {
    id: 'design-001', cat: 'art', title: 'Logo Concept Brief',
    emoji: '✏️', platform: 'ChatGPT',
    lang: 'English', score: 91, uses: 1543,
    prompt: 'Create a logo design brief for [BRAND NAME] in the [INDUSTRY] space. Target audience: [AUDIENCE]. Include: brand personality (5 adjectives), color palette with hex codes and psychological reasoning, typography style, logo concept options (3 directions), what to avoid, and reference brands for inspiration. Indian cultural sensitivity notes.'
  },
  {
    id: 'design-002', cat: 'art', title: 'Midjourney Style Guide',
    emoji: '🎭', platform: 'Midjourney',
    lang: 'English', score: 95, uses: 2109,
    prompt: '[SUBJECT DESCRIPTION], [ART STYLE: e.g. ukiyo-e / oil painting / watercolor], intricate details, masterpiece quality, [LIGHTING: e.g. golden hour / studio lighting / moonlight], [MOOD: e.g. ethereal / gritty / whimsical], [COMPOSITION: e.g. close-up portrait / wide establishing shot], 8K resolution, trending on ArtStation --ar 16:9 --v 6'
  },
];

/* ─── COMMUNITY PAGE CONTROLLER ──────────────── */
const CommunityPage = {
  allPrompts: COMMUNITY_PROMPTS,
  filtered: COMMUNITY_PROMPTS,
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'popular',

  /* ─── INIT ──────────────────────────────────── */
  init() {
    this.renderCategories();
    this.renderPrompts();
    this.bindSearch();
    this.bindSort();
    this.updateStats();
    // Load shared prompt from URL if present
    const shared = typeof SharePrompt !== 'undefined' ? SharePrompt.readFromURL() : null;
    if (shared) {
      Toast.show(`✦ Shared prompt loaded! Click "Use" to open it.`, 'info', 5000);
    }
  },

  /* ─── CATEGORIES ────────────────────────────── */
  renderCategories() {
    const cats = [
      { id: 'all', label: 'All', emoji: '✦' },
      { id: 'art', label: 'Art & Image', emoji: '🎨' },
      { id: 'writing', label: 'Writing', emoji: '📝' },
      { id: 'business', label: 'Business', emoji: '💼' },
      { id: 'education', label: 'Education', emoji: '🎓' },
      { id: 'gaming', label: 'Gaming', emoji: '🎮' },
      { id: 'india', label: 'India Special', emoji: '🇮🇳' },
      { id: 'productivity', label: 'Productivity', emoji: '⚡' },
    ];

    const container = document.getElementById('comm-categories');
    if (!container) return;

    container.innerHTML = cats.map(c => {
      const count = c.id === 'all' ? this.allPrompts.length
        : this.allPrompts.filter(p => p.cat === c.id).length;
      return `
        <button class="comm-cat-btn ${c.id === 'all' ? 'active' : ''}"
                data-cat="${c.id}"
                onclick="CommunityPage.setCategory('${c.id}')">
          ${c.emoji} ${c.label}
          <span class="comm-cat-count">${count}</span>
        </button>`;
    }).join('');
  },

  /* ─── SET CATEGORY ───────────────────────────── */
  setCategory(cat) {
    this.activeCategory = cat;
    document.querySelectorAll('.comm-cat-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.cat === cat);
    });
    this.applyFilters();
  },

  /* ─── SEARCH ─────────────────────────────────── */
  bindSearch() {
    const input = document.getElementById('comm-search');
    if (!input) return;
    input.addEventListener('input', debounce((e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.applyFilters();
    }, 250));
  },

  /* ─── SORT ───────────────────────────────────── */
  bindSort() {
    const sel = document.getElementById('comm-sort');
    if (!sel) return;
    sel.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.applyFilters();
    });
  },

  /* ─── APPLY FILTERS ──────────────────────────── */
  applyFilters() {
    let result = [...this.allPrompts];

    if (this.activeCategory !== 'all') {
      result = result.filter(p => p.cat === this.activeCategory);
    }

    if (this.searchQuery) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(this.searchQuery) ||
        p.prompt.toLowerCase().includes(this.searchQuery) ||
        p.platform.toLowerCase().includes(this.searchQuery) ||
        p.lang.toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.sortBy === 'popular') result.sort((a, b) => b.uses - a.uses);
    else if (this.sortBy === 'score') result.sort((a, b) => b.score - a.score);
    else if (this.sortBy === 'newest') result.reverse();

    this.filtered = result;
    this.renderPrompts();
  },

  /* ─── RENDER PROMPTS ─────────────────────────── */
  renderPrompts() {
    const container = document.getElementById('comm-grid');
    if (!container) return;

    const countEl = document.getElementById('comm-count');
    if (countEl) countEl.textContent = `${this.filtered.length} prompts`;

    if (!this.filtered.length) {
      container.innerHTML = `
        <div class="comm-empty">
          <div style="font-size:48px;margin-bottom:12px">🔍</div>
          <div style="font-size:16px;color:#888">No prompts found for "${this.searchQuery}"</div>
          <button class="btn btn-secondary" style="margin-top:16px" onclick="CommunityPage.setCategory('all');document.getElementById('comm-search').value='';CommunityPage.searchQuery=''">
            Clear filters
          </button>
        </div>`;
      return;
    }

    container.innerHTML = this.filtered.map(p => this._card(p)).join('');
  },

  /* ─── CARD HTML ──────────────────────────────── */
  _card(p) {
    const usesStr = p.uses >= 1000 ? `${(p.uses / 1000).toFixed(1)}K` : p.uses;
    return `
      <div class="comm-card" id="card-${p.id}">
        <div class="comm-card-top">
          <div class="comm-card-emoji">${p.emoji}</div>
          <div class="comm-card-meta">
            <div class="comm-card-title">${p.title}</div>
            <div class="comm-card-badges">
              <span class="comm-badge platform">${p.platform}</span>
              <span class="comm-badge lang">${p.lang}</span>
            </div>
          </div>
          <div class="comm-card-score">
            <div class="comm-score-num">${p.score}</div>
            <div class="comm-score-label">score</div>
          </div>
        </div>
        <div class="comm-card-prompt">${p.prompt.slice(0, 140)}${p.prompt.length > 140 ? '...' : ''}</div>
        <div class="comm-card-footer">
          <div class="comm-uses">🔥 ${usesStr} uses</div>
          <div class="comm-card-actions">
            <button class="comm-btn-copy" onclick="CommunityPage.copy('${p.id}', this)" title="Copy prompt">📋 Copy</button>
            <button class="comm-btn-use" onclick="CommunityPage.use('${p.id}')" title="Open in Write">✦ Use</button>
            <button class="comm-btn-share" onclick="CommunityPage.share('${p.id}')" title="Share">🔗</button>
          </div>
        </div>
      </div>`;
  },

  /* ─── COPY ───────────────────────────────────── */
  async copy(id, btn) {
    const p = this.allPrompts.find(x => x.id === id);
    if (!p) return;
    try {
      await navigator.clipboard.writeText(p.prompt);
      if (btn) { const o = btn.textContent; btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = o, 2000); }
      Toast.show('Prompt copied!', 'success');
    } catch { Toast.show('Copy failed', 'error'); }
  },

  /* ─── USE IN WRITE ───────────────────────────── */
  use(id) {
    const p = this.allPrompts.find(x => x.id === id);
    if (!p) return;
    const url = `write.html?prompt=${encodeURIComponent(p.prompt)}&platform=${encodeURIComponent(p.platform)}&via=clarix`;
    window.location.href = url;
  },

  /* ─── SHARE ──────────────────────────────────── */
  share(id) {
    const p = this.allPrompts.find(x => x.id === id);
    if (!p) return;
    if (typeof SharePrompt !== 'undefined') {
      SharePrompt.showModal(p.prompt, p.platform);
    } else {
      copyText(p.prompt);
    }
  },

  /* ─── UPDATE STATS ───────────────────────────── */
  updateStats() {
    const totalEl = document.getElementById('comm-total-prompts');
    const totalUses = document.getElementById('comm-total-uses');
    if (totalEl) totalEl.textContent = this.allPrompts.length + '+';
    if (totalUses) {
      const uses = this.allPrompts.reduce((s, p) => s + p.uses, 0);
      totalUses.textContent = (uses / 1000).toFixed(0) + 'K+';
    }
  }
};

/* ─── BOOT ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => CommunityPage.init());
