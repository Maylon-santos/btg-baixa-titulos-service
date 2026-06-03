import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
  export default function ResultadoChart({ dashboard }) {
    if (!dashboard) return null;
  
    const data = [
      {
        name: 'Sucesso',
        value: dashboard.sucesso || 0,
      },
      {
        name: 'Já Baixados',
        value: dashboard.jaBaixados || 0,
      },
      {
        name: 'Erros',
        value: dashboard.erros || 0,
      },
    ];
  
    const COLORS = [
      '#22c55e',
      '#f59e0b',
      '#ef4444',
    ];
  
    return (
      <div className="card">
        <h2>Resultado do Processamento</h2>
  
        <div style={{ height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={120}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>
  
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }