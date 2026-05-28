const { Pool } = require('pg');

// Conexión PostgreSQL para el microservicio de Préstamos.
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'db_loans',
  database: process.env.DB_NAME || 'loans',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

module.exports = pool;
