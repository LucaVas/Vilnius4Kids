# Start from the updated base image
FROM --platform=linux/amd64 node:18.19.0-alpine3.18 AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
