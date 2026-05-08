function resolveDataPagamento(titulo) {
  return (
    titulo.dataPagamento ||
    titulo.dataLiquidacao ||
    null
  );
}

function buildBaixaPayload(titulo, lancamento) {
  const dataPagamento =
    resolveDataPagamento(titulo);

  if (!dataPagamento) {
    throw new Error(
      `Título ${titulo.numeroDocumento} sem data de pagamento`
    );
  }
  function resolveDataPagamento(titulo) {
    return (
      titulo.dataPagamento ||
      titulo.dataLiquidacao ||
      null
    );
  }

  return {
    LANCAMENTO: lancamento.lancamento,

    DATA_PAGAMENTO: dataPagamento,

    OBS: `${new Date().toISOString()} - Baixa por retorno automacao importacao excel`,

    CONCILIADO: true,

    GERA_OUTRO: false,

    EFETUADO: true,

    STATUS_BAIXA: 'N',

    VALOR: Number(titulo.valorPago || 0),

    CONTA: lancamento.conta,

    FILIAL: lancamento.filial
  };
}

module.exports = {
  buildBaixaPayload
};