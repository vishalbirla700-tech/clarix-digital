/* ═══════════════════════════════════════════════
   CLARIX DATA INTELLIGENCE — data.js  v20260414I
   Dedicated Data Intelligence Lab page logic.
   Reuses studios.js for: file parsing, AI prompt,
   _computeStats, _renderMultiCharts, groqCall.
═══════════════════════════════════════════════ */

/* ── Industry definitions ── */
var DATA_INDUSTRIES = [
  { id:'process', icon:'🔬', name:'Process / Chemical', desc:'Steam, CW, Temperature, Flow, Pressure', color:'#1e40af' },
  { id:'lab',     icon:'🧪', name:'Lab / QC Analysis',  desc:'pH, Absorbance, Titration, SPC, Cpk',  color:'#065f46' },
  { id:'finance', icon:'🏦', name:'Banking & Finance',  desc:'P&L, Balance Sheet, NPA, CAGR, Ratios',color:'#92400e' },
  { id:'oil',     icon:'🛢️', name:'Oil & Gas / Energy', desc:'Production, GOR, Water Cut, Decline',   color:'#7f1d1d' },
  { id:'stock',   icon:'📈', name:'Share Market',       desc:'OHLCV, SMA, RSI, Technical Analysis',   color:'#1e1b4b' },
  { id:'engineering', icon:'🏗️', name:'Engineering / BOM', desc:'Bill of Materials, Specs, Cost', color:'#1c1917' },
];

/* ── Page state ── */
var _dataSelectedIndustry = null;
var _dataResult           = null;
var _dataChartInstances   = [];
var _dataHiddenSeries     = {};

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  renderIndustryGrid();
  setupDataDropZone();

  /* Mark sidebar link active */
  setTimeout(function() {
    document.querySelectorAll('.sidebar-link').forEach(function(link) {
      var href = link.getAttribute('href') || '';
      link.classList.toggle('active', href.includes('data.html'));
    });
  }, 300);
});

/* ══════════════════════════════
   INDUSTRY SELECTOR
══════════════════════════════ */
function renderIndustryGrid() {
  var grid = document.getElementById('industryGrid');
  if (!grid) return;
  grid.innerHTML = DATA_INDUSTRIES.map(function(ind) {
    return '<div class="data-industry-tile" id="ind_' + ind.id + '" onclick="selectDataIndustry(\'' + ind.id + '\')">'
      + '<span class="data-ind-icon">' + ind.icon + '</span>'
      + '<div class="data-ind-name">' + ind.name + '</div>'
      + '<div class="data-ind-desc">' + ind.desc + '</div>'
      + '</div>';
  }).join('');
}

function selectDataIndustry(id) {
  _dataSelectedIndustry = (_dataSelectedIndustry === id) ? null : id; /* toggle off on re-click */
  document.querySelectorAll('.data-industry-tile').forEach(function(t) {
    t.classList.toggle('active', t.id === 'ind_' + _dataSelectedIndustry);
  });
  /* Push selection into docDirectChartData if already parsed */
  if (_dataSelectedIndustry && window.docDirectChartData) {
    window.docDirectChartData.industry = _dataSelectedIndustry;
  }
}

/* ══════════════════════════════
   FILE DROP ZONE
══════════════════════════════ */
function setupDataDropZone() {
  var zone = document.getElementById('dataDropZone');
  if (!zone) return;

  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault(); zone.classList.remove('dragover');
    var f = e.dataTransfer && e.dataTransfer.files[0];
    if (f) dataFileSelected(f);
  });

  var inp = document.getElementById('dataFileInput');
  if (inp) {
    inp.addEventListener('change', function() {
      if (inp.files && inp.files[0]) dataFileSelected(inp.files[0]);
    });
  }
}

