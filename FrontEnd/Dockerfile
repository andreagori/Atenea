# Imagen base optimizada
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# ---- Fase para ejecutar el servidor de desarrollo ----
WORKDIR /app

# Exponer el puerto 4173 (puerto por defecto para Vite)
EXPOSE 5173

# Comando para ejecutar la aplicación en modo preview
CMD ["npm", "run", "dev", "--", "--host"]
