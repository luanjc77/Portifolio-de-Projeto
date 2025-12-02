const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const authRouter = require('../../routes/auth');
const db = require('../../db');

// Mock do módulo db
jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {

    it('deve registrar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        primeiro_acesso: true,
        etapa_atual: 'inicio_primeiro_acesso'
      };

      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe('testuser');
      expect(db.query).toHaveBeenCalled();
    });

    it('deve retornar erro 400 se campos estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
          // Faltando email e password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Campos incompletos.');
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

  });

  describe('POST /api/auth/login', () => {

    it('deve fazer login com sucesso usando email', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10),
        primeiro_acesso: false,
        etapa_atual: 'inicio_primeiro_acesso'
      };

      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      // Mock para o UPDATE
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe('testuser');
    });

    it('deve fazer login com sucesso usando username', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10),
        primeiro_acesso: true,
        etapa_atual: 'inicio_primeiro_acesso'
      };

      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar erro 400 se campos estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser'
          // Faltando password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Campos faltando.');
    });

    it('deve retornar erro 401 se usuário não for encontrado', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'inexistente@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar erro 401 se senha estiver incorreta', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password_hash: await bcrypt.hash('password123', 10),
        primeiro_acesso: true,
        etapa_atual: 'inicio_primeiro_acesso'
      };

      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'senhaerrada'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Senha incorreta.');
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

  });

  describe('GET /api/auth/user/:id', () => {

    it('deve retornar dados do usuário com conquistas', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        primeiro_acesso: false,
        etapa_atual: 'inicio_pos_primeiro_acesso',
        deepweb_access: false,
        vidas: 3
      };

      const mockConquistas = [
        { id: 1, nome: 'Primeira Conquista', codigo: 'FIRST' },
        { id: 2, nome: 'Segunda Conquista', codigo: 'SECOND' }
      ];

      // Mock para buscar usuário
      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      // Mock para buscar conquistas
      db.query.mockResolvedValueOnce({
        rows: mockConquistas
      });

      const response = await request(app)
        .get('/api/auth/user/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.conquistas).toHaveLength(2);
      expect(response.body.user.vidas).toBe(3);
    });

    it('deve retornar usuário sem conquistas se houver erro', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        primeiro_acesso: false,
        etapa_atual: 'inicio_pos_primeiro_acesso',
        deepweb_access: false,
        vidas: 3
      };

      // Mock para buscar usuário
      db.query.mockResolvedValueOnce({
        rows: [mockUser]
      });

      // Mock para erro ao buscar conquistas
      db.query.mockRejectedValueOnce(new Error('Conquistas error'));

      const response = await request(app)
        .get('/api/auth/user/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.conquistas).toEqual([]);
    });

    it('deve retornar erro 404 se usuário não existir', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/auth/user/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/auth/user/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

  });

  describe('GET /api/auth/ranking', () => {

    it('deve retornar ranking de usuários', async () => {
      const mockRanking = [
        { id: 1, username: 'user1', vidas: 100, total_conquistas: '5', dicas_usadas: '0' },
        { id: 2, username: 'user2', vidas: 95, total_conquistas: '3', dicas_usadas: '1' },
        { id: 3, username: 'user3', vidas: 90, total_conquistas: '2', dicas_usadas: '2' }
      ];

      db.query.mockResolvedValueOnce({
        rows: mockRanking
      });

      const response = await request(app)
        .get('/api/auth/ranking');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ranking).toHaveLength(3);
      expect(response.body.ranking[0].posicao).toBe(1);
      expect(response.body.ranking[0].username).toBe('user1');
      expect(response.body.ranking[0].vidas).toBe(100);
    });

    it('deve retornar ranking vazio se não houver usuários', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/auth/ranking');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ranking).toEqual([]);
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/auth/ranking');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

  });

});