function dataFileSelected(file) {
  /* Reset state */
  window.docDirectChartData = null;
  window.docExtractedText   = '';
  _dataHiddenSeries = {};
  _dataResult = null;

  var statusEl = document.getElementById('dataFileStatus');
  if (statusEl) { statusEl.textContent = '\u23f3 Reading file\u2026'; statusEl.style.color = 'rgba(255,255,255,0.5)'; }

  /* Hide output */
  var out = document.getElementById('dataOutput');
  if (out) out.style.display = 'none';

  /* Parse using studios.js engine (parseUploadedDoc is a global from studios.js) */
  parseUploadedDoc(file).then(function(text) {
    window.docExtractedText = text.substring(0, 8000);
    window.docFileName      = file.name;
    var wordCount = text.split(/\s+/).length;

    /* Auto-select industry from detected Excel headers if user hasn't chosen */
    if (!_dataSelectedIndustry && window.docDirectChartData && window.docDirectChartData.industry && window.docDirectChartData.industry !== 'general') {
      _dataSelectedIndustry = window.docDirectChartData.industry;
      selectDataIndustry(_dataSelectedIndustry);
    }

    var msg;
    if (window.docDirectChartData) {
      var d = window.docDirectChartData;
      msg = '\u2705 ' + d.labels.length + ' rows \u00d7 ' + (d.datasets.length + 1)
          + ' columns \u2014 ' + (d.detectedReason || 'Data ready');
    } else {
      msg = '\u2705 \u7e50\u7e54 ~' + wordCount.toLocaleString() + ' words extracted';
    }
    if (statusEl) { statusEl.textContent = msg; statusEl.style.color = '#4ade80'; }
    Toast.show('\ud83d\udcc4 File loaded! Click Analyze to get expert insights.', 'success', 3500);

  }).catch(function(err) {
    window.docExtractedText = '';
    var msg = '\u274c ' + (err.message || 'Could not read file');
    if (statusEl) { statusEl.textContent = msg; statusEl.style.color = '#f87171'; }
    Toast.show(msg, 'error');
  });
}

