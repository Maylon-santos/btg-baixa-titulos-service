import { useState } from 'react';

export default function UploadPlanilha({ onSubmit, loading }) {
  const [file, setFile] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      alert('Selecione uma planilha.');
      return;
    }

    onSubmit(file);
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Importar Planilha BTG</h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Processando...' : 'Enviar e Processar'}
      </button>
    </form>
  );
}