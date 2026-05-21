const app = require('./app');

// El microservicio de préstamos escucha en el puerto 3003 por defecto.
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Loan microservice running on port ${PORT}`);
});
