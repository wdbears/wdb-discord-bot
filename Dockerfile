FROM alpine:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json yarn.lock ./

RUN apk add --update \
    && apk add --no-cache nodejs-current nodejs-npm \
    && apk add --no-cache --virtual .build git curl build-base g++ ffmpeg \
    && npm install -g yarn \
    && yarn install \
    && apk del .build

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

# Run
CMD [ "yarn", "start-prod" ]