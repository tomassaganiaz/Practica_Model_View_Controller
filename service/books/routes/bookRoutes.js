const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/libros', bookController.getBooks);
router.get('/libros/:id', bookController.getBookById);
router.post('/libros', bookController.createBook);
router.put('/libros/:id', bookController.updateBook);
router.delete('/libros/:id', bookController.deleteBook);

module.exports = router;
