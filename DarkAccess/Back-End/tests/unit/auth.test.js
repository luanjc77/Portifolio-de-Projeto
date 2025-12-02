const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const authRouter = require('../../routes/auth');

jest.mock('../../db');
jest.mock('bcrypt');

const db = require('../../db');

describe('Auth Routes - Unit Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/auth/user/:id', () => {
    it('deve retornar usuário com conquistas', async () => {
      db.query
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            username: 'testuser',
            email: 'test@test.com',
            etapa_atual: 'inicio',
            primeiro_acesso: true
          }]
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 3, nome: 'Lab01 Completo', codigo: 'lab01_concluido' }
          ]
        });

      const response = await request(app).get('/api/auth/user/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.conquistas).toHaveLength(1);
    });

    it('deve retornar 404 para usuário inexistente', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/api/auth/user/999');

      expect(response.status).toBe(404);
    });

    it('deve retornar array vazio se usuário não tem conquistas', async () => {
      db.query
        .mockResolvedValueOnce({
          rows: [{ id: 1, username: 'user' }]
        })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/api/auth/user/1');

      expect(response.body.user.conquistas).toEqual([]);
    });
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar novo usuário com sucesso', async () => {
      bcrypt.hash.mockResolvedValueOnce('hashedpassword');
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, username: 'newuser' }]
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'new@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('deve rejeitar registro com campos faltando', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(() => {
      bcrypt.compare.mockReset();
    });

    it('deve fazer login com credenciais válidas', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          username: 'testuser',
          password_hash: 'hashedpass',
          primeiro_acesso: false
        }]
      }).mockResolvedValueOnce({});

      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'correctpass'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe('testuser');
    });

    it('deve rejeitar senha incorreta', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ 
          id: 1,
          username: 'testuser',
          password_hash: 'hashedpass',
          primeiro_acesso: false,
          etapa_atual: 'lab01_intro'
        }]
      });

      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'wrongpass'
        });

      expect(response.status).toBe(401);
    });

    it('deve rejeitar usuário inexistente', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'ghost',
          password: 'pass'
        });

      expect(response.status).toBe(401);
    });
  });
});
