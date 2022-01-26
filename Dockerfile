FROM alpine:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json yarn.lock ./

RUN apk add --update \
    && apk update && apk upgrade \
    && apk add --no-cache --repository https://dl-cdn.alpinelinux.org/alpine/edge/ nodejs npm python3\
    && apk add --no-cache --virtual .build git curl build-base g++ \
    && npm install -g yarn \
    && yarn install \
    && yarn prisma generate \
    && apk del .build

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

# Run
CMD [ "yarn", "start-prod" ]