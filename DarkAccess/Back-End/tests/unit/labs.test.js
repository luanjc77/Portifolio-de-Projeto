const request = require('supertest');
const express = require('express');
const labsRouter = require('../../routes/labs');

const app = express();
app.use(express.json());
app.use('/api/labs', labsRouter);

// Salvar variável de ambiente original
const originalEnv = process.env.VM_PUBLIC_IP;

describe('Labs Routes - Unit Tests', () => {

  beforeEach(() => {
    // Resetar variável de ambiente para cada teste
    process.env.VM_PUBLIC_IP = 'localhost';
  });

  afterAll(() => {
    // Restaurar variável de ambiente original
    process.env.VM_PUBLIC_IP = originalEnv;
  });

  describe('POST /api/labs/start', () => {

    it('deve iniciar lab XSS com sucesso', async () => {
      const response = await request(app)
        .post('/api/labs/start')
        .send({
          challengeId: 'xss'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sessionId).toBe('fixed');
      expect(response.body.url).toContain('8080');
    });

    it('deve iniciar lab SO com sucesso', async () => {
      const response = await request(app)
        .post('/api/labs/start')
        .send({
          challengeId: 'so'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sessionId).toBe('fixed');
      expect(response.body.url).toContain('8081');
    });

    it('deve usar IP da variável de ambiente VM_PUBLIC_IP', async () => {
      process.env.VM_PUBLIC_IP = '34.132.60.57';

      const response = await request(app)
        .post('/api/labs/start')
        .send({
          challengeId: 'xss'
        });

      expect(response.status).toBe(200);
      expect(response.body.url).toContain('34.132.60.57');
    });

    it('deve usar localhost quando VM_PUBLIC_IP não estiver definido', async () => {
      delete process.env.VM_PUBLIC_IP;

      const response = await request(app)
        .post('/api/labs/start')
        .send({
          challengeId: 'xss'
        });

      expect(response.status).toBe(200);
      expect(response.body.url).toContain('localhost');
    });

    it('deve retornar erro 400 para challengeId inválido', async () => {
      const response = await request(app)
        .post('/api/labs/start')
        .send({
          challengeId: 'invalido'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Lab não encontrado.');
    });

    it('deve retornar erro 400 para challengeId vazio', async () => {
      const response = await request(app)
        .post('/api/labs/start')
        .send({
          challengeId: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro 400 quando challengeId não for enviado', async () => {
      const response = await request(app)
        .post('/api/labs/start')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

  });

  describe('POST /api/labs/stop', () => {

    it('deve parar lab com sucesso', async () => {
      const response = await request(app)
        .post('/api/labs/stop')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Ambiente encerrado.');
    });

    it('deve sempre retornar sucesso mesmo sem parâmetros', async () => {
      const response = await request(app)
        .post('/api/labs/stop');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

  });

});
