CREATE TABLE IF NOT EXISTS users (
  uid UUID PRIMARY KEY,
	email   VARCHAR  NOT NULL UNIQUE,
	password   VARCHAR NOT NULL,
	first_name VARCHAR NOT NULL,
	last_name  VARCHAR NOT NULL,
  is_deleted BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- DROP TYPE IF EXISTS user_roles;
CREATE TYPE user_roles AS ENUM (
  'PET_OWNER', 
  'CARE_TAKER', 
  'ADMINISTRATOR'
);

CREATE TABLE IF NOT EXISTS roles (
  uid UUID REFERENCES users(uid) ON DELETE CASCADE,
  role user_roles NOT NULL,
  is_deleted BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(uid, role)
);

/*  SECTION ON PETS 
    pet_owner_profile:  uid
    pet_category:       pet_category_id
    pet:                pid
*/

CREATE TABLE IF NOT EXISTS pet_owner (
  uid UUID    REFERENCES users(uid) ON DELETE CASCADE,
  is_deleted  BOOLEAN NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY(uid)
);

CREATE TABLE IF NOT EXISTS pet_category (
  category        VARCHAR(100)    PRIMARY KEY,
  base_price      NUMERIC(12,2)   NOT NULL,
  created_at      TIMESTAMP WITH  TIME ZONE NOT NULL,
  updated_at      TIMESTAMP WITH  TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS pet (
  name                  VARCHAR   NOT NULL,
  category              VARCHAR   REFERENCES pet_category(category),
  pet_owner_id          UUID      REFERENCES pet_owner(uid) ON DELETE CASCADE,
  special_needs         VARCHAR,
  diet                  VARCHAR   NOT NULL,
  is_deleted            BOOLEAN   NOT NULL,
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at            TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY(name, pet_owner_id)
);