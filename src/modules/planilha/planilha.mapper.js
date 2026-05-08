const sanitizeDocument = require('../../shared/utils/sanitizeDocument');

function mapLinha(row) {
  return {
    numeroDocumento: String(row.numero_documento || '').trim(),

    cpfCnpj: sanitizeDocument(row.cpf_cnpj),

    cliente: String(row.cliente || '').trim(),

    nossoNumero: String(row.nosso_numero || '').trim(),

    linhaDigitavel: String(row.linha_digitavel || '').trim(),

    valorPago: Number(row.valor_pago || 0),

    juros: row.juros ? Number(row.juros) : null,

    dataPagamento: row.data_pagamento || null,

    dataLiquidacao: row.data_liquidacao || null
  };
}

module.exports = mapLinha;