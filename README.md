## Backend

### Install

- Install node

```
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
```

- Install yarn

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
```

- Install postgresql
  - https://www.postgresql.org/download/linux/ubuntu/
  - https://www.pgadmin.org/download/pgadmin-4-apt/
  - https://docs.boundlessgeo.com/suite/1.1.1/dataadmin/pgGettingStarted/firstconnect.html
- Copy .default.env to .env and fill in the environment varibles

### Run

- Run app

```
yarn start
```

- Go to http://localhost:5000

### Test

- Run tests

```
yarn test
```

### Heroku Setup

- Install Heroku
```
https://devcenter.heroku.com/articles/heroku-cli#download-and-install
```

- Login using cli (Make sure that you have access to the deployed heroku app)
```
heroku login
```


### Deploy

- Open app locally during development
```
heroku local
```


- Manual Deployment

```
heroku container:push web --app <app_name>
heroku container:release web --app <app_name>
```

- Check Logs

```
heroku logs --tail --app <app_name>
```

- View

```
heroku open --app <app_name>
```
