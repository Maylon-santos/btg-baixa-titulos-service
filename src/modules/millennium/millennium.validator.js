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

  const validacaoValor = validarValorComMora(titulo, lancamento);

  lancamento.validacaoValor = validacaoValor;

  if (!validacaoValor.valido) {
    throw new Error(
      `Divergência de valor no título ${titulo.numeroDocumento}`
    );
  }

  return lancamento;
}

module.exports = {
  validarConsultaTitulo
};