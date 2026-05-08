const axios = require('axios');

const env = require('../../config/env');
const logger = require('../../shared/logger/logger');

const sessionStore = require('./millennium.session.store');
const { ENDPOINTS } = require('./millennium.constants');

async function login() {
  logger.info('🔐 Iniciando login no Millennium');

  const response = await axios.get(`${env.millennium.baseUrl}${ENDPOINTS.LOGIN}`, {
    timeout: env.millennium.timeoutMs,
    headers: {
      'Content-Type': 'application/json',
      'wts-authorization': env.millennium.authorization,
      'wts-licencetype': env.millennium.licenseType
    }
  });

  const session = response.data?.session;

  if (!session) {
    throw new Error('Sessão não retornada pelo login do Millennium');
  }

  sessionStore.setSession(session);

  logger.info('✅ Login Millennium realizado com sucesso');

  return session;
}

async function getValidSession() {
  if (sessionStore.hasSession()) {
    return sessionStore.getSession();
  }

  return login();
}

async function finalizarSessao() {
  const session = sessionStore.getSession();

  if (!session) {
    logger.info('ℹ️ Nenhuma sessão Millennium ativa para finalizar');
    return;
  }

  try {
    logger.info('🔒 Finalizando sessão Millennium');

    await axios.post(
      `${env.millennium.baseUrl}${ENDPOINTS.CANCEL_SESSION}`,
      [
        {
          sessionkey: session
        }
      ],
      {
        timeout: env.millennium.timeoutMs,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info('✅ Sessão Millennium finalizada com sucesso');
  } catch (error) {
    logger.error('⚠️ Erro ao finalizar sessão Millennium', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  } finally {
    sessionStore.clearSession();
  }
}

module.exports = {
  login,
  getValidSession,
  finalizarSessao
};