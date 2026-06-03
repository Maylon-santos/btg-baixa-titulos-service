export default function ResultadoTabela({ resultados = [] }) {
    if (!resultados.length) return null;
  
    return (
      <div className="card">
        <h2>Resultado do Processamento</h2>
  
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Cliente</th>
                <th>Valor Título</th>
                <th>Valor Pago</th>
                <th>Status</th>
                <th>Erro</th>
              </tr>
            </thead>
  
            <tbody>
              {resultados.map((item, index) => (
                <tr key={index}>
                  <td>{item.numeroDocumento}</td>
                  <td>{item.cliente}</td>
                  <td>{item.valorTitulo}</td>
                  <td>{item.valorPago}</td>
                  <td>{item.status}</td>
                  <td>{item.erro || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }