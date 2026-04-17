/* ═══════════════════════════════════════════════
   CLARIX — PARTNER STATS API
   GET /api/partner-stats
   Returns referrals + earnings for the authenticated partner
   Protected: requires valid Firebase ID token
═══════════════════════════════════════════════ */

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://clarix.digital');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    /* Verify token */
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ error: 'No token provided' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    /* Load partner profile */
    const partnerDoc = await db.collection('partners').doc(uid).get();
    if (!partnerDoc.exists) {
      return res.status(404).json({ error: 'Not a registered partner' });
    }
    const partner = partnerDoc.data();

    /* Load referrals for this partner (last 100) */
    const refSnap = await db.collection('referrals')
      .where('partnerUid', '==', uid)
      .orderBy('signedUpAt', 'desc')
      .limit(100)
      .get();

    const referrals = refSnap.docs.map(d => {
      const r = d.data();
      return {
        id:           d.id,
        clientName:   r.clientName  || 'Member',
        clientCity:   r.clientCity  || '—',
        plan:         r.plan        || 'free',
        earningAmount:r.earningAmount || 0,
        status:       r.status      || 'pending',
        signedUpAt:   r.signedUpAt  ? r.signedUpAt.toDate().toISOString() : null
      };
    });

    /* Today's earnings */
    const today = new Date().toDateString();
    const todayEarnings = referrals
      .filter(r => r.signedUpAt && new Date(r.signedUpAt).toDateString() === today)
      .reduce((s, r) => s + (r.earningAmount || 0), 0);

    /* This month's earnings */
    const now = new Date();
    const monthEarnings = referrals
      .filter(r => {
        if (!r.signedUpAt) return false;
        const d = new Date(r.signedUpAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, r) => s + (r.earningAmount || 0), 0);

    /* Load pending payout requests */
    const payoutSnap = await db.collection('payout_requests')
      .where('partnerUid', '==', uid)
      .orderBy('requestedAt', 'desc')
      .limit(10)
      .get();

    const payouts = payoutSnap.docs.map(d => {
      const p = d.data();
      return {
        id:          d.id,
        amount:      p.amount,
        status:      p.status,
        requestedAt: p.requestedAt ? p.requestedAt.toDate().toISOString() : null
      };
    });

    return res.status(200).json({
      success: true,
      partner: {
        name:           partner.name,
        city:           partner.city,
        mode:           partner.mode,
        refCode:        partner.refCode,
        totalReferrals: partner.totalReferrals  || 0,
        proReferrals:   partner.proReferrals    || 0,
        totalEarnings:  partner.totalEarnings   || 0,
        pendingPayout:  partner.pendingPayout   || 0,
        paidOut:        partner.paidOut         || 0,
        joinedAt:       partner.joinedAt ? partner.joinedAt.toDate().toISOString() : null,
        status:         partner.status
      },
      stats: {
        todayEarnings,
        monthEarnings,
        totalReferrals: referrals.length
      },
      referrals,
      payouts
    });

  } catch (err) {
    console.error('[partner-stats] Error:', err.message);
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    return res.status(500).json({ error: 'Failed to load stats' });
  }
};
