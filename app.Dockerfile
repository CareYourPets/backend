FROM node:12.16

RUN echo "Building Docker Image For Backend App"

COPY . /app
WORKDIR /app

RUN ls -la

EXPOSE 5000

RUN yarn install
RUN yarn start

ENTRYPOINT yarn start