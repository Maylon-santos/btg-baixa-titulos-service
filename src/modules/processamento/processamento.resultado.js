function createResultadoBase(titulo) {
  return {
    numeroDocumento: titulo.numeroDocumento,
    cpfCnpj: titulo.cpfCnpj,
    cliente: titulo.cliente,

    valorTitulo: titulo.valorTitulo,
    valorPago: titulo.valorPago,

    status: null,
    erro: null,

    consulta: null,
    atualizacao: null,
    baixa: null
  };
}

module.exports = {
  createResultadoBase
};