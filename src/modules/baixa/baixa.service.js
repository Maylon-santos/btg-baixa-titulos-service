const millenniumClient = require('../millennium/millennium.client');

const logger = require('../../shared/logger/logger');

const {
  buildBaixaPayload
} = require('./baixa.payload');

const {
  validarBaixaResponse
} = require('./baixa.validator');

async function baixarTitulo(titulo, lancamento) {
  const payload = buildBaixaPayload(
    titulo,
    lancamento
  );

  logger.info(
    `💰 Iniciando baixa do título ${titulo.numeroDocumento}`,
    {
      lancamento: lancamento.lancamento,
      payload
    }
  );

  logger.info('📅 Payload da baixa', {
    dataPagamento: payload.DATA_PAGAMENTO
  });

  const response = await millenniumClient.request({
    method: 'POST',
    url: '/millenium/titulos/baixa',
    data: payload
  });

  validarBaixaResponse(response);

  logger.info(
    `✅ Título baixado com sucesso`,
    {
      numeroDocumento: titulo.numeroDocumento,
      baixa: response.baixa,
      valor: response.valor
    }
  );

  return response;
}

module.exports = {
  baixarTitulo
};