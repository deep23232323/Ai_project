FROM node:22

WORKDIR /app

COPY gateway/package*.json ./
RUN npm install

COPY gateway/ ./
COPY shared/ ./shared/

CMD ["node", "index.js"]