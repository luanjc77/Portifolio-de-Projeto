const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// sessão por usuário (em memória) para manter o cwd entre comandos
const sessions = {};

// rota de execução dos comandos
app.post('/api/exec', (req, res) => {
  const cmd = (req.body.command || "").toString();
  let sessionId = req.body.session || null;

  // criar sessão nova se necessário
  if (!sessionId) {
    sessionId = Math.random().toString(36).slice(2, 10);
    sessions[sessionId] = { cwd: path.join(__dirname, 'files') };
  }

  const session = sessions[sessionId];
  const cwd = session && session.cwd ? session.cwd : path.join(__dirname, 'files');

  console.log(`[CMD] [session:${sessionId}] cwd=${cwd} cmd=${cmd}`);

  // tratar cd localmente para manter cwd na sessão
  const trimmed = cmd.trim();
  if (trimmed.startsWith('cd ')) {
    const target = trimmed.slice(3).trim() || '.';
    // resolve caminho e evita escapar do diretório base
    const resolved = path.resolve(cwd, target);
    const base = path.join(__dirname, 'files');
    if (!resolved.startsWith(base)) {
      return res.json({ success: false, stdout: '', stderr: 'Acesso negado.' });
    }
    // verifica se é diretório
    exec(`test -d "${resolved}"`, (err) => {
      if (err) {
        return res.json({ success: false, stdout: '', stderr: 'Diretório não encontrado.' });
      }
      sessions[sessionId].cwd = resolved;
      return res.json({ success: true, stdout: `Diretório atual: ${resolved}`, stderr: '', session: sessionId });
    });
    return;
  }

  // Executar comando usando run.sh com cwd da sessão
  // Protege o cwd passado (escape simples)
  const safeCwd = cwd.replace(/"/g, '\\"');
  exec(`/lab/run.sh "${cmd.replace(/"/g, '\\"')}" "${safeCwd}"`, { timeout: 8000 }, (err, stdout, stderr) => {
    if (err) console.error('Erro:', stderr || err.message);
    res.json({
      success: !err,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      session: sessionId
    });
  });
});

app.listen(PORT, () => console.log(`Lab02 rodando em http://localhost:${PORT}`));
