# DarkAccess Cybersecurity Game

![Status do Projeto](https://img.shields.io/badge/status-Em%20Desenvolvimento-blue)
![Linguagem Principal](https://img.shields.io/badge/language-JavaScript-yellow)
![Licença](https://img.shields.io/badge/license-MIT-green)

> Uma plataforma gamificada para aprender cibersegurança de forma prática e imersiva.

O DarkAccess é um projeto acadêmico que visa preencher a lacuna entre conteúdos introdutórios e plataformas de hacking extremamente técnicas. Através de uma narrativa envolvente e desafios "hands-on", o jogador é guiado por conceitos fundamentais de cibersegurança, desde engenharia social até a exploração de sistemas em ambientes controlados.

![Tela de Login do DarkAccess](https://github.com/user-attachments/assets/e09b297c-da1e-4780-92dc-25ce2c941843)
![Tela Inicial do DarkAccess](https://github.com/user-attachments/assets/8efb9b88-14d9-4c8a-9d0f-00debf6da446)

---

## ✨ Funcionalidades Principais

* **📖 Narrativa Imersiva:** Uma história com temática hacker que serve como fio condutor para a jornada de aprendizado.
* **💻 Desafios Práticos:** Ambientes de laboratório reais e isolados (usando Docker) para cada desafio, permitindo uma experiência prática e segura.
* **📈 Sistema de Progressão e Ranking:** Fases com dificuldade progressiva, sistema de pontuação e um ranking para estimular a competitividade.
* **🌐 Acesso 100% via Navegador:** Nenhuma instalação ou configuração complexa necessária. O usuário precisa apenas de um navegador moderno para jogar.

## 🛠️ Stack Tecnológica

O projeto está sendo construído com as seguintes tecnologias:

* **Backend:** Node.js + Express.js para a API e orquestração dos contêineres.
* **Frontend:** HTML5, CSS3, JavaScript, React.
* **Infraestrutura:** Oracle Cloud (VM Always Free), Docker e Docker Compose.
* **Banco de Dados:** A ser definido (provavelmente PostgreSQL ou MySQL).
* **Desenvolvimento:** VS Code com a extensão Remote - SSH.

## 🚀 Status Atual do Projeto

**O projeto avançou da fase de planejamento para a Prova de Conceito (Proof of Concept - PoC) e início do desenvolvimento!**

O marco mais recente, concluído hoje (30/09/2025), foi a validação da arquitetura principal:

* ✅ **Conexão bem-sucedida entre Front-end e Contêiner:** Conseguimos fazer a interface do front-end (React) se conectar a um container Docker de teste, que está rodando em uma VM na nuvem.
* ✅ **Método de redirecionamento validado:** Com este passo, o fluxo para redirecionar os usuários do menu principal para os ambientes de atividades práticas está confirmado e funcionando.

## 🗺️ Próximos Passos

Com a arquitetura base validada, o foco agora se volta para a criação dos desafios e a orquestração dos ambientes. Os próximos grandes marcos são:

- [ ] **Mapear os Desafios:** Detalhar quais ambientes de estudo existirão e quais atividades práticas estarão contidas em cada um deles (ex: um ambiente com um site vulnerável a SQL Injection, outro com um formulário para Brute Force, etc.).

- [ ] **Desenvolver as Atividades:** Criar o código e os componentes de cada desafio individual.

- [ ] **Dockerizar os Desafios:** Criar um `Dockerfile` para cada atividade, transformando-as em contêineres independentes e portáteis.

- [ ] **Orquestrar com Docker Compose:** Desenvolver um arquivo `docker-compose.yml` que irá gerenciar e orquestrar todos os contêineres das atividades, facilitando o gerenciamento dos serviços.

- [ ] **Integrar no Front-end:** Distribuir e interligar os diferentes ambientes orquestrados pelo Docker Compose com os respectivos botões na interface principal do DarkAccess.

## 🤝 Como Contribuir

Este é um projeto acadâmico, mas feedbacks e sugestões são sempre bem-vindos! Se você tiver alguma ideia, sinta-se à vontade para abrir uma *Issue* no repositório.
