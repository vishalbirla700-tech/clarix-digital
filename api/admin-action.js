/* ═══════════════════════════════════════════════
   CLARIX — ADMIN ACTION ENDPOINT
   Handles: setIsPro, resetTrial, setIsAdmin, getUsers, getStats
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  /* ── Secret validation ── */
  const body   = req.body || {};
  const query  = req.query || {};
  const secret = query.secret || body.secret || '';
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'clarix-admin-2024';

  if (secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const action = query.action || body.action || '';
  const { auth, db } = getFirebaseAdmin();
  const users = db.collection('users');

  try {
    /* ── GET /api/admin-action?action=getStats ── */
    if (action === 'getStats') {
      const snap = await users.get();
      let totalUsers = 0, proUsers = 0, totalPrompts = 0, adminUsers = 0;
      snap.forEach(doc => {
        const d = doc.data();
        totalUsers++;
        if (d.isPro)    proUsers++;
        if (d.isAdmin)  adminUsers++;
        totalPrompts += (d.trialUsed || 0);
      });
      return res.status(200).json({ success: true, totalUsers, proUsers, totalPrompts, adminUsers });
    }

    /* ── GET /api/admin-action?action=getUsers&page=0 ── */
    if (action === 'getUsers') {
      const limit  = parseInt(query.limit || body.limit || '50');
      const search = (query.search || body.search || '').toLowerCase().trim();

      let q = users.orderBy('createdAt', 'desc').limit(limit);
      const snap = await q.get();

      const list = [];
      snap.forEach(doc => {
        const d = doc.data();
        /* client-side search filter */
        if (search) {
          const hay = `${d.email||''} ${d.name||''}`.toLowerCase();
          if (!hay.includes(search)) return;
        }
        list.push({
          uid:        doc.id,
          email:      d.email      || '',
          name:       d.name       || 'Creator',
          photo:      d.photo      || '',
          country:    d.country    || '',
          countryCode:d.countryCode|| '',
          countryFlag:d.countryFlag|| '🌍',
          language:   d.language   || 'English',
          trialUsed:  d.trialUsed  || 0,
          dailyUsage: d.dailyUsage || { date: '', count: 0 },
          isPro:      !!d.isPro,
          isAdmin:    !!d.isAdmin,
          onboarded:  !!d.onboarded,
          createdAt:  d.createdAt  ? d.createdAt.toMillis() : null
        });
      });
      return res.status(200).json({ success: true, users: list, total: list.length });
    }

    /* ── POST actions — require uid ── */
    const uid = body.uid || query.uid || '';
    if (!uid) return res.status(400).json({ error: 'uid required' });

    if (action === 'setIsPro') {
      const value = body.value === true || body.value === 'true';
      await users.doc(uid).update({ isPro: value });
      return res.status(200).json({ success: true, uid, isPro: value });
    }

    if (action === 'resetTrial') {
      await users.doc(uid).update({
        trialUsed:  0,
        dailyUsage: { date: '', count: 0 }
      });
      return res.status(200).json({ success: true, uid, message: 'Trial reset to 0' });
    }

    if (action === 'setIsAdmin') {
      const value = body.value === true || body.value === 'true';
      await users.doc(uid).update({ isAdmin: value });
      return res.status(200).json({ success: true, uid, isAdmin: value });
    }

    if (action === 'deleteUser') {
      /* Soft delete — mark user as deleted in Firestore, remove Firebase Auth */
      await users.doc(uid).update({ deleted: true, deletedAt: new Date() });
      try { await auth.deleteUser(uid); } catch (_) { /* ignore if already deleted */ }
      return res.status(200).json({ success: true, uid, message: 'User deleted' });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });

  } catch (err) {
    console.error('[AdminAction] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
