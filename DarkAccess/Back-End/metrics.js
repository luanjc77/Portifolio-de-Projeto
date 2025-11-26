const promClient = require('prom-client');

// Configurar coleta de métricas padrão
const register = new promClient.Registry();

// Métricas padrão do Node.js (CPU, Memória, etc)
promClient.collectDefaultMetrics({ register });

// Métricas customizadas do DarkAccess

// 1. Contador de requisições HTTP
const httpRequestsTotal = new promClient.Counter({
  name: 'darkaccess_http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// 2. Duração das requisições HTTP
const httpRequestDuration = new promClient.Histogram({
  name: 'darkaccess_http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// 3. Usuários ativos
const activeUsers = new promClient.Gauge({
  name: 'darkaccess_active_users',
  help: 'Número de usuários com sessão ativa',
  registers: [register]
});

// 4. Labs ativos
const activeLabs = new promClient.Gauge({
  name: 'darkaccess_active_labs',
  help: 'Número de labs (containers) ativos',
  labelNames: ['lab_id'],
  registers: [register]
});

// 5. Contador de conquistas
const conquistasTotal = new promClient.Counter({
  name: 'darkaccess_conquistas_total',
  help: 'Total de conquistas obtidas',
  labelNames: ['conquista_codigo'],
  registers: [register]
});

// 6. Respostas corretas/incorretas
const quizResponses = new promClient.Counter({
  name: 'darkaccess_quiz_responses_total',
  help: 'Total de respostas em quizzes',
  labelNames: ['etapa', 'correta'],
  registers: [register]
});

// Middleware para coletar métricas HTTP
function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status: res.statusCode
    }, duration);
  });
  
  next();
}

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  activeUsers,
  activeLabs,
  conquistasTotal,
  quizResponses,
  metricsMiddleware
};
