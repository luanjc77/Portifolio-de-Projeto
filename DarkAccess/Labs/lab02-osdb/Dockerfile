FROM node:18-alpine

# instalar utilitários necessários
RUN apk add --no-cache bash sqlite coreutils nginx

# criar usuário não-root
RUN adduser -D -h /home/labuser labuser

WORKDIR /lab

# copiar arquivos principais do lab
COPY files/ ./files/
COPY run.sh seed_db.sql server.js index.html ./

# instalar dependências do Node
RUN npm install express body-parser

# permissões
RUN chmod +x /lab/run.sh && \
    chown -R labuser:labuser /lab

# criar banco inicial
RUN sqlite3 /lab/main.sqlite < /lab/seed_db.sql && \
    chown labuser:labuser /lab/main.sqlite

# remover config padrão do nginx e adicionar nossas configs
RUN rm -f /etc/nginx/conf.d/default.conf

# copiar nginx.conf PRINCIPAL
COPY nginx.conf /etc/nginx/nginx.conf

# copiar o server block
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

# iniciar Node + Nginx no mesmo container
CMD ["sh", "-c", "node server.js & nginx -g 'daemon off;'"]
