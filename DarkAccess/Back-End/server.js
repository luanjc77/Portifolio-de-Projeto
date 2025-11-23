// server.js - DarkAccess backend (com build dinâmico e tag-única)
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// === Configs de labs ===
// Mapear challengeId -> pasta do lab (relativa a DarkAccess/Labs) e baseImageName
const challengeConfigs = {
  xss: {
    folder: 'xss-challenge',
    baseImage: 'xss-challenge-xss-challenge:latest'
  },
  so: {
    folder: 'lab02-osdb',
    baseImage: 'darkaccess/lab02-osdb:latest'
  },
  keylogger: {
    folder: 'lab03-keylogger',
    baseImage: 'darkaccess/lab03-keylogger'
  },
  // adicione outros labs aqui conforme for criando
};

// Sessões ativas e TTL
const activeSessions = {};
const SESSION_TTL = 1000 * 60 * 45; // 45 minutos

// === Função auxiliar: criar config.json dinâmico ===
function createSessionConfig(sessionId) {
  const dir = '/tmp/lab-configs';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${sessionId}-config.json`);
  const data = {
    admin_user: "root",
    admin_pass: "9d7f4c2_key_part1",
    database_path: "darknet://orion-db.core/system/main.sqlite",
    session_id: sessionId,
    created_at: new Date().toISOString(),
  };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

// --- Rotas da API ---
// Rota de Cadastro de Novo Usuário
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            "INSERT INTO usuarios (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username",
            [username, email, password_hash]
        );

        res.status(201).json({
            success: true,
            message: 'Usuário cadastrado com sucesso!',
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error('Erro no cadastro de usuário:', error.message);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Nome de usuário ou email já cadastrado.' });
        }
        res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
});

// Rota de Login
app.post('/api/auth/login', async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
    }

    try {
        const userQuery = await db.query(
            "SELECT * FROM usuarios WHERE username = $1 OR email = $1",
            [identifier]
        );

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        const user = userQuery.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (isPasswordCorrect) {

            // Verifica se ainda não tem a conquista "primeiro_acesso"
            await db.query(`
                INSERT INTO conquistas_usuario (usuario_id, conquista_id)
                SELECT $1, id FROM conquistas WHERE codigo = 'primeiro_acesso'
                ON CONFLICT DO NOTHING;
            `, [user.id]);

            // Marca o campo primeiro_acesso = true também
            await db.query(`
                UPDATE usuarios SET primeiro_acesso = true WHERE id = $1
            `, [user.id]);
        }

        res.status(200).json({
            success: true,
            message: 'Login bem-sucedido!',
            user: { id: user.id, username: user.username }
        });

    } catch (error) {
        console.error('Erro no login:', error.message);
        res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
});

// Rotas Narrador
// --- Narrador, Dicas, Deepweb e Conquistas ---
// Certifique-se de ter 'db' já importado (client de postgres) no topo do server.js

// GET fala do narrador considerando etapa e opcionalmente userId
app.get('/api/narrador/fala/:etapa', async (req, res) => {
  const { etapa } = req.params;
  const userId = req.query.userId || null;

  try {
    // Se userId foi passado, ler info do usuário para ajustar fala
    if (userId) {
      const u = await db.query('SELECT id, primeiro_acesso, etapa_atual, deepweb_access FROM usuarios WHERE id = $1', [userId]);
      if (u.rows.length > 0) {
        const user = u.rows[0];

        // Se for primeiro acesso e etapa seja 'inicio', retornamos tutorial
        if (user.primeiro_acesso && etapa === 'inicio') {
          const rows = await db.query('SELECT fala, ordem FROM falas_narrador WHERE chave_evento = $1 ORDER BY ordem', ['tutorial_inicio']);
          if (rows.rows.length > 0) {
            // retornar array concatenado como uma fala longa (ou escolher só a primeira)
            const combined = rows.rows.map(r => r.fala).join('\n\n');
            return res.json({ success: true, fala: { fala: combined, etapa: 'tutorial_inicio' } });
          }
        }

        // Se não for primeiro acesso, buscar falas padrão de 'inicio_retorno'
        if (!user.primeiro_acesso && etapa === 'inicio') {
          const rows = await db.query('SELECT fala, ordem FROM falas_narrador WHERE chave_evento = $1 ORDER BY ordem', ['inicio_retorno']);
          if (rows.rows.length > 0) {
            const combined = rows.rows.map(r => r.fala).join('\n\n');
            return res.json({ success: true, fala: { fala: combined, etapa: 'inicio_retorno' } });
          }
        }

        // Se o usuário já tem deepweb_access e pedimos uma fala relacionada
        if (user.deepweb_access === 'S' && etapa === 'profundezas') {
          const rows = await db.query('SELECT fala FROM falas_narrador WHERE chave_evento = $1 ORDER BY ordem', ['profundezas']);
          if (rows.rows.length > 0) {
            const combined = rows.rows.map(r => r.fala).join('\n\n');
            return res.json({ success: true, fala: { fala: combined, etapa: 'profundezas' } });
          }
        }
      }
    }

    // fallback: buscar falas normais por chave_evento = etapa
    const q = await db.query('SELECT fala, resposta_correta, ordem, conquista_codigo FROM falas_narrador WHERE chave_evento = $1 ORDER BY ordem', [etapa]);
    if (q.rows.length === 0) {
      // fallback simples se não existir no DB
      return res.json({ success: true, fala: { fala: 'Nenhuma fala configurada para esta etapa. Siga explorando!', etapa } });
    }

    // se existirem várias linhas, concatenamos
    const falaText = q.rows.map(r => r.fala).join('\n\n');
    // se a primeira linha tiver resposta_correta, informamos
    const first = q.rows[0];
    const responseObj = {
      fala: falaText,
      etapa,
    };
    if (first.resposta_correta) responseObj.resposta_correta = first.resposta_correta;
    if (first.conquista_codigo) responseObj.conquista_codigo = first.conquista_codigo;

    return res.json({ success: true, fala: responseObj });

  } catch (err) {
    console.error('Erro /api/narrador/fala:', err);
    res.status(500).json({ success: false, message: 'Erro ao recuperar fala.' });
  }
});

// GET dica (mantido / adaptado) -> também aceita userId query se quiser personalizar no futuro
app.get('/api/narrador/dica/:etapa', async (req, res) => {
  const { etapa } = req.params;
  try {
    const query = await db.query('SELECT dica FROM dicas_narrador WHERE etapa = $1 LIMIT 1', [etapa]);
    if (query.rows.length === 0) return res.json({ success: false, dica: 'Nenhuma dica disponível.' });
    res.json({ success: true, dica: query.rows[0].dica });
  } catch (err) {
    console.error('Erro dica:', err);
    res.status(500).json({ success: false, dica: 'Erro ao buscar dica.' });
  }
});

// POST /api/narrador/resposta (já existia no seu arquivo) - mantive e acrescentei lógica para conceder conquista se fala vinculada
app.post('/api/narrador/resposta', async (req, res) => {
  const { etapa, resposta, usuario_id } = req.body;
  if (!etapa || !usuario_id) return res.status(400).json({ success:false, message: 'Parâmetros inválidos.' });

  try {
    // buscar fala configurada que contenha resposta_correta para a etapa
    const q = await db.query('SELECT * FROM falas_narrador WHERE chave_evento = $1 ORDER BY ordem LIMIT 1', [etapa]);
    if (q.rows.length === 0) return res.status(404).json({ success:false, message: 'Etapa não encontrada.' });

    const fala = q.rows[0];

    if (fala.resposta_correta && fala.resposta_correta.toLowerCase() === (resposta || '').toLowerCase()) {
      // acertou → conceder conquista se houver
      if (fala.conquista_codigo) {
        const c = await db.query('SELECT id FROM conquistas WHERE codigo = $1 LIMIT 1', [fala.conquista_codigo]);
        if (c.rows.length > 0) {
          const conquistaId = c.rows[0].id;
          await db.query('INSERT INTO conquistas_usuario (usuario_id, conquista_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [usuario_id, conquistaId]);
        }
      }
      // marcar que não é mais primeiro_acesso
      await db.query('UPDATE usuarios SET primeiro_acesso = false WHERE id = $1', [usuario_id]);

      return res.json({
        success: true,
        correta: true,
        mensagem: 'Resposta correta! Você ganhou uma conquista (se aplicável).'
      });
    } else {
      // errar -> perder vida (se houver coluna vidas)
      await db.query('UPDATE usuarios SET vidas = GREATEST(COALESCE(vidas,3) - 1, 0) WHERE id = $1', [usuario_id]);
      return res.json({ success: true, correta: false, mensagem: 'Resposta incorreta. Você perdeu uma vida.' });
    }
  } catch (err) {
    console.error('Erro validar resposta:', err);
    res.status(500).json({ success:false, message: 'Erro no servidor.' });
  }
});

// POST /api/deepweb/unlock
// Body: { userId, password }
app.post('/api/deepweb/unlock', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) return res.status(400).json({ success: false, message: 'Parâmetros inválidos.' });

  try {
    const expected = process.env.DEEPWEB_PASSWORD || '123456';
    if (password !== expected) return res.json({ success: false, message: 'Senha incorreta.' });

    // Atualiza usuário
    await db.query('UPDATE usuarios SET deepweb_access = $1 WHERE id = $2', ['S', userId]);

    // concede conquista 'profundezas'
    const c = await db.query('SELECT id FROM conquistas WHERE codigo = $1 LIMIT 1', ['profundezas']);
    if (c.rows.length) {
      const conquistaId = c.rows[0].id;
      await db.query('INSERT INTO conquistas_usuario (usuario_id, conquista_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [userId, conquistaId]);
    }

    // retornar narrador/fala de desbloqueio
    const rows = await db.query('SELECT fala FROM falas_narrador WHERE chave_evento = $1 ORDER BY ordem', ['profundezas']);
    const falaCombined = rows.rows.map(r => r.fala).join('\n\n') || 'Você desbloqueou as Profundezas. Muito cuidado.';

    res.json({ success: true, message: 'Acesso liberado.', narrador_fala: falaCombined });
  } catch (err) {
    console.error('Erro deepweb unlock:', err);
    res.status(500).json({ success:false, message: 'Erro no servidor.' });
  }
});

// GET /api/usuario/:id/conquistas  -> lista conquistas do usuario
app.get('/api/usuario/:id/conquistas', async (req, res) => {
  const { id } = req.params;
  try {
    const q = await db.query(`
      SELECT c.codigo, c.nome
      FROM conquistas_usuario cu
      JOIN conquistas c ON c.id = cu.conquista_id
      WHERE cu.usuario_id = $1
    `, [id]);
    res.json({ success: true, conquistas: q.rows });
  } catch (err) {
    console.error('Erro ao buscar conquistas:', err);
    res.status(500).json({ success:false, message: 'Erro no servidor.' });
  }
});

// POST /api/usuario/:id/conquistas  -> body { codigo } - administra conquista manualmente
app.post('/api/usuario/:id/conquistas', async (req, res) => {
  const { id } = req.params;
  const { codigo } = req.body;
  if (!codigo) return res.status(400).json({ success:false, message: 'codigo obrigatório' });
  try {
    const c = await db.query('SELECT id FROM conquistas WHERE codigo = $1 LIMIT 1', [codigo]);
    if (c.rows.length === 0) return res.status(404).json({ success:false, message: 'conquista não encontrada' });
    await db.query('INSERT INTO conquistas_usuario (usuario_id, conquista_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [id, c.rows[0].id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro conceder conquista:', err);
    res.status(500).json({ success:false, message: 'Erro no servidor.' });
  }
});




// === Rota para iniciar um desafio ===
/*
app.post('/api/challenges/start', (req, res) => {
  const { challengeId } = req.body;
  const cfg = challengeConfigs[challengeId];

  if (!cfg) {
    return res.status(400).json({ success: false, message: 'Desafio não encontrado.' });
  }

  const sessionId = uuidv4();
  const containerName = `lab_${challengeId}_${sessionId.substring(0, 8)}`;
  const baseImage = cfg.baseImage;
  const VM_PUBLIC_IP = process.env.VM_PUBLIC_IP || 'localhost';

  console.log(`\n[+] Preparando ambiente para o desafio: ${challengeId}`);
  console.log(`[+] Usando imagem existente: ${baseImage}`);

  // ---- RODAR CONTAINER NA REDE challenge-net COM LABELS TRAEFIK ----
  const runCmd = `docker run -d \
    --network portifolio-de-projeto_challenge-net \
    --label "traefik.enable=true" \
    --label "traefik.http.routers.challenge-${sessionId}.rule=PathPrefix(\\\"/challenge/${sessionId}/\\\")" \
    --label "traefik.http.routers.challenge-${sessionId}.entrypoints=web" \
    --label "traefik.http.services.challenge-${sessionId}.loadbalancer.server.port=80" \
    --label "traefik.http.middlewares.challenge-${sessionId}-strip.stripprefix.prefixes=/challenge/${sessionId}" \
    --label "traefik.http.routers.challenge-${sessionId}.middlewares=challenge-${sessionId}-strip" \
    --name lab_${challengeId}_${sessionId} \
    ${baseImage}`;




  console.log(`[+] Iniciando container: ${containerName}`);
  
  exec(runCmd, (runError, runStdout, runStderr) => {
    if (runError) {
      console.error(`Erro ao iniciar contêiner:`, runStderr || runError.message);
      return res.status(500).json({ success: false, message: 'Erro ao iniciar contêiner.' });
    }

    const containerId = runStdout.trim();

    activeSessions[sessionId] = {
      containerId,
      containerName,
      createdAt: Date.now(),
    };

    const url = `http://${VM_PUBLIC_IP}/challenge/${sessionId}`;
    console.log(`[+] Sessão ${sessionId} iniciada. URL: ${url}`);

    setTimeout(() => {
        return res.json({
            success: true,
            sessionId,
            url,
        });
    }, 3000); // 3 segundos

    return res.json({
      success: true,
      sessionId,
      url,
    });
  });
});

*/
app.post('/api/challenges/start', (req, res) => {
    const { challengeId } = req.body;

    const VM_PUBLIC_IP = process.env.VM_PUBLIC_IP || "localhost";

    // Mapeamento Fixo
    const urls = {
        xss: `http://${VM_PUBLIC_IP}:8080`,
        so: `http://${VM_PUBLIC_IP}:8081`
    };

    if (!urls[challengeId]) {
        return res.status(400).json({ success: false, message: "Lab não encontrado." });
    }

    return res.json({
        success: true,
        sessionId: "fixed",
        url: urls[challengeId]
    });
});

// === Rota para encerrar sessão ===
app.post('/api/challenges/stop', (req, res) => {
  const { sessionId } = req.body;
  const session = activeSessions[sessionId];

  if (!session) return res.status(404).json({ success: false, message: 'Sessão não encontrada.' });

  const { containerId, configPath } = session;

  exec(`docker rm -f ${containerId}`, (err) => {
    if (err) console.error(`Erro ao remover contêiner ${containerId}: ${err}`);
    if (configPath && fs.existsSync(configPath)) fs.unlinkSync(configPath);
    delete activeSessions[sessionId];
    console.log(`Sessão ${sessionId} encerrada e limpa.`);
    res.json({ success: true });
  });
});


