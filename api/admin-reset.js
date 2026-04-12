/* ═══════════════════════════════════════════════
   CLARIX — ADMIN RESET ENDPOINT
   Resets trialUsed + sets isPro for admin accounts
   Protected by ADMIN_SECRET env var
═══════════════════════════════════════════════ */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore }                  = require('firebase-admin/firestore');
const { getAuth }                       = require('firebase-admin/auth');

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
  return { auth: getAuth(), db: getFirestore() };
}

const ADMIN_EMAILS = ['vishalbirla700@gmail.com'];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  /* Secret check */
  const secret = req.query.secret || (req.body && req.body.secret) || '';
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'clarix-admin-2024';
  if (secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { auth, db } = getFirebaseAdmin();

    const results = [];
    for (const email of ADMIN_EMAILS) {
      try {
        /* Look up UID by email */
        const userRecord = await auth.getUserByEmail(email);
        const uid = userRecord.uid;

        /* Reset Firestore profile */
        await db.collection('users').doc(uid).update({
          trialUsed:  0,
          dailyUsage: { date: '', count: 0 },
          isPro:      true,   /* Give admin permanent Pro access */
          isAdmin:    true
        });

        results.push({ email, uid, status: 'reset + isPro=true' });
        console.log('[AdminReset] Reset done for:', email, uid);
      } catch (e) {
        results.push({ email, status: 'error: ' + e.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Admin trial reset complete. isPro set to true.',
      results
    });

  } catch (err) {
    console.error('[AdminReset] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
