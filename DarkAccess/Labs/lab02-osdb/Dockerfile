FROM node:18-alpine

# instalar sqlite e utilitários básicos
RUN apk add --no-cache bash sqlite coreutils

# criar usuário não-root
RUN adduser -D -h /home/labuser labuser

WORKDIR /lab

# copiar arquivos do lab
COPY files/ ./files/
COPY run.sh seed_db.sql server.js index.html ./

# instalar dependências do Node
RUN npm install express body-parser

# permissões
RUN chmod +x /lab/run.sh && chown -R labuser:labuser /lab

# criar banco inicial
RUN sqlite3 /lab/main.sqlite < /lab/seed_db.sql && chown labuser:labuser /lab/main.sqlite

USER labuser

EXPOSE 3000

CMD ["node", "server.js"]
