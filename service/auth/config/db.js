const { Pool } = require('pg');

// Create a connection pool to the PostgreSQL database.
// Environments variables are used in Docker so each microservice can target its own SQL container.
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'db_auth',
  database: process.env.DB_NAME || 'auth',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

module.exports = pool;
