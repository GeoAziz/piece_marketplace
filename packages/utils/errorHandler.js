function errorHandler(err, req, res, next) {
  // minimal consistent error response
  const status = err.status || 500;
  const payload = { error: err.message || 'Internal server error' };
  // do not leak stack in production; include when NODE_ENV != 'production'
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  res.status(status).json(payload);
}

module.exports = errorHandler;
