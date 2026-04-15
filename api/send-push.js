/* ═══════════════════════════════════════════════
   CLARIX — SEND PUSH NOTIFICATION
   Admin-protected endpoint to broadcast pushes
   POST /api/send-push
   Body: { secret, title, body, url, icon }
═══════════════════════════════════════════════ */

const webpush                           = require('web-push');
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

  /* ── Auth: require admin secret ── */
  const body   = req.body || {};
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'clarix-admin-2024';
  if (body.secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { title, body: msgBody, url, icon } = body;
  if (!title || !msgBody) {
    return res.status(400).json({ error: 'title and body are required' });
  }

  /* ── Set VAPID details ── */
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:vishalbirla700@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const payload = JSON.stringify({
    title,
    body:  msgBody,
    icon:  icon  || '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    url:   url   || 'https://clarix.digital/',
    tag:   'clarix-update',
    renotify: true
  });

  try {
    const db   = getFirebaseAdmin();
    const snap = await db.collection('push_subscriptions').where('active', '==', true).get();

    if (snap.empty) {
      return res.status(200).json({ success: true, sent: 0, failed: 0, total: 0 });
    }

    let sent = 0, failed = 0;
    const staleIds = [];

    const sendPromises = snap.docs.map(async (doc) => {
      const sub = doc.data().subscription;
      try {
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch (err) {
        /* 404/410 = subscription expired — mark as inactive */
        if (err.statusCode === 404 || err.statusCode === 410) {
          staleIds.push(doc.id);
        }
        failed++;
        console.warn('[SendPush] Failed for', doc.id, err.statusCode || err.message);
      }
    });

    await Promise.allSettled(sendPromises);

    /* Clean up stale subscriptions in background */
    if (staleIds.length > 0) {
      const batch = db.batch();
      staleIds.forEach(id => {
        batch.update(db.collection('push_subscriptions').doc(id), { active: false });
      });
      await batch.commit().catch(() => {});
    }

    /* Log the campaign to Firestore */
    await db.collection('push_campaigns').add({
      title,
      body:    msgBody,
      url:     url || '/',
      sentAt:  new Date(),
      total:   snap.size,
      sent,
      failed
    });

    return res.status(200).json({ success: true, sent, failed, total: snap.size });

  } catch (err) {
    console.error('[SendPush] Fatal:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
