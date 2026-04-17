/* ═══════════════════════════════════════════════
   CLARIX — PAYOUT REQUEST API
   POST /api/payout-request
   Logs a payout request + notifies admin via Firestore
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
const MIN_PAYOUT = 100; /* Minimum payout threshold in INR */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://clarix.digital');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    /* Verify token */
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ error: 'No token provided' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    /* Load partner */
    const partnerDoc = await db.collection('partners').doc(uid).get();
    if (!partnerDoc.exists) return res.status(404).json({ error: 'Not a registered partner' });

    const partner = partnerDoc.data();
    const available = partner.pendingPayout || 0;

    if (available < MIN_PAYOUT) {
      return res.status(400).json({
        error: `Minimum payout is ₹${MIN_PAYOUT}. Your current balance is ₹${available}.`
      });
    }

    /* Check for existing pending request */
    const existingSnap = await db.collection('payout_requests')
      .where('partnerUid', '==', uid)
      .where('status', '==', 'pending')
      .limit(1)
      .get();
    if (!existingSnap.empty) {
      return res.status(400).json({ error: 'You already have a pending payout request. Please wait for it to be processed.' });
    }

    const { upiId } = req.body || {};
    if (!upiId) return res.status(400).json({ error: 'UPI ID is required' });

    /* Create payout request */
    const requestRef = db.collection('payout_requests').doc();
    const request = {
      partnerUid:  uid,
      partnerName: partner.name,
      partnerEmail:partner.email,
      amount:      available,
      upiId:       String(upiId).slice(0, 100),
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      status:      'pending'  /* admin changes to 'approved' or 'paid' */
    };
    await requestRef.set(request);

    /* Log notification for admin (shows in admin Partners tab) */
    await db.collection('admin_notifications').add({
      type:    'payout_request',
      message: `${partner.name} (${partner.email}) requested payout of ₹${available}`,
      refCode: partner.refCode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read:    false
    });

    return res.status(200).json({ success: true, requestId: requestRef.id, amount: available });

  } catch (err) {
    console.error('[payout-request] Error:', err.message);
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    return res.status(500).json({ error: 'Failed to submit payout request' });
  }
};
