FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DB
ARG DB_HOST
ARG DB_USER
ARG DB_PASS
ARG DB_PORT
ARG DB_LOGGING
ARG JWT_SECRET
ARG NODE_ENV

RUN echo "DB=$DB" > .env && \
    echo "DB_HOST=$DB_HOST" > .env && \
    echo "DB_USER=$DB_USER" >> .env && \
    echo "DB_PASS=$DB_PASS" >> .env && \
    echo "DB_PORT=$DB_PORT" >> .env && \
    echo "DB_LOGGING=$DB_LOGGING" >> .env && \
    echo "NODE_ENV=$NODE_ENV" >> .env && \
    echo "JWT_SECRET=$JWT_SECRET" >> .env

RUN npm run build

EXPOSE 6666

CMD ["npm","run","start"]
