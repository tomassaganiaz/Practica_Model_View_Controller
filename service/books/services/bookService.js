const bookDao = require('../dao/bookDao');

exports.create = async (data) => {
  if (!data.titulo) throw new Error("Título requerido");
  return await bookDao.create(data);
};

exports.findAll = async () => {
  return await bookDao.findAll();
};

exports.findById = async (id) => {
  return await bookDao.findById(id);
};

exports.update = async (id, data) => {
  return await bookDao.update(id, data);
};

exports.remove = async (id) => {
  return await bookDao.remove(id);
};
