export default function KpiCards({ dashboard }) {
    if (!dashboard) return null;
  
    const taxaSucesso =
      dashboard.totalTitulosProcessaveis > 0
        ? (
            (dashboard.sucesso /
              dashboard.totalTitulosProcessaveis) *
            100
          ).toFixed(2)
        : '0.00';
  
    const cards = [
      {
        label: 'Processáveis',
        value: dashboard.totalTitulosProcessaveis || 0,
        color: '#60a5fa',
      },
      {
        label: 'Sucesso',
        value: dashboard.sucesso || 0,
        color: '#22c55e',
      },
      {
        label: 'Já Baixados',
        value: dashboard.jaBaixados || 0,
        color: '#f59e0b',
      },
      {
        label: 'Erros',
        value: dashboard.erros || 0,
        color: '#ef4444',
      },
      {
        label: 'Franquias',
        value: dashboard.totalFranquias || 0,
        color: '#8b5cf6',
      },
      {
        label: 'Taxa Sucesso',
        value: `${taxaSucesso}%`,
        color: '#06b6d4',
      },
    ];
  
    return (
      <div className="kpi-grid">
        {cards.map((card) => (
          <div
            key={card.label}
            className="kpi-card"
            style={{
              borderLeft: `4px solid ${card.color}`,
            }}
          >
            <span>{card.label}</span>
  
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>
    );
  }