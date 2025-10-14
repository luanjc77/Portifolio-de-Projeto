# DarkAccess Cybersecurity Game

![Status do Projeto](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellowgreen)
![Linguagem Principal](https://img.shields.io/badge/language-JavaScript-yellow)
![Licença](https://img.shields.io/badge/license-MIT-green)

> Uma plataforma gamificada para aprender cibersegurança de forma prática e imersiva.

O DarkAccess é um projeto acadêmico que visa preencher a lacuna entre conteúdos introdutórios e plataformas de hacking extremamente técnicas. Através de uma narrativa envolvente e desafios "hands-on", o jogador é guiado por conceitos fundamentais de cibersegurança, desde engenharia social até a exploração de sistemas em ambientes controlados.

![Tela de Boas-Vindas do DarkAccess](https://github.com/user-attachments/assets/e09b297c-da1e-4780-92dc-25ce2c941843)
![Tela de Início de Jornada](https://github.com/user-attachments/assets/8efb9b88-14d9-4c8a-9d0f-00debf6da446)

---

## ✨ Funcionalidades Principais

* **📖 Narrativa Imersiva:** Uma história com temática hacker, guiada por um "narrador" que interage com o jogador e evolui com seu progresso.
* **💻 Desafios Práticos:** Ambientes de laboratório reais e isolados (usando Docker) para cada desafio, permitindo uma experiência prática e segura.
* **📈 Sistema de Progressão e Ranking:** Fases com dificuldade progressiva, sistema de pontuação e um ranking para estimular a competitividade.
* **🌐 Acesso 100% via Navegador:** Nenhuma instalação ou configuração complexa necessária. O usuário precisa apenas de um navegador moderno para jogar.

## 🛠️ Stack Tecnológica

O projeto está sendo construído com as seguintes tecnologias:

* **Backend:** Node.js + Express.js, utilizando `bcrypt` para segurança, `pg` para a conexão com o banco e `http-proxy-middleware` para o proxy reverso dos desafios.
* **Frontend:** React, utilizando `react-router-dom` para a navegação entre as telas.
* **Banco de Dados:** PostgreSQL, rodando em um contêiner Docker.
* **Infraestrutura:** Servidor local (Ubuntu Server) com acesso externo via Ngrok para desenvolvimento. Orquestração de ambientes com Docker.
* **Desenvolvimento:** VS Code com a extensão Remote - SSH, DBeaver para gerenciamento do banco.

## 🚀 Status Atual do Projeto

**O projeto evoluiu significativamente da Prova de Conceito para uma arquitetura de aplicação funcional, com os principais sistemas já implementados.**

Os marcos mais recentes concluídos são:

* ✅ **Arquitetura de Back-end Robusta:** A API é capaz de orquestrar contêineres Docker sob demanda. A implementação de um **proxy reverso** garante que os ambientes dos desafios sejam acessados de forma segura e escalável, sem expor múltiplas portas.
* ✅ **Ciclo de Vida dos Desafios:** Implementado o fluxo completo de **criar, acessar e destruir** os ambientes de estudo, garantindo que os recursos do servidor sejam liberados após o uso.
* ✅ **Integração com Banco de Dados:** O back-end está conectado a um banco de dados **PostgreSQL** rodando em Docker, com o schema inicial (`usuarios`, `desafios`, `progresso_usuario`, `falas_narrador`) já projetado.
* ✅ **Sistema de Autenticação:** As rotas de **cadastro (`/register`)** e **login (`/login`)** estão funcionais, incluindo a criptografia segura de senhas com `bcrypt` antes de salvar no banco.
* ✅ **Jornada Inicial do Usuário:** O front-end agora conta com as telas de **Boas-Vindas, Cadastro, Login e Início de Jornada**, com a navegação entre elas implementada.
* ✅ **Componente Narrador:** A base para a narrativa do jogo foi criada com um componente dinâmico que simula uma "conversa" com o usuário na tela principal.
* ✅ **Ambiente de Servidor Local:** O projeto foi migrado com sucesso para um servidor Ubuntu local, com acesso externo configurado via `ngrok` para facilitar o desenvolvimento e os testes.

## 🗺️ Próximos Passos

Com a fundação da arquitetura e da autenticação prontas, o foco agora se volta para a **criação do conteúdo e da lógica do jogo**.

* [ ] **Desenvolver o Primeiro Desafio Real:**
    * Criar o ambiente para o primeiro desafio prático (ex: uma página de login vulnerável a Brute Force).
    * "Dockerizar" este desafio, criando sua imagem.
    * Integrá-lo ao mapa `challengeImages` no back-end.

* [ ] **Implementar a Lógica de Progressão:**
    * Fazer com que o back-end registre no banco de dados (`progresso_usuario`) quando um desafio é concluído.
    * Criar uma rota na API para que o front-end possa buscar o progresso do usuário logado.
    * Bloquear o acesso à "Deep Web" até que os desafios da "Surface Web" sejam concluídos.

* [ ] **Desenvolver a Narrativa Dinâmica:**
    * Criar uma rota na API para buscar as falas do narrador (`falas_narrador`) com base nos "eventos" do jogo (ex: `COMPLETOU_PHISHING`).
    * Fazer o componente `Narrator` no front-end buscar e exibir essas falas dinamicamente, de acordo com o progresso do jogador.
