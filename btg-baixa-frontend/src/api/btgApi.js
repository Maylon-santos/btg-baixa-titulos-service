import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 300000,
});

export async function processarPlanilha(file) {
  const formData = new FormData();

  formData.append('file', file);

  const response = await api.post('/planilha/processar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function listarProcessamentos() {
  const response = await api.get('/processamentos');

  return response.data.data;
}

export async function buscarProcessamento(processamentoId) {
  const response = await api.get(`/processamentos/${processamentoId}`);

  return response.data.data;
}

export async function buscarStatusProcessamento(processamentoId) {
  const response = await api.get(
    `/processamentos/${processamentoId}/status`
  );

  return response.data.data;
}

export function getDownloadUrl(processamentoId, tipo) {
  return `${
    import.meta.env.VITE_API_URL
  }/processamentos/${processamentoId}/download/${tipo}`;
}