/* ══════════════════════════════
   ANALYZE
══════════════════════════════ */
async function dataAnalyze() {
  if (!window.docExtractedText) { Toast.show('Please upload a file first', 'error'); return; }

  /* Auth check */
  var user = null;
  try { user = firebase.auth().currentUser; } catch(e) {}
  if (!user) { Toast.show('Please sign in to analyze', 'error'); return; }

  var btn = document.getElementById('dataAnalyzeBtn');
  if (btn) { btn.disabled = true; btn.textContent = '\u23f3 Analyzing\u2026'; }

  /* Apply manual industry override */
  if (_dataSelectedIndustry && window.docDirectChartData) {
    window.docDirectChartData.industry = _dataSelectedIndustry;
  }

  try {
    var context = (document.getElementById('dataContext') || {}).value || '';

    /* Use studios.js promptDocAnalyzer — it already has the industry-intelligent logic */
    var result = await promptDocAnalyzer(context.trim());
    _dataResult = result;

    /* Render dashboard */
    renderDataDashboard(result);

    /* Save to Firestore history (non-critical) */
    try {
      var db = firebase.firestore();
      await db.collection('dataAnalysis').add({
        userId:     user.uid,
        title:      result.title || 'Data Analysis',
        industry:   _dataSelectedIndustry || (window.docDirectChartData && window.docDirectChartData.industry) || 'general',
        summary:    result.summary || '',
        fileName:   window.docFileName || '',
        hasRealData: !!window.docDirectChartData,
        createdAt:  firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch(e) { /* non-critical */ }

  } catch(err) {
    Toast.show('\u274c Analysis failed: ' + (err.message || err), 'error');
    console.error('dataAnalyze error:', err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '\u26a1 Analyze'; }
  }
}

/* ══════════════════════════════
   DASHBOARD RENDERER
══════════════════════════════ */
function renderDataDashboard(result) {
  var out = document.getElementById('dataOutput');
  if (!out) return;
  out.style.display = 'block';
  setTimeout(function() { out.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);

  var industry = _dataSelectedIndustry
    || (window.docDirectChartData && window.docDirectChartData.industry)
    || 'general';

  var indInfo = DATA_INDUSTRIES.find(function(i) { return i.id === industry; })
    || { icon: '\ud83d\udcca', name: 'General Analysis', color: '#1e293b' };

  /* ── Industry badge ── */
  var badge = document.getElementById('dataIndustryBadge');
  if (badge) {
    badge.innerHTML = '<span class="data-badge" style="background:rgba(56,189,248,.1);border-color:rgba(56,189,248,.25);color:#38bdf8">'
      + indInfo.icon + ' ' + indInfo.name + '</span>';
  }

  /* ── Report title ── */
  var titleEl = document.getElementById('dataReportTitle');
  if (titleEl) titleEl.textContent = result.title || 'Intelligence Report';

  /* ── Meta ── */
  var metaEl = document.getElementById('dataReportMeta');
  if (metaEl) {
    var parts = [];
    if (window.docFileName) parts.push(window.docFileName);
    parts.push(new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }));
    if (window.docDirectChartData) parts.push(window.docDirectChartData.labels.length + ' data points \u00d7 ' + window.docDirectChartData.datasets.length + ' columns');
    metaEl.textContent = parts.join(' \u00b7 ');
  }

  /* ── KPI cards ── */
  _renderDataKPIs(result);

  /* ── Column toggles ── */
  _renderColumnToggles();

  /* ── Charts ── */
  _renderDataCharts();

  /* ── AI Summary ── */
  var analysisText = document.getElementById('dataAnalysisText');
  if (analysisText) analysisText.textContent = result.summary || '';

  var keyPtsEl = document.getElementById('dataKeyPoints');
  if (keyPtsEl && result.keyPoints) {
    keyPtsEl.innerHTML = result.keyPoints.map(function(pt) {
      return '<div class="data-key-point">\u2192 ' + pt + '</div>';
    }).join('');
  }

  /* ── Anomalies ── */
  _renderDataAnomalies();

  /* ── Recommendations ── */
  var recsList = document.getElementById('dataRecsList');
  if (recsList && result.recommendations) {
    recsList.innerHTML = result.recommendations.map(function(r) {
      return '<li>' + r + '</li>';
    }).join('');
  }
}

/* ── KPI cards ── */
function _renderDataKPIs(result) {
  var row = document.getElementById('dataKpiRow');
  if (!row) return;
  var cards = [];

  /* Prefer real calculated stats from Excel */
  if (window.docDirectChartData && window.docDirectChartData.datasets) {
    window.docDirectChartData.datasets.forEach(function(ds) {
      if (!ds.stats) return;
      var s = ds.stats;
      var trendIcon = s.trend === 'up' ? '\u2191' : s.trend === 'down' ? '\u2193' : '\u2192';
      var trendCls  = s.trend === 'up' ? 'kpi-up' : s.trend === 'down' ? 'kpi-dn' : 'kpi-neu';
      var maxFmt    = s.max >= 10000 ? (s.max / 1000).toFixed(1) + 'K' : s.max.toFixed(s.max % 1 === 0 ? 0 : 1);
      var avgFmt    = s.mean >= 10000 ? (s.mean / 1000).toFixed(1) + 'K' : s.mean.toFixed(1);
      cards.push('<div class="data-kpi-card">'
        + '<div class="data-kpi-label">' + ds.label + '</div>'
        + '<div class="data-kpi-val">' + maxFmt + '<span class="data-kpi-sub"> max</span></div>'
        + '<div class="data-kpi-trend ' + trendCls + '">' + trendIcon + ' ' + s.pctChange + '% change</div>'
        + '<div class="data-kpi-sub2">Avg: ' + avgFmt + ' \u00b7 Min: ' + s.min.toFixed(1) + ' \u00b7 N=' + s.n + '</div>'
        + '</div>');
    });
  }

  /* Fallback: AI-provided stats */
  if (cards.length === 0 && result.stats) {
    result.stats.forEach(function(s) {
      var trendIcon = s.trend === 'up' ? '\u2191' : s.trend === 'down' ? '\u2193' : '\u2192';
      var trendCls  = s.trend === 'up' ? 'kpi-up' : s.trend === 'down' ? 'kpi-dn' : 'kpi-neu';
      cards.push('<div class="data-kpi-card">'
        + '<div class="data-kpi-label">' + s.label + '</div>'
        + '<div class="data-kpi-val">' + s.value + '</div>'
        + '<div class="data-kpi-trend ' + trendCls + '">' + trendIcon + '</div>'
        + '</div>');
    });
  }

  row.innerHTML = cards.join('');
}

/* ── Column toggles ── */
function _renderColumnToggles() {
  var ctrl = document.getElementById('dataColumnControls');
  if (!ctrl) return;
  if (!window.docDirectChartData || !window.docDirectChartData.datasets || window.docDirectChartData.datasets.length < 2) {
    ctrl.innerHTML = ''; return;
  }
  var html = '<span class="data-ctrl-label">Columns:</span>';
  window.docDirectChartData.datasets.forEach(function(ds, i) {
    html += '<button class="data-col-btn active" id="dataColBtn_' + i + '" onclick="dataToggleSeries(' + i + ')">' + ds.label + '</button>';
  });
  ctrl.innerHTML = html;
}

function dataToggleSeries(idx) {
  _dataHiddenSeries[idx] = !_dataHiddenSeries[idx];
  var btn = document.getElementById('dataColBtn_' + idx);
  if (btn) btn.classList.toggle('active', !_dataHiddenSeries[idx]);
  _renderDataCharts();
}

/* ── Multi-chart renderer ── */
function _renderDataCharts() {
  /* Destroy previous */
  _dataChartInstances.forEach(function(c) { try { c.destroy(); } catch(e) {} });
  _dataChartInstances = [];

  var wrap = document.getElementById('dataMultiChartWrap');
  if (!wrap) return;

  if (!window.docDirectChartData || !window.docDirectChartData.datasets || window.docDirectChartData.datasets.length === 0) {
    wrap.innerHTML = '<div class="data-no-chart">\ud83d\udcca Upload an Excel file (.xlsx) to see full multi-chart analysis with control limits</div>';
    return;
  }

  var data      = window.docDirectChartData;
  var labels    = data.labels;
  var xLabel    = data.col0Label || 'X';
  var chartType = data.detectedType || 'line';
  if (chartType === 'candlestick') chartType = 'line';
  var nPts    = labels.length;
  var palette = [
    'rgba(56,189,248,0.9)','rgba(255,112,67,0.9)','rgba(74,222,128,0.9)',
    'rgba(246,173,85,0.9)','rgba(167,139,250,0.9)','rgba(244,114,182,0.9)'
  ];

  var visibleSeries = data.datasets.filter(function(_, i) { return !_dataHiddenSeries[i]; });
  if (visibleSeries.length === 0) {
    wrap.innerHTML = '<p style="color:rgba(255,255,255,.35);padding:16px">All columns hidden — click column buttons above to show</p>';
    return;
  }

  /* Build chart grid HTML */
  var panelH = nPts > 60 ? 300 : (nPts > 30 ? 270 : 240);
  var html = '<div class="doc-multi-grid" style="--panel-h:' + panelH + 'px">';
  visibleSeries.forEach(function(ds, i) {
    html += '<div class="doc-chart-panel">';
    html += '<div class="doc-chart-panel-title">' + ds.label + '</div>';
    if (ds.stats) {
      var s = ds.stats;
      var trendIcon = s.trend === 'up' ? '\u2191' : s.trend === 'down' ? '\u2193' : '\u2192';
      var trendCls  = s.trend === 'up' ? 'stat-up' : s.trend === 'down' ? 'stat-dn' : 'stat-neu';
      html += '<div class="doc-panel-kpi">'
        + '<span>Avg: <b>' + s.mean.toFixed(1) + '</b></span>'
        + '<span>Max: <b>' + s.max.toFixed(1) + '</b></span>'
        + '<span>Min: <b>' + s.min.toFixed(1) + '</b></span>'
        + '<span class="' + trendCls + '">' + trendIcon + ' ' + s.pctChange + '%</span>'
        + '</div>';
    }
    html += '<div class="doc-panel-canvas-wrap"><canvas id="dataChart_' + i + '"></canvas></div>';
    html += '</div>';
  });
  html += '</div>';

  /* Statistical summary table */
  html += '<div class="doc-stats-table-wrap">'
    + '<div class="doc-stats-table-title">\ud83d\udcca Statistical Summary</div>'
    + '<div style="overflow-x:auto"><table class="doc-stats-table"><thead><tr>'
    + '<th>Column</th><th>N</th><th>Mean</th><th>Std Dev</th><th>Min</th><th>Max</th><th>UCL (+3\u03c3)</th><th>LCL (\u22123\u03c3)</th><th>Trend</th>'
    + '</tr></thead><tbody>';
  data.datasets.forEach(function(ds) {
    if (!ds.stats) return;
    var s = ds.stats;
    var trendTxt = s.trend === 'up' ? '\u2191 +' + s.pctChange + '%' : s.trend === 'down' ? '\u2193 ' + s.pctChange + '%' : '\u2192 Stable';
    var trendCls = s.trend === 'up' ? 'stat-up' : s.trend === 'down' ? 'stat-dn' : '';
    html += '<tr>'
      + '<td><b>' + ds.label + '</b></td>'
      + '<td>' + s.n + '</td>'
      + '<td>' + s.mean.toFixed(2) + '</td>'
      + '<td>' + s.std.toFixed(2) + '</td>'
      + '<td>' + s.min.toFixed(2) + '</td>'
      + '<td>' + s.max.toFixed(2) + '</td>'
      + '<td class="ucl-cell">' + s.ucl.toFixed(2) + '</td>'
      + '<td class="lcl-cell">' + (s.lcl > 0 ? s.lcl.toFixed(2) : '0') + '</td>'
      + '<td class="' + trendCls + '">' + trendTxt + '</td>'
      + '</tr>';
  });
  html += '</tbody></table></div></div>';

  wrap.innerHTML = html;

  /* Lazy-load Chart.js then render each panel */
  var _doRender = function() {
    visibleSeries.forEach(function(ds, i) {
      _dataRenderSingleChart(ds, i, labels, chartType, nPts, xLabel, palette);
    });
  };

  if (!window.Chart) {
    loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js').then(function() {
      if (!window.ChartDataLabels) {
        loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js').then(function() {
          if (window.ChartDataLabels) Chart.register(ChartDataLabels);
          _doRender();
        });
      } else { _doRender(); }
    });
    return;
  }
  if (!window.ChartDataLabels) {
    loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js').then(function() {
      if (window.ChartDataLabels) Chart.register(ChartDataLabels);
      _doRender();
    });
    return;
  }
  _doRender();
}

