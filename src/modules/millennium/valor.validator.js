const env = require('../../config/env');

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function diffInDays(dateStart, dateEnd) {
  if (!dateStart || !dateEnd) {
    return 0;
  }

  const start = new Date(`${dateStart}T00:00:00`);
  const end = new Date(`${dateEnd}T00:00:00`);

  const diffMs = end.getTime() - start.getTime();

  return Math.max(0, Math.floor(diffMs / 86400000));
}

function validarValorComMora(titulo, lancamento) {
  const valorPago = roundMoney(titulo.valorPago);
  const valorInicial = roundMoney(lancamento.valorInicial);

  const tolerancia =
    env.financeiro.toleranciaValor;

  const diferencaSemMora = Math.abs(valorPago - valorInicial);

  if (diferencaSemMora <= tolerancia) {
    return {
      valido: true,
      tipo: 'VALOR_EXATO',
      valorPago,
      valorInicial,
      valorMora: 0,
      valorEsperado: valorInicial,
      diferenca: roundMoney(valorPago - valorInicial),
      diasAtraso: 0
    };
  }

  const diasAtraso = diffInDays(
    lancamento.dataVencimento,
    titulo.dataPagamento || titulo.dataLiquidacao
  );

  const percentualMoraDia = Number(lancamento.mora || 0);

  const valorMora = roundMoney(
    valorInicial * (percentualMoraDia / 100) * diasAtraso
  );

  const valorEsperado = roundMoney(valorInicial + valorMora);

  const diferencaComMora = Math.abs(valorPago - valorEsperado);

  if (diferencaComMora <= tolerancia) {
    return {
      valido: true,
      tipo: 'VALOR_COM_MORA',
      valorPago,
      valorInicial,
      valorMora,
      valorEsperado,
      diferenca: roundMoney(valorPago - valorEsperado),
      diasAtraso
    };
  }

  return {
    valido: false,
    tipo: 'DIVERGENCIA_VALOR',
    valorPago,
    valorInicial,
    valorMora,
    valorEsperado,
    diferenca: roundMoney(valorPago - valorEsperado),
    diasAtraso
  };
}

module.exports = {
  validarValorComMora
};