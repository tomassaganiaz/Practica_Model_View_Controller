const app = require('./app');

// Libros microservice listens on port 3002 by default.
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Microservicio Libros corriendo en puerto ${PORT}`);
});
