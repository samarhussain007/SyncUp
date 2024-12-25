# Dockerfile for Node App
FROM --platform=linux/amd64 node:20-alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json package-lock.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000
EXPOSE 9229

VOLUME [ "/usr/src/node-app", "/usr/src/node-app/node_modules" ]

CMD [ "yarn", "start" ]

