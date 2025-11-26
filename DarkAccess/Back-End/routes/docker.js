const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const db = require("../db");

// Armazena containers ativos em memória
// Em produção, usar Redis ou banco de dados
const activeContainers = new Map();

// Modo de produção com Traefik
const PRODUCTION_MODE = process.env.NODE_ENV === "production";
const DOMAIN = process.env.DOMAIN || "localhost";
const TRAEFIK_NETWORK = process.env.TRAEFIK_NETWORK || "darkaccess_labs-network";

// Modo de teste: backend na GCP com IP, sem Traefik
const USE_TRAEFIK = process.env.USE_TRAEFIK === "true";

// Configuração dos labs
const LAB_CONFIGS = {
  lab01: {
    image: "xss-challenge-xss-challenge",
    basePort: 9000,
    name: "xss-lab",
    exposedPort: 80,
    path: "./Labs/xss-challenge"
  },
  lab02: {
    image: "lab02-osdb",
    basePort: 10000,
    name: "osdb-lab",
    exposedPort: 80,
    path: "./Labs/lab02-osdb"
  }
};

/**
 * Encontra uma porta disponível
 */
async function findAvailablePort(basePort) {
  const maxAttempts = 100;
  for (let i = 0; i < maxAttempts; i++) {
    const port = basePort + i;
    const isAvailable = await checkPortAvailable(port);
    if (isAvailable) return port;
  }
  throw new Error("Nenhuma porta disponível");
}

/**
 * Verifica se porta está disponível
 */
function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const cmd = spawn("powershell", [
      "-Command",
      `(Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue).Count -eq 0`
    ]);

    let output = "";
    cmd.stdout.on("data", (data) => {
      output += data.toString();
    });

    cmd.on("close", () => {
      resolve(output.trim() === "True");
    });

    cmd.on("error", () => resolve(true));
  });
}

/**
 * Cria container Docker
 */
