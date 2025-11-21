FROM node:18-alpine

# instalar utilitários necessários
RUN apk add --no-cache bash sqlite coreutils

WORKDIR /lab

# copiar arquivos necessários do Node
COPY server.js ./

# copiar arquivos restantes
COPY run.sh seed_db.sql index.html nginx.conf ./
COPY files/ ./files/

# instalar dependências do Node
RUN npm install express body-parser

# permissões
RUN chmod +x /lab/run.sh

# criar banco inicial
RUN sqlite3 /lab/main.sqlite < /lab/seed_db.sql

EXPOSE 3000

CMD ["node", "server.js"]
