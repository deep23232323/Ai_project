FROM node:22

WORKDIR /app

COPY services/chat/package*.json ./
RUN npm install

COPY services/chat/ ./
COPY shared/ ./shared/

CMD ["node", "index.js"]