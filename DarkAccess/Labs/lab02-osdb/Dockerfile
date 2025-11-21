FROM node:18-alpine as build

RUN apk add --no-cache bash sqlite coreutils
RUN adduser -D -h /home/labuser labuser

WORKDIR /lab

COPY files/ ./files/
COPY run.sh seed_db.sql server.js index.html ./
RUN npm install express body-parser

RUN chmod +x /lab/run.sh && chown -R labuser:labuser /lab
RUN sqlite3 /lab/main.sqlite < /lab/seed_db.sql && chown labuser:labuser /lab/main.sqlite

# ---------------- NGINX ------------------

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /lab/index.html /usr/share/nginx/html/index.html

COPY --from=build /lab/files /usr/share/nginx/html/files

COPY --from=build /lab /lab

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
