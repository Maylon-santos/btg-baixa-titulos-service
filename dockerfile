FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p logs storage storage/processamentos

EXPOSE 3333

CMD ["npm", "start"]