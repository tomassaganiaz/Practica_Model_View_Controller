const db = require('../config/db');

// Auth DAO consulta la base de datos de autenticación para obtener los usuarios.
exports.findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

exports.create = async (user) => {
  const result = await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [user.email, user.password]
  );
  return result.rows[0];
};
