/* ═══════════════════════════════════════════════
   CLARIX — HOME PAGE JS V2
   Neural Network Canvas + Ticker + Typewriter + Marquee
═══════════════════════════════════════════════ */

/* ─── LEFT TICKER — Creative Studios Showcase */
var LEFT_CARDS = [
  {
    tag: '👶 Kids Creator',
    text: 'Turn any child\'s photo into Pixar cartoon, Storybook magic or Superhero comic — perfect for birthday cards & WhatsApp stickers.',
    meta: '🎨 5 art styles · Instant prompt',
    badge: 'CREATIVE STUDIO',
    color: 'rgba(251,146,60,0.15)',
    border: 'rgba(251,146,60,0.3)',
  },
  {
    tag: '💼 Corporate Creator',
    text: 'Professional AI prompts for LinkedIn posts, pitch decks & brand ads. Upload team photos for branded corporate visuals.',
    meta: '📊 LinkedIn · Pitch · Ads',
    badge: 'CREATIVE STUDIO',
    color: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.3)',
  },
  {
    tag: '🎉 Cultural Creator',
    text: 'Generate Diwali, Eid, Navratri & 9 more festival cards with AI messages in Hindi, Gujarati, Urdu, Marathi — ready to share on WhatsApp.',
    meta: '🇮🇳 12 festivals · 6 languages',
    badge: 'ONLY IN INDIA',
    color: 'rgba(236,72,153,0.15)',
    border: 'rgba(236,72,153,0.3)',
  },
  {
    tag: '🔤 Multilingual Analyzer',
    text: 'Upload any image with Hindi, Gujarati, Tamil, Arabic or Urdu text. AI reads it, translates & generates 2 creative prompts instantly.',
    meta: '🌐 20+ languages · Vision AI',
    badge: 'CREATIVE STUDIO',
    color: 'rgba(20,184,166,0.15)',
    border: 'rgba(20,184,166,0.3)',
  },
];

var RIGHT_CARDS = [
  { tag:'Instagram Caption',  text:'Golden hour hits different when you stop chasing and start living. Tag someone who needs this today...', meta:'12.4K likes' },
  { tag:'YouTube Script',     text:'HOOK: What if I told you the one habit that doubled my income took only 10 minutes a day?...', meta:'847K views' },
  { tag:'WhatsApp Message',   text:'Bhai party kal raat 8 baje mere ghar pe. Khana sab set hai. Bas aa jaana, maza aayega!', meta:'Delivered' },
  { tag:'Midjourney Prompt',  text:'Colossal dragon engulfed in emerald fire, obsidian spire, cinematic 8K, hyperdetailed scales...', meta:'Score: 96/100' },
  { tag:'LinkedIn Post',      text:'3 things no one tells you about building in public (and why I wish I knew them earlier)...', meta:'4.2K impressions' },
];

function makeTickerHTML(cards) {
  var all = cards.concat(cards); // duplicate for seamless loop
  return all.map(function(c) {
    // Studio card (has .badge and .color)
    if (c.badge) {
      return '<div class="ticker-card ticker-studio" style="background:' + c.color + ';border-color:' + c.border + '">' +
        '<div class="ticker-studio-badge">' + c.badge + '</div>' +
        '<div class="ticker-tag">' + c.tag + '</div>' +
        '<div class="ticker-text">' + c.text + '</div>' +
        '<div class="ticker-meta">' + c.meta + '</div>' +
        '<div class="ticker-cta">Try in Creative Studios \u2192</div>' +
      '</div>';
    }
    // Simple prompt card
    return '<div class="ticker-card">' +
      '<div class="ticker-tag">\u2756 ' + c.tag + '</div>' +
      '<div class="ticker-text">' + c.text + '</div>' +
      '<div class="ticker-meta">' + c.meta + '</div>' +
    '</div>';
  }).join('');
}

function initTicker() {
  var left  = document.getElementById('ticker-left');
  var right = document.getElementById('ticker-right');
  if (left)  left.innerHTML  = makeTickerHTML(LEFT_CARDS);
  if (right) right.innerHTML = makeTickerHTML(RIGHT_CARDS);
}

/* ─── NEURAL NETWORK CANVAS ───────────────────── */
class NeuralNode {
  constructor(W, H) {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = Math.random() * 2 + 0.8;
    this.energy    = Math.random();
    this.energyDir = Math.random() > 0.5 ? 1 : -1;
    this.energySpd = Math.random() * 0.008 + 0.003;
    this.isCore    = false;
  }
  update(W, H) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    this.energy += this.energySpd * this.energyDir;
    if (this.energy >= 1 || this.energy <= 0) this.energyDir *= -1;
  }
}

