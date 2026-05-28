const bookService = require('../services/bookService');

exports.createBook = async (req, res) => {
  try {
    const book = await bookService.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBooks = async (req, res) => {
  const books = await bookService.findAll();
  res.json(books);
};

exports.getBookById = async (req, res) => {
  const book = await bookService.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Libro no encontrado" });
  res.json(book);
};

exports.updateBook = async (req, res) => {
  try {
    const book = await bookService.update(req.params.id, req.body);
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await bookService.remove(req.params.id);
    res.json({ message: "Libro eliminado" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
