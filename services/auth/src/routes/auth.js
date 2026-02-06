const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const logger = require('../../packages/utils/logger');
const { isNonEmptyString } = require('../../packages/utils/validators');

// Public: retrieve user info from ID token
router.get('/me', verifyFirebaseToken, async (req, res, next) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    return res.json({ uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName, customClaims: userRecord.customClaims || {} });
  } catch (err) {
    logger.error('Failed to fetch user record', { err: err.message });
    return next(err);
  }
});

// Admin: create user (requires server-side service account privileges)
router.post('/admin/create-user', verifyFirebaseToken, requireAdmin, async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body || {};
    if (!isNonEmptyString(email) || !isNonEmptyString(password)) return res.status(400).json({ error: 'email and password required' });
    const user = await admin.auth().createUser({ email, password, displayName });
    return res.status(201).json({ uid: user.uid, email: user.email });
  } catch (err) {
    logger.error('Create user failed', { err: err.message });
    return next(err);
  }
});

// Admin: set or unset admin custom claim on a user
router.post('/admin/set-admin', verifyFirebaseToken, requireAdmin, async (req, res, next) => {
  try {
    const { uid, admin: isAdmin } = req.body || {};
    if (!isNonEmptyString(uid) || typeof isAdmin !== 'boolean') return res.status(400).json({ error: 'uid and admin(boolean) required' });
    await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
    return res.json({ uid, admin: isAdmin });
  } catch (err) {
    logger.error('Set admin claim failed', { err: err.message });
    return next(err);
  }
});

// Admin: mint a custom token for a user (useful for testing)
router.post('/admin/mint-custom-token', verifyFirebaseToken, requireAdmin, async (req, res, next) => {
  try {
    const { uid } = req.body || {};
    if (!isNonEmptyString(uid)) return res.status(400).json({ error: 'uid required' });
    const token = await admin.auth().createCustomToken(uid);
    return res.json({ uid, customToken: token });
  } catch (err) {
    logger.error('Mint custom token failed', { err: err.message });
    return next(err);
  }
});

module.exports = router;
