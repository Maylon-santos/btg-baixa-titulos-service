import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = {
  Sucesso: '#22c55e',
  'Já Baixados': '#f59e0b',
  Erros: '#ef4444',
};

export default function ResultadoChart({ dashboard }) {
  if (!dashboard) return null;

  const data = [
    { name: 'Sucesso', value: dashboard.sucesso || 0 },
    { name: 'Já Baixados', value: dashboard.jaBaixados || 0 },
    { name: 'Erros', value: dashboard.erros || 0 },
  ].filter((item) => Number(item.value) > 0);

  if (!data.length) return null;

  return (
    <div className="card chart-card">
      <h2>Resultado do Processamento</h2>

      <div className="chart-fixed-wrapper">
        <PieChart width={520} height={340}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={110}
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}