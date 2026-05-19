const app = require('./app');

// Usuarios microservice listens on port 3001 by default.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Microservicio Usuarios corriendo en puerto ${PORT}`);
});
