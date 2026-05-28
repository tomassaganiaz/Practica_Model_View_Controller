const db = require('../config/bookDb');

exports.findById = async (id) => {
  const result = await db.query('SELECT * FROM libros WHERE id = $1', [id]);
  return result.rows[0];
};

exports.updateStock = async (id, newStock) => {
  const result = await db.query(
    'UPDATE libros SET stock = $1 WHERE id = $2 RETURNING *',
    [newStock, id]
  );
  return result.rows[0];
};
