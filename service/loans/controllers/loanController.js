const Joi = require('joi');
const loanService = require('../services/loanService');

const createLoanSchema = Joi.object({
  memberId: Joi.number().integer().positive().required(),
  bookId: Joi.number().integer().positive().required(),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const memberParamSchema = Joi.object({
  memberId: Joi.number().integer().positive().required(),
});

/**
 * Obtener todos los préstamos
 */
exports.getAllLoans = async (req, res, next) => {
  try {
    const loans = await loanService.findAll();
    res.json(loans);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo préstamo
 * Body: { memberId, bookId }
 */
exports.createLoan = async (req, res, next) => {
  try {
    const { error, value } = createLoanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const loan = await loanService.createLoan(value.memberId, value.bookId);
    res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
};

/**
 * Devolver un préstamo
 */
exports.returnLoan = async (req, res, next) => {
  try {
    const { error, value } = idParamSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await loanService.returnLoan(value.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener préstamos de un miembro específico
 */
exports.getLoansByMember = async (req, res, next) => {
  try {
    const { error, value } = memberParamSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const loans = await loanService.getLoansByMember(value.memberId);
    res.json(loans);
  } catch (error) {
    next(error);
  }
};
