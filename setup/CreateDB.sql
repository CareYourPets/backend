CREATE TYPE gender_enum AS ENUM (
  'MALE', 
  'FEMALE'
);

CREATE TABLE pet_owners (
	email VARCHAR PRIMARY KEY,
	password VARCHAR NOT NULL,
	name VARCHAR,
	gender gender_enum,
  contact VARCHAR,
  location VARCHAR,
  bio TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE psc_administrators (
	email VARCHAR PRIMARY KEY,
	password VARCHAR NOT NULL,
	name VARCHAR,
	gender gender_enum,
  contact VARCHAR,
  location VARCHAR,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE care_takers (
	email VARCHAR PRIMARY KEY,
	password VARCHAR NOT NULL,
	name VARCHAR,
	gender gender_enum,
  contact VARCHAR,
  location VARCHAR,
  bio TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS pet_category (
  category        VARCHAR(100)    PRIMARY KEY,
  base_price      NUMERIC(12,2)   NOT NULL
);

CREATE TABLE IF NOT EXISTS pet (
  name                  VARCHAR   NOT NULL,
  category              VARCHAR   REFERENCES pet_category(category),
  pet_owner_id          VARCHAR   REFERENCES pet_owners(email) ON DELETE CASCADE,
  special_needs         VARCHAR,
  diet                  VARCHAR   NOT NULL,
  is_deleted            BOOLEAN   NOT NULL,
  PRIMARY KEY(name, pet_owner_id)
);