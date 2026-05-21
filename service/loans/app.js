const express = require('express');
const app = express();
const loanRoutes = require('./routes/loanRoutes');

// Utilice middleware JSON y exponga los puntos finales de préstamos en /api.
app.use(express.json());
app.use('/api', loanRoutes);

module.exports = app;
