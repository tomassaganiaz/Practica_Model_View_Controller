const { Pool } = require('pg');

// Conexión a la base de datos Libros desde el servicio de Préstamos.
// El microservicio de Préstamos debe validar el stock antes de crear un nuevo préstamo.
const pool = new Pool({
  user: process.env.BOOKS_DB_USER || 'admin',
  host: process.env.BOOKS_DB_HOST || 'db_libros',
  database: process.env.BOOKS_DB_NAME || 'libros',
  password: process.env.BOOKS_DB_PASSWORD || 'admin',
  port: process.env.BOOKS_DB_PORT ? parseInt(process.env.BOOKS_DB_PORT, 10) : 5432,
});

module.exports = pool;
