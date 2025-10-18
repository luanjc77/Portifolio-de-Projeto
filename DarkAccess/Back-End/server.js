const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { v4: uuidv4 } = require('uuid');
const db = require('./db'); 
const bcrypt = require('bcrypt'); 

const app = express();
const PORT = 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());


// --- Mapeamento de Desafios ---
const challengeImages = {
    phishing: 'teste-simples:1.0',
    keylogger: 'teste-simples-2:1.0', 
};

// "Banco de dados" em memória para sessões ativas
const activeSessions = {};


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


// Rota para Iniciar um Desafio
app.post('/api/challenges/start', (req, res) => {
    const { challengeId } = req.body;
    const imageName = challengeImages[challengeId];
    console.log(`\n--- REQUISIÇÃO PARA INICIAR: ${challengeId} ---`);

    if (!imageName) {
        return res.status(400).json({ success: false, message: 'Desafio não encontrado.' });
    }

    const command = `docker run -d -P ${imageName}`;
    exec(command, (runError, containerId, runStderr) => {
        if (runError) { 
            console.error(`Erro ao iniciar o contêiner: ${runStderr}`);
            return res.status(500).json({ success: false, message: 'Erro no servidor ao iniciar o desafio.' });
        }
        const trimmedContainerId = containerId.trim();

        const inspectCommand = `docker inspect ${trimmedContainerId}`;
        exec(inspectCommand, (inspectError, inspectStdout, inspectStderr) => {
            if (inspectError) { 
                console.error(`Erro ao inspecionar o contêiner: ${inspectStderr}`);
                return res.status(500).json({ success: false, message: 'Erro ao inspecionar o contêiner.' });
            }
            try {
                const containerInfo = JSON.parse(inspectStdout);
                const ports = containerInfo[0].NetworkSettings.Ports;
                const internalPort = Object.keys(ports)[0];
                const publicPort = ports[internalPort][0].HostPort;
                const sessionId = uuidv4();

                activeSessions[sessionId] = { 
                    port: publicPort,
                    containerId: trimmedContainerId 
                };

                console.log(`Sessão ${sessionId} criada para a porta ${publicPort} (Contêiner: ${trimmedContainerId.substring(0, 12)})`);
                res.json({ success: true, sessionId: sessionId });

            } catch (parseError) { 
                console.error("ERRO: Falha ao parsear a saída do 'docker inspect'.", parseError);
                return res.status(500).json({ success: false, message: 'Erro ao ler a configuração do contêiner.' });
            }
        });
    });
});

// Rota para Encerrar um Desafio
app.post('/api/challenges/stop', (req, res) => {
    const { sessionId } = req.body;
    const session = activeSessions[sessionId];

    if (!session) {
        return res.status(404).json({ success: false, message: 'Sessão não encontrada.' });
    }

    const { containerId } = session;
    console.log(`\n--- REQUISIÇÃO PARA ENCERRAR: Sessão ${sessionId} (Contêiner: ${containerId.substring(0, 12)}) ---`);

    const stopCommand = `docker stop ${containerId}`;
    const removeCommand = `docker rm ${containerId}`;

    exec(stopCommand, (stopError, stdout, stderr) => {
        if (stopError) {
            console.error(`Erro ao parar contêiner ${containerId}: ${stderr}`);
        }
        console.log(`Contêiner ${containerId.substring(0, 12)} parado.`);

        exec(removeCommand, (rmError, stdout, stderr) => {
            if (rmError) {
                console.error(`Erro ao remover contêiner ${containerId}: ${stderr}`);
            }
            console.log(`Contêiner ${containerId.substring(0, 12)} removido.`);

            delete activeSessions[sessionId];
            console.log(`Sessão ${sessionId} encerrada.`);
            res.json({ success: true, message: 'Desafio encerrado com sucesso.' });
        });
    });
});

// Rota para liberar acesso à Deep Web
app.patch('/api/user/:id/deepweb-access', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            "UPDATE usuarios SET deepweb_access = 'S' WHERE id = $1",
            [id]
        );
        res.status(200).json({ success: true, message: 'Acesso à Deep Web liberado!' });
    } catch (error) {
        console.error('Erro ao liberar Deep Web:', error.message);
        res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
});


// --- Middleware do Proxy Reverso ---
app.use('/challenge/:sessionId', (req, res, next) => {
    const sessionId = req.params.sessionId;
    const session = activeSessions[sessionId];
    if (!session) {
        return res.status(404).send('Sessão do desafio não encontrada ou expirada.');
    }
    createProxyMiddleware({
        target: `http://127.0.0.1:${session.port}`,
        changeOrigin: true,
        pathRewrite: { [`^/challenge/${sessionId}`]: '/' },
    })(req, res, next);
});


// --- Inicialização do Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor da API do DarkAccess rodando na porta ${PORT}`);
});