FROM node:20-alpine as base

USER root
WORKDIR /webapps
COPY . .
RUN yarn install
COPY . /webapps