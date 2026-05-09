function buildResumoMessage({ processamentoId, dashboard }) {
    return [
      '✅ Processo BTG finalizado',
      '',
      `📁 Processamento: ${processamentoId}`,
      '',
      '📊 Resumo:',
      `• Total processáveis: ${dashboard.totalTitulosProcessaveis}`,
      `• Baixados com sucesso: ${dashboard.sucesso}`,
      `• Já baixados: ${dashboard.jaBaixados}`,
      `• Erros: ${dashboard.erros}`,
      `• Franquias separadas: ${dashboard.totalFranquias}`,
      `• Percentual sucesso: ${dashboard.percentualSucesso}%`,
      '',
      `🕒 Gerado em: ${dashboard.geradoEm}`
    ].join('\n');
  }
  
  module.exports = {
    buildResumoMessage
  };