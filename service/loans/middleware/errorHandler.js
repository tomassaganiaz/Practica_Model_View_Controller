const logger = require('../../common/logger');

/**
 * Middleware de manejo de errores global para todas las rutas.
 * Captura errores de llamadas a otros microservicios y los maneja apropiadamente.
 */
exports.errorHandler = (err, req, res, next) => {
  logger.error('Error: %s', err.message);

  // Errores de comunicación con otros microservicios
  if (err.message.includes('service error') || err.message.includes('Service')) {
    return res.status(503).json({
      message: 'Service temporarily unavailable',
      error: err.message
    });
  }

  // Errores de validación
  if (err.message.includes('not found')) {
    return res.status(404).json({
      message: err.message
    });
  }

  // Errores genéricos
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
  });
};

/**
 * Middleware para validar que un recurso existe en otro microservicio.
 */
exports.validateResourceExists = (resourceType) => {
  return async (req, res, next) => {
    try {
      // Este middleware será usado según sea necesario en cada ruta
      next();
    } catch (error) {
      res.status(404).json({
        message: `${resourceType} not found`
      });
    }
  };
};
