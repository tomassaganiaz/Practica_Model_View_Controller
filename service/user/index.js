const app = require('./app');

// El microservicio Usuarios escucha en el puerto 3001 por defecto.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Microservicio Usuarios corriendo en puerto ${PORT}`);
});
