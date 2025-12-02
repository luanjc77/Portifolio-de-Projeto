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

## Observabilidade - Grafana

<img width="1919" height="962" alt="image" src="https://github.com/user-attachments/assets/85a0c53e-03a6-4ea4-a453-a16420aa7f26" />

Principais métricas monitoradas:
- HTTP Request total
- Usuários Ativos
- Processos CPU


## Teste Front-End
---------------------------------|---------|----------|---------|---------|--------------------------------------
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
---------------------------------|---------|----------|---------|---------|--------------------------------------
Test Suites: 4 failed, 2 passed, 6 total
Tests:       21 failed, 12 passed, 33 total
Snapshots:   0 total
Time:        13.724 s
Ran all test suites.


## testes do Back
All files      |   76.12 |    75.17 |    67.5 |   76.48 |                                                                                                                 
 auth.js       |     100 |    88.88 |     100 |     100 | 51,171-172                                                                                                      
 conquistas.js |     100 |      100 |     100 |     100 |                                                                                                                 
 deepweb.js    |     100 |      100 |     100 |     100 |                                                                                                                 
 docker.js     |   51.38 |       52 |      48 |   51.97 | 47-71,83-98,120-127,154-156,161-162,167,175-196,240-246,265-269,280-285,298-304,311-313,322-353,396-414,474-494 
 labs.js       |     100 |      100 |     100 |     100 |                                                                                                                 
 narrador.js   |   97.82 |       84 |     100 |   97.82 | 134,263                                                                                                         
---------------|---------|----------|---------|---------|-----------------------------------------------------------------------------------------------------------------
