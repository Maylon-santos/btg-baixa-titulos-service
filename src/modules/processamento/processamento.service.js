const path = require('path');

const logger = require('../../shared/logger/logger');

const {
  writeJson
} = require('../../shared/utils/fileStorage');

const millenniumAuthService = require(
  '../millennium/millennium.auth.service'
);

const consultaService = require(
  '../millennium/millennium.consulta.service'
);

const atualizacaoService = require(
  '../millennium/millennium.atualizacao.service'
);

const baixaService = require(
  '../baixa/baixa.service'
);

const {
  createResultadoBase
} = require('./processamento.resultado');

const STATUS = require('./processamento.status');

async function processarTitulos(
  processamentoId,
  titulos = []
) {
  const resultados = [];

  try {
    await millenniumAuthService.login();

    logger.info(
      `🚀 Iniciando processamento de ${titulos.length} títulos`
    );

    for (const titulo of titulos) {
      const resultado =
        createResultadoBase(titulo);

      try {
        logger.info(
          `🔎 Processando título ${titulo.numeroDocumento}`
        );

        // CONSULTA
        const lancamento =
          await consultaService.consultarTitulo(
            titulo
          );

        resultado.consulta = lancamento;

        // ATUALIZAÇÃO
        const atualizacao =
          await atualizacaoService.atualizarTitulo(
            titulo,
            lancamento
          );

        resultado.atualizacao = atualizacao;

        // BAIXA
        const baixa =
          await baixaService.baixarTitulo(
            titulo,
            lancamento
          );

        resultado.baixa = baixa;

        resultado.status = STATUS.SUCESSO;

        logger.info(
          `✅ Fluxo concluído para ${titulo.numeroDocumento}`
        );
      } catch (error) {
        resultado.erro = error.message;

        logger.error(
          `❌ Erro no processamento do título ${titulo.numeroDocumento}`,
          {
            erro: error.message
          }
        );

        if (
          error.message.includes('não localizado') ||
          error.message.includes('Mais de um lançamento')
        ) {
          resultado.status =
            STATUS.ERRO_CONSULTA;
        } else if (
          error.message.includes('atualização')
        ) {
          resultado.status =
            STATUS.ERRO_ATUALIZACAO;
        } else if (
          error.message.includes('Baixa')
        ) {
          resultado.status =
            STATUS.ERRO_BAIXA;
        } else {
          resultado.status =
            STATUS.ERRO_DESCONHECIDO;
        }
      }

      resultados.push(resultado);
    }

    const resumo = {
      processamentoId,

      total: resultados.length,

      sucesso: resultados.filter(
        (r) => r.status === STATUS.SUCESSO
      ).length,

      erros: resultados.filter(
        (r) => r.status !== STATUS.SUCESSO
      ).length
    };

    const outputDir = path.resolve(
      'storage',
      'processamentos',
      processamentoId
    );

    writeJson(
      path.join(outputDir, 'resultado-processamento.json'),
      resultados
    );

    writeJson(
      path.join(outputDir, 'resumo-processamento.json'),
      resumo
    );

    logger.info(
      `🏁 Processamento finalizado`,
      resumo
    );

    return {
      resumo,
      resultados
    };
  } finally {
    await millenniumAuthService.finalizarSessao();
  }
}

module.exports = {
  processarTitulos
};