/* ═══════════════════════════════════════════════
   CLARIX — APPS PAGE JS V2
   Realistic thumbnails, compact video, intent grid
═══════════════════════════════════════════════ */

const INTENTS = [
  { icon:'📧', name:'Email',         sub:'Professional & personal',  color:'#1e3a5f', img:'https://images.unsplash.com/photo-1596526131083-e8c633064f9f?w=400&q=80', text:'Write a professional email to my manager requesting a meeting to discuss project updates and deliverables.' },
  { icon:'📱', name:'Social Post',   sub:'Instagram, LinkedIn, X',   color:'#1a1a2e', img:'https://images.unsplash.com/photo-1611162618479-ee4098c35a1f?w=400&q=80', text:'Write an engaging social media post about a product launch with a strong hook and call-to-action.' },
  { icon:'🎨', name:'Image Prompt',  sub:'Midjourney, DALL-E',       color:'#0f2027', img:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80', text:'Create a detailed cinematic image prompt for a futuristic Indian city at night with neon lights and rain.' },
  { icon:'✍️', name:'Blog Post',     sub:'SEO optimised',            color:'#1a2832', img:'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80', text:'Write an engaging blog post introduction about the future of AI in everyday life for Indian creators.' },
  { icon:'💻', name:'Code Help',     sub:'Debug & explain',          color:'#0d1117', img:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80', text:'Help me debug this code: explain what the error means and suggest the best fix with a clear explanation.' },
  { icon:'🎬', name:'Video Script',  sub:'YouTube & Reels',          color:'#1c0a00', img:'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80', text:'Write a 60-second YouTube Shorts script about 3 productivity hacks for students, hook-first structure.' },
  { icon:'💼', name:'Business',      sub:'Pitches & proposals',      color:'#0a1628', img:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80', text:'Write a compelling startup pitch for an AI-powered personal finance app for millennials in India.' },
  { icon:'✈️', name:'Travel',        sub:'Itineraries & guides',     color:'#012a1a', img:'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80', text:'Create a 5-day travel itinerary for Goa, India: beaches, food spots, nightlife, and hidden gems.' },
];

const HUBS = {
  video: {
    cards: [
      { icon:'🎬', name:'RunwayML Prompt',   desc:'Cinematic video prompt for RunwayML Gen-3', text:'Cinematic RunwayML prompt: aerial drone shot of neon Tokyo at night, rain, slow motion camera pan, 4K' },
      { icon:'🎭', name:'Pika Labs Prompt',   desc:'Short-form dramatic video for Pika 1.5',   text:'Pika Labs: close-up of glowing ember swirling into wind against dark background, cinematic slow motion' },
      { icon:'🌌', name:'Sora Style Scene',   desc:'Long-form cinematic Sora-inspired prompt',  text:'Cinematic scene: lone astronaut walking across red Martian desert at sunset, vast emptiness, IMAX 70mm' },
      { icon:'📱', name:'Reel Script (30s)',   desc:'30-second Instagram Reel, hook-first',     text:'Write a 30-second Instagram Reel script: 3 morning habits that changed my life. High energy, POV style.' },
    ]
  },
  blog: {
    cards: [
      { icon:'🔍', name:'SEO Blog Intro',     desc:'Hook + keyword-rich opening for Google',   text:'Write an SEO-optimised blog introduction about remote work productivity for keyword "work from home India"' },
      { icon:'💼', name:'LinkedIn Article',   desc:'Thought leadership, professional tone',     text:'Write a LinkedIn article about leadership lessons from building a startup. Personal story, 400 words.' },
      { icon:'🛒', name:'Product Review',     desc:'E-commerce blog that converts readers',     text:'Write an engaging blog post reviewing noise-cancelling headphones for students under ₹5000.' },
      { icon:'📰', name:'Newsletter Hook',    desc:'Email newsletter opener with high open rate',text:'Write a newsletter opening paragraph about 3 AI tools that saved me 10 hours this week.' },
    ]
  },
  '3d': {
    cards: [
      { icon:'🟠', name:'Blender Scene',      desc:'Photorealistic Blender render description', text:'Blender scene: cozy Japanese ramen shop at night, neon signs, rain on glass, warm interior lighting, 8K' },
      { icon:'🌐', name:'Spline Design',      desc:'Interactive 3D web experience for Spline',  text:'Spline 3D: floating holographic UI cards that rotate on hover, glassmorphism, dark space background' },
      { icon:'🗿', name:'Meshy 3D Model',     desc:'Text-to-3D asset description for Meshy AI', text:'Meshy 3D: ancient warrior helmet with intricate engravings, battle-worn metal texture, game-ready poly' },
      { icon:'🎮', name:'Unreal Engine 5',    desc:'UE5 environment and lighting description',   text:'Unreal Engine 5 environment: abandoned cyberpunk subway, overgrown vines, flickering neon, photorealistic' },
    ],
    tools: [
      { icon:'🟠', name:'Blender',    url:'https://blender.org',      tag:'3D Software' },
      { icon:'🌐', name:'Spline',     url:'https://spline.design',    tag:'3D Web' },
      { icon:'🗿', name:'Meshy AI',   url:'https://meshy.ai',         tag:'AI 3D' },
      { icon:'🎮', name:'Unreal',     url:'https://unrealengine.com', tag:'Game Engine' },
    ]
  },
  aitools: {
    tools: [
      { icon:'🤖', name:'ChatGPT',    url:'https://chat.openai.com',           tag:'Text & Code' },
      { icon:'🧠', name:'Claude',     url:'https://claude.ai',                 tag:'Analysis' },
      { icon:'♊', name:'Gemini',      url:'https://gemini.google.com',         tag:'Multimodal' },
      { icon:'🎨', name:'Midjourney', url:'https://midjourney.com',            tag:'Image Gen' },
      { icon:'🎬', name:'RunwayML',   url:'https://runwayml.com',              tag:'Video Gen' },
      { icon:'🔍', name:'Perplexity', url:'https://perplexity.ai',             tag:'Research' },
      { icon:'🌊', name:'DeepSeek',   url:'https://chat.deepseek.com',         tag:'Coding' },
      { icon:'⚡', name:'Grok',       url:'https://grok.x.ai',                 tag:'Real-time' },
      { icon:'🇮🇳', name:'Krutrim',   url:'https://krutrim.com',               tag:'Indian AI' },
      { icon:'🌄', name:'DALL-E',     url:'https://openai.com/dall-e-3',       tag:'Image Gen' },
      { icon:'🌊', name:'Suno AI',    url:'https://suno.com',                  tag:'Music Gen' },
      { icon:'🎙️', name:'ElevenLabs', url:'https://elevenlabs.io',             tag:'Voice Gen' },
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderIntents();
  switchHub('video');
});

function renderIntents() {
  document.getElementById('intentGrid').innerHTML = INTENTS.map((item, i) => `
    <div class="intent-card" onclick="loadIntent(${i})" style="animation-delay:${i*0.05}s">
      <div class="intent-thumb" style="background-image:url('${item.img}')">
        <div class="intent-thumb-overlay" style="background:linear-gradient(to top,${item.color}ee,${item.color}88)"></div>
        <div class="intent-icon-big">${item.icon}</div>
      </div>
      <div class="intent-info">
        <div class="intent-name">${item.name}</div>
        <div class="intent-sub">${item.sub}</div>
      </div>
    </div>`).join('');
}

function loadIntent(idx) {
  const item = INTENTS[idx];
  localStorage.setItem('clarix_intent', item.text);
  // Auto-select platform based on intent type
  const platformMap = {
    'Email':       'ChatGPT',
    'Social Post': 'Instagram',
    'Image Prompt':'Midjourney',
    'Blog Post':   'ChatGPT',
    'Code Help':   'ChatGPT',
    'Video Script':'ChatGPT',
    'Business':    'ChatGPT',
    'Travel':      'ChatGPT',
  };
  const platform = platformMap[item.name];
  if (platform) localStorage.setItem('clarix_intent_platform', platform);
  window.location.href = 'write.html';
}

function switchHub(hub) {
  document.querySelectorAll('.hub-tab').forEach(t => t.classList.toggle('active', t.dataset.hub === hub));
  const data = HUBS[hub];
  let html = '';

  if (data.cards) {
    html += `<div class="hub-section-title">Prompt Templates</div>
    <div class="hub-cards">
      ${data.cards.map(c => `
        <div class="hub-card" onclick="loadHubCard('${c.text.replace(/'/g,"\\'").replace(/`/g,'\\`')}', '${c.platform || 'Midjourney'}')">

          <div class="hub-card-icon">${c.icon}</div>
          <div class="hub-card-name">${c.name}</div>
          <div class="hub-card-desc">${c.desc}</div>
          <div class="hub-card-action">Use in Write →</div>
        </div>`).join('')}
    </div>`;
  }
  if (data.tools) {
    html += `<div class="hub-section-title" style="margin-top:28px">Open Tools</div>
    <div class="ai-tools-grid">
      ${data.tools.map(t => `
        <a class="ai-tool-btn" href="${t.url}" target="_blank" rel="noopener">
          <div class="ai-tool-icon">${t.icon}</div>
          <div class="ai-tool-name">${t.name}</div>
          ${t.tag ? `<div class="ai-tool-tag">${t.tag}</div>` : ''}
        </a>`).join('')}
    </div>`;
  }

  document.getElementById('hubContent').innerHTML = `<div class="hub-panel active">${html}</div>`;
}

function loadHubCard(text, platform) {
  localStorage.setItem('clarix_intent', text);
  if (platform) localStorage.setItem('clarix_intent_platform', platform);
  window.location.href = 'write.html';
}
