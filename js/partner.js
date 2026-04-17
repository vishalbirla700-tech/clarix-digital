/* ═══════════════════════════════════════════════
   CLARIX — PARTNER PROGRAM JS
   Handles: registration, dashboard data loading,
            ref param capture, share utilities
═══════════════════════════════════════════════ */

/* ── Capture ?ref= param on any page load (last-click wins) ── */
(function captureRefParam() {
  try {
    var params = new URLSearchParams(window.location.search);
    var ref = params.get('ref');
    if (ref && /^[A-Z]{2}\d{4}$/.test(ref)) {
      localStorage.setItem('clarix_ref', ref);
      console.log('[Clarix Partner] Referral captured:', ref);
    }
  } catch(e) {}
})();

/* ══════════════════════════════════════════════
   PARTNER REGISTRATION MODULE
══════════════════════════════════════════════ */
var PartnerReg = {

  _submitting: false,

  init: function() {
    var form = document.getElementById('partnerRegForm');
    if (form) form.addEventListener('submit', this.handleSubmit.bind(this));

    /* Pre-fill email only from Firebase auth — name is entered by the partner themselves */
    ClarixAuth.onReady(function(user) {
      if (user) {
        var emailEl = document.getElementById('partnerEmail');
        if (emailEl && !emailEl.value) emailEl.value = user.email || '';
      }
    });
  },

  handleSubmit: async function(e) {
    e.preventDefault();
    if (this._submitting) return;
    this._submitting = true;

    var btn = document.getElementById('regSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Registering…'; }

    try {
      var name  = document.getElementById('partnerName').value.trim();
      var city  = document.getElementById('partnerCity').value.trim();
      var mode  = document.getElementById('partnerMode').value;
      var agree = document.getElementById('partnerAgree').checked;

      if (!name || !city || !mode) {
        PartnerReg._error('Please fill all fields.'); return;
      }
      if (!agree) {
        PartnerReg._error('Please agree to the Partner Terms.'); return;
      }

      /* Get Firebase ID token */
      if (!ClarixAuth.currentUser) {
        PartnerReg._error('Please sign in first to register as a partner.');
        return;
      }
      var idToken = await ClarixAuth.currentUser.getIdToken(true);

      var resp = await fetch('/api/partner-register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken },
        body:    JSON.stringify({ name, city, mode })
      });
      var data = await resp.json();

      if (data.success) {
        localStorage.setItem('clarix_partner_code', data.partner.refCode);
        /* Redirect to dashboard */
        window.location.href = '/partner-dashboard.html';
      } else {
        PartnerReg._error(data.error || 'Registration failed. Please try again.');
      }
    } catch(err) {
      PartnerReg._error('Network error. Please try again.');
      console.error('[PartnerReg]', err);
    } finally {
      this._submitting = false;
      if (btn) { btn.disabled = false; btn.textContent = 'Join as Partner →'; }
    }
  },

  _error: function(msg) {
    this._submitting = false;
    var btn = document.getElementById('regSubmitBtn');
    if (btn) { btn.disabled = false; btn.textContent = 'Join as Partner →'; }
    var errEl = document.getElementById('regError');
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    else alert(msg);
  }
};

