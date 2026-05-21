const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware común para analizar cuerpos JSON para todos los puntos finales de autenticación.
app.use(express.json());
app.use('/api', authRoutes);

module.exports = app;
