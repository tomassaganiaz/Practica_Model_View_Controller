const Joi = require('joi');
const bookService = require('../services/bookService');

const bookSchema = Joi.object({
  titulo: Joi.string().trim().required().messages({
    'any.required': 'Título requerido',
    'string.empty': 'Título requerido',
  }),
  stock: Joi.number().integer().min(0).optional(),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

exports.createBook = async (req, res) => {
  try {
    const { error, value } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const book = await bookService.create(value);
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
  if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
  res.json(book);
};

exports.updateBook = async (req, res) => {
  try {
    const { error, value } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const book = await bookService.update(req.params.id, value);
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await bookService.remove(req.params.id);
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
