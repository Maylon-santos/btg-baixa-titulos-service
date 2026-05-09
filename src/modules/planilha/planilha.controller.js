const planilhaService = require('./planilha.service');
const relatorioService = require('../relatorios/relatorio.service');


const processamentoService = require(
  '../processamento/processamento.service'
);


const path = require('path');

const whatsappService = require('../whatsapp/whatsapp.service');

const {
  buildResumoMessage
} = require('../whatsapp/whatsapp.message');



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
    const relatorios = relatorioService.gerarRelatorios({
      processamentoId: resultadoPlanilha.processamentoId,
      resultados: processamento.resultados,
      franquias: resultadoPlanilha.franquias
    });

    const mensagem = buildResumoMessage({
      processamentoId: resultadoPlanilha.processamentoId,
      dashboard: relatorios.dashboard
    });
    
    await whatsappService.enviarTexto(mensagem);
    
    if (relatorios.dashboard.erros > 0) {
      const errosFile = path.resolve(
        'storage',
        'processamentos',
        resultadoPlanilha.processamentoId,
        'relatorio-erros.xlsx'
      );
    
      await whatsappService.enviarArquivo(errosFile);
    }

    return res.status(200).json({
      success: true,

      processamentoId:
        resultadoPlanilha.processamentoId,

      planilha: resultadoPlanilha,

      processamento,

      relatorios
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