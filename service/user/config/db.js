const { Pool } = require('pg');

// Conexión PostgreSQL para el microservicio Usuarios.
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'db_usuarios',
  database: process.env.DB_NAME || 'usuarios',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

module.exports = pool;
