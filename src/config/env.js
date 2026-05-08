require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3333),

  log: {
    enabled: process.env.LOG_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info',
    detailed: process.env.LOG_DETAILED === 'true',
    dir: process.env.LOG_DIR || 'logs'
  }
};

module.exports = env;