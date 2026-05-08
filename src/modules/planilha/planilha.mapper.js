const sanitizeDocument = require('../../shared/utils/sanitizeDocument');
const normalizeDate = require('../../shared/utils/normalizeDate');

function toNumber(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  if (typeof value === 'number') {
    return Number.isNaN(value) ? defaultValue : value;
  }

  const normalized = String(value)
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();

  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = toNumber(value, null);

  return Number.isNaN(parsed) ? null : parsed;
}

function mapLinha(row) {
  return {
    numeroDocumento: String(row.numero_documento || '').trim(),

    cpfCnpj: sanitizeDocument(row.cpf_cnpj),

    cliente: String(row.cliente || '').trim(),

    nossoNumero: String(row.nosso_numero || '').trim(),

    linhaDigitavel: String(row.linha_digitavel || '').trim(),

    valorPago: toNumber(row.valor_pago, 0),

    juros: toNullableNumber(row.juros),

    dataPagamento: normalizeDate(
      row.data_pagamento
    ),
    
    dataLiquidacao: normalizeDate(
      row.data_liquidacao
    )
  };
}

module.exports = mapLinha;