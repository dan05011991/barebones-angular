FROM node:13

COPY . /usr/webapp
WORKDIR /usr/webapp

RUN npm install
RUN npm test