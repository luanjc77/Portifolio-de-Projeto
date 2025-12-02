const request = require('supertest');
const express = require('express');
const { spawn } = require('child_process');
const dockerRouter = require('../../routes/docker');
const db = require('../../db');

// Mock do módulo db
jest.mock('../../db');

// Mock do child_process
jest.mock('child_process');

const app = express();
app.use(express.json());
app.use('/api/docker', dockerRouter);

describe('Docker Routes - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.USE_TRAEFIK = 'false';
    process.env.DOMAIN = 'localhost';
    process.env.NODE_ENV = 'test';
  });

  describe('POST /api/docker/start-lab', () => {

    it('deve retornar erro 400 se usuario_id estiver faltando', async () => {
      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          lab_id: 'lab01'
          // Faltando usuario_id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parâmetros inválidos');
    });

    it('deve retornar erro 400 se lab_id estiver faltando', async () => {
      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1
          // Faltando lab_id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parâmetros inválidos');
    });

    it('deve retornar erro 400 se ambos parâmetros estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parâmetros inválidos');
    });

    it('deve retornar erro 404 se lab não for encontrado', async () => {
      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab_inexistente'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Lab não encontrado');
    });

    it('deve reconhecer lab01 como válido', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // Sem container existente
      db.query.mockRejectedValueOnce(new Error('Stop test here'));

      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      expect(response.status).toBe(500);
      expect(db.query).toHaveBeenCalled();
    });

    it('deve reconhecer lab02 como válido', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // Sem container existente
      db.query.mockRejectedValueOnce(new Error('Stop test here'));

      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 2,
          lab_id: 'lab02'
        });

      expect(response.status).toBe(500);
      expect(db.query).toHaveBeenCalled();
    });

    it('deve verificar container existente no banco', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{
          container_name: 'xss-lab-user1-123',
          porta: 9001
        }]
      });

      // Mock spawn para checkContainerRunning retornar false
      const mockSpawn = {
        stdout: {
          on: jest.fn((event, handler) => {
            if (event === 'data') {
              // Retorna vazio = container não está rodando
              handler(Buffer.from(''));
            }
          })
        },
        stderr: { on: jest.fn() },
        on: jest.fn((event, handler) => {
          if (event === 'close') {
            setImmediate(() => handler(0));
          }
        })
      };

      spawn.mockReturnValue(mockSpawn);

      // Mock para DELETE do container órfão
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Mock para falhar depois (não criar novo)
      db.query.mockRejectedValueOnce(new Error('Stop here'));

      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      // Verificar que a query foi chamada (não importa quantas vezes exatamente)
      expect(db.query).toHaveBeenCalled();
      expect(response.status).toBe(500);
    });

    it('deve usar DOMAIN da variável de ambiente', async () => {
      process.env.DOMAIN = 'example.com';
      
      db.query.mockResolvedValueOnce({ rows: [] });
      db.query.mockRejectedValueOnce(new Error('Stop'));

      await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      expect(db.query).toHaveBeenCalled();
    });

  });

  describe('POST /api/docker/stop-lab', () => {

    it('deve retornar erro 400 se usuario_id estiver faltando', async () => {
      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({
          lab_id: 'lab01'
          // Faltando usuario_id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parâmetros inválidos');
    });

    it('deve retornar erro 400 se lab_id estiver faltando', async () => {
      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({
          usuario_id: 1
          // Faltando lab_id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Parâmetros inválidos');
    });

    it('deve retornar erro 400 se ambos parâmetros estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar sucesso mesmo sem container ativo', async () => {
      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Nenhum container ativo');
    });

    it('deve funcionar com diferentes usuarios', async () => {
      const response = await request(app)
        .post('/api/docker/stop-lab')
        .send({
          usuario_id: 999,
          lab_id: 'lab02'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve funcionar com diferentes labs', async () => {
      const response1 = await request(app)
        .post('/api/docker/stop-lab')
        .send({ usuario_id: 1, lab_id: 'lab01' });

      const response2 = await request(app)
        .post('/api/docker/stop-lab')
        .send({ usuario_id: 1, lab_id: 'lab02' });

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });

  });

  describe('GET /api/docker/labs-ativos/:usuario_id', () => {

    it('deve retornar labs ativos do usuário', async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            lab_id: 'lab01',
            container_name: 'xss-lab-user1-123',
            porta: 9001,
            created_at: new Date()
          }
        ]
      });

      const response = await request(app)
        .get('/api/docker/labs-ativos/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.labs).toHaveLength(1);
      expect(response.body.labs[0].lab_id).toBe('lab01');
    });

    it('deve retornar array vazio se usuário não tiver labs', async () => {
      db.query.mockResolvedValueOnce({
        rows: []
      });

      const response = await request(app)
        .get('/api/docker/labs-ativos/999');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.labs).toEqual([]);
    });

    it('deve retornar erro 500 em caso de falha no banco', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/docker/labs-ativos/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro ao listar labs');
    });

    it('deve funcionar com múltiplos labs', async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            lab_id: 'lab01',
            container_name: 'container1',
            porta: 9001,
            created_at: new Date()
          },
          {
            lab_id: 'lab02',
            container_name: 'container2',
            porta: 10000,
            created_at: new Date()
          }
        ]
      });

      const response = await request(app)
        .get('/api/docker/labs-ativos/1');

      expect(response.status).toBe(200);
      expect(response.body.labs).toHaveLength(2);
    });

    it('deve passar usuario_id como parâmetro', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await request(app)
        .get('/api/docker/labs-ativos/42');

      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        ['42']
      );
    });

  });

});
