FROM node:14.17.1-alpine3.12

WORKDIR /usr/src/app

# Installing dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn install --production
RUN npx next telemetry disable

# Copying source files
COPY . .

# Building app
RUN yarn build

# Running the app
ENTRYPOINT ["node", "index.mjs"]