function createContainer(labId, userId, port, config) {
  return new Promise((resolve, reject) => {
    const containerName = `${config.name}-user${userId}-${Date.now()}`;
    
    console.log(`🐳 Criando container ${containerName}`);

    const args = [
      "run",
      "-d",
      "--name", containerName,
      "--rm" // Remove automaticamente ao parar
    ];

    // Modo produção com Traefik: usar labels
    if (USE_TRAEFIK) {
      console.log(`🌐 Modo produção: usando Traefik`);
      
      // Adicionar à rede do Traefik
      args.push("--network", TRAEFIK_NETWORK);
      
      // Labels do Traefik para roteamento via paths
      const pathPrefix = `/labs/user${userId}/${labId}`;
      args.push(
        "--label", "traefik.enable=true",
        "--label", `traefik.http.routers.${containerName}.rule=PathPrefix(\`${pathPrefix}\`)`,
        "--label", `traefik.http.routers.${containerName}.entrypoints=websecure`,
        "--label", `traefik.http.routers.${containerName}.tls.certresolver=letsencrypt`,
        "--label", `traefik.http.services.${containerName}.loadbalancer.server.port=${config.exposedPort}`,
        "--label", `traefik.http.middlewares.${containerName}-strip.stripprefix.prefixes=${pathPrefix}`,
        "--label", `traefik.http.routers.${containerName}.middlewares=${containerName}-strip`
      );
    } else {
      // Modo desenvolvimento ou teste GCP: mapear porta diretamente
      console.log(`💻 Mapeando porta ${port} diretamente`);
      args.push("-p", `${port}:${config.exposedPort}`);
    }

    args.push(config.image);

    const docker = spawn("docker", args);

    let containerId = "";
    docker.stdout.on("data", (data) => {
      containerId += data.toString().trim();
    });

    docker.stderr.on("data", (data) => {
      console.error(`Erro Docker: ${data}`);
    });

    docker.on("close", (code) => {
      if (code === 0 && containerId) {
        console.log(`✅ Container criado: ${containerId.substring(0, 12)}`);
        resolve({ containerId, containerName });
      } else {
        reject(new Error(`Falha ao criar container. Code: ${code}`));
      }
    });

    docker.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Para e remove container
 */
function stopContainer(containerName) {
  return new Promise((resolve) => {
    console.log(`🛑 Parando container ${containerName}`);
    
    const docker = spawn("docker", ["stop", containerName]);
    
    docker.on("close", () => {
      console.log(`✅ Container ${containerName} parado`);
      resolve();
    });

    docker.on("error", (err) => {
      console.error(`Erro ao parar container:`, err);
      resolve(); // Resolve mesmo com erro
    });
  });
}

/**
 * POST /api/docker/start-lab
 * Inicia um lab para o usuário
 */
router.post("/start-lab", async (req, res) => {
  const { usuario_id, lab_id } = req.body;

  if (!usuario_id || !lab_id) {
    return res.status(400).json({ 
      success: false, 
      message: "Parâmetros inválidos" 
    });
  }

  const config = LAB_CONFIGS[lab_id];
  if (!config) {
    return res.status(404).json({ 
      success: false, 
      message: "Lab não encontrado" 
    });
  }

  try {
    // Verificar se usuário já tem container ativo para este lab
    const existingKey = `${usuario_id}-${lab_id}`;
    if (activeContainers.has(existingKey)) {
      const existing = activeContainers.get(existingKey);
      
      // Verificar se container ainda está rodando
      const isRunning = await checkContainerRunning(existing.containerName);
      
      if (isRunning) {
        // Gerar URL correta baseado no modo
        const url = USE_TRAEFIK 
          ? `https://${DOMAIN}/labs/user${usuario_id}/${lab_id}`
          : `http://${DOMAIN}:${existing.port}`;

        return res.json({
          success: true,
          url,
          port: existing.port,
          message: "Container já ativo"
        });
      } else {
        // Container morreu, remover do mapa
        activeContainers.delete(existingKey);
      }
    }

    // Encontrar porta disponível e gerar URL
    let port = null;
    let url = "";

    if (USE_TRAEFIK) {
      // Produção com Traefik: URL via paths
      url = `https://${DOMAIN}/labs/user${usuario_id}/${lab_id}`;
    } else {
      // Desenvolvimento ou teste GCP: porta direta
      port = await findAvailablePort(config.basePort);
      url = `http://${DOMAIN}:${port}`;
    }

    // Criar container
    const { containerId, containerName } = await createContainer(
      lab_id,
      usuario_id,
      port,
      config
    );

    // Registrar container ativo
    const containerInfo = {
      containerId,
      containerName,
      port,
      labId: lab_id,
      userId: usuario_id,
      createdAt: new Date(),
      lastAccess: new Date()
    };

    activeContainers.set(existingKey, containerInfo);

    // Registrar no banco de dados
    await db.query(
      `INSERT INTO labs_ativos (usuario_id, lab_id, container_id, container_name, porta, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (usuario_id, lab_id) 
       DO UPDATE SET 
         container_id = $3,
         container_name = $4,
         porta = $5,
         created_at = NOW()`,
      [usuario_id, lab_id, containerId.substring(0, 12), containerName, port || 0]
    );

    res.json({
      success: true,
      url,
      port,
      containerName,
      message: "Lab iniciado com sucesso"
    });

  } catch (err) {
    console.error("Erro ao iniciar lab:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao iniciar lab: " + err.message 
    });
  }
});

/**
 * POST /api/docker/stop-lab
 * Para um lab do usuário
 */
router.post("/stop-lab", async (req, res) => {
  const { usuario_id, lab_id } = req.body;

  if (!usuario_id || !lab_id) {
    return res.status(400).json({ 
      success: false, 
      message: "Parâmetros inválidos" 
    });
  }

  try {
    const containerKey = `${usuario_id}-${lab_id}`;
    const containerInfo = activeContainers.get(containerKey);

    if (!containerInfo) {
      return res.json({ 
        success: true, 
        message: "Nenhum container ativo" 
      });
    }

    // Parar container
    await stopContainer(containerInfo.containerName);

    // Remover do mapa
    activeContainers.delete(containerKey);

    // Atualizar banco
    await db.query(
      `DELETE FROM labs_ativos WHERE usuario_id = $1 AND lab_id = $2`,
      [usuario_id, lab_id]
    );

    res.json({ 
      success: true, 
      message: "Lab parado com sucesso" 
    });

  } catch (err) {
    console.error("Erro ao parar lab:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao parar lab: " + err.message 
    });
  }
});

/**
 * GET /api/docker/labs-ativos/:usuario_id
 * Lista labs ativos do usuário
 */
router.get("/labs-ativos/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const result = await db.query(
      `SELECT lab_id, container_name, porta, created_at 
       FROM labs_ativos 
       WHERE usuario_id = $1`,
      [usuario_id]
    );

    res.json({ 
      success: true, 
      labs: result.rows 
    });

  } catch (err) {
    console.error("Erro ao listar labs:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao listar labs" 
    });
  }
});

/**
 * Verifica se container está rodando
 */
function checkContainerRunning(containerName) {
  return new Promise((resolve) => {
    const docker = spawn("docker", ["ps", "-q", "-f", `name=${containerName}`]);
    
    let output = "";
    docker.stdout.on("data", (data) => {
      output += data.toString();
    });

    docker.on("close", () => {
      resolve(output.trim().length > 0);
    });

    docker.on("error", () => resolve(false));
  });
}

/**
 * Cleanup: Remove containers inativos (executar periodicamente)
 */
async function cleanupInactiveContainers() {
  const TIMEOUT = 30 * 60 * 1000; // 30 minutos
  const now = new Date();

  console.log("🧹 Limpando containers inativos...");

  for (const [key, info] of activeContainers.entries()) {
    const inactive = now - info.lastAccess > TIMEOUT;
    
    if (inactive) {
      console.log(`⏰ Container ${info.containerName} inativo há mais de 30min`);
      
      try {
        await stopContainer(info.containerName);
        activeContainers.delete(key);
        
        await db.query(
          `DELETE FROM labs_ativos WHERE container_name = $1`,
          [info.containerName]
        );
      } catch (err) {
        console.error(`Erro ao limpar ${info.containerName}:`, err);
      }
    }
  }
}

// Executar cleanup a cada 5 minutos
setInterval(cleanupInactiveContainers, 5 * 60 * 1000);

module.exports = router;
