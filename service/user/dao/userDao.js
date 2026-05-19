const db = require('../config/db');

// User DAO performs CRUD operations over the socios table.
exports.create = async (user) => {
  const result = await db.query(
    'INSERT INTO socios (nombre, bloqueado) VALUES ($1, $2) RETURNING *',
    [user.nombre, user.bloqueado || false]
  );
  return result.rows[0];
};

exports.findAll = async () => {
  const result = await db.query('SELECT * FROM socios');
  return result.rows;
};

exports.findById = async (id) => {
  const result = await db.query('SELECT * FROM socios WHERE id = $1', [id]);
  return result.rows[0];
};
