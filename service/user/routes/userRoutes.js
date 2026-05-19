const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/usuarios', userController.getUsers);
router.get('/usuarios/:id', userController.getUserById);
router.post('/usuarios', userController.createUser);

module.exports = router;
