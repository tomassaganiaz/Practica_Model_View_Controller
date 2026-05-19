const { Pool } = require('pg');

// Connection to the Usuarios database from the Loans service.
// This allows the Loans service to verify member status and loan eligibility.
const pool = new Pool({
  user: process.env.MEMBERS_DB_USER || 'admin',
  host: process.env.MEMBERS_DB_HOST || 'db_usuarios',
  database: process.env.MEMBERS_DB_NAME || 'usuarios',
  password: process.env.MEMBERS_DB_PASSWORD || 'admin',
  port: process.env.MEMBERS_DB_PORT ? parseInt(process.env.MEMBERS_DB_PORT, 10) : 5432,
});

module.exports = pool;
