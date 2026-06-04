export default function ProgressStatus({ status }) {
    if (!status) return null;
  
    return (
      <div className="card progress-status-card">
        <div className="progress-status-head">
          <div>
            <h2>Progresso do Processamento</h2>
            <p>{status.mensagem || 'Aguardando atualização...'}</p>
          </div>
  
          <span className={`tag status-tag-${status.status?.toLowerCase()}`}>
            {status.status}
          </span>
        </div>
  
        <div className="progress-line">
          <div
            className="progress-line-fill"
            style={{ width: `${status.percentual || 0}%` }}
          />
        </div>
  
        <div className="progress-percent">
          {status.percentual || 0}% concluído
        </div>
  
        <div className="progress-grid">
          <div>
            <span>Total</span>
            <strong>{status.total || 0}</strong>
          </div>
  
          <div>
            <span>Processados</span>
            <strong>{status.processados || 0}</strong>
          </div>
  
          <div>
            <span>Sucesso</span>
            <strong className="status-success">{status.sucesso || 0}</strong>
          </div>
  
          <div>
            <span>Já Baixados</span>
            <strong className="status-warning">
              {status.jaBaixados || 0}
            </strong>
          </div>
  
          <div>
            <span>Erros</span>
            <strong className="status-error">{status.erros || 0}</strong>
          </div>
  
          <div>
            <span>Etapa</span>
            <strong>{status.etapa || '-'}</strong>
          </div>
        </div>
      </div>
    );
  }