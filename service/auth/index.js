require('dotenv').config();
const logger = require('../common/logger');
const app = require('./app');

// El servicio de autenticación está expuesto en el puerto 3004 por defecto.
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  logger.info(`Auth microservice running on port ${PORT}`);
});
