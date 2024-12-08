FROM node:20-alpine3.20 


RUN npm i -g nodemon
RUN npm i -g ts-node

WORKDIR /app

COPY package.json /app

RUN npm i

COPY . /app

ENTRYPOINT npm start