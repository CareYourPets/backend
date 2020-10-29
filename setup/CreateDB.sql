SET timezone TO 'Asia/Singapore';

CREATE TYPE gender_enum AS ENUM (
  'MALE', 
  'FEMALE'
);

CREATE TYPE area_enum AS enum (
  'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL',
  'NORTH-EAST', 'NORTH-WEST',
  'SOUTH-EAST', 'SOUTH-WEST'
);

CREATE TYPE delivery_enum AS ENUM (
  'PET_OWNER_DELIVER',
  'CARE_TAKER_PICK_UP',
  'TRANSFER_THROUGH_PCS'
);

CREATE TYPE payment_enum AS ENUM (
  'CASH',
  'CREDIT'
);

CREATE TABLE pet_owners (
	email VARCHAR PRIMARY KEY,
	password VARCHAR NOT NULL,
	name VARCHAR,
	gender gender_enum,
  contact VARCHAR,
  area area_enum,
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
  area area_enum,
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

CREATE TABLE pet_owner_notifications (
  notif_date TIMESTAMPTZ DEFAULT current_timestamp(2),
  email VARCHAR REFERENCES pet_owners(email) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  message VARCHAR,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY(notif_date)
);

CREATE TABLE care_taker_notifications (
  notif_date TIMESTAMPTZ DEFAULT current_timestamp(2),
  email VARCHAR REFERENCES care_takers(email) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  message VARCHAR,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY(notif_date)
);
/*
CREATE TABLE psc_administrator_notifications (
  notif_date TIMESTAMPTZ DEFAULT current_timestamp,
  email VARCHAR REFERENCES psc_administrators(email),
  is_read BOOLEAN NOT NULL DEFAULT false,
  message VARCHAR,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY(notif_date)
);
*/
CREATE OR REPLACE FUNCTION calculate_duration (start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
  RETURNS INT AS
$$
DECLARE
  duration_interval INTERVAL;
  duration INT = 0;
BEGIN
  duration_interval = end_date - start_date;
  duration = DATE_PART('day', duration_interval);

  RETURN duration;
END;
$$
LANGUAGE 'plpgsql';

CREATE TABLE bids (
  pet_name VARCHAR NOT NULL,
  pet_owner_email VARCHAR NOT NULL,
  care_taker_email VARCHAR REFERENCES care_takers(email), /* NULL until bid is accepted by a care_taker*/
  is_accepted BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  transaction_date TIMESTAMPTZ,
  payment_mode payment_enum, /* NULL until payment is made when bid accepted */
  amount FLOAT, /* NULL until bid is accepted by a care_taker*/
  review_date TIMESTAMPTZ,
  transportation_mode delivery_enum, /* NULL until bid is accepted by a care_taker*/
  review VARCHAR,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (pet_name, pet_owner_email) REFERENCES pets (name, email) ON DELETE CASCADE,
  CHECK(calculate_duration(start_date, end_date) >= 0),
  PRIMARY KEY (pet_name, pet_owner_email, care_taker_email, start_date)
);

-- Care Taker Functions
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

-- Notification Functions
CREATE OR REPLACE FUNCTION create_pet_owner_notification_trigger_funct()
  RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO pet_owner_notifications(email, message)
  VALUES(NEW.pet_owner_email, 'Bid has been created for ' || NEW.pet_owner_email);
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION create_care_taker_notification_trigger_funct()
  RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO care_taker_notifications(email, message)
  VALUES(NEW.care_taker_email, 'Bid has been created for ' || NEW.care_taker_email);
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION update_pet_owner_notification_trigger_funct()
  RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO pet_owner_notifications(email, message)
  VALUES(NEW.pet_owner_email, 'Bid has been updated for ' || NEW.pet_owner_email);
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION update_care_taker_notification_trigger_funct()
  RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO care_taker_notifications(email, message)
  VALUES(NEW.care_taker_email, 'Bid has been updated for ' || NEW.care_taker_email);
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';
/*
CREATE OR REPLACE FUNCTION create_psc_administrator_notification_trigger_funct()
  RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO psc_administrator_notifications(email, message)
  VALUES(NEW.email, 'New Notification for' || NEW.email);
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';
*/
-- Care Taker Triggers
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

-- Notification Triggers
CREATE TRIGGER create_pet_owner_notification_trigger
AFTER INSERT
ON bids
FOR EACH ROW
EXECUTE PROCEDURE create_pet_owner_notification_trigger_funct();

CREATE TRIGGER create_care_taker_notification_trigger
AFTER INSERT
ON bids
FOR EACH ROW
EXECUTE PROCEDURE create_care_taker_notification_trigger_funct();

CREATE TRIGGER update_pet_owner_notification_trigger
AFTER UPDATE
ON bids
FOR EACH ROW
EXECUTE PROCEDURE update_pet_owner_notification_trigger_funct();

CREATE TRIGGER update_care_taker_notification_trigger
AFTER UPDATE
ON bids
FOR EACH ROW
EXECUTE PROCEDURE update_care_taker_notification_trigger_funct();
/*
CREATE TRIGGER create_psc_administrator_notification_trigger
AFTER INSERT
ON bids
FOR EACH ROW
EXECUTE PROCEDURE create_psc_administrator_notification_trigger_funct();
*/

