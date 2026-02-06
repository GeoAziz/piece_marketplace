const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const firebaseAdmin = require('./firebaseAdmin');
const authRoutes = require('./routes/auth');
const errorHandler = require('../../packages/utils/errorHandler');
const logger = require('../../packages/utils/logger');

const app = express();
app.use(express.json());

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info('Auth service (firebase) listening', { port: PORT });
});

module.exports = app;
