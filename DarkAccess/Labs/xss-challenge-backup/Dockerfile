# --- ESTÁGIO 1: Build (React) ---
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ESTÁGIO 2: Servir com NGINX ---
FROM nginx:stable-alpine

# Remove a config padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados para a pasta servida pelo Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia nossa config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
