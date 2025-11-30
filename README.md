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

## Caso de Uso

## <img width="2040" height="2120" alt="image" src="https://github.com/user-attachments/assets/f5214aeb-c95e-4967-9cc0-3492cbf8ef7a" />

---

## Arquitetura do Projeto

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

### **Requisitos Funcionais (RF)**

| ID | Descrição |
|----|-----------|
| **RF01** | Sistema de autenticação com registro e login | 
| **RF02** | Sistema de progressão por etapas (fases do jogo) | 
| **RF03** | Narrador interativo guiando o jogador | 
| **RF04** | Criação dinâmica de ambientes de laboratório isolados | 
| **RF05** | Sistema de conquistas desbloqueáveis |
| **RF06** | Validação de respostas dos desafios | 
| **RF07** | Feedback instantâneo ao jogador | 
| **RF08** | Perfil de usuário conquistas | 


### **Requisitos Não-Funcionais (RNF)**

| ID | Descrição | 
|----|-----------|
| **RNF01** | Hash seguro de senhas (bcrypt 10 rounds) | 
| **RNF02** | Proteção contra SQL Injection (prepared statements) | 
| **RNF03** | Isolamento de ambientes de laboratório | 
| **RNF04** | Disponibilidade 99% (uptime) | 
| **RNF05** | Cobertura de testes automatizados > 80% | 
| **RNF06** | Deploy automatizado via CI/CD | 
| **RNF07** | Logs estruturados e métricas Prometheus | 

---

a descrição de cada RFC 


os testes implementados e seus resultados.

