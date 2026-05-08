const app = require('./app');
const env = require('./config/env');
const logger = require('./shared/logger/logger');

app.listen(env.port, () => {
  logger.info(`🚀 Servidor iniciado com sucesso na porta ${env.port}`, {
    port: env.port,
    nodeEnv: env.nodeEnv,
    logDetailed: env.log.detailed
  });
});