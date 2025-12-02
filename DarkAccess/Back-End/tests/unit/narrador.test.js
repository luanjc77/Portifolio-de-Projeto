const request = require('supertest');
const express = require('express');
const narradorRouter = require('../../routes/narrador');
const db = require('../../db');

// Mock do módulo db
jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/narrador', narradorRouter);

describe('Narrador Routes - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/narrador/fala/:etapa', () => {

    it('deve retornar fala para uma etapa válida', async () => {
      const mockFala = [
        {
          fala: 'Bem-vindo ao DarkAccess',
          resposta_correta: null,
          tela_permitida: null
        }
      ];

      db.query.mockResolvedValueOnce({
        rows: mockFala
      });

      const response = await request(app)
        .get('/api/narrador/fala/inicio_primeiro_acesso')
        .query({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.fala.fala).toBe('Bem-vindo ao DarkAccess');
      expect(response.body.fala.etapa).toBe('inicio_primeiro_acesso');
    });

    it('deve retornar fala para tela específica', async () => {
      const mockFala = [
        {
          fala: 'Fala para HomePage',
          resposta_correta: null,
          tela_permitida: 'HomePage'
        }
      ];

      db.query.mockResolvedValueOnce({
        rows: mockFala
      });

      const response = await request(app)
        .get('/api/narrador/fala/lab01_intro')
        .query({ userId: 1, tela: 'HomePage' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.fala.fala).toBe('Fala para HomePage');
    });

    it('deve concatenar múltiplas falas', async () => {
      const mockFalas = [
        { fala: 'Primeira parte', resposta_correta: null, tela_permitida: null },
        { fala: 'Segunda parte', resposta_correta: null, tela_permitida: null }
      ];

      db.query.mockResolvedValueOnce({
        rows: mockFalas
      });

      const response = await request(app)
        .get('/api/narrador/fala/inicio_primeiro_acesso');

      expect(response.status).toBe(200);
      expect(response.body.fala.fala).toContain('Primeira parte');
      expect(response.body.fala.fala).toContain('Segunda parte');
    });

    it('deve filtrar valores null/undefined', async () => {
      const mockFalas = [
        { fala: 'Fala válida', resposta_correta: null, tela_permitida: null },
        { fala: null, resposta_correta: null, tela_permitida: null },
        { fala: 'null', resposta_correta: null, tela_permitida: null }
      ];

      db.query.mockResolvedValueOnce({
        rows: mockFalas
      });

      const response = await request(app)
        .get('/api/narrador/fala/test');

      expect(response.status).toBe(200);
      expect(response.body.fala.fala).toBe('Fala válida');
    });

    it('deve retornar mensagem quando nenhuma fala for encontrada', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/narrador/fala/etapa_inexistente');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.fala.fala).toBe('Nenhuma fala configurada para esta etapa.');
    });

    it('deve retornar erro quando tela não for permitida', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/narrador/fala/lab01_intro')
        .query({ tela: 'TelaInvalida' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/narrador/fala/test');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

  });

  describe('POST /api/narrador/resposta', () => {

    it('deve processar resposta correta e dar conquista', async () => {
      // Mock para buscar fala
      db.query.mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'resposta_certa',
          conquista_codigo: 'lab01_concluido'
        }]
      });

      // Mock para buscar conquista
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1 }]
      });

      // Mock para inserir conquista
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock para update da etapa
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock para buscar vidas
      db.query.mockResolvedValueOnce({
        rows: [{ vidas: 100 }]
      });

      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1',
          resposta: 'resposta_certa',
          usuario_id: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.correta).toBe(true);
      expect(response.body.nova_etapa).toBe('lab02_intro');
    });

    it('deve processar resposta incorreta e reduzir vida', async () => {
      // Mock para buscar fala
      db.query.mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'resposta_certa',
          conquista_codigo: null
        }]
      });

      // Mock para update de vida
      db.query.mockResolvedValueOnce({
        rows: [{ vidas: 90 }]
      });

      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1',
          resposta: 'resposta_errada',
          usuario_id: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.correta).toBe(false);
      expect(response.body.mensagem).toContain('incorreta');
      expect(response.body.vidas).toBe(90);
    });

    it('deve retornar erro 400 se parâmetros estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1'
          // Faltando resposta e usuario_id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parâmetros inválidos');
    });

    it('deve retornar erro 404 se etapa não for encontrada', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'etapa_inexistente',
          resposta: 'teste',
          usuario_id: 1
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Etapa não encontrada.');
    });

    it('deve processar lab02 corretamente', async () => {
      // Mock para buscar fala
      db.query.mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'resposta_lab2',
          conquista_codigo: null
        }]
      });

      // Mock para buscar conquista lab02
      db.query.mockResolvedValueOnce({
        rows: [{ id: 2 }]
      });

      // Mock para inserir conquista
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock para update da etapa
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock para buscar vidas
      db.query.mockResolvedValueOnce({
        rows: [{ vidas: 95 }]
      });

      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab02_pergunta1',
          resposta: 'resposta_lab2',
          usuario_id: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.correta).toBe(true);
      expect(response.body.nova_etapa).toBe('antes_acesso_profundezas');
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1',
          resposta: 'teste',
          usuario_id: 1
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

  });

  describe('GET /api/narrador/dica/:etapa', () => {

    it('deve retornar dica para etapa válida', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ dica: 'Esta é uma dica útil' }]
      });

      db.query.mockResolvedValueOnce({ rows: [] }); // Update dicas_usadas

      const response = await request(app)
        .get('/api/narrador/dica/lab01_intro')
        .query({ usuario_id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.dica).toBe('Esta é uma dica útil');
      expect(db.query).toHaveBeenCalledTimes(2); // Select + Update
    });

    it('deve retornar mensagem se dica não existir', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/narrador/dica/etapa_sem_dica');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.dica).toBe('Nenhuma dica disponível.');
    });

    it('deve não incrementar dicas_usadas se usuario_id não for fornecido', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ dica: 'Dica teste' }]
      });

      const response = await request(app)
        .get('/api/narrador/dica/lab01_intro');

      expect(response.status).toBe(200);
      expect(db.query).toHaveBeenCalledTimes(1); // Apenas o SELECT
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/narrador/dica/lab01_intro');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.dica).toBe('Erro no servidor.');
    });

  });

  describe('PUT /api/narrador/etapa', () => {

    it('deve atualizar etapa do usuário', async () => {
      // Mock para verificar etapa anterior
      db.query.mockResolvedValueOnce({
        rows: [{
          etapa_atual: 'lab01_intro',
          primeiro_acesso: false
        }]
      });

      // Mock para update de etapa
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/narrador/etapa')
        .send({
          usuario_id: 1,
          nova_etapa: 'lab01_concluido'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Etapa atualizada com sucesso.');
    });

    it('deve desbloquear conquista primeiro_acesso', async () => {
      // Mock para verificar etapa anterior
      db.query.mockResolvedValueOnce({
        rows: [{
          etapa_atual: 'inicio_primeiro_acesso',
          primeiro_acesso: true
        }]
      });

      // Mock para update de etapa
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock para buscar conquista
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1 }]
      });

      // Mock para inserir conquista
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/narrador/etapa')
        .send({
          usuario_id: 1,
          nova_etapa: 'lab01_intro'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(db.query).toHaveBeenCalledTimes(4); // Check + Update + Select conquista + Insert
    });

    it('deve retornar erro 400 se parâmetros estiverem faltando', async () => {
      const response = await request(app)
        .put('/api/narrador/etapa')
        .send({
          usuario_id: 1
          // Faltando nova_etapa
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parâmetros inválidos');
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .put('/api/narrador/etapa')
        .send({
          usuario_id: 1,
          nova_etapa: 'lab01_concluido'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

  });

});
