const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/authMiddleware');
const logger = require('../../packages/utils/logger');
const { isNonEmptyString } = require('../../packages/utils/validators');

const db = admin.firestore();

// Admin: list evidence items in review queue (uploaded -> uploaded status)
router.get('/reviews/queue', verifyFirebaseToken, requireAdmin, async (req, res, next) => {
  try {
    const snapshot = await db.collection('evidence').where('status', '==', 'uploaded').limit(50).get();
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return res.json({ items });
  } catch (err) {
    logger.error('Fetch review queue failed', { err: err.message });
    return next(err);
  }
});

// Admin: review an evidence item and assign badge / decision
router.post('/reviews/:evidenceId', verifyFirebaseToken, requireAdmin, async (req, res, next) => {
  const evidenceId = req.params.evidenceId;
  const { decision, rationale } = req.body || {};
  if (!['accept', 'reject', 'flag'].includes(decision)) return res.status(400).json({ error: 'Invalid decision' });

  try {
    const evRef = db.collection('evidence').doc(evidenceId);
    const evDoc = await evRef.get();
    if (!evDoc.exists) return res.status(404).json({ error: 'Evidence not found' });
    const ev = evDoc.data();

    const auditRef = db.collection('auditLogs').doc();
    await auditRef.set({
      id: auditRef.id,
      actorUid: req.user.uid,
      action: 'review',
      targetType: 'evidence',
      targetId: evidenceId,
      decision,
      rationale: rationale || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const newStatus = decision === 'accept' ? 'accepted' : decision === 'reject' ? 'rejected' : 'flagged';
    await evRef.update({ status: newStatus, reviewedAt: admin.firestore.FieldValue.serverTimestamp(), reviewedBy: req.user.uid });

    let badge = null;
    if (decision === 'accept') {
      const badgeRef = db.collection('badges').doc();
      badge = {
        id: badgeRef.id,
        listingId: ev.listingId,
        name: 'EvidenceReviewed',
        issuedBy: req.user.uid,
        issuedAt: admin.firestore.FieldValue.serverTimestamp(),
        rationale: rationale || null
      };
      await badgeRef.set(badge);

      const listingRef = db.collection('listings').doc(ev.listingId);
      await db.runTransaction(async (tx) => {
        const ld = await tx.get(listingRef);
        if (!ld.exists) throw Object.assign(new Error('Listing not found'), { status: 404 });
        const data = ld.data();
        const badges = data.badges || [];
        badges.push({ id: badge.id, name: badge.name, issuedAt: admin.firestore.FieldValue.serverTimestamp() });
        tx.update(listingRef, { badges, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      });
    }

    return res.json({ evidenceId, status: newStatus, badge });
  } catch (err) {
    logger.error('Review failed', { err: err.message });
    return next(err);
  }
});

// Admin: list recent audit logs
router.get('/audit-logs', verifyFirebaseToken, requireAdmin, async (req, res, next) => {
  try {
    const snapshot = await db.collection('auditLogs').orderBy('createdAt', 'desc').limit(100).get();
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return res.json({ items });
  } catch (err) {
    logger.error('Fetch audit logs failed', { err: err.message });
    return next(err);
  }
});

module.exports = router;
