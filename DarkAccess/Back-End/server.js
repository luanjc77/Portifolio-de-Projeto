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

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
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
app.get('/api/narrador/fala/:etapa', async (req, res) => {
  const { etapa } = req.params;
 
  try {
    const query = await db.query(
      'SELECT * FROM falas_narrador WHERE etapa = $1 ORDER BY ordem LIMIT 1',
      [etapa]
    );
    
    if (query.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Fala não encontrada.' });
    }

    res.json({ success: true, fala: query.rows[0] });
  } catch (err) {
    console.error('Erro ao buscar fala:', err.message);
    res.status(500).json({ success: false, message: 'Erro no servidor.' });
  }
});

app.post('/api/narrador/resposta', async (req, res) => {
  const { etapa, resposta, usuario_id } = req.body;

  try {
    const query = await db.query(
      'SELECT * FROM falas_narrador WHERE etapa = $1 LIMIT 1',
      [etapa]
    );

    if (query.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Etapa não encontrada.' });

    const fala = query.rows[0];

    if (fala.resposta_correta && fala.resposta_correta.toLowerCase() === resposta.toLowerCase()) {
      // acerto → ganha conquista
      if (fala.conquista_id) {
        await db.query(
          'INSERT INTO conquistas_usuario (usuario_id, conquista_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [usuario_id, fala.conquista_id]
        );
      }
      return res.json({
        success: true,
        correta: true,
        mensagem: 'Resposta correta! Você ganhou uma conquista.',
      });
    } else {
      // erro → perde vida
      await db.query(
        'UPDATE usuarios SET vidas = GREATEST(vidas - 1, 0) WHERE id = $1',
        [usuario_id]
      );
      return res.json({
        success: true,
        correta: false,
        mensagem: 'Resposta incorreta. Você perdeu uma vida.',
      });
    }
  } catch (err) {
    console.error('Erro ao validar resposta:', err.message);
    res.status(500).json({ success: false, message: 'Erro no servidor.' });
  }
});
//narrador dicas
app.get('/api/narrador/dica/:etapa', async (req, res) => {
  const { etapa } = req.params;
  try {
    const query = await db.query(
      'SELECT dica FROM dicas_narrador WHERE etapa = $1 LIMIT 1',
      [etapa]
    );
    if (query.rows.length === 0)
      return res.status(404).json({ success: false, dica: 'Nenhuma dica disponível.' });

    res.json({ success: true, dica: query.rows[0].dica });
  } catch (err) {
    console.error('Erro ao buscar dica:', err.message);
    res.status(500).json({ success: false, dica: 'Erro ao conectar ao servidor.' });
  }
});



// === Rota para iniciar um desafio ===
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
    --network challenge-net \
    --label "traefik.enable=true" \
    --label "traefik.http.routers.challenge-${sessionId}.rule=PathPrefix(\\\`/challenge/${sessionId}\\\`)" \
    --label "traefik.http.services.challenge-${sessionId}.loadbalancer.server.port=80" \
    --name ${containerName} \
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

    return res.json({
      success: true,
      sessionId,
      url,
    });
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
