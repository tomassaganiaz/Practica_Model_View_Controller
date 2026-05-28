const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas (sin autenticación requerida para este ejemplo)
router.get('/loans', loanController.getAllLoans);
router.post('/loans', loanController.createLoan);
router.put('/loans/:id/return', loanController.returnLoan);

// Rutas protegidas (requieren token JWT)
router.get('/loans/user/:memberId', authMiddleware.authenticateToken, loanController.getLoansByMember);

module.exports = router;
