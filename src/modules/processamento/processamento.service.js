const path = require('path');

const logger = require('../../shared/logger/logger');
const { writeJson } = require('../../shared/utils/fileStorage');

const millenniumAuthService = require('../millennium/millennium.auth.service');
const consultaService = require('../millennium/millennium.consulta.service');
const atualizacaoService = require('../millennium/millennium.atualizacao.service');
const baixaService = require('../baixa/baixa.service');

const { createResultadoBase } = require('./processamento.resultado');
const STATUS = require('./processamento.status');
const progressoService = require('./processamento.status.service');

function contarResultados(resultados) {
  return {
    sucesso: resultados.filter((r) => r.status === STATUS.SUCESSO).length,

    jaBaixados: resultados.filter(
      (r) => r.status === STATUS.JA_BAIXADO
    ).length,

    erros: resultados.filter(
      (r) =>
        r.status !== STATUS.SUCESSO &&
        r.status !== STATUS.JA_BAIXADO
    ).length
  };
}

function gerarResumo(processamentoId, resultados, erroGeral = null) {
  const contadores = contarResultados(resultados);

  return {
    processamentoId,

    total: resultados.length,

    sucesso: contadores.sucesso,

    jaBaixados: contadores.jaBaixados,

    erros: contadores.erros,

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
    (item) =>
      item.status !== STATUS.SUCESSO &&
      item.status !== STATUS.JA_BAIXADO
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

function salvarProgresso({
  processamentoId,
  status,
  etapa,
  total,
  resultados,
  mensagem
}) {
  const contadores = contarResultados(resultados);

  return progressoService.salvarStatus({
    processamentoId,
    status,
    etapa,
    total,
    processados: resultados.length,
    sucesso: contadores.sucesso,
    jaBaixados: contadores.jaBaixados,
    erros: contadores.erros,
    mensagem
  });
}

function classificarErro(error) {
  const message = String(error.message || '');

  if (
    message.includes('não localizado') ||
    message.includes('Mais de um lançamento') ||
    message.includes('Divergência de valor') ||
    message.includes('VALOR_PAGO_NAO_INFORMADO') ||
    message.includes('DIVERGENCIA_VALOR_TITULO') ||
    message.includes('VALOR_PAGO_MENOR_QUE_TITULO')
  ) {
    return STATUS.ERRO_CONSULTA;
  }

  if (message.toLowerCase().includes('atualiza')) {
    return STATUS.ERRO_ATUALIZACAO;
  }

  if (message.toLowerCase().includes('baixa')) {
    return STATUS.ERRO_BAIXA;
  }

  return STATUS.ERRO_DESCONHECIDO;
}

async function processarTitulos(processamentoId, titulos = []) {
  const resultados = [];
  let erroGeral = null;

  progressoService.salvarStatus({
    processamentoId,
    status: 'INICIANDO',
    etapa: 'LOGIN_MILLENNIUM',
    total: titulos.length,
    processados: 0,
    sucesso: 0,
    jaBaixados: 0,
    erros: 0,
    mensagem: 'Iniciando login no Millennium'
  });

  try {
    await millenniumAuthService.login();

    progressoService.salvarStatus({
      processamentoId,
      status: 'PROCESSANDO',
      etapa: 'PROCESSANDO_TITULOS',
      total: titulos.length,
      processados: 0,
      sucesso: 0,
      jaBaixados: 0,
      erros: 0,
      mensagem: `Iniciando processamento de ${titulos.length} títulos`
    });

    logger.info(`🚀 Iniciando processamento de ${titulos.length} títulos`);

    for (const titulo of titulos) {
      const resultado = createResultadoBase(titulo);

      try {
        salvarProgresso({
          processamentoId,
          status: 'PROCESSANDO',
          etapa: 'CONSULTANDO_TITULO',
          total: titulos.length,
          resultados,
          mensagem: `Consultando título ${titulo.numeroDocumento}`
        });

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

          salvarProgresso({
            processamentoId,
            status: 'PROCESSANDO',
            etapa: 'TITULO_JA_BAIXADO',
            total: titulos.length,
            resultados,
            mensagem: `Título ${titulo.numeroDocumento} já estava baixado`
          });

          continue;
        }

        salvarProgresso({
          processamentoId,
          status: 'PROCESSANDO',
          etapa: 'ATUALIZANDO_TITULO',
          total: titulos.length,
          resultados,
          mensagem: `Atualizando título ${titulo.numeroDocumento}`
        });

        const atualizacao = await atualizacaoService.atualizarTitulo(
          titulo,
          lancamento
        );

        resultado.atualizacao = atualizacao;

        salvarProgresso({
          processamentoId,
          status: 'PROCESSANDO',
          etapa: 'BAIXANDO_TITULO',
          total: titulos.length,
          resultados,
          mensagem: `Baixando título ${titulo.numeroDocumento}`
        });

        const baixa = await baixaService.baixarTitulo(titulo, lancamento);

        resultado.baixa = baixa;

        resultado.status = STATUS.SUCESSO;

        logger.info(`✅ Fluxo concluído para ${titulo.numeroDocumento}`);
      } catch (error) {
        resultado.erro = error.message;

        resultado.status = classificarErro(error);

        logger.error(`❌ Erro no título ${titulo.numeroDocumento}`, {
          status: resultado.status,
          erro: error.message
        });
      }

      resultados.push(resultado);

      const resumoParcial = gerarResumo(processamentoId, resultados);

      salvarResultado(processamentoId, resultados, resumoParcial);

      salvarProgresso({
        processamentoId,
        status: 'PROCESSANDO',
        etapa: 'TITULO_PROCESSADO',
        total: titulos.length,
        resultados,
        mensagem: `Título ${titulo.numeroDocumento} finalizado`
      });
    }
  } catch (error) {
    erroGeral = error.message;

    logger.error('❌ Erro geral no processamento', {
      processamentoId,
      erro: error.message
    });

    salvarProgresso({
      processamentoId,
      status: 'ERRO',
      etapa: 'ERRO_GERAL',
      total: titulos.length,
      resultados,
      mensagem: error.message
    });
  } finally {
    await millenniumAuthService.finalizarSessao();

    const resumoFinal = gerarResumo(
      processamentoId,
      resultados,
      erroGeral
    );

    salvarResultado(processamentoId, resultados, resumoFinal);

    salvarProgresso({
      processamentoId,
      status: erroGeral ? 'ERRO' : 'FINALIZADO',
      etapa: 'FINALIZADO',
      total: titulos.length,
      resultados,
      mensagem: erroGeral || 'Processamento finalizado'
    });

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