// POST /api/lab/:sessionId/exec
// body: { command: "ls -la" }
app.post('/api/lab/:sessionId/exec', (req, res) => {
  const { sessionId } = req.params;
  const { command } = req.body;
  const session = activeSessions[sessionId];
  if (!session) return res.status(404).json({ success:false, message: 'Sessão não encontrada' });

  if (!command || typeof command !== 'string' || command.length > 1000) {
    return res.status(400).json({ success:false, message: 'Comando inválido' });
  }

  // sanitize mínimo: rejeita pipes e redirecionamentos perigosos
  if (/[;&|`$()<>]/.test(command)) {
    return res.status(400).json({ success:false, message: 'Comando contém caracteres proibidos' });
  }

  // monta exec seguro: passa comando como único argumento para run.sh
  // usamos JSON.stringify(command) para adicionar aspas e escapar corretamente
  const dockerExec = `docker exec ${session.containerId} /lab/run.sh ${JSON.stringify(command)}`;

  console.log(`Exec na sessão ${sessionId}: ${command}`);
  exec(dockerExec, { timeout: 8000, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro exec (${sessionId}):`, err && err.message);
      // devolve stdout/stderr se houver
      return res.json({ success: false, stdout: stdout ? stdout.toString() : '', stderr: stderr ? stderr.toString() : (err && err.message) });
    }
    res.json({ success: true, stdout: stdout ? stdout.toString() : '', stderr: stderr ? stderr.toString() : '' });
  });
});


