const {
  axiosInstance,
  retryWithBackoff,
  formatHttpError,
} = require('../../common/httpClient');

const BOOKS_SERVICE_URL = process.env.BOOKS_SERVICE_URL || 'http://books:3002';

/**
 * Cliente HTTP para comunicarse con el microservicio de libros.
 * Permite al servicio de préstamos consultar información de libros sin acceso directo a BD.
 */

exports.getBookById = async (bookId) => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.get(`${BOOKS_SERVICE_URL}/api/libros/${bookId}`));
    return response.data;
  } catch (error) {
    throw formatHttpError('Books service', error, 'Book not found');
  }
};

exports.updateBookStock = async (bookId, newStock) => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.put(`${BOOKS_SERVICE_URL}/api/libros/${bookId}`, {
      stock: newStock,
    }));
    return response.data;
  } catch (error) {
    throw formatHttpError('Books service', error);
  }
};

exports.getAllBooks = async () => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.get(`${BOOKS_SERVICE_URL}/api/libros`));
    return response.data;
  } catch (error) {
    throw formatHttpError('Books service', error);
  }
};
