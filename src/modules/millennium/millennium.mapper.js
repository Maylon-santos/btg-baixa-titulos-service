  
  function mapLancamento(data) {
    return {
      lancamento: data.lancamento,
      filial: data.filial,
      conta: data.conta,
  
      clienteCodigo: data.cod_cliente,
  
      clienteNome: data.nome,
  
      cnpj: String(data.cnpj || '').trim(),
  
      valorInicial: Number(data.valor_inicial || 0),
  
      transId: data.trans_id,
  
      situacao: String(data.situacao || '')
        .trim()
        .toUpperCase()
    };
  }
  
  module.exports = {
    mapLancamento
  };