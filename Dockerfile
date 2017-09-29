FROM node:latest

ENV NODE_ENV=development

RUN npm install nodemon -g

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json /opt/app
RUN npm install
COPY . /opt/app

EXPOSE 3000
