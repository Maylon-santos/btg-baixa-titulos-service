import { PieChart, Pie, Tooltip } from "recharts";

const COLORS = {
  Sucesso: "#22c55e",
  "Já Baixados": "#f59e0b",
  Erros: "#ef4444",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="chart-tooltip">
      <strong>{item.name}</strong>
      <span>{item.value}</span>
    </div>
  );
}

export default function ResultadoChart({ dashboard }) {
  if (!dashboard) return null;

  const data = [
    {
      name: "Sucesso",
      value: Number(dashboard.sucesso || 0),
      fill: COLORS.Sucesso,
    },
    {
      name: "Já Baixados",
      value: Number(dashboard.jaBaixados || 0),
      fill: COLORS["Já Baixados"],
    },
    {
      name: "Erros",
      value: Number(dashboard.erros || 0),
      fill: COLORS.Erros,
    },
  ].filter((item) => item.value > 0);

  if (!data.length) return null;

  return (
    <div className="card chart-card">
      <h2>Resultado do Processamento</h2>

      <div className="chart-fixed-wrapper">
        <PieChart width={520} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={105}
            label={false}
            labelLine={false}
            isAnimationActive={false}
          />

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </div>

      <div className="chart-legend">
        {data.map((item) => (
          <div key={item.name} className="chart-legend-item">
            <span
              className="chart-legend-dot"
              style={{ background: item.fill }}
            />
            <span>{item.name}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}