class NeuralSpark {
  constructor(fromNode, toNode) {
    this.from  = fromNode;
    this.to    = toNode;
    this.t     = 0;
    this.speed = Math.random() * 0.02 + 0.01;
    this.done  = false;
  }
  update() {
    this.t += this.speed;
    if (this.t >= 1) this.done = true;
  }
  draw(ctx) {
    const x = this.from.x + (this.to.x - this.from.x) * this.t;
    const y = this.from.y + (this.to.y - this.from.y) * this.t;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,200,100,${1 - this.t})`;
    ctx.fill();
  }
}

function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], sparks = [];
  let frame = 0;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Create nodes — core cluster near center + spread
  const TOTAL = 90;
  for (let i = 0; i < TOTAL; i++) {
    const n = new NeuralNode(W, H);
    // First 15 nodes form a "core" cluster near center
    if (i < 15) {
      n.x = W / 2 + (Math.random() - 0.5) * 200;
      n.y = H / 2 + (Math.random() - 0.5) * 150;
      n.r = Math.random() * 2.5 + 1.5;
      n.isCore = true;
    }
    nodes.push(n);
  }

  // Spawn a random spark occasionally
  function maybeSpawn() {
    if (Math.random() < 0.06 && sparks.length < 8) {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      const dx = a.x - b.x, dy = a.y - b.y;
      if (dx * dx + dy * dy < 140 * 140) sparks.push(new NeuralSpark(a, b));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max  = nodes[i].isCore && nodes[j].isCore ? 140 : 110;

        if (dist < max) {
          const alpha = (1 - dist / max) * 0.15;
          const pulse = (nodes[i].energy + nodes[j].energy) / 2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,${100 + pulse * 80},67,${alpha + pulse * 0.05})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      n.update(W, H);
      const glow = 0.4 + n.energy * 0.6;
      const size = n.r + n.energy * (n.isCore ? 2 : 1);

      // Outer glow
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 4);
      grad.addColorStop(0, `rgba(255,112,67,${glow * 0.25})`);
      grad.addColorStop(1,  'rgba(255,112,67,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, size * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${120 + n.energy * 60},67,${glow})`;
      ctx.fill();
    });

    // Sparks
    maybeSpawn();
    sparks = sparks.filter(s => !s.done);
    sparks.forEach(s => { s.update(); s.draw(ctx); });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── TYPEWRITER ──────────────────────────────── */
const PHRASES = [
  'ek dragon ka cinematic photo chahiye...',
  'Write a LinkedIn post about my startup...',
  'Mujhe ek powerful image prompt chahiye...',
  'Video script for a 60-second product reel...',
  'Aaj ka motivational quote WhatsApp ke liye...',
  'Blog intro: AI tools for Indian creators...',
  'Realistic sunset photo prompt for Midjourney...',
  'Professional email for salary negotiation...',
  'एक सुंदर landscape image का prompt...',
  'Instagram caption for my business launch...',
];

function initTypewriter() {
  const input = document.getElementById('hero-input');
  if (!input) return;
  let pi = 0, ci = 0, del = false;

  function type() {
    const phrase = PHRASES[pi];
    if (!del) {
      ci++;
      input.placeholder = phrase.slice(0, ci);
      if (ci === phrase.length) { del = true; setTimeout(type, 2800); return; }
      setTimeout(type, 52);
    } else {
      ci--;
      input.placeholder = phrase.slice(0, ci);
      if (ci === 0) { del = false; pi = (pi + 1) % PHRASES.length; setTimeout(type, 450); return; }
      setTimeout(type, 26);
    }
  }
  setTimeout(type, 2800);
}

/* ─── MARQUEE ─────────────────────────────────── */
function initMarquee() {
  const ai = [
    ['🤖','ChatGPT'],['🧠','Claude'],['♊','Gemini'],['⚡','Grok'],
    ['🌊','DeepSeek'],['🔍','Perplexity'],['🪟','Copilot'],['🤳','Meta AI'],
    ['🎨','Midjourney'],['🌄','DALL-E'],['🤖','Mistral'],['🇮🇳','Krutrim'],
  ];
  const social = [
    ['📸','Instagram'],['💬','WhatsApp'],['💼','LinkedIn'],['🐦','Twitter/X'],
    ['👥','Facebook'],['▶️','YouTube'],['👻','Snapchat'],['🧵','Threads'],
    ['📌','Pinterest'],['🔴','Reddit'],['✈️','Telegram'],['🇮🇳','ShareChat'],
  ];

  const build = (id, items) => {
    const el = document.getElementById(id);
    if (!el) return;
    const all = [...items, ...items];
    el.innerHTML = all.map(([icon, name]) =>
      `<div class="marquee-item"><span>${icon}</span><span>${name}</span></div>`
    ).join('');
  };

  build('marquee-ai',     ai);
  build('marquee-social', social);
}

/* ─── SCROLL REVEAL ───────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('anim-fade-up'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ─── HERO ENHANCE ────────────────────────────── */
async function heroEnhance() {
  const input = document.getElementById('hero-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) { Toast.show('Type something first!', 'info'); input.focus(); return; }
  localStorage.setItem('clarix_hero_prompt', text);
  window.location.href = 'write.html?from=hero';
}

/* ─── NAV SCROLL HIDE/SHOW ────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('topnav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    lastY = y;
  }, { passive: true });
}

/* ─── SMOOTH SCROLL FOR ANCHORS ───────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ─── INIT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTicker();
  initTypewriter();
  initMarquee();
  initScrollReveal();
  initNavScroll();
  initSmoothScroll();

  const hi = document.getElementById('hero-input');
  if (hi) hi.addEventListener('keydown', e => { if (e.key === 'Enter') heroEnhance(); });
});
