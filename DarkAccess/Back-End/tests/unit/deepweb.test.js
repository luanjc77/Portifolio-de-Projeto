const request = require('supertest');
const express = require('express');
const deepwebRouter = require('../../routes/deepweb');
const db = require('../../db');

// Mock do módulo db
jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/deepweb', deepwebRouter);

// Salvar variáveis de ambiente originais
const originalEnv = {
  VPN_USER: process.env.VPN_USER,
  VPN_PASS: process.env.VPN_PASS,
  VPN_IP: process.env.VPN_IP
};

describe('DeepWeb Routes - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar variáveis de ambiente para os testes
    process.env.VPN_USER = 'darkadmin';
    process.env.VPN_PASS = 'darkpass123';
    process.env.VPN_IP = '192.168.1.100';
  });

  afterAll(() => {
    // Restaurar variáveis de ambiente originais
    process.env.VPN_USER = originalEnv.VPN_USER;
    process.env.VPN_PASS = originalEnv.VPN_PASS;
    process.env.VPN_IP = originalEnv.VPN_IP;
  });

  describe('POST /api/deepweb/access', () => {

    it('deve liberar acesso às profundezas com credenciais corretas', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/deepweb/access')
        .send({
          username: 'darkadmin',
          password: 'darkpass123',
          ip: '192.168.1.100',
          userId: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Acesso às Profundezas liberado!');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE usuarios SET deepweb_access'),
        [1]
      );
    });

    it('deve retornar erro 400 se campos estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/deepweb/access')
        .send({
          username: 'darkadmin',
          password: 'darkpass123'
          // Faltando ip e userId
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Campos faltando');
    });

    it('deve retornar erro 401 com username incorreto', async () => {
      const response = await request(app)
        .post('/api/deepweb/access')
        .send({
          username: 'wronguser',
          password: 'darkpass123',
          ip: '192.168.1.100',
          userId: 1
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciais inválidas.');
    });

    it('deve retornar erro 401 com password incorreta', async () => {
      const response = await request(app)
        .post('/api/deepweb/access')
        .send({
          username: 'darkadmin',
          password: 'wrongpass',
          ip: '192.168.1.100',
          userId: 1
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciais inválidas.');
    });

    it('deve retornar erro 401 com IP incorreto', async () => {
      const response = await request(app)
        .post('/api/deepweb/access')
        .send({
          username: 'darkadmin',
          password: 'darkpass123',
          ip: '10.0.0.1',
          userId: 1
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciais inválidas.');
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/deepweb/access')
        .send({
          username: 'darkadmin',
          password: 'darkpass123',
          ip: '192.168.1.100',
          userId: 1
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro no servidor.');
    });

    it('deve funcionar com diferentes userIds', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/deepweb/access')
        .send({
          username: 'darkadmin',
          password: 'darkpass123',
          ip: '192.168.1.100',
          userId: 999
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        [999]
      );
    });

  });

});
