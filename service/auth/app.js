const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Common middleware to parse JSON bodies for all auth endpoints.
app.use(express.json());
app.use('/api', authRoutes);

module.exports = app;
