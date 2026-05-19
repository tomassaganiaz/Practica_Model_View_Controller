const db = require('../config/db');

// Loan DAO contains the SQL operations for the Loans database.
exports.create = async (loan) => {
  const result = await db.query(
    'INSERT INTO loans (member_id, book_id, date, active) VALUES ($1, $2, $3, true) RETURNING *',
    [loan.memberId, loan.bookId, loan.date]
  );
  return result.rows[0];
};

exports.findById = async (id) => {
  const result = await db.query('SELECT * FROM loans WHERE id = $1', [id]);
  return result.rows[0];
};

exports.countActiveByMember = async (memberId) => {
  const result = await db.query(
    'SELECT COUNT(*) FROM loans WHERE member_id = $1 AND active = true',
    [memberId]
  );
  return parseInt(result.rows[0].count, 10);
};

exports.updateStatus = async (id, active) => {
  await db.query('UPDATE loans SET active = $1 WHERE id = $2', [active, id]);
};

exports.findAll = async () => {
  const result = await db.query('SELECT * FROM loans');
  return result.rows;
};
