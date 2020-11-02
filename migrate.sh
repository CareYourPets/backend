#!/usr/bin/env bash
PGPASSWORD=password psql -U postgres -h localhost -d dev -a -f setup/DropDB.sql
PGPASSWORD=password psql -U postgres -h localhost -d dev -a -f setup/CreateDB.sql
PGPASSWORD=password psql -U postgres -h localhost -d dev -a -f setup/SeedDB.sql
yarn seed