FROM node:12.14.1-alpine3.11

WORKDIR /home/node/dndbot

COPY dist/* ./
COPY package.json ./

RUN npm i --only=prod

CMD ["node", "Main.js"]