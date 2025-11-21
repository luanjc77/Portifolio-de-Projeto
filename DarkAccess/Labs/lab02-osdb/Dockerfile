FROM node:18-alpine

RUN apk add --no-cache bash sqlite coreutils

WORKDIR /lab

COPY files/ ./files/
COPY run.sh seed_db.sql server.js package.json package-lock.json index.html ./

RUN npm install

RUN chmod +x /lab/run.sh
RUN sqlite3 /lab/main.sqlite < /lab/seed_db.sql

EXPOSE 3000

CMD ["node", "server.js"]
