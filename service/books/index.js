const app = require('./app');

// El microservicio Libros escucha en el puerto 3002 por defecto.
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Microservicio Libros corriendo en puerto ${PORT}`);
});
