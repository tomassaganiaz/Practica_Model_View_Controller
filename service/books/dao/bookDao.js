const db = require('../config/db');

// Book DAO gestiona la persistencia de los libros y el control de existencias.
exports.create = async (book) => {
  const result = await db.query(
    'INSERT INTO libros (titulo, stock) VALUES ($1, $2) RETURNING *',
    [book.titulo, book.stock || 0]
  );
  return result.rows[0];
};

exports.findAll = async () => {
  const result = await db.query('SELECT * FROM libros');
  return result.rows;
};

exports.findById = async (id) => {
  const result = await db.query('SELECT * FROM libros WHERE id = $1', [id]);
  return result.rows[0];
};

exports.update = async (id, book) => {
  const result = await db.query(
    'UPDATE libros SET titulo = $1, stock = $2 WHERE id = $3 RETURNING *',
    [book.titulo, book.stock, id]
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  await db.query('DELETE FROM libros WHERE id = $1', [id]);
};
