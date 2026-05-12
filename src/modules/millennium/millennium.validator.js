const {
  validarValorComMora
} = require('./valor.validator');

function validarConsultaTitulo(titulo, lancamentos = []) {
  if (!Array.isArray(lancamentos)) {
    throw new Error('Retorno inválido da consulta Millennium');
  }

  if (lancamentos.length === 0) {
    throw new Error(`Título não localizado: ${titulo.numeroDocumento}`);
  }

  if (lancamentos.length > 1) {
    throw new Error(`Mais de um lançamento encontrado para ${titulo.numeroDocumento}`);
  }

  const lancamento = lancamentos[0];

  const situacao = String(lancamento.situacao || '')
    .trim()
    .toUpperCase();

  /**
   * Importante:
   * Se o título já está baixado, não validamos valor.
   * Apenas retornamos para o processamento marcar como JA_BAIXADO.
   */
  if (situacao === 'BAIXADO') {
    lancamento.validacaoValor = {
      valido: true,
      tipo: 'IGNORADO_TITULO_JA_BAIXADO',
      mensagem: 'Título já baixado no Millennium; validação de valor ignorada'
    };

    return lancamento;
  }

  const validacaoValor = validarValorComMora(titulo, lancamento);

  lancamento.validacaoValor = validacaoValor;

  if (!validacaoValor.valido) {
    throw new Error(
      `${validacaoValor.tipo}: ${titulo.numeroDocumento} - ${validacaoValor.mensagem}`
    );
  }

  return lancamento;
}

module.exports = {
  validarConsultaTitulo
};