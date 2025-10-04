# Dockerfile pour Artisania Frontend
FROM node:24-alpine as build

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm run build


EXPOSE 80

CMD ["npm", "run", "dev"]
