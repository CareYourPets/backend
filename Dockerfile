FROM node:12.16

RUN echo "Building Docker Image For Backend App"

COPY . /app
WORKDIR /app

RUN ls -la

RUN yarn install

CMD yarn start