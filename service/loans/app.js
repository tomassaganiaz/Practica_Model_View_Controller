const express = require('express');
const app = express();
const loanRoutes = require('./routes/loanRoutes');
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.json());

// Rutas
app.use('/api', loanRoutes);

// Middleware de manejo de errores (debe estar al final)
app.use(errorHandler.errorHandler);

module.exports = app;
