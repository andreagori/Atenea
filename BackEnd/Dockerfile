FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json tsconfig.json ./

# Instalar dependencias solo para producción
RUN npm ci --omit=dev

# Copiar el código fuente
COPY . .

# Compilar el código TypeScript
RUN npm run build

# ---- Segunda fase: Runtime ----
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario desde la fase anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./  
COPY --from=builder /app/tsconfig.json ./ 
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

# Definir variables de entorno
ENV NODE_ENV=production

RUN npx prisma generate
# Exponer el puerto
EXPOSE 3000

# Compila la aplicación
RUN npm run build

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]