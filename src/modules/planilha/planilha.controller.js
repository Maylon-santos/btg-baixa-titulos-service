const planilhaService = require('./planilha.service');


const processamentoService = require(
  '../processamento/processamento.service'
);

async function processar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo não enviado'
      });
    }

    const resultadoPlanilha =
      await planilhaService.processarPlanilha(
        req.file.path
      );

    const processamento =
      await processamentoService.processarTitulos(
        resultadoPlanilha.processamentoId,
        resultadoPlanilha.processaveis
      );

    return res.status(200).json({
      success: true,

      processamentoId:
        resultadoPlanilha.processamentoId,

      planilha: resultadoPlanilha,

      processamento
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  processar
};