/* ═══════════════════════════════════════════════
   CLARIX — CHARTS.JS
   Lightweight canvas chart renderer — no libraries
   Used by: Profile Analytics Dashboard
═══════════════════════════════════════════════ */

const ClarixCharts = {

  /* ─── COLOUR PALETTE ────────────────────────── */
  accent: '#ff7043',
  accentDim: 'rgba(255,112,67,0.15)',
  accentGlow: 'rgba(255,112,67,0.4)',
  textMuted: '#888',
  textLight: '#ccc',
  gridLine: 'rgba(255,255,255,0.05)',

  /* ─── BAR CHART: 7-day usage ────────────────── */
  renderBarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const padL = 36, padR = 16, padT = 16, padB = 48;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const max = Math.max(...data.map(d => d.value), 1);
    const barCount = data.length;
    const gap = 8;
    const barW = (chartW - gap * (barCount - 1)) / barCount;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    const gridCount = 4;
    ctx.strokeStyle = this.gridLine;
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridCount; i++) {
      const y = padT + (chartH / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();

      // Y labels
      const val = Math.round(max * (1 - i / gridCount));
      ctx.fillStyle = this.textMuted;
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val, padL - 6, y + 4);
    }

    // Bars + labels
    data.forEach((d, i) => {
      const x = padL + i * (barW + gap);
      const barH = d.value > 0 ? Math.max((d.value / max) * chartH, 4) : 2;
      const y = padT + chartH - barH;

      // Glow shadow
      ctx.shadowColor = this.accentGlow;
      ctx.shadowBlur = d.value > 0 ? 12 : 0;

      // Gradient fill
      const grad = ctx.createLinearGradient(0, y, 0, padT + chartH);
      grad.addColorStop(0, this.accent);
      grad.addColorStop(1, this.accentDim);

      // Rounded top bar
      const r = Math.min(5, barW / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, padT + chartH);
      ctx.lineTo(x, padT + chartH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Value on top of bar
      if (d.value > 0) {
        ctx.fillStyle = this.accent;
        ctx.font = 'bold 10px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.value, x + barW / 2, y - 5);
      }

      // Day label below
      ctx.fillStyle = d.isToday ? this.accent : this.textMuted;
      ctx.font = d.isToday ? 'bold 11px DM Sans, sans-serif' : '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barW / 2, padT + chartH + 18);

      // "Today" marker
      if (d.isToday) {
        ctx.fillStyle = this.accent;
        ctx.font = '9px DM Sans, sans-serif';
        ctx.fillText('TODAY', x + barW / 2, padT + chartH + 32);
      }
    });
  },

  /* ─── HORIZONTAL BAR: top platforms ─────────── */
  renderHorizontalBar(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    // Only show top 5
    const items = data.slice(0, 5);
    if (!items.length) { this._drawEmpty(ctx, W, H); return; }

    const max = Math.max(...items.map(d => d.value), 1);
    const rowH = H / items.length;
    const padL = 90, padR = 50, padV = 8;
    const barAreaW = W - padL - padR;

    ctx.clearRect(0, 0, W, H);

    items.forEach((d, i) => {
      const y = i * rowH + padV;
      const barH = rowH - padV * 2;
      const barW = Math.max((d.value / max) * barAreaW, 4);

      // Background track
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.beginPath();
      ctx.roundRect(padL, y, barAreaW, barH, 4);
      ctx.fill();

      // Filled bar
      ctx.shadowColor = this.accentGlow;
      ctx.shadowBlur = 8;
      const grad = ctx.createLinearGradient(padL, 0, padL + barW, 0);
      grad.addColorStop(0, this.accent);
      grad.addColorStop(1, 'rgba(255,112,67,0.4)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(padL, y, barW, barH, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Platform label
      ctx.fillStyle = this.textLight;
      ctx.font = '12px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.label, padL - 8, y + barH / 2);

      // Value label
      ctx.fillStyle = this.accent;
      ctx.font = 'bold 11px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.value, padL + barW + 8, y + barH / 2);
    });
  },

  /* ─── DONUT CHART: language split ───────────── */
  renderDonut(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const cx = W * 0.38, cy = H / 2;
    const outerR = Math.min(W * 0.3, H * 0.42);
    const innerR = outerR * 0.6;

    if (!data.length) { this._drawEmpty(ctx, W, H); return; }

    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const colors = ['#ff7043', '#ff9a76', '#ffcc02', '#4fc3f7', '#81c784', '#ba68c8'];

    ctx.clearRect(0, 0, W, H);

    let startAngle = -Math.PI / 2;
    data.slice(0, 6).forEach((d, i) => {
      const slice = (d.value / total) * Math.PI * 2;
      const endAngle = startAngle + slice;
      const mid = startAngle + slice / 2;

      // Slice
      ctx.shadowColor = colors[i] + '66';
      ctx.shadowBlur = 10;
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner hole
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fill();

      // Legend dot
      const legendY = 24 + i * 26;
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(W * 0.70, legendY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = this.textLight;
      ctx.font = '11px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${d.label} (${Math.round(d.value / total * 100)}%)`, W * 0.70 + 12, legendY);

      startAngle = endAngle;
    });

    // Center label
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(outerR * 0.38)}px Syne, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, cx, cy - 8);
    ctx.fillStyle = this.textMuted;
    ctx.font = `10px DM Sans, sans-serif`;
    ctx.fillText('prompts', cx, cy + 10);
  },

  /* ─── EMPTY STATE ────────────────────────────── */
  _drawEmpty(ctx, W, H) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#555';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No data yet — start prompting!', W / 2, H / 2);
  },

  /* ─── AUTO RESIZE ────────────────────────────── */
  observeResize(canvasId, renderFn) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.ResizeObserver) return;
    const ro = new ResizeObserver(() => renderFn());
    ro.observe(canvas.parentElement || canvas);
  }
};
