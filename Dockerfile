# syntax=docker/dockerfile:1

# <----- Stage 1 ------>
FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --quiet

COPY . .

RUN npm run init-prisma
RUN npm run build

# <----- Stage 2 ------>
FROM node@sha256:28bed508446db2ee028d08e76fb47b935defa26a84986ca050d2596ea67fd506 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

RUN apk add --no-cache --virtual .build-deps git curl python3 build-base g++

USER node
COPY --chown=node:node --from=build /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --chown=node:node --from=build /usr/src/app/dist ./src

EXPOSE 8080

CMD ["node", "src/server.js"]