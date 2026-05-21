const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

// Analiza el JSON entrante para las solicitudes de usuario y monta las rutas de usuario en /api.
app.use(express.json());
app.use('/api', userRoutes);

module.exports = app;
