const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');

// Análisis JSON para puntos finales de libros y montaje de rutas.
app.use(express.json());
app.use('/api', bookRoutes);

module.exports = app;
