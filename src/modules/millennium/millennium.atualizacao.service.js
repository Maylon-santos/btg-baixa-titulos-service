const millenniumClient = require('./millennium.client');

const logger = require('../../shared/logger/logger');

const {
  buildAtualizacaoPayload
} = require('./millennium.payloads');

const {
  validarAtualizacaoResponse
} = require('./millennium.response.validator');

async function atualizarTitulo(titulo, lancamento) {
  const payload = buildAtualizacaoPayload(
    titulo,
    lancamento
  );

  logger.info(
    `📝 Atualizando título ${titulo.numeroDocumento}`,
    {
      lancamento: lancamento.lancamento,
      payload
    }
  );

  const response = await millenniumClient.request({
    method: 'POST',
    url: '/MILLENIUM!JOIN_ONEUP.LANCAMENTOS.INSEREINFO',
    data: payload
  });

  validarAtualizacaoResponse(response);

  logger.info(
    `✅ Título atualizado com sucesso`,
    {
      numeroDocumento: titulo.numeroDocumento,
      lancamento: response.lancamento,
      transId: response.trans_id
    }
  );

  return response;
}

module.exports = {
  atualizarTitulo
};