function _dataRenderSingleChart(ds, i, labels, chartType, nPts, xLabel, palette) {
  var canvas = document.getElementById('dataChart_' + i);
  if (!canvas) return;
  var st = ds.stats;
  var c  = palette[i % palette.length];

  var chartDatasets = [{
    label:               ds.label,
    data:                ds.data,
    borderColor:         c,
    backgroundColor:     c.replace('0.9', '0.1'),
    borderWidth:         2,
    fill:                true,
    tension:             0,
    pointRadius:         nPts > 80 ? 2 : (nPts > 40 ? 3 : 4),
    pointHoverRadius:    7,
    pointBackgroundColor: c,
    order: 0
  }];

  /* Add UCL / Mean / LCL as constant annotation datasets */
  if (st && chartType === 'line') {
    chartDatasets.push({ label: 'UCL (' + st.ucl.toFixed(1) + ')',
      data: labels.map(function() { return st.ucl; }),
      borderColor: 'rgba(239,68,68,0.75)', borderWidth: 1.5, borderDash: [6,4],
      pointRadius: 0, fill: false, tension: 0, order: 1, datalabels: { display: false } });
    chartDatasets.push({ label: 'Mean (' + st.mean.toFixed(1) + ')',
      data: labels.map(function() { return st.mean; }),
      borderColor: 'rgba(74,222,128,0.75)', borderWidth: 1.5, borderDash: [4,3],
      pointRadius: 0, fill: false, tension: 0, order: 1, datalabels: { display: false } });
    if (st.lcl > 0) {
      chartDatasets.push({ label: 'LCL (' + st.lcl.toFixed(1) + ')',
        data: labels.map(function() { return st.lcl; }),
        borderColor: 'rgba(239,68,68,0.75)', borderWidth: 1.5, borderDash: [6,4],
        pointRadius: 0, fill: false, tension: 0, order: 1, datalabels: { display: false } });
    }
  }

  var dlCfg = {
    display: function(ctx) {
      if (ctx.datasetIndex !== 0) return false;
      if (nPts > 120) return false;
      if (nPts > 60)  return ctx.dataIndex % 3 === 0;
      if (nPts > 30)  return ctx.dataIndex % 2 === 0;
      return true;
    },
    color:     'rgba(255,255,255,0.85)',
    font:      { size: nPts > 60 ? 7 : (nPts > 30 ? 8 : 9), weight: '700' },
    formatter: function(v) {
      if (v === 0 || v == null) return '';
      return typeof v === 'number' ? v.toFixed(v % 1 === 0 ? 0 : 1) : v;
    },
    anchor: 'end', align: 'top', offset: 1,
    rotation: nPts > 30 ? -60 : 0, clip: false
  };

  var inst = new Chart(canvas, {
    type: (chartType === 'scatter') ? 'scatter' : 'line',
    data: { labels: labels, datasets: chartDatasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      layout: { padding: { top: nPts > 30 ? 30 : 18, right: 8 } },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: { color: 'rgba(255,255,255,0.55)', font: { size: 10 }, padding: 10 }
        },
        tooltip: {
          mode: 'index', intersect: false,
          callbacks: {
            label: function(ctx) {
              var v = ctx.parsed.y;
              return ctx.dataset.label + ': ' + (typeof v === 'number' ? v.toFixed(2) : v);
            }
          }
        },
        datalabels: dlCfg
      },
      scales: {
        x: {
          title: { display: true, text: xLabel, color: 'rgba(255,255,255,0.4)', font: { size: 10 } },
          ticks: { color: 'rgba(255,255,255,0.45)', font: { size: 9 }, maxTicksLimit: Math.min(nPts, 15), maxRotation: 45 },
          grid:  { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          title: { display: true, text: ds.label, color: 'rgba(255,255,255,0.4)', font: { size: 10 } },
          ticks: { color: 'rgba(255,255,255,0.45)', font: { size: 9 } },
          grid:  { color: 'rgba(255,255,255,0.04)' }
        }
      }
    }
  });
  _dataChartInstances.push(inst);
}

