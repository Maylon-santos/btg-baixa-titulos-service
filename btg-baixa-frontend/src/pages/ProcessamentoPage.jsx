import { useState } from "react";

import { processarPlanilha } from "../api/btgApi";
import UploadPlanilha from "../components/UploadPlanilha";
import DashboardResumo from "../components/DashboardResumo";
import ResultadoTabela from "../components/ResultadoTabela";
import ProcessingOverlay from "../components/ProcessingOverlay";
import KpiCards from "../components/KpiCards";
import ResultadoChart from "../components/ResultadoChart";

export default function ProcessamentoPage() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  async function handleProcessar(file) {
    try {
      setLoading(true);
      setErro(null);
      setResultado(null);

      const data = await processarPlanilha(file);

      setResultado(data);
    } catch (error) {
      setErro(
        error.response?.data?.message ||
          error.message ||
          "Erro ao processar planilha"
      );
    } finally {
      setLoading(false);
    }
  }

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
      <p className="subtitle">
        Importe a planilha de retorno bancário, acompanhe o processamento e
        visualize o relatório final.
      </p>

      <UploadPlanilha onSubmit={handleProcessar} loading={loading} />
       <KpiCards dashboard={resultado?.relatorios?.dashboard} />

      <ResultadoChart dashboard={resultado?.relatorios?.dashboard} />

      {erro && <div className="error">{erro}</div>}

      <DashboardResumo data={resultado} />

      <ResultadoTabela
        resultados={resultado?.processamento?.resultados || []}
      />
    </main>
  );
}
