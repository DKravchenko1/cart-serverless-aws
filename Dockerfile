FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:webpack

FROM node:18-alpine As production

WORKDIR /usr/src/app

COPY --from=base /usr/src/app/package*.json ./
COPY --from=base /usr/src/app/Dockerfile ./

RUN npm install --only=production && npm cache clean --force

COPY --from=base /usr/src/app/dist ./dist

ENV NODE_ENV production

CMD [ "node", "dist/main.js" ]