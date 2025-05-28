FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci 

# Copiar el código fuente
COPY . .

RUN npx prisma generate
# Compilar el código TypeScript
RUN npm run build

# ---- Segunda fase: Runtime ----
FROM node:20-alpine

WORKDIR /app

# Copiar package.json para instalar dependencias de producción
COPY package.json package-lock.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar archivos compilados desde la fase anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

# Generar cliente de Prisma en runtime
RUN npx prisma generate

# Definir variables de entorno
ENV NODE_ENV=production

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]