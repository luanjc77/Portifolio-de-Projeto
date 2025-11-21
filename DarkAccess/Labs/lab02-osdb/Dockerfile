# ---------- BUILD NODE BACKEND ----------
FROM node:18-alpine AS build

WORKDIR /lab

RUN apk add --no-cache bash sqlite coreutils

RUN adduser -D -h /home/labuser labuser

COPY files/ ./files/
COPY run.sh seed_db.sql server.js index.html ./

RUN npm install express body-parser

RUN chmod +x /lab/run.sh && chown -R labuser:labuser /lab
RUN sqlite3 /lab/main.sqlite < /lab/seed_db.sql && chown labuser:labuser /lab/main.sqlite


# ---------- FINAL IMAGE WITH NGINX + NODE ----------
FROM nginx:stable-alpine

# Copia nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia arquivos estáticos
COPY --from=build /lab/index.html /usr/share/nginx/html/index.html
COPY --from=build /lab/files /usr/share/nginx/html/files

# Copia tudo do lab (Node + DB + scripts)
COPY --from=build /lab /lab

# Instala Node dentro da imagem final
RUN apk add --no-cache nodejs npm

# Roda Node + Nginx juntos
CMD sh -c "node /lab/server.js & nginx -g 'daemon off;'"
