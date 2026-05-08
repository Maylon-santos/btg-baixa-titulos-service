const tituloSchema = require('./schemas/titulo.schema');

function validarTitulos(titulos = []) {
  const erros = [];

  const validos = titulos.filter((titulo, index) => {
    const result = tituloSchema.safeParse(titulo);

    if (!result.success) {
      erros.push({
        linha: index + 1,
        erros: result.error.issues
      });

      return false;
    }

    return true;
  });

  return {
    validos,
    erros
  };
}

module.exports = validarTitulos;