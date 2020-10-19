CREATE TYPE gender_enum AS ENUM (
  'MALE', 
  'FEMALE'
);

CREATE TYPE delivery_enum AS ENUM (
  'PET_OWNER_DELIVER',
  'CARE_TAKER_PICK_UP',
  'TRANSFER_THROUGH_PCS'
)

CREATE TYPE payment_enum AS ENUM (
  'CASH',
  'CREDIT'
)

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

CREATE TABLE pet_categories (
  category VARCHAR PRIMARY KEY,
  base_price NUMERIC NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE pets (
  name VARCHAR NOT NULL,
  category VARCHAR REFERENCES pet_categories(category) ON UPDATE CASCADE,
  email VARCHAR REFERENCES pet_owners(email) ON DELETE CASCADE,
  needs VARCHAR,
  diet VARCHAR,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY(name, email)
);

CREATE TABLE care_taker_skills (
  email VARCHAR REFERENCES care_takers(email),
  category VARCHAR REFERENCES pet_categories(category),
  price NUMERIC NOT NULL,
  PRIMARY KEY(email, category)
);

CREATE TABLE care_taker_full_timers (
  email VARCHAR REFERENCES care_takers(email),
  PRIMARY KEY(email)
);

CREATE TABLE care_taker_part_timers (
  email VARCHAR REFERENCES care_takers(email),
  PRIMARY KEY(email)
);

CREATE OR REPLACE FUNCTION care_taker_full_timer_insert_trigger_funct()
  RETURNS trigger AS
$$
BEGIN
  IF (
      SELECT count(*)
      FROM care_taker_part_timers
      WHERE email = NEW.email
     ) > 0
  THEN
    RAISE EXCEPTION 'Caretaker is already part timer';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION care_taker_part_timer_insert_trigger_funct()
  RETURNS trigger AS
$$
BEGIN
  IF (
      SELECT count(*)
      FROM care_taker_full_timers
      WHERE email = NEW.email
     ) > 0
  THEN
    RAISE EXCEPTION 'Caretaker is already full timer';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';


CREATE TRIGGER care_taker_full_timer_insert_trigger
BEFORE INSERT
ON care_taker_full_timers
FOR EACH ROW
EXECUTE PROCEDURE care_taker_full_timer_insert_trigger_funct();

CREATE TRIGGER care_taker_part_timer_insert_trigger
BEFORE INSERT
ON care_taker_part_timers
FOR EACH ROW
EXECUTE PROCEDURE care_taker_part_timer_insert_trigger_funct();

CREATE TABLE bids (
  pet_name VARCHAR NOT NULL
  pet_email VARCHAR NOT NULL
  care_taker REFERENCES(care_takers) /* NULL until bid is accepted by a care_taker*/
  is_accepted BOOLEAN NOT NULL
  start_date TIMESTAMP NOT NULL
  end_date TIMESTAMP NOT NULL
  transaction_date TIMESTAMP
  payment_mode payment_enum /* NULL until payment is made when bid accepted */
  amount NUMERIC /* NULL until bid is accepted by a care_taker*/
  review_date TIMESTAMP
  transportation_mode delivery_enum /* NULL until bid is accepted by a care_taker*/
  review VARCHAR
  is_deleted BOOLEAN NOT NULL DEFAULT false
  FOREIGN KEY (pet_name, pet_email) REFERENCES pets (name, email)
  CHECK(calculate_duration(start_date, end_date) >= 0)
  PRIMARY KEY (pet_email, start_date)
);

CREATE OR REPLACE FUNCTION calculate_duration (start_date TIMESTAMP, end_date TIMESTAMP)
  RETURNS INT AS $$
DECLARE
  duration_interval INTERVAL;
  duration INT = 0;
BEGIN
  duration_interval = start_date - end_date;
  duration = DATE_PART('day', duration_interval);

  RETURN duration; 
END;
$$ 
LANGUAGE 'plpgsql';
