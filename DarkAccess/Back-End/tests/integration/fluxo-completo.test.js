const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const authRouter = require('../../routes/auth');
const narradorRouter = require('../../routes/narrador');
const conquistasRouter = require('../../routes/conquistas');
const db = require('../../db');

// Mock do módulo db
jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/narrador', narradorRouter);
app.use('/api/conquistas', conquistasRouter);

describe('Integration Tests - Fluxo Completo', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fluxo de Registro e Login', () => {

    it('deve registrar usuário e fazer login em seguida', async () => {
      const mockUser = {
        id: 1,
        username: 'novouser',
        primeiro_acesso: true,
        etapa_atual: 'inicio_primeiro_acesso'
      };

      // Mock para registro
      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      // Registro
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'novouser',
          email: 'novo@example.com',
          password: 'senha123'
        });

      expect(registerResponse.status).toBe(200);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.user.username).toBe('novouser');

      // Preparar mock para login
      const userWithHash = {
        ...mockUser,
        email: 'novo@example.com',
        password_hash: await bcrypt.hash('senha123', 10)
      };

      db.query.mockResolvedValueOnce({
        rows: [userWithHash]
      });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'novouser',
          password: 'senha123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.user.username).toBe('novouser');
    });

  });

  describe('Fluxo de Jogo Completo', () => {

    it.skip('deve completar fluxo: login → fala inicial → atualizar etapa → buscar conquistas', async () => {
      const userId = 1;

      // 1. Login
      const mockUser = {
        id: userId,
        username: 'jogador',
        email: 'jogador@example.com',
        password_hash: await bcrypt.hash('senha123', 10),
        primeiro_acesso: false,
        etapa_atual: 'inicio_pos_primeiro_acesso'
      };

      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      db.query.mockResolvedValueOnce({ rows: [] }); // Update etapa

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'jogador',
          password: 'senha123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);

      // 2. Buscar fala inicial
      db.query.mockResolvedValueOnce({
        rows: [{
          fala: 'Bem-vindo de volta!',
          resposta_correta: null,
          tela_permitida: null
        }]
      });

      const falaResponse = await request(app)
        .get('/api/narrador/fala/inicio_pos_primeiro_acesso')
        .query({ userId });

      expect(falaResponse.status).toBe(200);
      expect(falaResponse.body.success).toBe(true);
      expect(falaResponse.body.fala.fala).toContain('Bem-vindo');

      // 3. Atualizar etapa
      db.query.mockResolvedValueOnce({
        rows: [{
          etapa_atual: 'inicio_pos_primeiro_acesso',
          primeiro_acesso: false
        }]
      });

      db.query.mockResolvedValueOnce({ rows: [] }); // Update

      const updateEtapaResponse = await request(app)
        .put('/api/narrador/etapa')
        .send({
          usuario_id: userId,
          nova_etapa: 'lab01_intro'
        });

      expect(updateEtapaResponse.status).toBe(200);
      expect(updateEtapaResponse.body.success).toBe(true);

      // 4. Buscar conquistas
      db.query.mockResolvedValueOnce({
        rows: [
          { codigo: 'primeiro_acesso', nome: 'Primeiro Acesso' }
        ]
      });

      const conquistasResponse = await request(app)
        .get(`/api/conquistas/${userId}`);

      expect(conquistasResponse.status).toBe(200);
      expect(conquistasResponse.body.success).toBe(true);
      expect(conquistasResponse.body.conquistas).toHaveLength(1);
    });

  });

  describe('Fluxo de Lab e Respostas', () => {

    it('deve completar lab: buscar fala → responder corretamente → ganhar conquista', async () => {
      const userId = 1;

      // 1. Buscar fala do lab
      db.query.mockResolvedValueOnce({
        rows: [{
          fala: 'Encontre a vulnerabilidade XSS',
          resposta_correta: 'alert',
          tela_permitida: null
        }]
      });

      const falaResponse = await request(app)
        .get('/api/narrador/fala/lab01_pergunta1')
        .query({ userId });

      expect(falaResponse.status).toBe(200);
      expect(falaResponse.body.success).toBe(true);

      // 2. Responder corretamente
      db.query.mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'alert',
          conquista_codigo: 'lab01_concluido'
        }]
      });

      db.query.mockResolvedValueOnce({
        rows: [{ id: 1 }] // Conquista
      });

      db.query.mockResolvedValueOnce({ rows: [] }); // Insert conquista
      db.query.mockResolvedValueOnce({ rows: [] }); // Update etapa

      db.query.mockResolvedValueOnce({
        rows: [{ vidas: 100 }]
      });

      const respostaResponse = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1',
          resposta: 'alert',
          usuario_id: userId
        });

      expect(respostaResponse.status).toBe(200);
      expect(respostaResponse.body.success).toBe(true);
      expect(respostaResponse.body.correta).toBe(true);
      expect(respostaResponse.body.nova_etapa).toBe('lab02_intro');
    });

    it.skip('deve penalizar resposta errada', async () => {
      const userId = 1;

      // Responder incorretamente
      db.query.mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'resposta_certa',
          conquista_codigo: null
        }]
      });

      db.query.mockResolvedValueOnce({
        rows: [{ vidas: 90 }] // Perdeu 10 vidas
      });

      const respostaResponse = await request(app)
        .post('/api/narrador/resposta')
        .send({
          etapa: 'lab01_pergunta1',
          resposta: 'resposta_errada',
          usuario_id: userId
        });

      expect(respostaResponse.status).toBe(200);
      expect(respostaResponse.body.success).toBe(true);
      expect(respostaResponse.body.correta).toBe(false);
      expect(respostaResponse.body.vidas).toBe(90);
      expect(respostaResponse.body.mensagem).toContain('incorreta');
    });

  });

  describe('Fluxo de Ranking', () => {

    it.skip('deve buscar dados do usuário e ranking', async () => {
      const userId = 1;

      // 1. Buscar dados do usuário
      db.query.mockResolvedValueOnce({
        rows: [{
          id: userId,
          username: 'topplayer',
          email: 'top@example.com',
          primeiro_acesso: false,
          etapa_atual: 'lab02_concluido',
          deepweb_access: true,
          vidas: 95
        }]
      });

      db.query.mockResolvedValueOnce({
        rows: [
          { id: 1, nome: 'Lab 01', codigo: 'lab01_concluido' },
          { id: 2, nome: 'Lab 02', codigo: 'lab02_concluido' }
        ]
      });

      const userResponse = await request(app)
        .get(`/api/auth/user/${userId}`);

      expect(userResponse.status).toBe(200);
      expect(userResponse.body.success).toBe(true);
      expect(userResponse.body.user.conquistas).toHaveLength(2);

      // 2. Buscar ranking
      db.query.mockResolvedValueOnce({
        rows: [
          { id: 1, username: 'topplayer', vidas: 95, total_conquistas: '2', dicas_usadas: '0' },
          { id: 2, username: 'player2', vidas: 80, total_conquistas: '1', dicas_usadas: '1' }
        ]
      });

      const rankingResponse = await request(app)
        .get('/api/auth/ranking');

      expect(rankingResponse.status).toBe(200);
      expect(rankingResponse.body.success).toBe(true);
      expect(rankingResponse.body.ranking).toHaveLength(2);
      expect(rankingResponse.body.ranking[0].username).toBe('topplayer');
      expect(rankingResponse.body.ranking[0].posicao).toBe(1);
    });

  });

  describe('Fluxo de Dicas', () => {

    it.skip('deve buscar dica e incrementar contador', async () => {
      const userId = 1;

      db.query.mockResolvedValueOnce({
        rows: [{ dica: 'Procure por tags HTML' }]
      });

      db.query.mockResolvedValueOnce({ rows: [] }); // Update dicas_usadas

      const dicaResponse = await request(app)
        .get('/api/narrador/dica/lab01_intro')
        .query({ usuario_id: userId });

      expect(dicaResponse.status).toBe(200);
      expect(dicaResponse.body.success).toBe(true);
      expect(dicaResponse.body.dica).toContain('tags HTML');
      expect(db.query).toHaveBeenCalledTimes(2);
    });

  });

  describe('Fluxo de Primeiro Acesso', () => {

    it.skip('deve desbloquear conquista de primeiro acesso ao avançar etapa', async () => {
      const userId = 1;

      // Verificar etapa
      db.query.mockResolvedValueOnce({
        rows: [{
          etapa_atual: 'inicio_primeiro_acesso',
          primeiro_acesso: true
        }]
      });

      // Update etapa
      db.query.mockResolvedValueOnce({ rows: [] });

      // Buscar conquista
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1 }]
      });

      // Inserir conquista
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/narrador/etapa')
        .send({
          usuario_id: userId,
          nova_etapa: 'lab01_intro'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(db.query).toHaveBeenCalledTimes(4);
    });

  });

});
