const planilhaService = require('./planilha.service');

async function processar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo não enviado'
      });
    }

    const resultado = await planilhaService.processarPlanilha(req.file.path);

    return res.status(200).json({
      success: true,
      ...resultado
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