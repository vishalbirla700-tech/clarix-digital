/* ═══════════════════════════════════════════════
   CLARIX — PARTNER REGISTRATION API
   POST /api/partner-register
   Creates partner profile + unique refCode in Firestore
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

/* Generate a unique 6-char ref code: initials + random digits */
function generateRefCode(name) {
  const initials = (name || 'CX')
    .split(' ')
    .map(w => w[0] || '')
    .join('')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 2)
    .padEnd(2, 'X');
  const digits = Math.floor(1000 + Math.random() * 9000);
  return initials + digits; // e.g. "VB2042"
}

/* Check that a refCode doesn't already exist */
async function ensureUniqueCode(name) {
  for (let attempts = 0; attempts < 10; attempts++) {
    const code = generateRefCode(name);
    const snap = await db.collection('partners')
      .where('refCode', '==', code).limit(1).get();
    if (snap.empty) return code;
  }
  // Fallback: timestamp-based code (always unique)
  return 'CX' + Date.now().toString().slice(-6);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://clarix.digital');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    /* Verify Firebase ID token */
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ error: 'No token provided' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    /* Check if already a partner */
    const existing = await db.collection('partners').doc(uid).get();
    if (existing.exists) {
      return res.status(200).json({ success: true, partner: existing.data(), alreadyRegistered: true });
    }

    /* Parse body */
    const { name, city, mode } = req.body || {};
    if (!name || !city || !mode) {
      return res.status(400).json({ error: 'name, city, and mode are required' });
    }

    /* Generate unique ref code */
    const refCode = await ensureUniqueCode(name);

    /* Create partner document */
    const partner = {
      uid,
      name:            String(name).slice(0, 80),
      email:           decoded.email || '',
      city:            String(city).slice(0, 60),
      mode:            ['freelancer','sales','agency','influencer'].includes(mode) ? mode : 'freelancer',
      refCode,
      totalReferrals:  0,
      proReferrals:    0,   /* only paid conversions */
      totalEarnings:   0,   /* INR — calculated from pro referrals */
      pendingPayout:   0,   /* awaiting manual disbursement */
      paidOut:         0,   /* already paid */
      joinedAt:        admin.firestore.FieldValue.serverTimestamp(),
      status:          'active'
    };

    await db.collection('partners').doc(uid).set(partner);

    return res.status(200).json({ success: true, partner });

  } catch (err) {
    console.error('[partner-register] Error:', err.message);
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};
