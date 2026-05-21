const authDao = require('../dao/authDao');
const jwt = require('jsonwebtoken');

// El servicio de autenticación gestiona los flujos de inicio de sesión y registro.
// Esta capa aísla las reglas de negocio del controlador y de las consultas SQL directas.
exports.login = async (email, password) => {
  const user = await authDao.findByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }
  
// Crea un token JWT que pueda ser validado por cualquier servicio posterior.
  return jwt.sign({ id: user.id, email: user.email }, "secretKey", { expiresIn: "1h" });
};

exports.register = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password required");
  const existing = await authDao.findByEmail(data.email);
  if (existing) throw new Error("User already exists");
  return await authDao.create(data);
};
