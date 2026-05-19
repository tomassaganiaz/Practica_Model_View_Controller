const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

// Parse incoming JSON for user requests and mount user routes under /api.
app.use(express.json());
app.use('/api', userRoutes);

module.exports = app;
