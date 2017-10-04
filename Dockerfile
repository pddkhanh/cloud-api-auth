FROM node:8.6.0

ENV NODE_ENV=development

RUN npm install nodemon -g


RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json /opt/app
COPY yarn.lock /opt/app/
RUN yarn install
COPY . /opt/app

EXPOSE 3000
