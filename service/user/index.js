require('dotenv').config();
const logger = require('../common/logger');
const app = require('./app');

// El microservicio Usuarios escucha en el puerto 3001 por defecto.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Microservicio Usuarios corriendo en puerto ${PORT}`);
});