/* ── Anomaly detection ── */
function _renderDataAnomalies() {
  var el   = document.getElementById('dataAnomalies');
  var list = document.getElementById('dataAnomalyList');
  if (!el || !list || !window.docDirectChartData) { if (el) el.style.display = 'none'; return; }

  var anomalies = [];
  window.docDirectChartData.datasets.forEach(function(ds) {
    if (!ds.stats) return;
    var s = ds.stats;
    var breachUp = ds.data.filter(function(v) { return v > s.ucl; }).length;
    if (breachUp > 0) {
      anomalies.push('\u26a0\ufe0f <b>' + ds.label + '</b>: ' + breachUp + ' reading(s) exceeded UCL (' + s.ucl.toFixed(1) + ')');
    }
    if (s.lcl > 0) {
      var breachDn = ds.data.filter(function(v) { return v < s.lcl; }).length;
      if (breachDn > 0) {
        anomalies.push('\u26a0\ufe0f <b>' + ds.label + '</b>: ' + breachDn + ' reading(s) fell below LCL (' + s.lcl.toFixed(1) + ')');
      }
    }
    if (Math.abs(parseFloat(s.pctChange)) > 50) {
      var dir = parseFloat(s.pctChange) > 0 ? 'increase' : 'decrease';
      anomalies.push('\ud83d\udcc9 <b>' + ds.label + '</b>: ' + Math.abs(s.pctChange) + '% ' + dir + ' over measurement period');
    }
  });

  if (anomalies.length === 0) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  list.innerHTML = anomalies.map(function(a) {
    return '<div class="data-anomaly-item">' + a + '</div>';
  }).join('');
}

