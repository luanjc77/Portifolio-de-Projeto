# DarkAccess - Plataforma de Estudos Gameficada

![Status do Projeto](https://img.shields.io/badge/status-Em%20Produ%C3%A7%C3%A3o-green)
![Linguagem Principal](https://img.shields.io/badge/language-JavaScript-yellow)
![Licença](https://img.shields.io/badge/license-MIT-green)
![Hospedagem](https://img.shields.io/badge/hosted-GCP-blue)


## Acesso ao Projeto

**Aplicação:** [http://34.132.60.57](http://34.132.60.57)  
**Hospedagem:** Google Cloud Platform (GCP) - Ubuntu Server

---
## Contexto 

Com o avanço acelerado das tecnologias digitais e a presença constante da internet na rotina das pessoas, a segurança digital tornou-se uma área de extrema relevância. Entretanto, apesar do crescente interesse pelo tema, o primeiro contato com conteúdos de cibersegurança frequentemente revela uma problemática recorrente: para aqueles que já possuem algum conhecimento prévio, a abordagem excessivamente teórica tende a ser pouco estimulante; por outro lado, para iniciantes que ainda não dominam conceitos fundamentais de tecnologia, os materiais disponíveis costumam ser excessivamente complexos, técnicos ou pouco didáticos.

Somado a isso, grande parte das metodologias de ensino ainda adota modelos rígidos, dificultando o engajamento e a compreensão prática do conteúdo. Observa-se também que muitas soluções educacionais gamificadas sobre segurança digital são voltadas principalmente para crianças ou para públicos já técnicos, deixando uma lacuna significativa para estudantes iniciantes do ensino superior na área de tecnologia.

É nesse contexto que surge o DarkAccess, uma proposta inovadora de aprendizagem prática e interativa. O projeto busca preencher essa lacuna ao oferecer uma abordagem introdutória, acessível e envolvente, adequada ao nível de conhecimento de novos universitários. Por meio de mecânicas gamificadas e cenários aplicados, o DarkAccess promove um primeiro contato mais motivador, dinâmico e eficiente com conceitos essenciais da segurança digital.

---

## DarkAccess - A Plataforma de Gameficação sobre Cybersegurança

Uma plataforma web desenvolvida com React.js no Front-End e Node.js + Express no Back-End. A aplicação apresenta uma narrativa interativa que acompanha o usuário ao longo de sua jornada, introduzindo conceitos de cibersegurança de maneira contextualizada e envolvente.

Além de transmitir conhecimento, o projeto busca estimular a criatividade na resolução de desafios e instigar a curiosidade do usuário sobre o tema. A proposta é que, após vivenciar a experiência oferecida pelo DarkAccess, o usuário sinta-se motivado a aprofundar seus estudos na área de segurança digital, explorando novas possibilidades de aprendizado e desenvolvimento.

Os temas apresentados até o momento estão divididos entre narrador e dois laboratórios práticos:

Narrador - Através de suas falas apresenta temas como: 
- VPN
- Diferença entre Surface, DeepWeb e DarkWeb
- Phishing

Lab01 - laboratório prático que simula um site de uma empresa, mas que contem falhas de:
- XSS (Cross-Site Scripting)
- Arquivos expostos

Lab02 - Simula um acesso a um computador, demonstrando:
- Perigo de utilizar senhas padrão
- Quebra de autenticação
- Vazamento de arquivos

Conexão com VPN - Apresenta o conceito de uma VPN e qual sua finalidade 


### **Contexto da Narrativa**

A Arpheus Tech é uma empresa tradicional do setor tecnológico, com muitos anos de história e experiência. Iniciou sua trajetória como uma pequena desenvolvedora web, mas, ao longo do tempo, expandiu-se e consolidou-se no mercado graças à qualidade de seus projetos e à capacidade de adaptação às mudanças da era digital.

Com essa longa vivência no mundo da tecnologia, a Arpheus acompanhou de perto a evolução da internet — e, junto dela, o crescimento constante dos crimes cibernéticos. Ao observar falhas comuns, como sistemas sem validações adequadas, arquivos sensíveis deixados expostos, rotas não protegidas, uso de credenciais fracas e inúmeros descuidos de desenvolvimento, a empresa percebeu a necessidade urgente de fortalecer a segurança digital.

Foi então que a Arpheus decidiu transformar-se: deixou de atuar apenas no desenvolvimento web e passou a concentrar seus esforços em segurança cibernética. Dessa mudança nasceu a Aurora IA, uma inteligência artificial avançada, criada para monitorar os sistemas internos da corporação e de seus clientes. Além da proteção ativa, a Aurora possui um modo de treinamento, focado em capacitar desenvolvedores e usuários comuns a reconhecerem as ameaças e perigos espalhados pela internet.

Para intensificar o aprendizado de forma prática e instigante, a Arpheus liberou para a Aurora um conjunto de sistemas de teste — ambientes preparados especialmente para que seus alunos possam explorar vulnerabilidades reais, porém controladas. O objetivo é desafiar, despertar curiosidade e fortalecer a habilidade dos participantes em detectar riscos e se defender no universo digital.

---


## <img width="2040" height="2120" alt="image" src="https://github.com/user-attachments/assets/f5214aeb-c95e-4967-9cc0-3492cbf8ef7a" />

---

## Arquitetura do Projeto

## Requisitos Funcionais

- RF01 - Sistema de Autenticação e Autorização (registro, login, criptografia bcrypt)
- RF02 - Sistema de Progressão por Etapas (controle de progressão narrativa sequencial)
- RF03 - Sistema de Narrador Interativo (falas com efeito typewriter, skip, repetir)
- RF04 - Sistema de Desafios e Validação de Respostas (validação, conquistas, perda de vida)
- RF05 - Sistema de Dicas (dicas contextualizadas, contador de uso)
- RF06 - Sistema de Conquistas (desbloqueio automático, exibição no perfil)
- RF07 - Gestão Dinâmica de Laboratórios Docker (criar/destruir containers isolados)
- RF08 - Sistema de Ranking (ordenação por vida, conquistas, dicas)
- RF09 - Perfil de Usuário (estatísticas, conquistas, avatar)
- RF10 - Navegação entre Páginas (login, home, labs, perfil)

## Requisitos Não Funcionais
- RNF01 - Performance (APIs < 500ms, containers < 10s, carregamento < 3s)
- RNF02 - Segurança (bcrypt, prepared statements, CORS, isolamento Docker)
- RNF03 - Escalabilidade (backend stateless, portas dinâmicas, SPA)
- RNF04 - Disponibilidade (GCP e2-medium, Docker Compose)
- RNF05 - Usabilidade (interface "terminal hacker", feedback visual, responsivo)
- RNF06 - Manutenibilidade (código modular, documentação)
- RNF07 - Portabilidade (Docker, funciona em Linux/Windows)
- RNF08 - Confiabilidade (transações atômicas, validações, tratamento de erros)
- RNF09 - Compatibilidade com navegadores modernos

**Frontend:**
- React 19.1.1
- React Router DOM 7.9.3
- Axios 1.13.2
- React Icons 5.5.0
- CSS Modules

**Backend:**
- Node.js 18
- Express 5.1.0
- bcrypt 6.0.0
- pg 8.16.3 (PostgreSQL client)
- dockerode (Docker API client)
  
**Banco de Dados:**
- PostgreSQL 14

**Infraestrutura:**
- Docker 24+
- Docker Compose
- Traefik 3.0 (reverse proxy)
- GCP e2-medium (Ubuntu 22.04)


<img width="2842" height="1001" alt="diagrama de arquitetura" src="https://github.com/user-attachments/assets/0480b6a9-ce9e-4c9a-bba6-826084bdbf03" />


| Cor | Componente | Descrição |
|-----|------------|-----------|
| 🟠 Laranja | **Usuário** | Estudante de cibersegurança que acessa a plataforma |
| 🔵 Azul Claro | **Frontend** | Interface do usuário (React 18 + Nginx) |
| 🟢 Verde-Água | **Backend** | API REST (Node.js 18 + Express 4.21) |
| 🟢 Verde-Escuro | **Traefik** | Reverse Proxy e roteador de requisições |
| 🟢 Verde | **Docker/Labs** | Engine Docker e containers de laboratórios |
| 🟣 Roxo | **Database** | Banco de dados PostgreSQL 14 |
| 🔵 Azul | **Cloud** | Infraestrutura Google Cloud Platform |

#### Detalhamento dos Componentes

1. **Usuário** acessa `http://34.132.60.57` via navegador web
   - O IP público da VM GCP está configurado sem DNS/domínio customizado
   - Tráfego HTTP na porta 80

2. **Traefik** (porta 80) recebe a requisição e realiza roteamento inteligente:
   - **Host: `34.132.60.57` ou `localhost`** → Redireciona para **Frontend** (prioridade 1)
   - **Path: `/api/*`** → Redireciona para **Backend** na porta 3001 (prioridade 2)
   - **Labs dinâmicos** → Roteamento via labels Docker para containers de usuários específicos

3. **Frontend (React + Nginx)** :
   - Nginx retorna o `index.html` e assets estáticos do build React
   - Usuário navega entre páginas: `/login`, `/register`, `/start`, `/darkaccess`, `/deepweb`, `/user`
   - React Router gerencia navegação client-side sem recarregar página

4. **Frontend** executa chamadas REST para o **Backend**:
   - `POST http://34.132.60.57:3001/api/auth/login` → Autenticação
   - `GET http://34.132.60.57:3001/api/narrador/:userId/mensagens` → Narrativa
   - `POST http://34.132.60.57:3001/api/labs/start` → Provisionar lab
   - `GET http://34.132.60.57:3001/api/conquistas/:userId` → Conquistas
   - Respostas em formato JSON com dados estruturados

5. **Backend (Node.js + Express)** processa requisições:
   - Valida credenciais com bcrypt para autenticação
   - Consulta **PostgreSQL** via prepared statements: `SELECT * FROM usuarios WHERE usuario = $1`
   - Retorna dados: `{success: true, userId, pontos, vidas, etapa_atual}`
   - Armazena estado do narrador: fase atual, mensagens exibidas

6. **Backend** gerencia labs via **Docker Engine**:
   - Monta `/var/run/docker.sock` para controlar containers
   - Cria container: `docker.createContainer({name: 'lab02-user-123', network: 'challenge-net'})`
   - Inicia lab: `container.start()` com porta aleatória mapeada (ex: 32768)
   - Traefik detecta automaticamente via labels e cria rota dinâmica
   - Agenda remoção: `setTimeout(() => container.stop().remove(), 30 * 60 * 1000)`

7. **Labs** são acessados pelo usuário:
   - Backend retorna URL: `http://34.132.60.57:32768` (porta mapeada)
   - Usuário abre em nova aba e interage com ambiente isolado
   - Lab02-OSDB: Exploração de SQL Injection em Node.js + SQLite
   - XSS-Challenge: Testes de Cross-Site Scripting em React + Vite

8. **PostgreSQL** persiste todos os dados:
   - Tabela `usuarios`: credenciais, progresso, pontos, vidas
   - Tabela `narrador_estado`: fase atual e mensagens já exibidas
   - Tabela `conquistas_usuario`: achievements desbloqueados
   - Volume `db_data` garante persistência mesmo após restart dos containers

9. **Toda infraestrutura roda na GCP VM**:
   - IP público: `34.132.60.57` (e2-medium, Ubuntu 22.04)
   - Rede `darkaccess-net`: Frontend, Backend, PostgreSQL, Traefik
   - Rede `challenge-net`: Labs isolados dos serviços principais
   - Firewall GCP: Apenas portas 80/443 expostas publicamente


## Todos os Componentes do Sistema

### 1. Traefik (Reverse Proxy)

**Imagem:** `traefik:v3.0`

**Função:**
- Ponto de entrada único para todo tráfego HTTP (porta 80)
- Roteamento inteligente baseado em labels dos containers
- Gerenciamento de acesso aos labs dinâmicos

**Portas:**
- `80:80` - HTTP (ÚNICA porta exposta externamente)

**Volumes:**
```yaml
- /var/run/docker.sock:/var/run/docker.sock  # Descoberta automática de containers
- ./traefik/traefik.yml:/etc/traefik/traefik.yml  # Configuração estática
- ./traefik/dynamic.yml:/etc/traefik/dynamic.yml  # Configuração dinâmica
- ./traefik/acme.json:/acme.json  # Certificados SSL (futuro)
```

**Redes:**
- `darkaccess-net` - Rede principal da aplicação
- `challenge-net` - Rede isolada dos labs

**Configuração (`traefik.yml`):**
```yaml
api:
  dashboard: true  # Dashboard em localhost:8080

entryPoints:
  web:
    address: ":80"

providers:
  docker:
    exposedByDefault: false  # Apenas containers com traefik.enable=true
  file:
    filename: /etc/traefik/dynamic.yml
    watch: true
```

**Middleware (`dynamic.yml`):**
```yaml
http:
  middlewares:
    strip-challenge:
      stripPrefixRegex:
        regex:
          - "/challenge/[A-Za-z0-9-]+"  # Remove prefixo de labs
```

---

### 2. Frontend (React SPA)

**Build:** Multi-stage Dockerfile

**Stage 1 - Build:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build
```

**Stage 2 - Serve:**
```dockerfile
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Labels Traefik:**
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.frontend.rule=Host(`34.132.60.57`) || Host(`localhost`)"
  - "traefik.http.routers.frontend.entrypoints=web"
  - "traefik.http.services.frontend.loadbalancer.server.port=80"
  - "traefik.http.routers.frontend.priority=1"
```

**Características:**
- Single Page Application (SPA) React 19.1.1
- Servido via Nginx (leve e eficiente)
- Roteamento via React Router 7.9.3
- Build otimizado (minificação, tree shaking)

---

### 3. Backend (Node.js + Express)

**Imagem Base:** `node:18-slim`

**Dockerfile:**
```dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

**Portas:**
- `3001:3001` - Exposição direta (SEM Traefik)

**Volumes Críticos:**
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock  # API Docker para criar containers
  - /usr/bin/docker:/usr/bin/docker            # Binário Docker CLI
  - ./DarkAccess/Back-End:/app                 # Hot reload (dev)
```

**Variáveis de Ambiente:**
```bash
# Banco de Dados
DB_HOST=db_darkaccess
DB_USER=darkaccess_user
DB_PASS=senhasegura123
DB_NAME=darkaccess
DB_PORT=5432

# API
API_HOST=0.0.0.0
API_PORT=3001
NODE_ENV=production

# Deploy
DOMAIN=34.132.60.57    # IP público da VM GCP
USE_TRAEFIK=true       # Habilita modo Traefik para labs
```

**Capacidades Especiais:**
- **Criação de Containers:** Acesso root ao Docker host via socket
- **Gestão de Labs:** Cria/destrói containers sob demanda
- **Métricas:** Exporta métricas Prometheus em `/metrics`

**Dependências:**
- `express@5.1.0` - Framework web
- `pg@8.16.3` - Cliente PostgreSQL
- `bcrypt@6.0.0` - Hash de senhas
- `dockerode` - Cliente Docker API
- `prom-client` - Métricas Prometheus

---

### 4. PostgreSQL (Banco de Dados)

**Imagem Custom:** `costaluan/db_darkaccess`

**Conteúdo da Imagem:**
- PostgreSQL 14
- Schema inicial (tabelas, índices)
- Dados iniciais:
  - Conquistas disponíveis
  - Falas do narrador
  - Dicas por etapa

**Volume Persistente:**
```yaml
volumes:
  - db_data:/var/lib/postgresql/data  # Dados sobrevivem a restarts
```

**Portas:**
- `5432:5432` - Exposição interna na rede `darkaccess-net`

**Variáveis:**
```bash
POSTGRES_USER=darkaccess_user
POSTGRES_PASSWORD=senhasegura123
POSTGRES_DB=darkaccess
```

**Tabelas Principais:**
- `usuarios` - Dados de autenticação e progressão
- `conquistas` - Badges desbloqueáveis
- `conquistas_usuario` - Relacionamento N:N
- `falas_narrador` - Narrativa do jogo
- `dicas_narrador` - Dicas contextualizadas
- `labs_ativos` - Registro de containers criados

---

### 5. Labs Dinâmicos (Containers Sob Demanda)

**Diferencial:** Não estão no `docker-compose.yml` - são criados pelo backend via Docker API.

#### Lab01 - XSS Challenge

**Imagem:** `costaluan/lab01-atualizado:latest`

**Aplicação:** Tech Horizon (blog de tecnologia vulnerável)

**Vulnerabilidades:**
- XSS Reflected e Stored
- Arquivos sensíveis expostos (`/files/leaked-config.json`)
- CORS permissivo

**Porta Interna:** 5173 (Vite dev server)

**Nomeação:** `user{usuario_id}-lab01-{timestamp}`

#### Lab02 - OS Command Injection Database (OSDB)

**Imagem:** `costaluan/lab02-osdb:latest`

**Aplicação:** Sistema de busca de arquivos com vulnerabilidade

**Vulnerabilidades:**
- SQL Injection
- Command Injection via input de busca
- Senhas padrão em arquivos
- Path traversal

**Porta Interna:** 3000 (Node.js + Express)

**Nomeação:** `user{usuario_id}-lab02-{timestamp}`

#### Configuração de Container Dinâmico

```javascript
// Backend: routes/docker.js
const container = await docker.createContainer({
  Image: `costaluan/${lab_id}-atualizado:latest`,
  name: containerName,
  ExposedPorts: { [`${labConfig.porta}/tcp`]: {} },
  HostConfig: {
    PortBindings: { [`${labConfig.porta}/tcp`]: [{ HostPort: `${port}` }] },
    NetworkMode: 'challenge-net',
    AutoRemove: false,
    RestartPolicy: { Name: 'no' }
  },
  Labels: {
    'traefik.enable': 'true',
    'managed-by': 'darkaccess-backend',
    'user-id': usuario_id,
    'lab-id': lab_id,
    'created-at': new Date().toISOString()
  }
});
```

**Lifecycle:**
1. **Criação:** POST `/api/docker/start-lab`
2. **Registro:** Salvo em `activeContainers` (Map) + `labs_ativos` (DB)
3. **Uso:** Usuário acessa via `http://34.132.60.57:{porta}`
4. **Auto-destruição:** Após 30 minutos de inatividade
5. **Remoção Manual:** POST `/api/docker/stop-lab`

---

## Redes Docker

### darkaccess-net (Rede Principal)

**Driver:** `bridge`

**Containers:**
- `traefik`
- `darkaccess-frontend`
- `darkaccess-backend`
- `db_darkaccess`

**Finalidade:** Comunicação entre componentes principais da aplicação.

### challenge-net (Rede de Labs)

**Driver:** `bridge`

**Containers:**
- `traefik` (conectado a ambas as redes)
- Labs dinâmicos (`user*-lab*`)

**Finalidade:** Isolamento dos labs vulneráveis.

**Segurança:**
- Labs não acessam `darkaccess-net`
- Labs não acessam banco de dados diretamente
- Labs não acessam backend diretamente

---


#### Camadas de Segurança


- **Traefik**: SSL/TLS termination, firewall de aplicação
- **Backend**: Bcrypt (10 rounds), prepared statements SQL
- **Docker**: Isolamento de containers, networks separadas (darkaccess-net, challenge-net)
- **GCP**: Firewall rules (apenas portas 80/443 expostas)

#### Fluxo de Dados

1. **Usuário** acessa via navegador (HTTP/HTTPS)
2. **Traefik** recebe e roteia baseado em host/path
3. **Frontend** serve a interface React
4. **Frontend** faz chamadas REST para o **Backend**
5. **Backend** consulta o **PostgreSQL** para dados persistidos
6. **Backend** cria/gerencia labs via **Docker Engine**
7. **Labs** são acessados dinamicamente pelo usuário
8. Toda infraestrutura roda na **GCP VM**

---
## Diagrama do Banco de Dados

<img width="2763" height="1903" alt="Diagrama BD" src="https://github.com/user-attachments/assets/c94c170d-6133-40ed-9450-5a14893addc2" />

---

## Observabilidade - Grafana

<img width="1919" height="962" alt="image" src="https://github.com/user-attachments/assets/85a0c53e-03a6-4ea4-a453-a16420aa7f26" />

Principais métricas monitoradas:
- HTTP Request total
- Usuários Ativos
- Processos CPU

## Qualidade de Software - SonarQube

<img width="2938" height="1658" alt="image" src="https://github.com/user-attachments/assets/7b1fab91-801c-4ba8-8d1e-b385e68992b5" />


## Teste Front-End

File                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                    
---------------------------------|---------|----------|---------|---------|--------------------------------------
All files                        |   28.53 |    20.63 |   26.92 |   29.07 |                                      
 src                             |       0 |      100 |       0 |       0 |                                      
  index.js                       |       0 |      100 |     100 |       0 | 6-7                                  
  routes.js                      |       0 |      100 |       0 |       0 | 12                                   
 src/Pages/DarkAccess            |       0 |        0 |       0 |       0 |                                      
  index.js                       |       0 |        0 |       0 |       0 | 6-103                                
 src/Pages/DeepWeb               |       0 |      100 |       0 |       0 |                                      
  index.js                       |       0 |      100 |       0 |       0 | 5                                    
 src/Pages/Home                  |   26.04 |    16.66 |   31.25 |   26.96 |                                      
  index.js                       |   26.04 |    16.66 |   31.25 |   26.96 | 37-57,66-73,80-83,87-131,167,188-247 
 src/Pages/Login                 |   33.33 |    33.33 |      25 |   33.33 |                                      
  index.js                       |   33.33 |    33.33 |      25 |   33.33 | 15-42,55-63                          
 src/Pages/Register              |   39.13 |       50 |      20 |   39.13 |                                      
  index.js                       |   39.13 |       50 |      20 |   39.13 | 16-36,49-65                          
 src/Pages/Start                 |       0 |        0 |       0 |       0 |                                      
  index.js                       |       0 |        0 |       0 |       0 | 11-135                               
 src/Pages/User                  |       0 |        0 |       0 |       0 |                                      
  index.js                       |       0 |        0 |       0 |       0 | 6-179                                
 src/Pages/Welcome               |       0 |      100 |       0 |       0 |                                      
  index.js                       |       0 |      100 |       0 |       0 | 7-17                                 
 src/components/Narrator         |   82.95 |    73.52 |     100 |   84.81 |                                      
  index.js                       |   82.95 |    73.52 |     100 |   84.81 | 33,43-47,97-98,125-128               
 src/components/NarratorControls |      50 |    81.25 |      50 |      50 |                                      
  index.js                       |      50 |    81.25 |      50 |      50 | 24                                   
 src/components/User             |     100 |      100 |     100 |     100 |                                      
  index.js                       |     100 |      100 |     100 |     100 |                                      
 src/utils                       |   20.68 |     7.14 |   33.33 |   22.22 |                                      
  progressao.js                  |   20.68 |     7.14 |   33.33 |   22.22 | 19-65                                
                                 |         |          |         |         |
Test Suites: 4 failed, 2 passed, 6 total
Tests:       21 failed, 12 passed, 33 total
Snapshots:   0 total
Time:        13.724 s
Ran all test suites.


## testes do Back

File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                    
---------------|---------|----------|---------|---------|--------------------------------------
All files      |   76.12 |    75.17 |    67.5 |   76.48 |                                                                                                                 
 auth.js       |     100 |    88.88 |     100 |     100 | 51,171-172                                                                                                      
 conquistas.js |     100 |      100 |     100 |     100 |                                                                                                                 
 deepweb.js    |     100 |      100 |     100 |     100 |                                                                                                                 
 docker.js     |   51.38 |       52 |      48 |   51.97 | 47-71,83-98,120-127,154-156,161-162,167,175-196,240-246,265-269,280-285,298-304,311-313,322-353,396-414,474-494 
 labs.js       |     100 |      100 |     100 |     100 |                                                                                                                 
 narrador.js   |   97.82 |       84 |     100 |   97.82 | 134,263                                                                                                         
---------------|---------|----------|---------|---------|-----------------------------------------------------------------------------------------------------------------



## Conclusão

O **DarkAccess** é um sistema educacional completo que combina gamificação, narrativa interativa e ambientes práticos isolados para ensinar cibersegurança de forma envolvente. A arquitetura baseada em microserviços Docker, banco de dados relacional e frontend moderno garante escalabilidade, segurança e manutenibilidade.

Os requisitos funcionais cobrem toda a jornada do usuário desde registro até conclusão dos labs, enquanto os requisitos não funcionais garantem performance, segurança e observabilidade adequadas para um ambiente de produção.

