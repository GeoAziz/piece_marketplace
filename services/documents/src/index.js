const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const documentsRoutes = require('./routes/documents');
const errorHandler = require('../../packages/utils/errorHandler');
const logger = require('../../packages/utils/logger');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1', documentsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  logger.info('Documents service listening', { port: PORT });
});

module.exports = app;
