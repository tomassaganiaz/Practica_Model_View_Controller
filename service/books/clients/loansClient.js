const {
  axiosInstance,
  retryWithBackoff,
  formatHttpError,
} = require('../../common/httpClient');

const LOANS_SERVICE_URL = process.env.LOANS_SERVICE_URL || 'http://loans:3003';

/**
 * Cliente HTTP para comunicarse con el microservicio de préstamos.
 */

exports.getLoansByBookId = async (bookId) => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.get(`${LOANS_SERVICE_URL}/api/loans?bookId=${bookId}`));
    return response.data;
  } catch (error) {
    throw formatHttpError('Loans service', error);
  }
};

exports.getAllLoans = async () => {
  try {
    const response = await retryWithBackoff(() => axiosInstance.get(`${LOANS_SERVICE_URL}/api/loans`));
    return response.data;
  } catch (error) {
    throw formatHttpError('Loans service', error);
  }
};
