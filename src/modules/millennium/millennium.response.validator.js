function validarAtualizacaoResponse(response) {
    if (!response) {
      throw new Error('Resposta vazia da atualização Millennium');
    }
  
    if (!response.lancamento) {
      throw new Error(
        'Resposta da atualização não retornou lançamento'
      );
    }
  
    return true;
  }
  
  module.exports = {
    validarAtualizacaoResponse
  };