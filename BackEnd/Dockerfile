# Imagen base optimizada
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias solo para producción
RUN npm ci --omit=dev

# Copiar el código fuente
COPY . .

# Compilar el código TypeScript
RUN npm run build

# ---- Segunda fase para reducir tamaño ----
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario desde la fase anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Definir variables de entorno
ENV NODE_ENV=production

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]