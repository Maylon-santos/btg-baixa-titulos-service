const fs = require('fs');
const path = require('path');

function getBaseDir() {
  return path.resolve('storage', 'processamentos');
}

function readJsonSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
}

function fileExists(dir, filename) {
  return fs.existsSync(path.join(dir, filename));
}

function listarHistorico() {
  const baseDir = getBaseDir();

  if (!fs.existsSync(baseDir)) {
    return [];
  }

  return fs
    .readdirSync(baseDir)
    .filter((folder) => {
      const fullPath = path.join(baseDir, folder);
      return fs.statSync(fullPath).isDirectory();
    })
    .map((processamentoId) => {
      const dir = path.join(baseDir, processamentoId);

      const resumoPlanilha = readJsonSafe(
        path.join(dir, 'resumo.json'),
        {}
      );

      const resumoProcessamento = readJsonSafe(
        path.join(dir, 'resumo-processamento.json'),
        {}
      );

      const dashboard = readJsonSafe(
        path.join(dir, 'dashboard.json'),
        {}
      );

      return {
        processamentoId,

        planilha: resumoPlanilha,

        processamento: resumoProcessamento,

        dashboard,

        arquivos: {
          sucesso: fileExists(dir, 'relatorio-sucesso.xlsx'),
          erros: fileExists(dir, 'relatorio-erros.xlsx'),
          jaBaixados: fileExists(dir, 'relatorio-ja-baixados.xlsx'),
          franquias: fileExists(dir, 'relatorio-franquias.xlsx'),
          resultado: fileExists(dir, 'resultado-processamento.json'),
          dashboard: fileExists(dir, 'dashboard.json')
        }
      };
    })
    .sort((a, b) =>
      b.processamentoId.localeCompare(a.processamentoId)
    );
}

function buscarHistoricoPorId(processamentoId) {
  const dir = path.join(getBaseDir(), processamentoId);

  if (!fs.existsSync(dir)) {
    return null;
  }

  return {
    processamentoId,

    planilha: readJsonSafe(path.join(dir, 'resumo.json'), {}),

    resumo: readJsonSafe(
      path.join(dir, 'resumo-processamento.json'),
      {}
    ),

    dashboard: readJsonSafe(path.join(dir, 'dashboard.json'), {}),

    resultados: readJsonSafe(
      path.join(dir, 'resultado-processamento.json'),
      []
    ),

    erros: readJsonSafe(
      path.join(dir, 'erros-processamento.json'),
      []
    )
  };
}

function getArquivoRelatorio(processamentoId, tipo) {
  const allowedFiles = {
    sucesso: 'relatorio-sucesso.xlsx',
    erros: 'relatorio-erros.xlsx',
    jaBaixados: 'relatorio-ja-baixados.xlsx',
    franquias: 'relatorio-franquias.xlsx',
    resultado: 'resultado-processamento.json',
    dashboard: 'dashboard.json'
  };

  const filename = allowedFiles[tipo];

  if (!filename) {
    return null;
  }

  const filePath = path.join(
    getBaseDir(),
    processamentoId,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return filePath;
}

function buscarStatus(processamentoId) {
  const dir = path.join(getBaseDir(), processamentoId);

  if (!fs.existsSync(dir)) {
    return null;
  }

  return readJsonSafe(path.join(dir, 'status.json'), null);
}
module.exports = {
  listarHistorico,
  buscarHistoricoPorId,
  getArquivoRelatorio,
  buscarStatus
};