const path = require('path');
const XLSX = require('xlsx');

const STATUS = require('../processamento/processamento.status');

const {
  writeJson
} = require('../../shared/utils/fileStorage');

const {
  mapResultadoParaRelatorio
} = require('./relatorio.mapper');

function criarExcel(filePath, rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Relatorio'
  );

  XLSX.writeFile(workbook, filePath);
}

function gerarDashboard(processamentoId, resultados = [], franquias = []) {
  const total = resultados.length;

  const sucesso = resultados.filter(
    (item) => item.status === STATUS.SUCESSO
  ).length;

  const jaBaixados = resultados.filter(
    (item) => item.status === STATUS.JA_BAIXADO
  ).length;

  const erros = resultados.filter(
    (item) =>
      item.status !== STATUS.SUCESSO &&
      item.status !== STATUS.JA_BAIXADO
  ).length;

  return {
    processamentoId,
    totalTitulosProcessaveis: total,
    totalFranquias: franquias.length,
    sucesso,
    jaBaixados,
    erros,
    percentualSucesso:
      total > 0 ? Number(((sucesso / total) * 100).toFixed(2)) : 0,
    geradoEm: new Date().toISOString()
  };
}

function gerarRelatorios({
  processamentoId,
  resultados = [],
  franquias = []
}) {
  const outputDir = path.resolve(
    'storage',
    'processamentos',
    processamentoId
  );

  const rows = resultados.map(mapResultadoParaRelatorio);

  const sucessos = rows.filter(
    (item) => item.status === STATUS.SUCESSO
  );

  const erros = rows.filter(
    (item) =>
      item.status !== STATUS.SUCESSO &&
      item.status !== STATUS.JA_BAIXADO
  );

  const jaBaixados = rows.filter(
    (item) => item.status === STATUS.JA_BAIXADO
  );

  const franquiasRows = franquias.map((item) => ({
    numeroDocumento: item.numeroDocumento,
    cpfCnpj: item.cpfCnpj,
    cliente: item.cliente,
    nossoNumero: item.nossoNumero,
    linhaDigitavel: item.linhaDigitavel,
    valorPago: item.valorPago,
    juros: item.juros,
    dataPagamento: item.dataPagamento,
    dataLiquidacao: item.dataLiquidacao
  }));

  criarExcel(
    path.join(outputDir, 'relatorio-sucesso.xlsx'),
    sucessos
  );

  criarExcel(
    path.join(outputDir, 'relatorio-erros.xlsx'),
    erros
  );

  criarExcel(
    path.join(outputDir, 'relatorio-ja-baixados.xlsx'),
    jaBaixados
  );

  criarExcel(
    path.join(outputDir, 'relatorio-franquias.xlsx'),
    franquiasRows
  );

  const dashboard = gerarDashboard(
    processamentoId,
    resultados,
    franquias
  );

  writeJson(
    path.join(outputDir, 'dashboard.json'),
    dashboard
  );

  return {
    arquivos: {
      sucesso: 'relatorio-sucesso.xlsx',
      erros: 'relatorio-erros.xlsx',
      jaBaixados: 'relatorio-ja-baixados.xlsx',
      franquias: 'relatorio-franquias.xlsx',
      dashboard: 'dashboard.json'
    },
    dashboard
  };
}

module.exports = {
  gerarRelatorios
};