# Agregador de Anúncios Imobiliários

## Capa

**Título do Projeto:** Agregador Inteligente de Anúncios Imobiliários por Localidade  
**Nome do Estudante:** Luan Jacomini Costa
**Curso:** Engenharia de Software  

---

## Resumo

Este projeto propõe o desenvolvimento de um sistema web (e futuramente mobile) para a agregação de anúncios de imóveis (casas, apartamentos, terrenos, salões, etc.) disponíveis para venda ou aluguel, publicados em sites de imobiliárias. O sistema utilizará geolocalização e scraping automatizado para reunir e exibir os anúncios em um único local, facilitando a consulta e comparação por parte dos usuários. O objetivo é servir como um intermediador de informações, sem envolver-se diretamente nas negociações.

---

## 1. Introdução

### Contexto

A busca por imóveis geralmente envolve a navegação por diversos sites de imobiliárias, o que torna o processo moroso e fragmentado. Uma solução que centralize esses dados pode otimizar a experiência do usuário.

### Justificativa

O projeto apresenta relevância ao propor uma ferramenta de automação e centralização de informações imobiliárias, aliando engenharia de software, scraping de dados, geolocalização e notificações inteligentes.

### Objetivos

- **Objetivo principal:** Desenvolver um agregador de anúncios imobiliários com filtros e sugestões baseadas em geolocalização.
- **Objetivos secundários:** Permitir cadastro de usuários e envio de notificações sobre novos anúncios de interesse.

---

## 2. Descrição do Projeto

### Tema do Projeto

Ferramenta web que agrega e exibe anúncios de imóveis por localidade com base em filtros definidos pelo usuário (tipo, valor, tamanho etc.) e usa scraping via Google Search Scraper para buscar anúncios atualizados em sites de imobiliárias.

### Problemas a Resolver

- Centralização de anúncios dispersos em diferentes sites
- Dificuldade de comparação entre anúncios
- Falta de notificações personalizadas para novos imóveis

### Limitações

- O sistema **não realizará** intermediação ou negociação direta entre comprador e vendedor
- O scraping será limitado por políticas de uso de cada site
- Sujeito à disponibilidade e estrutura dos sites de origem

---

## 3. Especificação Técnica

### 3.1 Requisitos de Software

#### Lista de Requisitos

**Requisitos Funcionais (RF):**

- RF01 – Permitir busca de imóveis por localidade e tipo
- RF02 – Exibir anúncios encontrados
- RF03 – Permitir visualização do anúncio original
- RF04 – Cadastrar usuário
- RF05 – Configurar preferências de notificação
- RF06 – Receber notificações personalizadas (e-mail, SMS, WhatsApp)
- RF07 – Exibir sugestões de imóveis com base na localização do usuário

**Requisitos Não-Funcionais (RNF):**

- RNF01 – Sistema web responsivo
- RNF02 – Tempo de resposta inferior a 3 segundos
- RNF03 – Código modular e escalável
- RNF04 – Conformidade com LGPD no tratamento de dados

#### Representação dos Requisitos

*Ver diagrama de casos de uso em: `docs/diagrama-casos-de-uso.png`*

---

### 3.2 Considerações de Design

#### Visão Inicial da Arquitetura

- Backend: Responsável por orquestrar scraping, autenticação e envio de notificações
- Frontend: Interface web com formulário de busca, listagem de anúncios e sugestões
- Banco de dados: Armazena preferências e dados de usuários

#### Padrões de Arquitetura

- MVC (Model-View-Controller)

#### Modelos C4

- Nível 1 – Sistema: Ferramenta de agregação de anúncios
- Nível 2 – Contêineres: WebApp, API de scraping, Banco de Dados, Serviço de Notificações
- Nível 3 – Componentes: Scraper, Geolocalização, Autenticação, Notificação
- Nível 4 – Código: (a ser detalhado no desenvolvimento)

---

### 3.3 Stack Tecnológica

#### Linguagens de Programação

- Python (backend, scraping)
- JavaScript (frontend)
- HTML/CSS

#### Frameworks e Bibliotecas

- Flask ou FastAPI (Python)
- BeautifulSoup / Playwright (scraping)
- Leaflet.js (geolocalização com OpenStreetMap)
- Email/SMS APIs (Twilio, SMTP)

#### Ferramentas de Desenvolvimento

- Git / GitHub
- Trello (gestão)
- Visual Studio Code
- Postman (testes de API)

---

### 3.4 Considerações de Segurança

- Respeito às políticas dos sites ao fazer scraping
- Criptografia de senhas e dados sensíveis
- Conformidade com LGPD
- Autenticação via tokens

---

## 4. Próximos Passos

| Etapa | Início | Fim | Descrição |
|------|--------|-----|-----------|
| Planejamento | Semana 1 | Semana 2 | Levantamento de requisitos e escopo |
| Design e Arquitetura | Semana 3 | Semana 4 | Modelagem de sistema e protótipos |
| Desenvolvimento Inicial | Semana 5 | Semana 8 | Scraper e busca funcional |
| Funcionalidades Avançadas | Semana 9 | Semana 11 | Cadastro, notificações, sugestões |
| Testes e Validação | Semana 12 | Semana 13 | Testes e ajustes |
| Documentação e Apresentação | Semana 14 | Semana 16 | Finalização da entrega |

---

## 5. Referências

- [Google Search Scraper API](https://www.scraperapi.com/)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Twilio API](https://www.twilio.com/)
- LGPD - Lei Geral de Proteção de Dados (Lei nº 13.709/2018)

---

## 6. Apêndices (Opcionais)

- Imagens de protótipos
- Resultados de scraping simulados
- Logs de testes de API
- Capturas de tela de notificações

---

