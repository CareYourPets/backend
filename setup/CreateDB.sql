CREATE TABLE IF NOT EXISTS users (
  uid UUID PRIMARY KEY,
	email   VARCHAR  NOT NULL UNIQUE,
	password   VARCHAR NOT NULL,
	first_name VARCHAR NOT NULL,
	last_name  VARCHAR NOT NULL,
  deleted INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

DROP TYPE IF EXISTS user_roles_enum;
CREATE TYPE user_roles_enum AS ENUM (
  'PET_OWNER', 
  'CARE_TAKER', 
  'ADMINISTRATOR'
);

CREATE TABLE IF NOT EXISTS roles (
  uid UUID REFERENCES users(uid) ON DELETE CASCADE,
  role user_roles_enum NOT NULL,
  deleted INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(uid, role)
);

DROP TYPE IF EXISTS gender_enum;
CREATE TYPE gender_enum AS ENUM (
  'MALE', 
  'FEMALE'
);

CREATE TABLE IF NOT EXISTS care_taker_profile (
  pid UUID PRIMARY KEY,
  uid UUID REFERENCES users(uid),
  bio TEXT,
  location VARCHAR NOT NULL,
  gender gender_enum NOT NULL,
  deleted INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(uid, deleted)
)
