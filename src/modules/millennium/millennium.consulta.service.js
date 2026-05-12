const millenniumClient = require('./millennium.client');
const formatCpfCnpj = require('../../shared/utils/formatCpfCnpj');
const { mapLancamento } = require('./millennium.mapper');

const {
  validarConsultaTitulo
} = require('./millennium.validator');


function buildConsultaUrl(titulo) {
  const documento = String(titulo.cpfCnpj || '').replace(/\D/g, ''); ƒƒ

  const numeroDocumento = encodeURIComponent(titulo.numeroDocumento);

  if (documento.length === 11) {
    const cpfFormatado = formatCpfCnpj(documento);

    return `/MILLENIUM!JOIN_ONEUP.LANCAMENTOS.CONSULTALANCAMENTOS?n_documento=${numeroDocumento}&cpf=${encodeURIComponent(cpfFormatado)}`;
  }

  if (documento.length === 14) {
    const cnpjFormatado = formatCpfCnpj(documento);

    return `/MILLENIUM!JOIN_ONEUP.LANCAMENTOS.CONSULTALANCAMENTOS?cnpj=${encodeURIComponent(cnpjFormatado)}&n_documento=${numeroDocumento}`;
  }

  return `/MILLENIUM!JOIN_ONEUP.LANCAMENTOS.CONSULTALANCAMENTOS?n_documento=${numeroDocumento}`;
}

async function consultarTitulo(titulo) {
  const url = buildConsultaUrl(titulo);

  const response = await millenniumClient.request({
    method: 'GET',
    url
  });

  const rows = response.value || [];

  const lancamentos = rows.map(mapLancamento);

  const lancamentoValidado = validarConsultaTitulo(
    titulo,
    lancamentos
  );

  return lancamentoValidado;
}

module.exports = {
  consultarTitulo,
  buildConsultaUrl
};