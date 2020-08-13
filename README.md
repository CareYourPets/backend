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

### Deploy

- NA
