const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/authMiddleware');
const logger = require('../../packages/utils/logger');
const { isNonEmptyString } = require('../../packages/utils/validators');

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Generate signed upload URL for owner to upload evidence
router.post('/listings/:id/upload-url', verifyFirebaseToken, async (req, res, next) => {
  const listingId = req.params.id;
  const { filename, contentType, type } = req.body || {};
  if (!isNonEmptyString(filename)) return res.status(400).json({ error: 'filename required' });

  try {
    const listingDoc = await db.collection('listings').doc(listingId).get();
    if (!listingDoc.exists) return res.status(404).json({ error: 'Listing not found' });
    const listing = listingDoc.data();
    if (listing.ownerUid !== req.user.uid) return res.status(403).json({ error: 'Not the listing owner' });

    const uidPart = uuidv4();
    const ext = filename.split('.').pop();
    const objectPath = `evidence/${listingId}/${uidPart}.${ext}`;
    const file = bucket.file(objectPath);
    const mimeType = contentType || mime.lookup(filename) || 'application/octet-stream';

    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: mimeType
    });

    const evidenceId = uidPart;

    await db.collection('evidence').doc(evidenceId).set({
      id: evidenceId,
      listingId,
      uploaderUid: req.user.uid,
      objectPath,
      filename,
      contentType: mimeType,
      type: type || null,
      status: 'uploading',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ evidenceId, uploadUrl, objectPath });
  } catch (err) {
    logger.error('Generate upload URL failed', { err: err.message });
    return next(err);
  }
});

// Confirm upload and attach evidence to listing
router.post('/listings/:id/confirm', verifyFirebaseToken, async (req, res, next) => {
  const listingId = req.params.id;
  const { evidenceId, checksum } = req.body || {};
  if (!isNonEmptyString(evidenceId)) return res.status(400).json({ error: 'evidenceId required' });

  try {
    const evRef = db.collection('evidence').doc(evidenceId);
    const evDoc = await evRef.get();
    if (!evDoc.exists) return res.status(404).json({ error: 'Evidence not found' });
    const ev = evDoc.data();
    if (ev.uploaderUid !== req.user.uid) return res.status(403).json({ error: 'Not the uploader' });
    if (ev.listingId !== listingId) return res.status(400).json({ error: 'Listing mismatch' });

    await evRef.update({ status: 'uploaded', checksum: checksum || null, uploadedAt: admin.firestore.FieldValue.serverTimestamp() });

    const listingRef = db.collection('listings').doc(listingId);
    await db.runTransaction(async (tx) => {
      const ld = await tx.get(listingRef);
      if (!ld.exists) throw Object.assign(new Error('Listing not found'), { status: 404 });
      const data = ld.data();
      const evidenceIds = data.evidenceIds || [];
      evidenceIds.push(evidenceId);
      tx.update(listingRef, { evidenceIds, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    });

    return res.json({ evidenceId, status: 'recorded' });
  } catch (err) {
    logger.error('Confirm upload failed', { err: err.message });
    return next(err);
  }
});

// Admin: get signed download URL for evidence
router.get('/evidence/:id/download', verifyFirebaseToken, requireAdmin, async (req, res, next) => {
  const evidenceId = req.params.id;
  if (!isNonEmptyString(evidenceId)) return res.status(400).json({ error: 'invalid id' });
  try {
    const evDoc = await db.collection('evidence').doc(evidenceId).get();
    if (!evDoc.exists) return res.status(404).json({ error: 'Evidence not found' });
    const ev = evDoc.data();
    const file = bucket.file(ev.objectPath);
    const [downloadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });
    return res.json({ downloadUrl });
  } catch (err) {
    logger.error('Get download URL failed', { err: err.message });
    return next(err);
  }
});

module.exports = router;
