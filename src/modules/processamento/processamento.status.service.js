const path = require('path');

const { writeJson } = require('../../shared/utils/fileStorage');

function getStatusPath(processamentoId) {
  return path.resolve(
    'storage',
    'processamentos',
    processamentoId,
    'status.json'
  );
}

function calcularPercentual(processados, total) {
  if (!total) return 0;

  return Number(((processados / total) * 100).toFixed(2));
}

function salvarStatus({
  processamentoId,
  status,
  etapa,
  total = 0,
  processados = 0,
  sucesso = 0,
  jaBaixados = 0,
  erros = 0,
  mensagem = null
}) {
  const payload = {
    processamentoId,
    status,
    etapa,
    total,
    processados,
    sucesso,
    jaBaixados,
    erros,
    percentual: calcularPercentual(processados, total),
    mensagem,
    atualizadoEm: new Date().toISOString()
  };

  writeJson(getStatusPath(processamentoId), payload);

  return payload;
}

module.exports = {
  salvarStatus
};