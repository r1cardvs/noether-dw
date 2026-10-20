FROM node:20-alpine AS base
WORKDIR /app

COPY package.json ./
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/index.js"]
