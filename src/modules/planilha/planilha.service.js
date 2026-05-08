const XLSX = require('xlsx');

const normalizeHeader = require('../../shared/utils/normalizeHeader');
const generateProcessamentoId = require('../../shared/utils/generateProcessamentoId');

const mapLinha = require('./planilha.mapper');
const validarTitulos = require('./planilha.validator');

async function processarPlanilha(filePath) {
  const workbook = XLSX.readFile(filePath);

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(firstSheet);

  const normalizedRows = rows.map((row) => {
    const normalized = {};

    Object.entries(row).forEach(([key, value]) => {
      normalized[normalizeHeader(key)] = value;
    });

    return normalized;
  });

  const titulos = normalizedRows.map(mapLinha);

  const validacao = validarTitulos(titulos);

  const franquias = validacao.validos.filter((item) =>
    item.cpfCnpj.startsWith('48047765')
  );

  const processaveis = validacao.validos.filter(
    (item) => !item.cpfCnpj.startsWith('48047765')
  );

  return {
    processamentoId: generateProcessamentoId(),

    totalLinhas: rows.length,

    totalValidos: validacao.validos.length,

    totalErros: validacao.erros.length,

    totalFranquias: franquias.length,

    totalProcessaveis: processaveis.length,

    franquias,

    processaveis,

    erros: validacao.erros
  };
}

module.exports = {
  processarPlanilha
};