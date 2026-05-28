const authDao = require('../dao/authDao');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// El servicio de autenticación gestiona los flujos de inicio de sesión y registro.
// Esta capa aísla las reglas de negocio del controlador y de las consultas SQL directas.
exports.login = async (email, password) => {
  const user = await authDao.findByEmail(email);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

exports.register = async (data) => {
  if (!data.email || !data.password) throw new Error('Email and password required');
  const existing = await authDao.findByEmail(data.email);
  if (existing) throw new Error('User already exists');
  return await authDao.create(data);
};
