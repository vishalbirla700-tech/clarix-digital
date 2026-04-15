/* ═══════════════════════════════════════════════
   CLARIX — PUSH STATS
   Returns subscriber count and campaign history
   GET /api/push-stats?secret=***
═══════════════════════════════════════════════ */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore }                  = require('firebase-admin/firestore');

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    privateKey = privateKey.replace(/\\n/g, '\n');
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  privateKey
      })
    });
  }
  return getFirestore();
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const query = req.query || {};
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'clarix-admin-2024';
  if (query.secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const db = getFirebaseAdmin();

    const [subSnap, campSnap] = await Promise.all([
      db.collection('push_subscriptions').where('active', '==', true).get(),
      db.collection('push_campaigns').orderBy('sentAt', 'desc').limit(10).get()
    ]);

    const campaigns = [];
    campSnap.forEach(doc => {
      const d = doc.data();
      campaigns.push({
        id:     doc.id,
        title:  d.title,
        body:   d.body,
        url:    d.url,
        sentAt: d.sentAt ? d.sentAt.toMillis() : null,
        total:  d.total,
        sent:   d.sent,
        failed: d.failed
      });
    });

    return res.status(200).json({
      success:     true,
      subscribers: subSnap.size,
      campaigns
    });

  } catch (err) {
    console.error('[PushStats]', err.message);
    return res.status(500).json({ error: err.message });
  }
};
