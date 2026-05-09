const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const env = require('../../config/env');
const logger = require('../../shared/logger/logger');

async function enviarTexto(body) {
  if (!env.whatsapp.enabled) {
    logger.info('ℹ️ WhatsApp desabilitado por configuração');
    return null;
  }

  logger.info('📲 Enviando resumo por WhatsApp');

  const response = await axios.post(
    env.whatsapp.apiUrl,
    {
      number: env.whatsapp.number,
      body
    },
    {
      headers: {
        Authorization: `Bearer ${env.whatsapp.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'btg-baixa-titulos-service'
      },
      timeout: 30000
    }
  );

  logger.info('✅ Resumo enviado por WhatsApp', {
    response: response.data
  });

  return response.data;
}

async function enviarArquivo(filePath) {
  if (!env.whatsapp.enabled || !env.whatsapp.sendFiles) {
    logger.info('ℹ️ Envio de arquivos WhatsApp desabilitado');
    return null;
  }

  if (!fs.existsSync(filePath)) {
    logger.warn('⚠️ Arquivo não encontrado para envio WhatsApp', {
      filePath
    });
    return null;
  }

  logger.info('📎 Enviando arquivo por WhatsApp', {
    filePath
  });

  const form = new FormData();

  form.append('number', env.whatsapp.number);
  form.append('medias', fs.createReadStream(filePath));

  const response = await axios.post(
    env.whatsapp.apiUrl,
    form,
    {
      headers: {
        Authorization: `Bearer ${env.whatsapp.token}`,
        'User-Agent': 'btg-baixa-titulos-service',
        ...form.getHeaders()
      },
      timeout: 60000
    }
  );

  logger.info('✅ Arquivo enviado por WhatsApp', {
    filePath,
    response: response.data
  });

  return response.data;
}

module.exports = {
  enviarTexto,
  enviarArquivo
};