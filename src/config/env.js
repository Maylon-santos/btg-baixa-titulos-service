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
  }
};

module.exports = env;