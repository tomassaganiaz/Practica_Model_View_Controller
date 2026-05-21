const { Pool } = require('pg');

// Crea un pool de conexiones a la base de datos PostgreSQL.
// En Docker se utilizan variables de entorno para que cada microservicio pueda usar su propio contenedor SQL.
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'db_auth',
  database: process.env.DB_NAME || 'auth',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

module.exports = pool;
