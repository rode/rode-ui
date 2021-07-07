ARG NODE_TAG=14.17.1-alpine3.12
FROM node:${NODE_TAG} as builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn install --production

# Copying source files
COPY . .

# Building app
RUN yarn build

###

FROM node:${NODE_TAG}
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=builder /usr/src/app .

ENTRYPOINT ["node", "index.mjs"]
