const logger = require('../../common/logger');

/**
 * Middleware de manejo de errores global.
 */
exports.errorHandler = (err, req, res, next) => {
  logger.error('Error: %s', err.message);

  if (err.message.includes('service error') || err.message.includes('Service')) {
    return res.status(503).json({
      message: 'Service temporarily unavailable',
      error: err.message
    });
  }

  if (err.message.includes('not found')) {
    return res.status(404).json({
      message: err.message
    });
  }

  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
  });
};
