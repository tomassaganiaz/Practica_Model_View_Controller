const jwt = require('jsonwebtoken');

/**
 * Middleware para validar JWT tokens en las rutas protegidas.
 * Verifica que el token sea válido y extrae la información del usuario.
 */
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware para validar tokens de servicio a servicio.
 * Permite que un microservicio verifique un token sin necesidad de llamar al servicio de auth.
 */
exports.validateServiceToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Service token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.serviceUser = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid service token' });
  }
};
