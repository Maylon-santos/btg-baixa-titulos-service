require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3333),

  log: {
    enabled: process.env.LOG_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info',
    detailed: process.env.LOG_DETAILED === 'true',
    dir: process.env.LOG_DIR || 'logs'
  },
  
  millennium: {
    baseUrl: process.env.MILLENNIUM_BASE_URL,
    authorization: process.env.MILLENNIUM_AUTHORIZATION,
    licenseType: process.env.MILLENNIUM_LICENSE_TYPE || 'api',
    timeoutMs: Number(process.env.MILLENNIUM_TIMEOUT_MS || 30000)
  },
  financeiro: {
    toleranciaValor: Number(
      process.env.VALOR_TOLERANCIA || 0.5
    )
  },
  whatsapp: {
    enabled: process.env.WHATSAPP_ENABLED === 'true',
    apiUrl: process.env.WHATSAPP_API_URL,
    token: process.env.WHATSAPP_TOKEN,
    number: process.env.WHATSAPP_NUMBER,
    sendFiles: process.env.WHATSAPP_SEND_FILES === 'true'
  }
};

module.exports = env;