FROM node:20.12.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY ./src ./src

CMD [ "npm", "start"]
