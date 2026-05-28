const axios = require('axios');

const HTTP_TIMEOUT_MS = process.env.HTTP_TIMEOUT_MS ? parseInt(process.env.HTTP_TIMEOUT_MS, 10) : 5000;

const axiosInstance = axios.create({
  timeout: HTTP_TIMEOUT_MS,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithBackoff = async (fn, options = {}) => {
  const attempts = options.attempts || 3;
  const initialDelay = options.delayMs || 500;
  const backoff = options.backoff || 2;

  let lastError;
  let currentDelay = initialDelay;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      await delay(currentDelay);
      currentDelay *= backoff;
    }
  }

  throw lastError;
};

const formatHttpError = (serviceName, error, notFoundMessage) => {
  if (error.code === 'ECONNABORTED') {
    throw new Error(`${serviceName} timeout`);
  }

  if (error.response?.status === 404 && notFoundMessage) {
    throw new Error(notFoundMessage);
  }

  if (error.response) {
    throw new Error(`${serviceName} error: ${error.response.status} ${error.response.statusText}`);
  }

  throw new Error(`${serviceName} error: ${error.message}`);
};

module.exports = {
  axiosInstance,
  retryWithBackoff,
  formatHttpError,
};
