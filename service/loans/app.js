const express = require('express');
const app = express();
const loanRoutes = require('./routes/loanRoutes');

// Use JSON middleware and expose loan endpoints under /api.
app.use(express.json());
app.use('/api', loanRoutes);

module.exports = app;
