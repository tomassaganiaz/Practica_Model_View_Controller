const app = require('./app');

// Loans microservice listens on port 3003 by default.
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Loan microservice running on port ${PORT}`);
});
