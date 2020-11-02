#!/usr/bin/env bash
psql -d $DATABASE_URL -a -f setup/DropDB.sql
psql -d $DATABASE_URL -a -f setup/CreateDB.sql
psql -d $DATABASE_URL -a -f setup/SeedDB.sql
yarn start
