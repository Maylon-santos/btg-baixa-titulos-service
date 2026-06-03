export default function DashboardResumo({ data }) {
    if (!data) return null;
  
    const dashboard = data.relatorios?.dashboard;
    const planilha = data.planilha;
    const processamento = data.processamento?.resumo;
  
    return (
      <div className="dashboard">
        <div className="card">
          <span>Processamento</span>
          <strong>{data.processamentoId}</strong>
        </div>
  
        <div className="card">
          <span>Total Linhas</span>
          <strong>{planilha?.totalLinhas || 0}</strong>
        </div>
  
        <div className="card">
          <span>Franquias</span>
          <strong>{planilha?.totalFranquias || 0}</strong>
        </div>
  
        <div className="card">
          <span>Sucesso</span>
          <strong>{dashboard?.sucesso ?? processamento?.sucesso ?? 0}</strong>
        </div>
  
        <div className="card">
          <span>Já Baixados</span>
          <strong>{dashboard?.jaBaixados ?? processamento?.jaBaixados ?? 0}</strong>
        </div>
  
        <div className="card">
          <span>Erros</span>
          <strong>{dashboard?.erros ?? processamento?.erros ?? 0}</strong>
        </div>
      </div>
    );
  }