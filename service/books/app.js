const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');

// JSON parsing for book endpoints and route mounting.
app.use(express.json());
app.use('/api', bookRoutes);

module.exports = app;
