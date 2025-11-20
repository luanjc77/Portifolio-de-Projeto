# Usar Node LTS
FROM node:18-alpine

# Criar pasta da aplicação
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o restante do backend
COPY . .

# Backend roda na porta 3001
EXPOSE 3001

# Comando para iniciar
CMD ["npm", "start"]
