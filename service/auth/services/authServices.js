const authDao = require('../dao/authDao');
const jwt = require('jsonwebtoken');

// Auth service handles login and registration flows.
// This layer isolates business rules from the controller and the direct SQL queries.
exports.login = async (email, password) => {
  const user = await authDao.findByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  // Create a JWT token that can be validated by any downstream service.
  return jwt.sign({ id: user.id, email: user.email }, "secretKey", { expiresIn: "1h" });
};

exports.register = async (data) => {
  if (!data.email || !data.password) throw new Error("Email and password required");
  const existing = await authDao.findByEmail(data.email);
  if (existing) throw new Error("User already exists");
  return await authDao.create(data);
};
