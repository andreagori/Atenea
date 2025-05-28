FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias SIN ejecutar postinstall scripts
RUN npm ci --ignore-scripts

# Copiar el código fuente
COPY . .

# Verificar que los archivos estén copiados (para debug)
RUN ls -la src/auth/

# Generar Prisma después de copiar el código
RUN npx prisma generate

# Compilar el código TypeScript
RUN npm run build

# ---- Segunda fase: Runtime ----
FROM node:20-alpine

WORKDIR /app

# Copiar package.json para instalar dependencias de producción
COPY package.json package-lock.json ./

# Copiar prisma ANTES de npm ci para que el postinstall funcione
COPY --from=builder /app/prisma ./prisma

# Instalar solo dependencias de producción (esto ejecutará prisma generate por el postinstall)
RUN npm ci --only=production

# Copiar archivos compilados desde la fase anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

# Definir variables de entorno
ENV NODE_ENV=production

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]