/* ═══════════════════════════════════════════════
   CLARIX — SAVE PUSH SUBSCRIPTION
   Stores a push subscription object to Firestore
   POST /api/save-subscription
   Body: { subscription, uid?, guestId? }
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subscription, uid, guestId } = req.body || {};

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }

  try {
    const db = getFirebaseAdmin();

    /* Use uid if logged in, otherwise guestId, otherwise hash of endpoint */
    const subId = uid || guestId || Buffer.from(subscription.endpoint).toString('base64').slice(-20);

    await db.collection('push_subscriptions').doc(subId).set({
      subscription,
      uid:       uid     || null,
      guestId:   guestId || null,
      endpoint:  subscription.endpoint,
      createdAt: new Date(),
      updatedAt: new Date(),
      active:    true
    }, { merge: true });

    return res.status(200).json({ success: true, id: subId });
  } catch (err) {
    console.error('[SaveSubscription]', err.message);
    return res.status(500).json({ error: err.message });
  }
};
