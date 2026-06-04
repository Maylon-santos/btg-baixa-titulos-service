import { useEffect, useState } from 'react';

import {
  buscarProcessamento,
  listarProcessamentos,
  processarPlanilha,
} from '../api/btgApi';

import UploadPlanilha from '../components/UploadPlanilha';
import DashboardResumo from '../components/DashboardResumo';
import ResultadoTabela from '../components/ResultadoTabela';
import ProcessingOverlay from '../components/ProcessingOverlay';
import HistoricoProcessamentos from '../components/HistoricoProcessamentos';
import KpiCards from '../components/KpiCards';
import ResultadoChart from '../components/ResultadoChart';
import ProgressStatus from '../components/ProgressStatus';

function montarResultadoHistorico(data) {
  return {
    success: true,
    processamentoId: data.processamentoId,
    processamento: {
      resumo: data.resumo,
      resultados: data.resultados || [],
    },
    relatorios: {
      dashboard: data.dashboard,
    },
    planilha: {
      totalLinhas: data.planilha?.totalLinhas || 0,
      totalFranquias: data.dashboard?.totalFranquias || 0,
    },
  };
}

export default function ProcessamentoPage() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState(null);
  const [statusProcessamento, setStatusProcessamento] = useState(null);

  async function carregarHistorico() {
    const data = await listarProcessamentos();
    setHistorico(data);
  }

  async function handleSelecionarHistorico(processamentoId) {
    try {
      setErro(null);
      setStatusProcessamento(null);

      const data = await buscarProcessamento(processamentoId);

      setResultado(montarResultadoHistorico(data));
    } catch (error) {
      setErro(
        error.response?.data?.message ||
          error.message ||
          'Erro ao buscar processamento'
      );
    }
  }

  async function handleProcessar(file) {
    try {
      setLoading(true);
      setErro(null);
      setResultado(null);
      setStatusProcessamento({
        status: 'ENVIANDO',
        etapa: 'UPLOAD_PLANILHA',
        total: 0,
        processados: 0,
        sucesso: 0,
        jaBaixados: 0,
        erros: 0,
        percentual: 0,
        mensagem: 'Enviando planilha para processamento...',
      });

      const data = await processarPlanilha(file);

      setResultado(data);

      if (data?.processamentoId) {
        setStatusProcessamento({
          status: 'FINALIZADO',
          etapa: 'FINALIZADO',
          total:
            data.relatorios?.dashboard?.totalTitulosProcessaveis ||
            data.processamento?.resumo?.total ||
            0,
          processados:
            data.relatorios?.dashboard?.totalTitulosProcessaveis ||
            data.processamento?.resumo?.total ||
            0,
          sucesso:
            data.relatorios?.dashboard?.sucesso ||
            data.processamento?.resumo?.sucesso ||
            0,
          jaBaixados:
            data.relatorios?.dashboard?.jaBaixados ||
            data.processamento?.resumo?.jaBaixados ||
            0,
          erros:
            data.relatorios?.dashboard?.erros ||
            data.processamento?.resumo?.erros ||
            0,
          percentual: 100,
          mensagem: 'Processamento finalizado',
        });

        await carregarHistorico();
      }
    } catch (error) {
      setErro(
        error.response?.data?.message ||
          error.message ||
          'Erro ao processar planilha'
      );

      setStatusProcessamento({
        status: 'ERRO',
        etapa: 'ERRO_PROCESSAMENTO',
        percentual: 0,
        mensagem:
          error.response?.data?.message ||
          error.message ||
          'Erro ao processar planilha',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ativo = true;
  
    async function carregar() {
      try {
        const data = await listarProcessamentos();
  
        if (ativo) {
          setHistorico(data);
        }
      } catch {
        // erro silencioso na carga inicial
      }
    }
  
    carregar();
  
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="container">
      <ProcessingOverlay visible={loading} />

      <div className="topbar">
        <div className="brand">
          <div className="brand-badge"></div>

          <div>
            <h1>BTG - Baixa de Títulos</h1>
            <p>Importação, conciliação e baixa automática no Millennium</p>
          </div>
        </div>

        <button className="btn" type="button">
          Ambiente Local
        </button>
      </div>

      <UploadPlanilha onSubmit={handleProcessar} loading={loading} />

      {erro && <div className="error">{erro}</div>}

      <ProgressStatus status={statusProcessamento} />

      <KpiCards dashboard={resultado?.relatorios?.dashboard} />

      <ResultadoChart dashboard={resultado?.relatorios?.dashboard} />

      <DashboardResumo data={resultado} />

      <ResultadoTabela
        resultados={resultado?.processamento?.resultados || []}
      />

      <HistoricoProcessamentos
        historico={historico}
        onSelecionar={handleSelecionarHistorico}
      />
    </main>
  );
}