const millenniumClient = require('./millennium.client');
const formatCpfCnpj = require('../../shared/utils/formatCpfCnpj');

const { mapLancamento } = require('./millennium.mapper');

const {
  validarConsultaTitulo
} = require('./millennium.validator');

function buildConsultaUrl(titulo) {
  const cnpjFormatado = formatCpfCnpj(titulo.cpfCnpj);

  const cnpj = encodeURIComponent(cnpjFormatado);
  const numeroDocumento = encodeURIComponent(titulo.numeroDocumento);

  return `/MILLENIUM!JOIN_ONEUP.LANCAMENTOS.CONSULTALANCAMENTOS?cnpj=${cnpj}&n_documento=${numeroDocumento}`;
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