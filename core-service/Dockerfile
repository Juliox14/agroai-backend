FROM node:current-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias (incluyendo Prisma)
RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos el cliente de Prisma para que pueda hablar con Postgres
RUN npx prisma generate

# Exponemos el puerto del servidor principal
EXPOSE 3000

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]