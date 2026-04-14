FROM node:current-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exponemos el puerto del servidor forense
EXPOSE 4000

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]