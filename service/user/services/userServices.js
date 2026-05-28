const userDao = require('../dao/userDao');

exports.create = async (data) => {
  if (!data.nombre) throw new Error("Nombre requerido");
  return await userDao.create(data);
};

exports.findAll = async () => {
  return await userDao.findAll();
};

exports.findById = async (id) => {
  return await userDao.findById(id);
};
