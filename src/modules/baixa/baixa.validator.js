function validarBaixaResponse(response) {
    if (!response) {
      throw new Error('Resposta vazia da baixa');
    }
  
    if (!response.baixa) {
      throw new Error(
        'Baixa não retornou identificador'
      );
    }
  
    return true;
  }
  
  module.exports = {
    validarBaixaResponse
  };