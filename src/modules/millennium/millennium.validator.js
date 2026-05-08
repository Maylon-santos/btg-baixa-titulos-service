function validarConsultaTitulo(titulo, lancamentos = []) {
    if (!Array.isArray(lancamentos)) {
      throw new Error('Retorno inválido da consulta Millennium');
    }
  
    if (lancamentos.length === 0) {
      throw new Error(
        `Título não localizado: ${titulo.numeroDocumento}`
      );
    }
  
    if (lancamentos.length > 1) {
      throw new Error(
        `Mais de um lançamento encontrado para ${titulo.numeroDocumento}`
      );
    }
  
    const lancamento = lancamentos[0];
  
    const valorPlanilha = Number(titulo.valorPago || 0);
    const valorMillennium = Number(lancamento.valorInicial || 0);
  
    const diferenca = Math.abs(valorPlanilha - valorMillennium);
  
    if (diferenca > 0.01) {
      throw new Error(
        `Divergência de valor no título ${titulo.numeroDocumento}`
      );
    }
  
    return lancamento;
  }
  
  module.exports = {
    validarConsultaTitulo
  };