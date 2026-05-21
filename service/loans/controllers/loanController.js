const { Pool } = require('pg');

// Conexión a la base de datos de Usuarios desde el servicio de Préstamos.
// Esto permite al servicio de Préstamos verificar el estado del miembro y su elegibilidad para el préstamo.
const pool = new Pool({
  user: process.env.MEMBERS_DB_USER || 'admin',
  host: process.env.MEMBERS_DB_HOST || 'db_usuarios',
  database: process.env.MEMBERS_DB_NAME || 'usuarios',
  password: process.env.MEMBERS_DB_PASSWORD || 'admin',
  port: process.env.MEMBERS_DB_PORT ? parseInt(process.env.MEMBERS_DB_PORT, 10) : 5432,
});

module.exports = pool;
