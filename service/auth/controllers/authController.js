const authService = require('../services/authServices');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
