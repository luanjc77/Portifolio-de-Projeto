const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const USERS = {
  admin: "admin",
  guest: "1234"
};

// sessões por usuário
const sessions = {};

// LOGIN
app.post('/api/login', (req, res) => {
  const { user, pass } = req.body;

  if (!USERS[user] || USERS[user] !== pass) {
    return res.json({ success: false, message: "Credenciais inválidas." });
  }

  const sessionId = Math.random().toString(36).slice(2, 12);
  sessions[sessionId] = {
    cwd: path.join(__dirname, 'files'),
    user
  };

  return res.json({ success: true, session: sessionId });
});

// EXECUÇÃO
app.post('/api/exec', (req, res) => {
  const cmd = (req.body.command || "").toString();
  const sessionId = req.body.session;

  const session = sessions[sessionId];

  if (!session || !session.user) {
    return res.json({ success: false, stderr: "Você precisa fazer login para usar o terminal." });
  }

  const cwd = session.cwd;

  console.log(`[CMD] [session:${sessionId}] cwd=${cwd} cmd=${cmd}`);

  // cd
  if (cmd.startsWith("cd ")) {
    const target = cmd.slice(3).trim();
    const resolved = path.resolve(cwd, target);
    const base = path.join(__dirname, 'files');

    if (!resolved.startsWith(base)) {
      return res.json({ success: false, stderr: "Acesso negado." });
    }

    exec(`test -d "${resolved}"`, err => {
      if (err) return res.json({ success: false, stderr: "Diretório não encontrado." });

      sessions[sessionId].cwd = resolved;
      return res.json({ success: true, stdout: `Diretório atual: ${resolved}` });
    });

    return;
  }

  // executa run.sh
  const safeCwd = cwd.replace(/"/g, '\\"');
  exec(`/lab/run.sh "${cmd.replace(/"/g, '\\"')}" "${safeCwd}"`,
    { timeout: 8000 },
    (err, stdout, stderr) => {
      res.json({
        success: !err,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        session: sessionId
      });
    }
  );
});

app.listen(PORT, () =>
  console.log(`Lab02 rodando em http://localhost:${PORT}`)
);
