const historicoService = require('./historico.service');

function listar(req, res) {
  const data = historicoService.listarHistorico();

  return res.status(200).json({
    success: true,
    data
  });
}

function buscarPorId(req, res) {
  const { processamentoId } = req.params;

  const data =
    historicoService.buscarHistoricoPorId(processamentoId);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Processamento não encontrado'
    });
  }

  return res.status(200).json({
    success: true,
    data
  });
}

function download(req, res) {
  const { processamentoId, tipo } = req.params;

  const filePath = historicoService.getArquivoRelatorio(
    processamentoId,
    tipo
  );

  if (!filePath) {
    return res.status(404).json({
      success: false,
      message: 'Arquivo não encontrado'
    });
  }

  return res.download(filePath);
}
function status(req, res) {
  const { processamentoId } = req.params;

  const data = historicoService.buscarStatus(processamentoId);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Status do processamento não encontrado'
    });
  }

  return res.status(200).json({
    success: true,
    data
  });
}

module.exports = {
  listar,
  buscarPorId,
  download,
  status
};