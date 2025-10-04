# Dockerfile pour Artisania Backend
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["nodemon", "server.js"]
