# Dockerfile pour Artisania Backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

EXPOSE 5001

# Use node instead of nodemon for production
CMD ["node", "server.js"]
