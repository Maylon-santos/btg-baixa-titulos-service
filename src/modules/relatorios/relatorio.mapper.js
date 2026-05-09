function mapResultadoParaRelatorio(item) {
    return {
      numeroDocumento: item.numeroDocumento,
      cpfCnpj: item.cpfCnpj,
      cliente: item.cliente,
      valorPago: item.valorPago,
      status: item.status,
      erro: item.erro || '',
  
      lancamento: item.consulta?.lancamento || '',
      situacao: item.consulta?.situacao || '',
      filial: item.consulta?.filial || '',
      conta: item.consulta?.conta || '',
  
      baixa: item.baixa?.baixa || '',
      valorBaixado: item.baixa?.valor || '',
  
      nossoNumero: item.atualizacao?.nossonumero || '',
      linhaDigitavel: item.atualizacao?.linhadigitavel || '',
      transId: item.consulta?.transId || ''
    };
  }
  
  module.exports = {
    mapResultadoParaRelatorio
  };