const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.json());

// Rutas
app.use('/api', bookRoutes);

// Middleware de manejo de errores
app.use(errorHandler.errorHandler);

module.exports = app;
