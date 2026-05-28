const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.json());

// Rutas
app.use('/api', userRoutes);

// Middleware de manejo de errores
app.use(errorHandler.errorHandler);

module.exports = app;
