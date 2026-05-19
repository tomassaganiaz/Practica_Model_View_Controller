const app = require('./app');

// The auth service is exposed on port 3004 by default.
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Auth microservice running on port ${PORT}`);
});
