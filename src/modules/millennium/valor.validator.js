const env = require('../../config/env');

function roundMoney(value) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function getTolerancia() {
  return env.financeiro?.toleranciaValor || 0.02;
}

function validarValorComMora(titulo, lancamento) {
  const tolerancia = getTolerancia();

  const valorTituloPlanilha = roundMoney(titulo.valorTitulo);
  const valorPago = roundMoney(titulo.valorPago);
  const valorInicial = roundMoney(lancamento.valorInicial);

  const diferencaTitulo = roundMoney(
    valorTituloPlanilha - valorInicial
  );

  const valorAcrescimo = roundMoney(
    valorPago - valorInicial
  );

  console.log('DEBUG VALOR', {
    numeroDocumento: titulo.numeroDocumento,
    valorTitulo: titulo.valorTitulo,
    valorPago: titulo.valorPago,
    valorInicial: lancamento.valorInicial
  });
  
  const valorTituloConfere =
    Math.abs(diferencaTitulo) <= tolerancia;

  if (!valorTituloConfere) {
    return {
      valido: false,
      tipo: 'DIVERGENCIA_VALOR_TITULO',

      tolerancia,

      valorTituloPlanilha,
      valorInicial,
      valorPago,

      valorAcrescimo,
      diferenca: diferencaTitulo,

      mensagem:
        'Valor do título na planilha diverge do valor inicial retornado pelo Millennium'
    };
  }

  if (valorPago < valorInicial - tolerancia) {
    return {
      valido: false,
      tipo: 'VALOR_PAGO_MENOR_QUE_TITULO',

      tolerancia,

      valorTituloPlanilha,
      valorInicial,
      valorPago,

      valorAcrescimo,
      diferenca: roundMoney(valorPago - valorInicial),

      mensagem:
        'Valor pago na planilha é menor que o valor inicial do título'
    };
  }

  if (valorAcrescimo > tolerancia) {
    return {
      valido: true,
      tipo: 'VALOR_COM_ACRESCIMO',

      tolerancia,

      valorTituloPlanilha,
      valorInicial,
      valorPago,

      valorAcrescimo,
      diferenca: diferencaTitulo,

      mensagem:
        'Valor do título confere e valor pago possui acréscimo'
    };
  }

  return {
    valido: true,
    tipo: 'VALOR_EXATO',

    tolerancia,

    valorTituloPlanilha,
    valorInicial,
    valorPago,

    valorAcrescimo: 0,
    diferenca: diferencaTitulo,

    mensagem:
      'Valor do título confere com o valor inicial retornado pelo Millennium'
  };
}

module.exports = {
  validarValorComMora,
  roundMoney
};