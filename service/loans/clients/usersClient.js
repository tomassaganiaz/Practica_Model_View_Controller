const {
  axiosInstance,
  retryWithBackoff,
  formatHttpError,
} = require('../../common/httpClient');

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://users:3001';

/**
 * Cliente HTTP para comunicarse con el microservicio de usuarios.
 * Permite al servicio de préstamos consultar información de miembros sin acceso directo a BD.
 */

exports.getUserById = async (userId) => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.get(`${USERS_SERVICE_URL}/api/usuarios/${userId}`));
    return response.data;
  } catch (error) {
    throw formatHttpError('Users service', error, 'User not found');
  }
};

exports.getAllUsers = async () => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.get(`${USERS_SERVICE_URL}/api/usuarios`));
    return response.data;
  } catch (error) {
    throw formatHttpError('Users service', error);
  }
};
