const db = require('../config/memberDb');

exports.findById = async (id) => {
  const result = await db.query('SELECT * FROM socios WHERE id = $1', [id]);
  return result.rows[0];
};
