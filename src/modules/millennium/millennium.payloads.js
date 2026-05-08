function buildAtualizacaoPayload(titulo, lancamento) {
    return {
      nossoNumero: titulo.nossoNumero,
  
      linhaDigitavel: titulo.linhaDigitavel,
  
      valorJuros: Number(titulo.juros || 0),
  
      lancamento: lancamento.lancamento
    };
  }
  
  module.exports = {
    buildAtualizacaoPayload
  };