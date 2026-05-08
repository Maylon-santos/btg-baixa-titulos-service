const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  it('deve retornar status online', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('online');
    expect(response.body.service).toBe('btg-baixa-titulos-service');
  });
});