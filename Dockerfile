FROM node:20-alpine as base

USER root
WORKDIR /webapps
COPY . .
RUN yarn install
RUN yarn build
COPY . /webapps