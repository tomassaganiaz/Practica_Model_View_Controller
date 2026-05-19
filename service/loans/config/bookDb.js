const { Pool } = require('pg');

// Connection to the Libros database from the Loans service.
// The Loans microservice must validate stock before creating a new loan.
const pool = new Pool({
  user: process.env.BOOKS_DB_USER || 'admin',
  host: process.env.BOOKS_DB_HOST || 'db_libros',
  database: process.env.BOOKS_DB_NAME || 'libros',
  password: process.env.BOOKS_DB_PASSWORD || 'admin',
  port: process.env.BOOKS_DB_PORT ? parseInt(process.env.BOOKS_DB_PORT, 10) : 5432,
});

module.exports = pool;
