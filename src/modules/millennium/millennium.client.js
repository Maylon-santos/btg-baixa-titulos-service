const axios = require('axios');

const env = require('../../config/env');
const logger = require('../../shared/logger/logger');

const authService = require('./millennium.auth.service');
const sessionStore = require('./millennium.session.store');

async function request(config, retry = true) {
  const session = await authService.getValidSession();

  try {
    logger.info(`🌐 Millennium request: ${config.method || 'GET'} ${config.url}`);

    const response = await axios({
      baseURL: env.millennium.baseUrl,
      timeout: env.millennium.timeoutMs,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'btg-baixa-titulos-service',
        'wts-session': session,
        ...(config.headers || {})
      }
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status;

    logger.error('❌ Erro na requisição Millennium', {
      url: config.url,
      method: config.method,
      status,
      data: error.response?.data,
      message: error.message
    });

    if (status === 401 && retry) {
      logger.info('🔁 Sessão Millennium expirada. Renovando sessão...');

      sessionStore.clearSession();

      await authService.login();

      return request(config, false);
    }

    throw error;
  }
}

module.exports = {
  request
};