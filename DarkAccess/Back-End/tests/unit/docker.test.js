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
    it('deve iniciar lab01 com porta dinâmica', async () => {
      // Mock verificação de container existente no banco
      db.query.mockResolvedValueOnce({ 
        rows: [{ max_porta: null }] 
      });

      // Mock verificação de container no banco
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock criação de container
      const mockSpawn = {
        stdout: { 
          on: jest.fn((event, cb) => {
            if (event === 'data') {
              setTimeout(() => cb(Buffer.from('abc123container\n')), 10);
            }
          })
        },
        stderr: { on: jest.fn() },
        on: jest.fn((event, cb) => {
          if (event === 'close') {
            setTimeout(() => cb(0), 20);
          }
        })
      };
      
      spawn.mockReturnValue(mockSpawn);

      // Mock inserção no banco
      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.url).toContain('localhost');
      expect(response.body.port).toBeGreaterThanOrEqual(9000);
      expect(response.body.port).toBeLessThan(9100);
    });

    it('deve reusar container ativo existente', async () => {
      // Mock container existente no banco
      db.query.mockResolvedValueOnce({
        rows: [{
          container_name: 'xss-lab-user1-123',
          porta: 9005
        }]
      });

      // Mock verificação se está rodando
      const mockSpawn = {
        stdout: { on: jest.fn((event, cb) => {
          if (event === 'data') cb(Buffer.from('container-id'));
        })},
        on: jest.fn((event, cb) => {
          if (event === 'close') cb(0);
        })
      };
      
      spawn.mockReturnValueOnce(mockSpawn);

      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab01'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('já ativo');
      expect(response.body.port).toBe(9005);
    });

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

    it('deve iniciar lab02 com porta base 10000', async () => {
      // Mock findAvailablePort
      db.query.mockResolvedValueOnce({ 
        rows: [{ max_porta: null }] 
      });

      // Mock verificação container existente
      db.query.mockResolvedValueOnce({ rows: [] });

      const mockSpawn = {
        stdout: { 
          on: jest.fn((event, cb) => {
            if (event === 'data') {
              setTimeout(() => cb(Buffer.from('container123\n')), 10);
            }
          })
        },
        stderr: { on: jest.fn() },
        on: jest.fn((event, cb) => {
          if (event === 'close') {
            setTimeout(() => cb(0), 20);
          }
        })
      };
      
      spawn.mockReturnValue(mockSpawn);

      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/docker/start-lab')
        .send({
          usuario_id: 1,
          lab_id: 'lab02'
        });

      expect(response.status).toBe(200);
      expect(response.body.port).toBeGreaterThanOrEqual(10000);
      expect(response.body.port).toBeLessThan(10100);
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
    it('deve listar labs ativos do usuário', async () => {
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
    it('deve retornar array vazio se não há labs ativos', async () => {
      // Limpar containers ativos da memória primeiro
      const dockerRouter = require('../../routes/docker');
      
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/docker/labs-ativos/999');

      expect(response.status).toBe(200);
      expect(response.body.labs).toEqual([]);
    });

    it('deve tratar erro de banco', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .get('/api/docker/labs-ativos/888');

      expect(response.status).toBe(500);
    });'deve tratar erro de banco', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .get('/api/docker/labs-ativos/1');

      expect(response.status).toBe(500);
    });
  });
});
