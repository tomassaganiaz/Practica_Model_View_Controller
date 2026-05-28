const {
  axiosInstance,
  retryWithBackoff,
  formatHttpError,
} = require('../../common/httpClient');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth:3004';

/**
 * Cliente HTTP para comunicarse con el microservicio de autenticación.
 */

exports.validateToken = async (token) => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.post(`${AUTH_SERVICE_URL}/api/verify`, {
      token,
    }));
    return response.data;
  } catch (error) {
    throw formatHttpError('Auth service', error);
  }
};

exports.authenticate = async (credentials) => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.post(`${AUTH_SERVICE_URL}/api/login`, credentials));
    return response.data;
  } catch (error) {
    throw formatHttpError('Auth service', error);
  }
};
