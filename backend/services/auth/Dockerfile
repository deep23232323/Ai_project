FROM node:22

WORKDIR /app

COPY services/agent/package*.json ./
RUN npm install

COPY services/auth/ ./
COPY shared/ ./shared/

CMD ["node", "index.js"]