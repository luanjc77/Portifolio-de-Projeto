# Gamificação de estudos sobre cibersegurança

## Capa

- **Título do Projeto**:   
- **Nome do Estudante**: Luan Jacomini Costa  
- **Curso**: Engenharia de Software  
- **Data de Entrega**: 

---

## Resumo

Este projeto tem como objetivo demonstrar, de maneira prática e envolvente, conceitos fundamentais de cibersegurança por meio de um ambiente web interativo. O CyberGame guiará o jogador por meio de uma pequena narrativa com desafios e puzzles que abordam desde ataques como phishing e ransomware até fundamentos de redes e sistemas operacionais. Voltado para jovens universitários, o "jogo" proporciona uma experiência gamificada de aprendizado técnico, diferente de abordagens que nescessitam de um breve conhecimento ou mais infantis.

---

## 1. Introdução

### Contexto

Em um mundo onde a segurança digital é cada vez mais vital, este projeto surge como uma proposta inovadora de ensino prático e interativo. A maioria dos jogos existentes sobre o tema são voltados ao público infantil ou ao público já técnico. O CyberGame visa preencher essa lacuna ao se direcionar a iniciantes no ensino superior em áreas de tecnologia.

### Justificativa

A segurança digital é uma área crítica e cada vez mais presente na vida cotidiana. Muitos têm curiosidade sobre o tema, mas encontram barreiras técnicas ou conteúdos excessivamente complexos e teóricos. O CyberGame gamifica conceitos como keyloggers, brute force, phishing, criptografia e redes de forma acessível, prática e imersiva, estimulando o senso crítico e a proteção digital entre novos universitários.

### Objetivos

- **Objetivo principal**: Desenvolver um jogo web interativo com narrativa e minigames que ensinem conceitos práticos de cibersegurança.
- **Objetivos secundários**:
  - Criar uma narrativa imersiva.
  - Explorar conceitos como phishing, brute force, ransomware, redes e sistemas operacionais.
  - Utilizar puzzles inspirados em jogos como "Enigma do Medo" e "Black Riddle"
  - Ambientação enigmática que desperta curiosidade, como o site "Terminal 00".

---

## 2. Descrição do Projeto

### Tema do Projeto

Um site interativo, que conversa com o jogador e apresenta o ambiete, similar a deep/dark web (local na internet que atrai a curiosidade de muitos) e leva o jogador a desafios práticos sobre segurança e estabelece primeiro contato do jogador será com um ataque de phishing, já fazendo parte do enredo.

### Problemas a Resolver

- Tornar o aprendizado de cibersegurança acessível a estudantes iniciantes.
- Criar uma narrativa coesa e envolvente com progressão por fases.
- Desenvolver minigames que equilibrem complexidade e diversão.

### Limitações

- O jogo não abordará técnicas de engenharia reversa avançadas nem simulações realistas de ambientes profissionais.
- O projeto não será voltado a certificações.

---

## 3. Especificação Técnica

### 3.1 Requisitos de Software

#### Requisitos Funcionais (RF)

- RF01 – Sistema de fases com progressão.
- RF02 – Feedback e pontuação ao final de cada fase.
- RF03 – Apresentação dos conceitos ao final de cada desafio.
- RF04 – Sistema de dicas durante os puzzles.
- RF05 – Integração com ranking de jogadores.

#### Requisitos Não-Funcionais (RNF)

- RNF01 – Interface amigável, responsiva e acessível.
- RNF02 – Boa performance nos principais navegadores modernos.
- RNF03 – Código seguro com proteção contra injeção de scripts.
- RNF04 – Armazenamento local de progresso e pontuação do jogador.
- RNF05 – Facilidade de deploy em servidores web simples.

---

## Diagrama

![Blank diagram (1)](https://github.com/user-attachments/assets/e7cc7051-3d35-4ea3-a129-8a7a8504c0be)


### 3.2 Considerações de Design

- O jogo será modular, com fases independentes conectadas por uma narrativa.
- O visual seguirá um estilo retrô, remetendo à estética hacker e à internet antiga.
- Os desafios serão progressivamente mais complexos para manter o interesse.

### Primeiras Telas
![login](https://github.com/user-attachments/assets/e09b297c-da1e-4780-92dc-25ce2c941843)

![início](![image](https://github.com/user-attachments/assets/8efb9b88-14d9-4c8a-9d0f-00debf6da446)


OBS: para o início da exploração, o jogador deverá excoler entre dois ambientes, superficie e profundezas, introduzindo assim o conceito de surface e deep/dark web
mas para acessar o ambiente das profundezas é nescessário obter o login e a senha de uma vpn para poder se conectar a mesma rede profunda e explorar seus conteudos,
essas credenciais serão desbloquiadas pelo usuário atráves de uma dinamica prática.

#### Visão Inicial da Arquitetura

- Frontend em HTML/CSS/JavaScript
- Backend opcional com Node.js + Express (para ranking e autenticação simples)
- JSON como formato de dados para puzzles e fases

#### Padrões de Arquitetura

- Padrão MVC simplificado no front (componentes lógicos e visuais)
- Modularização por fases/minigames

#### Modelos C4

1. **Contexto**: Navegador do usuário acessa o site com puzzles educativos.
2. **Contêineres**: Frontend (UI + lógica de jogo), Backend (ranking e cadastro).
3. **Componentes**: Jogo principal, gerador de puzzles, componente de ranking.
4. **Código**: Modular JS com controllers para fases e interações.

---

### 3.3 Stack Tecnológica

- **Linguagens**:
  - JavaScript
  - HTML5 / CSS3
  - PHP
- **Frameworks e Bibliotecas**:
  - Phaser.js (motor de jogos em 2D)
  - Bootstrap (para UI)
  - Node.js + Express
- **Ferramentas de Desenvolvimento**:
  - Visual Studio Code
  - Trello (gestão de tarefas)
  - Git/GitHub (versionamento)
- **Outras Tecnologias**:
  - JSON (para puzzles)
  - Canva/Figma (para mockups)
  - Draw.io (diagramas)

---

### 3.4 Considerações de Segurança

- As simulações serão feitas de maneira controlada e educativa, sem qualquer execução de códigos maliciosos reais.
- Proteções contra XSS, CSRF e injeções serão consideradas.
- O armazenamento de dados do jogador será mínimo e opcional.

---

## 4. Próximos Passos

- Finalizar storyboard e narrativa principal.
- Implementar primeiros minigames.
- Conectar sistema de pontuação e ranking.
- Testes de usabilidade com estudantes-alvo.
- Expansão e refinamento.

---

## 5. Referências

- [Phaser.js Game Engine](https://phaser.io/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Terminal 00](https://angusnicneven.com/)
- [TryHackMe](https://tryhackme.com/)
- [Hack The Box](https://www.hackthebox.com/)
- [Guardey Game](https://guardey.io/)
- Enigma Negro (jogo nacional com enigmas e narrativa)
- [Welcome to the game](https://store.steampowered.com/app/485380/Welcome_to_the_Game/?l=portuguese)
---



## 7. Avaliações de Professores

- **Considerações Professor(a):**  
  Assinatura: _______________________________

- **Considerações Professor(a):**  
  Assinatura: _______________________________

- **Considerações Professor(a):**  
  Assinatura: _______________________________
