# DarkAccess - Cybersecurity Learning Platform

![Status do Projeto](https://img.shields.io/badge/status-Em%20Produ%C3%A7%C3%A3o-green)
![Linguagem Principal](https://img.shields.io/badge/language-JavaScript-yellow)
![Licença](https://img.shields.io/badge/license-MIT-green)
![Hospedagem](https://img.shields.io/badge/hosted-GCP-blue)

## Acesso ao Projeto

**Aplicação:** [http://34.132.60.57](http://34.132.60.57)  
**Backend API:** [http://34.132.60.57:3001](http://34.132.60.57:3001)  
**Hospedagem:** Google Cloud Platform (GCP) - Ubuntu Server

---

## Sobre o Projeto

O **DarkAccess** é uma plataforma educacional desenvolvida como projeto acadêmico que visa democratizar o aprendizado de cibersegurança. O projeto preenche a lacuna entre conteúdos introdutórios teóricos e plataformas de hacking altamente técnicas (como HackTheBox), oferecendo:

- **Narrativa Imersiva:** Sistema de narrador interativo com efeito máquina de escrever que guia o jogador pela jornada
- **Aprendizado Prático:** Laboratórios isolados em containers Docker para cada desafio
- **Progressão Gamificada:** Sistema de etapas, conquistas e vidas
- **Acessibilidade:** 100% via navegador web, sem necessidade de instalações complexas

---

## Funcionalidades Principais

* **Narrativa:** Uma história com temática hacker, guiada por um "narrador" que interage com o jogador e evolui com seu progresso.
* **Desafios Práticos:** Ambientes de laboratório reais e isolados (usando Docker) para cada desafio, permitindo uma experiência prática e segura.
* **Sistema de Progressão e Ranking:** Fases com dificuldade progressiva, sistema de pontuação e um ranking para estimular a competitividade.
* **Acesso 100% via Navegador:** Nenhuma instalação ou configuração complexa necessária. O usuário precisa apenas de um navegador moderno para jogar.

## Stack Tecnológica

### **Backend**
- **Node.js 18** + **Express.js** - API REST
- **PostgreSQL 14** - Banco de dados relacional
- **bcrypt** - Hash seguro de senhas (10 salt rounds)
- **Prometheus** - Métricas e monitoramento
- **Docker** - Gerenciamento dinâmico de containers de labs

### **Frontend**
- **React 18** - Interface do usuário
- **React Router v6** - Navegação SPA
- **Nginx** - Servidor web de produção
- **CSS Modules** - Estilização componetizada

### **Infraestrutura**
- **Docker Compose** - Orquestração de containers
- **Traefik v3** - Proxy reverso e load balancing
- **GCP (Google Cloud Platform)** - Hospedagem em VM Ubuntu Server
- **GitHub Actions** - CI/CD automatizado
- **Jest + Supertest** - Testes automatizados (cobertura 85%+)
- **SonarQube** - Análise de qualidade de código

## Funcionalidades Implementadas

### **Sistema de Autenticação**
-  Registro de usuários com hash bcrypt
-  Login com validação de credenciais
-  Gerenciamento de sessão via localStorage
-  Sistema de vidas (3 tentativas por desafio)

### **Sistema de Progressão**
-  Narrador interativo com efeito máquina de escrever
-  Etapas progressivas do jogo (inicio → welcome → start → labs → deepweb)
-  Sistema de conquistas desbloqueáveis
-  Validação de respostas com feedback instantâneo
-  Progressão salva no banco de dados

### **Gerenciamento Dinâmico de Labs**
- Criação automática de containers Docker por usuário
- Isolamento de ambientes (1 container por usuário/lab)
- Detecção e atribuição de portas dinâmicas
- Cleanup automático de containers (flag `--rm`)
- Rastreamento de labs ativos no PostgreSQL

### **Laboratórios Disponíveis**
-  **Lab 01:** XSS Challenge (Cross-Site Scripting)
  - Formulário de contato vulnerável
  - Validação de payload XSS
-  **Lab 02:** SQL Injection (OSDB)
  - Sistema de login explorável
  - Arquivos sensíveis ocultos


### **Interface do Usuário**
-  Design dark/cyberpunk responsivo
-  Navegação SPA fluida (React Router)
-  Componente Narrator com animações
-  Telas: Home, Login, Register, Welcome, Start, DarkAccess, DeepWeb, User Profile
-  Feedback visual de carregamento e erros


### **Fluxo de Criação de Lab:**
1. Usuário clica em "Acessar Lab"
2. Frontend → POST `/api/docker/start-lab`
3. Backend verifica container existente no PostgreSQL
4. Se não existe: cria container Docker isolado
5. Registra container ativo no banco
6. Retorna URL do lab para o usuário
7. Usuário acessa lab em nova aba

---

### **1. Clone o repositório:**
```bash
git clone https://github.com/luanjc77/Portifolio-de-Projeto.git
cd Portifolio-de-Projeto
```

---

## Requisitos do Sistema

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

### **Contexto da Narrativa**

A Arpheus Tech é uma empresa tradicional do setor tecnológico, com muitos anos de história e experiência. Iniciou sua trajetória como uma pequena desenvolvedora web, mas, ao longo do tempo, expandiu-se e consolidou-se no mercado graças à qualidade de seus projetos e à capacidade de adaptação às mudanças da era digital.

Com essa longa vivência no mundo da tecnologia, a Arpheus acompanhou de perto a evolução da internet — e, junto dela, o crescimento constante dos crimes cibernéticos. Ao observar falhas comuns, como sistemas sem validações adequadas, arquivos sensíveis deixados expostos, rotas não protegidas, uso de credenciais fracas e inúmeros descuidos de desenvolvimento, a empresa percebeu a necessidade urgente de fortalecer a segurança digital.

Foi então que a Arpheus decidiu transformar-se: deixou de atuar apenas no desenvolvimento web e passou a concentrar seus esforços em segurança cibernética. Dessa mudança nasceu a Aurora IA, uma inteligência artificial avançada, criada para monitorar os sistemas internos da corporação e de seus clientes. Além da proteção ativa, a Aurora possui um modo de treinamento, focado em capacitar desenvolvedores e usuários comuns a reconhecerem as ameaças e perigos espalhados pela internet.

Para intensificar o aprendizado de forma prática e instigante, a Arpheus liberou para a Aurora um conjunto de sistemas de teste — ambientes preparados especialmente para que seus alunos possam explorar vulnerabilidades reais, porém controladas. O objetivo é desafiar, despertar curiosidade e fortalecer a habilidade dos participantes em detectar riscos e se defender no universo digital.
