require('dotenv').config();
const logger = require('../common/logger');
const app = require('./app');

// El microservicio de préstamos escucha en el puerto 3003 por defecto.
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  logger.info(`Loan microservice running on port ${PORT}`);
});
