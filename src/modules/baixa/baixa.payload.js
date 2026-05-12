function roundMoney(value) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function resolveDataPagamento(titulo) {
  return titulo.dataPagamento || titulo.dataLiquidacao || null;
}

function calcularAcresDecres(titulo, lancamento) {
  const valorPago = roundMoney(titulo.valorPago);
  const valorInicial = roundMoney(lancamento.valorInicial);

  const diferenca = roundMoney(valorPago - valorInicial);

  return diferenca > 0 ? diferenca : 0;
}

function buildBaixaPayload(titulo, lancamento) {
  const dataPagamento = resolveDataPagamento(titulo);

  if (!dataPagamento) {
    throw new Error(
      `Título ${titulo.numeroDocumento} sem data de pagamento`
    );
  }

  const valorPago = roundMoney(titulo.valorPago);
  const acresDecres = calcularAcresDecres(titulo, lancamento);

  return {
    LANCAMENTO: lancamento.lancamento,

    DATA_PAGAMENTO: dataPagamento,

    OBS: `${new Date().toISOString()} - Baixa por retorno automacao importacao excel`,

    CONCILIADO: true,

    GERA_OUTRO: false,

    EFETUADO: true,

    STATUS_BAIXA: 'N',

    VALOR: valorPago,

    valor_pago: valorPago,

    CONTA: lancamento.conta,

    FILIAL: lancamento.filial,

    acres_decres: acresDecres
  };
}

module.exports = {
  buildBaixaPayload
};