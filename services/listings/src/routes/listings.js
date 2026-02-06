const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const logger = require('../../packages/utils/logger');
const { isNonEmptyString, isPositiveNumber } = require('../../packages/utils/validators');

const db = admin.firestore();

// Create listing (seller)
router.post('/', verifyFirebaseToken, async (req, res, next) => {
  try {
    const { title, description, location, price } = req.body || {};
    if (!isNonEmptyString(title)) return res.status(400).json({ error: 'title required' });

    const ownerUid = req.user.uid;
    const now = admin.firestore.FieldValue.serverTimestamp();

    const data = {
      ownerUid,
      title: title.trim(),
      description: description || '',
      location: location || null,
      price: typeof price === 'string' ? Number(price) : price || null,
      status: 'published',
      evidenceIds: [],
      badges: [],
      createdAt: now,
      updatedAt: now
    };

    const docRef = await db.collection('listings').add(data);
    const created = await docRef.get();
    return res.status(201).json({ id: docRef.id, ...created.data() });
  } catch (err) {
    logger.error('Create listing failed', { err: err.message });
    return next(err);
  }
});

// Get listing (public)
router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  if (!isNonEmptyString(id)) return res.status(400).json({ error: 'invalid id' });
  try {
    const doc = await db.collection('listings').doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Listing not found' });
    const data = doc.data();
    const publicData = {
      id: doc.id,
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      status: data.status,
      badges: data.badges || []
    };
    return res.json(publicData);
  } catch (err) {
    logger.error('Fetch listing failed', { err: err.message });
    return next(err);
  }
});

// List listings (public, simple pagination)
router.get('/', async (req, res, next) => {
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  try {
    const snapshot = await db.collection('listings').where('status', '==', 'published').limit(limit).get();
    const items = [];
    snapshot.forEach(doc => {
      const d = doc.data();
      items.push({ id: doc.id, title: d.title, description: d.description, location: d.location, price: d.price, badges: d.badges || [] });
    });
    return res.json({ items });
  } catch (err) {
    logger.error('List listings failed', { err: err.message });
    return next(err);
  }
});

module.exports = router;