// === Proxy reverso para o laboratório ===
// Todos os requests para /challenge/:sessionId/* são proxiados diretamente para o container
// O container (Nginx) cuida de reescrever URLs e servir arquivos estáticos

/*
// Proxy reverso para a rota principal do laboratório
app.use('/challenge/:sessionId', (req, res, next) => {
  const sessionId = req.params.sessionId;
  const session = activeSessions[sessionId];

  if (!session) {
    return res.status(404).send('Sessão do desafio não encontrada ou expirada.');
  }

  const target = `http://127.0.0.1:${session.port}`;
  console.log(`Proxy ativo para sessão ${sessionId} -> ${target}${req.originalUrl}`);

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    // REMOVE o prefixo /challenge/:sessionId antes de repassar para o container
    pathRewrite: {
      [`^/challenge/${sessionId}`]: ''
    },
    onProxyReq(proxyReq, req, res) {
      // Ajusta o Host header (React/Nginx podem validar isso)
      proxyReq.setHeader('Host', `127.0.0.1:${session.port}`);
    },
    onError(err, req, res) {
      console.error(`Erro no proxy da sessão ${sessionId}:`, err.message);
      res.status(502).send('Erro no proxy para o laboratório.');
    },
    logLevel: 'warn',
  });

  proxy(req, res, next);
});
*/

// === Auto-cleanup (encerra labs inativos) ===
setInterval(() => {
  const now = Date.now();
  Object.entries(activeSessions).forEach(([id, sess]) => {
    if (now - sess.createdAt > SESSION_TTL) {
      exec(`docker rm -f ${sess.containerId}`, () => {});
      if (fs.existsSync(sess.configPath)) fs.unlinkSync(sess.configPath);
      delete activeSessions[id];
      console.log(`Sessão ${id} encerrada por inatividade.`);
    }
  });
}, 1000 * 60 * 2);

// === Inicialização ===
app.listen(API_PORT, () => {
  console.log(`DarkAccess backend rodando na porta ${API_PORT}`);
});
