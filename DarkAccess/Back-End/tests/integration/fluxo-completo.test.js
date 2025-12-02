const request = require('supertest');
const express = require('express');
const authRouter = require('../../routes/auth');
const narradorRouter = require('../../routes/narrador');

jest.mock('../../db');
jest.mock('bcrypt');

const db = require('../../db');
const bcrypt = require('bcrypt');

describe('Fluxo Completo - Integration Tests', () => {
  let app;
  let userId;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    app.use('/api/narrador', narradorRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    userId = Math.floor(Math.random() * 1000);
  });

  it('deve completar fluxo: registro → login → progressão → conquista', async () => {
    // 1. REGISTRO
    bcrypt.hash.mockResolvedValueOnce('hashed_password');
    db.query.mockResolvedValueOnce({
      rows: [{ 
        id: userId, 
        username: 'integrationtest',
        etapa_atual: 'inicio_primeiro_acesso'
      }]
    });

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'integrationtest',
        email: 'integration@test.com',
        password: 'testpass123'
      });

    expect(registerRes.status).toBe(200);
    expect(registerRes.body.success).toBe(true);

    // 2. LOGIN
    db.query.mockResolvedValueOnce({
      rows: [{
        id: userId,
        username: 'integrationtest',
        password_hash: 'hashed_password',
        primeiro_acesso: true,
        etapa_atual: 'inicio_primeiro_acesso'
      }]
    });

    bcrypt.compare.mockResolvedValueOnce(true);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'integrationtest',
        password: 'testpass123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.user.etapa_atual).toBe('inicio_primeiro_acesso');

    // 3. BUSCAR PRIMEIRA FALA
    db.query.mockResolvedValueOnce({
      rows: [{ fala: 'Bem-vindo ao início' }]
    });

    const falaRes = await request(app)
      .get('/api/narrador/fala/inicio_primeiro_acesso')
      .query({ userId });

    expect(falaRes.status).toBe(200);
    expect(falaRes.body.fala.fala).toContain('Bem-vindo');

    // 4. ATUALIZAR ETAPA (AVANÇAR)
    // Mock da query de busca de usuário
    db.query.mockResolvedValueOnce({
      rows: [{ id: userId, etapa_atual: 'inicio_primeiro_acesso', primeiro_acesso: true }]
    });

    // Mock do UPDATE
    db.query.mockResolvedValueOnce({
      rows: [{ etapa_atual: 'lab01_intro' }]
    });

    const etapaRes = await request(app)
      .put('/api/narrador/etapa')
      .send({
        usuario_id: userId,
        nova_etapa: 'lab01_intro'
      });

    expect(etapaRes.status).toBe(200);

    // 5. RESPONDER PERGUNTA CORRETAMENTE
    db.query
      .mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'xss',
          conquista_codigo: null
        }]
      })
      .mockResolvedValueOnce({
        rows: [{ id: 3 }]
      })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [{ vidas: 100 }]
      });

    const respostaRes = await request(app)
      .post('/api/narrador/resposta')
      .send({
        etapa: 'lab01_pergunta1',
        resposta: 'xss',
        usuario_id: userId
      });

    expect(respostaRes.status).toBe(200);
    expect(respostaRes.body.correta).toBe(true);

    // 6. VERIFICAR CONQUISTA FOI DADA
    db.query
      .mockResolvedValueOnce({
        rows: [{ id: userId, username: 'integrationtest' }]
      })
      .mockResolvedValueOnce({
        rows: [{
          id: 3,
          nome: 'Lab01 Completo',
          codigo: 'lab01_concluido'
        }]
      });

    const userRes = await request(app).get(`/api/auth/user/${userId}`);

    expect(userRes.status).toBe(200);
    expect(userRes.body.user.conquistas).toHaveLength(1);
    expect(userRes.body.user.conquistas[0].codigo).toBe('lab01_concluido');
  });

  it('deve penalizar resposta incorreta', async () => {
    // Mock da resposta errada
    db.query
      .mockResolvedValueOnce({
        rows: [{
          resposta_correta: 'certa',
          conquista_codigo: null
        }]
      })
      .mockResolvedValueOnce({
        rows: [{ vidas: 90 }]
      }); // UPDATE vidas RETURNING

    const respostaRes = await request(app)
      .post('/api/narrador/resposta')
      .send({
        etapa: 'lab01_pergunta1',
        resposta: 'errada',
        usuario_id: userId
      });

    expect(respostaRes.status).toBe(200);
    expect(respostaRes.body.correta).toBe(false);
    expect(db.query).toHaveBeenCalled();
  });
});
