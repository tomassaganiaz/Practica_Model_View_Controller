const Joi = require('joi');
const userService = require('../services/userServices');

const createUserSchema = Joi.object({
  nombre: Joi.string().trim().min(2).required().messages({
    'any.required': 'Nombre requerido',
    'string.empty': 'Nombre requerido',
  }),
  bloqueado: Joi.boolean().optional(),
});

exports.createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = await userService.create(value);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await userService.findAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
};