/* ══════════════════════════════════════════════
   PARTNER DASHBOARD MODULE
══════════════════════════════════════════════ */
var PartnerDash = {

  _data: null,
  _tab:  'overview',

  init: async function() {
    /* Require auth */
    ClarixAuth.onReady(async function(user) {
      if (!user) {
        window.location.href = '/partner.html';
        return;
      }
      await PartnerDash.loadData(user);
    });

    /* Tab switching */
    document.querySelectorAll('[data-dash-tab]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        PartnerDash.switchTab(this.dataset.dashTab);
      });
    });

    /* Payout button */
    var payoutBtn = document.getElementById('requestPayoutBtn');
    if (payoutBtn) payoutBtn.addEventListener('click', PartnerDash.requestPayout.bind(PartnerDash));

    /* Copy ref link */
    var copyBtn = document.getElementById('copyRefLink');
    if (copyBtn) copyBtn.addEventListener('click', PartnerDash.copyRefLink.bind(PartnerDash));
  },

  loadData: async function(user) {
    try {
      var idToken = await user.getIdToken(true);
      var resp = await fetch('/api/partner-stats', {
        headers: { 'Authorization': 'Bearer ' + idToken }
      });

      if (resp.status === 404) {
        /* Not a partner yet */
        window.location.href = '/partner.html';
        return;
      }

      var data = await resp.json();
      if (!data.success) throw new Error(data.error);

      this._data = data;
      this.render(data);
    } catch(err) {
      console.error('[PartnerDash]', err);
      PartnerDash._showError('Failed to load dashboard. Please refresh.');
    }
  },

  render: function(data) {
    var p = data.partner;
    var s = data.stats;

    /* Hide loader, show content */
    var loader = document.getElementById('dashLoader');
    var content = document.getElementById('dashContent');
    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'block';

    /* Partner name */
    document.querySelectorAll('.partner-name-display').forEach(function(el) {
      el.textContent = p.name;
    });

    /* Ref code and link */
    var refCodeEl = document.getElementById('refCodeDisplay');
    var refLinkEl = document.getElementById('refLinkDisplay');
    if (refCodeEl) refCodeEl.textContent = p.refCode;
    if (refLinkEl) refLinkEl.value = 'https://clarix.digital/?ref=' + p.refCode;
    localStorage.setItem('clarix_partner_code', p.refCode);

    /* KPI cards */
    PartnerDash._setText('statTodayEarnings',   '₹' + (s.todayEarnings  || 0));
    PartnerDash._setText('statMonthEarnings',   '₹' + (s.monthEarnings  || 0));
    PartnerDash._setText('statTotalEarnings',   '₹' + (p.totalEarnings  || 0));
    PartnerDash._setText('statPendingPayout',   '₹' + (p.pendingPayout  || 0));
    PartnerDash._setText('statTotalReferrals',  p.totalReferrals || 0);
    PartnerDash._setText('statProReferrals',    p.proReferrals   || 0);
    PartnerDash._setText('statPaidOut',         '₹' + (p.paidOut        || 0));

    /* Mode badge */
    var modeBadge = document.getElementById('partnerModeBadge');
    if (modeBadge) {
      var modeLabels = {
        'freelancer': '🧑‍💻 Freelancer',
        'sales':      '💼 Sales Pro',
        'agency':     '🏢 Agency',
        'influencer': '📲 Influencer'
      };
      modeBadge.textContent = modeLabels[p.mode] || p.mode;
    }

    /* City */
    PartnerDash._setText('partnerCityDisplay', p.city);

    /* Render referral table */
    PartnerDash.renderReferrals(data.referrals || []);

    /* Render payouts */
    PartnerDash.renderPayouts(data.payouts || []);

    /* Update payout button state */
    var payoutBtn = document.getElementById('requestPayoutBtn');
    if (payoutBtn) {
      var pending = p.pendingPayout || 0;
      payoutBtn.disabled = pending < 100;
      payoutBtn.title = pending < 100 ? 'Minimum payout is ₹100' : 'Request payout of ₹' + pending;
    }
  },

  renderReferrals: function(referrals) {
    var tbody = document.getElementById('referralsTableBody');
    if (!tbody) return;

    if (!referrals.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:48px;color:rgba(255,255,255,0.3);font-size:13px;">No referrals yet. Share your link to start earning!</td></tr>';
      return;
    }

    tbody.innerHTML = referrals.map(function(r) {
      var date = r.signedUpAt ? new Date(r.signedUpAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
      var planBadge = r.plan === 'pro'
        ? '<span class="pd-badge pd-badge-pro">Pro ✦</span>'
        : '<span class="pd-badge pd-badge-free">Free</span>';
      var statusBadge = r.status === 'confirmed' || r.status === 'paid'
        ? '<span class="pd-badge pd-badge-green">Confirmed</span>'
        : '<span class="pd-badge pd-badge-pending">Pending</span>';
      var earning = r.earningAmount > 0 ? '<span style="color:#22c55e;font-weight:700;">₹' + r.earningAmount + '</span>' : '<span style="color:rgba(255,255,255,0.3);">—</span>';

      return [
        '<tr>',
          '<td><div class="pd-user-cell"><div class="pd-avatar">' + (r.clientName[0] || 'U') + '</div><span>' + r.clientName + '</span></div></td>',
          '<td>' + (r.clientCity || '—') + '</td>',
          '<td>' + planBadge + '</td>',
          '<td>' + earning + '</td>',
          '<td>' + date + '</td>',
        '</tr>'
      ].join('');
    }).join('');
  },

  renderPayouts: function(payouts) {
    var list = document.getElementById('payoutHistoryList');
    if (!list) return;

    if (!payouts.length) {
      list.innerHTML = '<div style="text-align:center;padding:24px;color:rgba(255,255,255,0.3);font-size:13px;">No payout history yet.</div>';
      return;
    }

    list.innerHTML = payouts.map(function(p) {
      var date = p.requestedAt ? new Date(p.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
      var statusColor = { pending: '#f59e0b', approved: '#22c55e', paid: '#60a5fa' }[p.status] || '#fff';
      return [
        '<div class="pd-payout-row">',
          '<div><span style="font-size:13px;font-weight:700;color:#fff;">₹' + p.amount + '</span><span style="font-size:11px;color:rgba(255,255,255,0.4);margin-left:8px;">' + date + '</span></div>',
          '<span style="font-size:11px;font-weight:700;color:' + statusColor + ';text-transform:uppercase;">' + p.status + '</span>',
        '</div>'
      ].join('');
    }).join('');
  },

  switchTab: function(tab) {
    this._tab = tab;
    document.querySelectorAll('[data-dash-tab]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.dashTab === tab);
    });
    document.querySelectorAll('[data-dash-panel]').forEach(function(panel) {
      panel.style.display = panel.dataset.dashPanel === tab ? 'block' : 'none';
    });
  },

  copyRefLink: function() {
    var linkEl = document.getElementById('refLinkDisplay');
    if (!linkEl) return;
    navigator.clipboard.writeText(linkEl.value).then(function() {
      var btn = document.getElementById('copyRefLink');
      if (btn) { btn.textContent = '✓ Copied!'; setTimeout(function() { btn.textContent = 'Copy Link'; }, 2000); }
    });
  },

  shareWhatsApp: function() {
    var code = localStorage.getItem('clarix_partner_code') || '';
    var link = 'https://clarix.digital/?ref=' + code;
    var msg = encodeURIComponent(
      '🚀 *Try Clarix AI — India\'s First AI Prompt Engine!*\n\n' +
      'Write better prompts in Hindi, Hinglish, English & 20+ languages.\n' +
      'ChatGPT, Midjourney, Claude & 25+ platforms. *Free to start!* ✦\n\n' +
      '👉 ' + link
    );
    window.open('https://wa.me/?text=' + msg, '_blank');
  },

  shareTelegram: function() {
    var code = localStorage.getItem('clarix_partner_code') || '';
    var link = 'https://clarix.digital/?ref=' + code;
    var msg = encodeURIComponent('🚀 Try Clarix AI — India\'s First AI Prompt Engine! Free to start → ' + link);
    window.open('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + msg, '_blank');
  },

  requestPayout: async function() {
    var upiId = prompt('Enter your UPI ID for payout:\n(e.g. name@upi or mobile@paytm)');
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. yourname@upi)');
      return;
    }

    try {
      var user = ClarixAuth.currentUser;
      if (!user) { alert('Please sign in first.'); return; }
      var idToken = await user.getIdToken(true);

      var resp = await fetch('/api/payout-request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken },
        body:    JSON.stringify({ upiId })
      });
      var data = await resp.json();

      if (data.success) {
        alert('✅ Payout request submitted!\n\nAmount: ₹' + data.amount + '\nUPI: ' + upiId + '\n\nClarix team will process your payout on the 15th of the following month.');
        window.location.reload();
      } else {
        alert('❌ ' + (data.error || 'Failed to submit request.'));
      }
    } catch(err) {
      alert('Network error. Please try again.');
    }
  },

  _setText: function(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  _showError: function(msg) {
    var loader = document.getElementById('dashLoader');
    if (loader) loader.innerHTML = '<div style="text-align:center;padding:48px;color:rgba(255,100,100,0.9);">' + msg + '</div>';
  }
};

/* ── Auto-init based on current page ── */
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('partnerRegForm')) {
    PartnerReg.init();
  }
  if (document.getElementById('dashContent') || document.getElementById('dashLoader')) {
    PartnerDash.init();
  }
});
