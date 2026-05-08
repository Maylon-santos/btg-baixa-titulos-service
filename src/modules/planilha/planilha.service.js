const path = require('path');
const { writeJson, copyFile } = require('../../shared/utils/fileStorage');
const XLSX = require('xlsx');
const { normalizeRowHeaders } = require('./planilha.header-normalizer');
const generateProcessamentoId = require('../../shared/utils/generateProcessamentoId');

const mapLinha = require('./planilha.mapper');
const validarTitulos = require('./planilha.validator');

async function processarPlanilha(filePath) {
  const workbook = XLSX.readFile(filePath);

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(firstSheet);

  const normalizedRows = rows.map(normalizeRowHeaders);

  const titulos = normalizedRows.map(mapLinha);

  const validacao = validarTitulos(titulos);

  const franquias = validacao.validos.filter((item) =>
    item.cpfCnpj.startsWith('48047765')
  );

  const processaveis = validacao.validos.filter(
    (item) => !item.cpfCnpj.startsWith('48047765')
  );

  const processamentoId = generateProcessamentoId();

const baseDir = path.resolve(
  'storage',
  'processamentos',
  processamentoId
);

const resumo = {
  processamentoId,
  totalLinhas: rows.length,
  totalValidos: validacao.validos.length,
  totalErros: validacao.erros.length,
  totalFranquias: franquias.length,
  totalProcessaveis: processaveis.length
};

copyFile(filePath, path.join(baseDir, 'original.xlsx'));
writeJson(path.join(baseDir, 'resumo.json'), resumo);
writeJson(path.join(baseDir, 'franquias.json'), franquias);
writeJson(path.join(baseDir, 'processaveis.json'), processaveis);
writeJson(path.join(baseDir, 'erros.json'), validacao.erros);

return {
  ...resumo,
  franquias,
  processaveis,
  erros: validacao.erros
};
}

module.exports = {
  processarPlanilha
};