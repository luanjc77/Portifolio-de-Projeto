const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const challengeImages = {
    phishing: 'teste1:1',
};

// Um "banco de dados" em memória para guardar as sessões ativas
// A chave é o sessionId, o valor é a porta
const activeSessions = {};

// Endpoint para iniciar o desafio
app.post('/api/challenges/start', (req, res) => {
    const { challengeId } = req.body;
    const imageName = challengeImages[challengeId];
    console.log(`\n--- REQUISIÇÃO PARA INICIAR: ${challengeId} ---`);

    if (!imageName) {
        return res.status(400).json({ success: false, message: 'Desafio não encontrado.' });
    }

    const command = `docker run -d -P ${imageName}`;
    exec(command, (runError, containerId, runStderr) => {
        if (runError) { /* ... (código de erro igual ao anterior) ... */ }
        const trimmedContainerId = containerId.trim();

        const inspectCommand = `docker inspect ${trimmedContainerId}`;
        exec(inspectCommand, (inspectError, inspectStdout, inspectStderr) => {
            if (inspectError) { /* ... (código de erro igual ao anterior) ... */ }
            try {
                const containerInfo = JSON.parse(inspectStdout);
                const ports = containerInfo[0].NetworkSettings.Ports;
                const internalPort = Object.keys(ports)[0];
                const publicPort = ports[internalPort][0].HostPort;

                const sessionId = uuidv4(); // Gera um ID único para a sessão
                activeSessions[sessionId] = publicPort; // Salva a porta associada ao ID

                console.log(`Sessão ${sessionId} criada para a porta ${publicPort}`);

                // Retorna o sessionId para o front-end
                res.json({
                    success: true,
                    sessionId: sessionId,
                });

            } catch (parseError) { /* ... (código de erro igual ao anterior) ... */ }
        });
    });
});

// Middleware do Proxy
app.use('/challenge/:sessionId', (req, res, next) => {
    const sessionId = req.params.sessionId;
    const targetPort = activeSessions[sessionId];

    if (!targetPort) {
        return res.status(404).send('Sessão do desafio não encontrada ou expirada.');
    }

    // Configura e ativa o proxy para esta requisição
    createProxyMiddleware({
        target: `http://127.0.0.1:${targetPort}`,
        changeOrigin: true,
        // Reescreve a URL: remove /challenge/sessionId/ do caminho
        pathRewrite: {
            [`^/challenge/${sessionId}`]: '/',
        },
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Servidor da API do DarkAccess rodando na porta ${PORT}`);
});