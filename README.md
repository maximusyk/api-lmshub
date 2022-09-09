<p align="center">
  <img src="https://i.ibb.co/BfGPr9q/app-logo.jpg" alt="LMShub" border="0">
</p>

<br />

## LMShub Description

#

-   Swagger API documentation: `/api/docs`
    <br>
-   Swagger API documentation JSON: `/api/docs-json`

<br />

## Configuration

#

**Make sure that all files in `bin` folder are existed !**

-   ### Environment variables

    You need to create few `.env` files as described in `.example.env` file:

    -   `.development.env` - for development environment

    -   `.production.env` - for production environment

<br />

## Installation

#

```bash
$ npm i
```

<br />

## Running the app

#

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# docker development
$ sh ./bin/run.dev.sh

# docker production
$ sh ./bin/run.prod.sh
```

<br />

## Docker configuration

#

Before start docker run this commands:

```bash
$ npm i
$ npm run build
$ docker-compose build --no-cache
```

<br />

## Start Docker

#

```bash
$ docker-compose up -d --force-recreate
```

#

## DB Seed

_Commands described below is running in Docker automatically_

```bash
# Create DB
$ npx sequelize-cli db:create

# Drop DB
$ npx sequelize-cli db:drop

# Insert all seed
$ npx sequelize-cli db:seed:all

# Undo all seed
$ npx sequelize-cli db:seed:undo:all

# Run migrations
$ npx sequelize-cli db:migrate

# Undo all migrations
$ npx sequelize-cli db:migrate:undo:all
```

<br />

## Auth

#

Steps for get auth token:
<br>

1. Send `POST` request with your credentials(`email`, `password`) to API: `/auth/local/signin`. You will receive tokens
   pair: `accessToken` and `refreshToken`.
2. Use accessToken to other requests in API.
3. Use refreshToken to get a new accessToken.
4. To get new accessToken with refreshToken, you need to send POST request to API: `/auth/refresh` with
   payload `{ "refreshToken": <refreshToken> }`.

To test open Swagger API Documentation in browser go to: `https://{host}/api/docs`.
