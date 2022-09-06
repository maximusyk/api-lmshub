FROM node:16.3.0-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:16.3.0-alpine as api
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./bin/docker-entrypoint.*.sh ./bin/
COPY .sequelizerc ./
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/migrations ./migrations
COPY --from=build /usr/src/app/seeders ./seeders
RUN npm install --only=production
COPY --from=build /usr/src/app/dist ./dist
CMD ["sh", "./bin/docker-entrypoint.prod.sh"]