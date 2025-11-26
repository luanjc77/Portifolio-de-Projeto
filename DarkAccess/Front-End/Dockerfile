# Stage 1: Build da aplicação React
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --silent

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Servir com Nginx
FROM nginx:stable-alpine

# Copiar build do React
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