/* ══════════════════════════════
   EXPORT / SHARE
══════════════════════════════ */
function dataExportPDF() {
  Toast.show('\ud83d\udcc4 PDF export coming soon. Use browser Print → Save as PDF for now.', 'info', 4000);
  window.print();
}

function dataExportPPT() {
  Toast.show('\ud83c\udfa5 PPT export — use the Document Analyzer in Creative Studio for PPT export.', 'info', 4000);
}

async function dataShareLink(btn) {
  if (!_dataResult) { Toast.show('Generate analysis first', 'error'); return; }
  var user = null;
  try { user = firebase.auth().currentUser; } catch(e) {}
  if (!user) { Toast.show('Please sign in to share', 'error'); return; }

  var origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Generating\u2026'; }

  try {
    var expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    var db = firebase.firestore();
    var reportData = {
      userId:      user.uid,
      userName:    user.displayName || 'Clarix User',
      title:       _dataResult.title || 'Data Analysis',
      summary:     _dataResult.summary || '',
      keyPoints:   _dataResult.keyPoints || [],
      stats:       _dataResult.stats || [],
      recommendations: _dataResult.recommendations || [],
      chartData:   _dataResult.chartData || null,
      directChartData: window.docDirectChartData || null,
      fileName:    window.docFileName || '',
      industry:    _dataSelectedIndustry || (window.docDirectChartData && window.docDirectChartData.industry) || 'general',
      detectedType: window.docDirectChartData ? window.docDirectChartData.detectedType : 'line',
      isPublic:    true,
      createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
      expiresAt:   expiry
    };
    var docRef = await db.collection('sharedReports').add(reportData);
    var link   = window.location.origin + '/view.html?id=' + docRef.id;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
      Toast.show('\ud83d\udd17 Share link copied to clipboard!', 'success', 4000);
    } else {
      prompt('Copy this link:', link);
    }
  } catch(err) {
    Toast.show('\u274c Share failed: ' + (err.message || err), 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

function dataCopyText() {
  if (!_dataResult) { Toast.show('Generate analysis first', 'error'); return; }
  var txt = (_dataResult.title || '') + '\n\n'
    + (_dataResult.summary || '') + '\n\n'
    + 'Key Points:\n'
    + (_dataResult.keyPoints || []).map(function(p, i) { return (i+1) + '. ' + p; }).join('\n') + '\n\n'
    + 'Recommendations:\n'
    + (_dataResult.recommendations || []).map(function(r, i) { return (i+1) + '. ' + r; }).join('\n');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt).then(function() { Toast.show('\ud83d\udccb Analysis copied to clipboard!', 'success'); });
  } else {
    prompt('Copy this text:', txt);
  }
}

function dataNewAnalysis() {
  /* Reset everything for a fresh upload */
  window.docDirectChartData = null;
  window.docExtractedText   = '';
  _dataResult = null;
  _dataHiddenSeries = {};
  _dataSelectedIndustry = null;

  var out = document.getElementById('dataOutput');
  if (out) out.style.display = 'none';

  var statusEl = document.getElementById('dataFileStatus');
  if (statusEl) { statusEl.textContent = 'No file selected'; statusEl.style.color = 'rgba(255,255,255,.5)'; }

  var inp = document.getElementById('dataFileInput');
  if (inp) inp.value = '';

  document.querySelectorAll('.data-industry-tile').forEach(function(t) { t.classList.remove('active'); });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  Toast.show('\ud83d\udd04 Ready for new analysis!', 'info', 2000);
}
