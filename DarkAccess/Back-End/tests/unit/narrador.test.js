const request = require('supertest');
const express = require('express');
const narradorRouter = require('../../routes/narrador');

// Mock do banco de dados
jest.mock('../../db', () => ({
  query: jest.fn()
}));

const db = require('../../db');

describe('Narrador Routes - Unit Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/narrador', narradorRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/narrador/fala/:etapa', () => {
    it('deve retornar fala correta para etapa válida', async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          { fala: 'Bem-vindo ao DarkAccess', resposta_correta: null }
        ]
      });

      const response = await request(app)
        .get('/api/narrador/fala/inicio_primeiro_acesso')
        .query({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.fala.fala).toBe('Bem-vindo ao DarkAccess');
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        ['inicio_primeiro_acesso']
      );
    });

    it('deve retornar mensagem padrão quando etapa não existe', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/narrador/fala/etapa_inexistente')
        .query({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body.fala.fala).toContain('Nenhuma fala configurada');
    });

    it('deve tratar erro de banco de dados', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/narrador/fala/inicio')
        .query({ userId: 1 });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/narrador/resposta', () => {
    it('deve dar conquista quando resposta está correta', async () => {
      // Mock da query da fala
      db.query.mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'resposta123',
          conquista_codigo: null
        }]
      });

      // Mock da query de conquista
      db.query.mockResolvedValueOnce({
        rows: [{ id: 3 }]
      });

      // Mock da inserção de conquista
      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1',
          resposta: 'resposta123',
          usuario_id: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.correta).toBe(true);
      expect(response.body.mensagem).toBe('Resposta correta!');
    });

    it('deve remover vida quando resposta está errada', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'certa',
          conquista_codigo: null
        }]
      });

      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1',
          resposta: 'errada',
          usuario_id: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.correta).toBe(false);
      expect(response.body.mensagem).toContain('perdeu uma vida');
    });

    it('deve rejeitar requisição sem parâmetros obrigatórios', async () => {
      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({ etapa: 'lab01' });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/narrador/etapa', () => {
    it('deve atualizar etapa do usuário', async () => {
      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .put('/api/narrador/etapa')
        .send({
          usuario_id: 1,
          nova_etapa: 'lab01_intro'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE usuarios'),
        ['lab01_intro', 1]
      );
    });

    it('deve rejeitar sem usuario_id', async () => {
      const response = await request(app)
        .put('/api/narrador/etapa')
        .send({ nova_etapa: 'lab01' });

      expect(response.status).toBe(400);
    });
  });
});
