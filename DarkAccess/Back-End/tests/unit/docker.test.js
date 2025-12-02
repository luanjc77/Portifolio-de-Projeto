const request = require('supertest');
const express = require('express');
const dockerRouter = require('../../routes/docker');
const { spawn } = require('child_process');

jest.mock('../../db');
jest.mock('child_process');

const db = require('../../db');

describe('Docker Routes - Unit Tests (75% backend coverage)', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/docker', dockerRouter);
    jest.clearAllMocks();
    
    process.env.DOMAIN = 'localhost';
    process.env.USE_TRAEFIK = 'false';
  });

  describe('POST /api/docker/start-lab', () => {
    // Nota: Testes de criação real de container são complexos e requerem Docker rodando
    // Estes testes focam em validações e erros

    it('deve rejeitar requisição sem parâmetros', async () => {
      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve rejeitar lab_id inválido', async () => {
      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab99_inexistente'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('não encontrado');
    });


  });

  describe('POST /api/docker/stop-lab', () => {
    it('deve parar container ativo', async () => {
      // Mock para simular parada de container
      const mockSpawn = {
        on: jest.fn((event, cb) => {
          if (event === 'close') cb(0);
        })
      };
      
      spawn.mockReturnValueOnce(mockSpawn);

      // Mock deleção do banco
      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar sucesso mesmo sem container ativo', async () => {
      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Nenhum container');
    });

    it('deve rejeitar sem parâmetros', async () => {
      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/docker/labs-ativos/:usuario_id', () => {
    it('deve retornar labs ativos do usuário do banco', async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            lab_id: 'lab01',
            container_name: 'xss-lab-user1-123',
            porta: 9000,
            created_at: new Date()
          }
        ]
      });

      const response = await request(app)
        .get('/api/docker/labs-ativos/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.labs)).toBe(true);
    });

    it('deve retornar array vazio se não há labs ativos', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/docker/labs-ativos/999');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.labs)).toBe(true);
    });
  });
});
