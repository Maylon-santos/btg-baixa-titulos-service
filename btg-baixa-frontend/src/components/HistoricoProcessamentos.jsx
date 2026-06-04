import { getDownloadUrl } from '../api/btgApi';

export default function HistoricoProcessamentos({
  historico = [],
  onSelecionar,
}) {
  if (!historico.length) {
    return null;
  }

  return (
    <div className="card">
      <h2>Histórico de Processamentos</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Processamento</th>
              <th>Total</th>
              <th>Sucesso</th>
              <th>Já Baixados</th>
              <th>Erros</th>
              <th>Franquias</th>
              <th>Relatórios</th>
            </tr>
          </thead>

          <tbody>
            {historico.map((item) => {
              const dashboard = item.dashboard || {};

              return (
                <tr key={item.processamentoId}>
                  <td>
                    <button
                      className="btn btn-sm"
                      type="button"
                      onClick={() => onSelecionar(item.processamentoId)}
                    >
                      {item.processamentoId}
                    </button>
                  </td>

                  <td>{dashboard.totalTitulosProcessaveis || 0}</td>

                  <td className="status-success">
                    {dashboard.sucesso || 0}
                  </td>

                  <td className="status-warning">
                    {dashboard.jaBaixados || 0}
                  </td>

                  <td className="status-error">
                    {dashboard.erros || 0}
                  </td>

                  <td>{dashboard.totalFranquias || 0}</td>

                  <td>
                    <div className="file-actions">
                      <a
                        className="btn btn-sm"
                        href={getDownloadUrl(
                          item.processamentoId,
                          'sucesso'
                        )}
                      >
                        Sucesso
                      </a>

                      <a
                        className="btn btn-sm"
                        href={getDownloadUrl(
                          item.processamentoId,
                          'erros'
                        )}
                      >
                        Erros
                      </a>

                      <a
                        className="btn btn-sm"
                        href={getDownloadUrl(
                          item.processamentoId,
                          'jaBaixados'
                        )}
                      >
                        Já Baixados
                      </a>

                      <a
                        className="btn btn-sm"
                        href={getDownloadUrl(
                          item.processamentoId,
                          'franquias'
                        )}
                      >
                        Franquias
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}