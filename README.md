# API - SERVICE - CRAWL - PRICE

A API service is used to get price of tokens and save them on redis.
## Table of Contents
- [Introduction](#introduction)
- [System requirements](#system-requirements)
- [Setup](#setup)
- [Run in Local](#run-in-local)
- [Run with Docker](#run-with-docker)
<!-- - [User manual](#user-manual) -->
## Introduction
This service is designed to get price of token, with third-party API.
## System requirements
List the System requirements needed to run project.
- Redis

## Setup

###  Configure environment variables (if needed)

``` bash
touch .env
```
In the .env file, fill in the following information
``` bash
PORT=

NODE_ENV=
# NODE_ENV=production


REDIS_URL = 
COIN_MARKET_CAP_API = 
TIME_LIMIT = 10800000 # 3 hours 
```
## Run in local
```bash
yarn install
yarn dev
```
## Run with Docker
```bash
docker compose up -d --build
```
