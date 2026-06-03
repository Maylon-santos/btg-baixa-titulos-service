export default function ProcessingOverlay({ visible }) {
    if (!visible) return null;
  
    return (
      <div className="processing-overlay">
        <div className="processing-card">
          <div className="spinner" />
  
          <h2>Processando planilha...</h2>
  
          <p>
            Aguarde enquanto os títulos são consultados, atualizados e baixados no Millennium.
          </p>
  
          <div className="progress-bar">
            <div className="progress-bar-fill" />
          </div>
        </div>
      </div>
    );
  }