FROM node:12.18.3-alpine3.12

WORKDIR /home/node/dndbot

COPY dist/ ./
COPY package.json ./

RUN npm i --only=prod

CMD ["node", "Main.js"]
