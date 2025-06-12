# Etapa de construcción - común para desarrollo y producción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias y herramientas de Prisma
RUN npm install

# Copiar todo el código fuente
COPY . .

# Etapa de desarrollo
FROM builder AS development

# Variables de entorno para desarrollo
ENV NODE_ENV=development

# Exponer el puerto
EXPOSE 3000

# Comando para desarrollo (con hot-reload)
CMD ["npm", "run", "dev"]

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar solo lo necesario para producción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/tsconfig.json ./

# Variables de entorno para producción
ENV NODE_ENV=production
ENV PORT=3000

# Instalar solo producción en la etapa final
RUN npm prune --production

# Exponer el puerto
EXPOSE 3000

# Comando para producción
CMD ["npm", "start"] 