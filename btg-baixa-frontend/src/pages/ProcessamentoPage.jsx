import { useState } from 'react';

import { processarPlanilha } from '../api/btgApi';
import UploadPlanilha from '../components/UploadPlanilha';
import DashboardResumo from '../components/DashboardResumo';
import ResultadoTabela from '../components/ResultadoTabela';

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
          'Erro ao processar planilha'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>BTG - Baixa de Títulos</h1>

      <UploadPlanilha onSubmit={handleProcessar} loading={loading} />

      {erro && <div className="error">{erro}</div>}

      <DashboardResumo data={resultado} />

      <ResultadoTabela
        resultados={resultado?.processamento?.resultados || []}
      />
    </main>
  );
}