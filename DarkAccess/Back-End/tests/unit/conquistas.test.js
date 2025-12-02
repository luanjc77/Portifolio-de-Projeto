const request = require('supertest');
const express = require('express');
const conquistasRouter = require('../../routes/conquistas');
const db = require('../../db');

// Mock do módulo db
jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/conquistas', conquistasRouter);

describe('Conquistas Routes - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/conquistas/:id', () => {

    it('deve retornar conquistas do usuário', async () => {
      const mockConquistas = [
        { codigo: 'primeiro_acesso', nome: 'Primeiro Acesso' },
        { codigo: 'lab01_concluido', nome: 'Lab 01 Concluído' },
        { codigo: 'lab02_concluido', nome: 'Lab 02 Concluído' }
      ];

      db.query.mockResolvedValueOnce({
        rows: mockConquistas
      });

      const response = await request(app)
        .get('/api/conquistas/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.conquistas).toHaveLength(3);
      expect(response.body.conquistas[0].codigo).toBe('primeiro_acesso');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('deve retornar array vazio se usuário não tiver conquistas', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/conquistas/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.conquistas).toEqual([]);
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/conquistas/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    it('deve funcionar com diferentes IDs de usuário', async () => {
      const mockConquistas = [
        { codigo: 'conquista_especial', nome: 'Conquista Especial' }
      ];

      db.query.mockResolvedValueOnce({
        rows: mockConquistas
      });

      const response = await request(app)
        .get('/api/conquistas/999');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.conquistas).toHaveLength(1);
    });

  });

});
