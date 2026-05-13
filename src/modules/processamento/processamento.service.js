const path = require('path');

const logger = require('../../shared/logger/logger');
const { writeJson } = require('../../shared/utils/fileStorage');

const millenniumAuthService = require('../millennium/millennium.auth.service');
const consultaService = require('../millennium/millennium.consulta.service');
const atualizacaoService = require('../millennium/millennium.atualizacao.service');
const baixaService = require('../baixa/baixa.service');

const { createResultadoBase } = require('./processamento.resultado');
const STATUS = require('./processamento.status');

function gerarResumo(processamentoId, resultados, erroGeral = null) {
  return {
    processamentoId,

    total: resultados.length,

    sucesso: resultados.filter(
      (r) => r.status === STATUS.SUCESSO
    ).length,

    jaBaixados: resultados.filter(
      (r) => r.status === STATUS.JA_BAIXADO
    ).length,

    erros: resultados.filter(
      (r) =>
        r.status !== STATUS.SUCESSO &&
        r.status !== STATUS.JA_BAIXADO
    ).length,

    erroGeral,

    finalizadoEm: new Date().toISOString()
  };
}

function salvarResultado(processamentoId, resultados, resumo) {
  const outputDir = path.resolve(
    'storage',
    'processamentos',
    processamentoId
  );

  const errosProcessamento = resultados.filter(
    (item) => item.status !== STATUS.SUCESSO
  );

  writeJson(
    path.join(outputDir, 'resultado-processamento.json'),
    resultados
  );

  writeJson(
    path.join(outputDir, 'resumo-processamento.json'),
    resumo
  );

  writeJson(
    path.join(outputDir, 'erros-processamento.json'),
    errosProcessamento
  );
}

async function processarTitulos(processamentoId, titulos = []) {
  const resultados = [];
  let erroGeral = null;

  try {
    await millenniumAuthService.login();

    logger.info(`🚀 Iniciando processamento de ${titulos.length} títulos`);

    for (const titulo of titulos) {
      const resultado = createResultadoBase(titulo);

      try {
        logger.info(`🔎 Processando título ${titulo.numeroDocumento}`);

        const lancamento = await consultaService.consultarTitulo(titulo);
        resultado.consulta = lancamento;
        
        if (lancamento.situacao === 'BAIXADO') {
          resultado.status = STATUS.JA_BAIXADO;
        
          logger.info(
            `ℹ️ Título ${titulo.numeroDocumento} já estava baixado. Processo ignorado.`,
            {
              lancamento: lancamento.lancamento,
              situacao: lancamento.situacao
            }
          );
        
          resultados.push(resultado);
        
          const resumoParcial = gerarResumo(processamentoId, resultados);
          salvarResultado(processamentoId, resultados, resumoParcial);
        
          continue;
        }

        const atualizacao = await atualizacaoService.atualizarTitulo(
          titulo,
          lancamento
        );
        resultado.atualizacao = atualizacao;

        const baixa = await baixaService.baixarTitulo(titulo, lancamento);
        resultado.baixa = baixa;

        resultado.status = STATUS.SUCESSO;

        logger.info(`✅ Fluxo concluído para ${titulo.numeroDocumento}`);
      } catch (error) {
        resultado.erro = error.message;

        if (
          error.message.includes('não localizado') ||
          error.message.includes('Mais de um lançamento') ||
          error.message.includes('Divergência de valor')
        ) {
          resultado.status = STATUS.ERRO_CONSULTA;
        } else if (error.message.toLowerCase().includes('atualiza')) {
          resultado.status = STATUS.ERRO_ATUALIZACAO;
        } else if (error.message.toLowerCase().includes('baixa')) {
          resultado.status = STATUS.ERRO_BAIXA;
        } else {
          resultado.status = STATUS.ERRO_DESCONHECIDO;
        }

        logger.error(`❌ Erro no título ${titulo.numeroDocumento}`, {
          status: resultado.status,
          erro: error.message
        });
      }

      resultados.push(resultado);

      const resumoParcial = gerarResumo(processamentoId, resultados);
      salvarResultado(processamentoId, resultados, resumoParcial);
    }
  } catch (error) {
    erroGeral = error.message;

    logger.error('❌ Erro geral no processamento', {
      processamentoId,
      erro: error.message
    });
  } finally {
    await millenniumAuthService.finalizarSessao();

    const resumoFinal = gerarResumo(
      processamentoId,
      resultados,
      erroGeral
    );

    salvarResultado(processamentoId, resultados, resumoFinal);

    logger.info('🏁 Processamento finalizado', resumoFinal);

    return {
      resumo: resumoFinal,
      resultados
    };
  }
}

module.exports = {
  processarTitulos
};