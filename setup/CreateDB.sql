SET timezone TO 'Asia/Singapore';
SET datestyle TO 'ISO, DMY';

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

CREATE OR REPLACE FUNCTION check_care_taker_pt_availability(email VARCHAR, date DATE)
  RETURNS BOOLEAN AS 
$$
DECLARE
  upper_bound DATE = (current_timestamp::date + interval '2 year' - interval '1 day')::date;
BEGIN
  IF date NOT BETWEEN current_timestamp::date AND upper_bound
  THEN 
    RETURN false;
  END IF;
  RETURN true;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_care_taker_availability(email VARCHAR, date DATE)
  RETURNS BOOLEAN AS 
$$
DECLARE
  start_of_year DATE = (date_trunc('year', NOW()::date))::date;
  end_of_year DATE = (date_trunc('year', NOW()::date) + interval '1 year' - interval '1 day')::date;
BEGIN
  IF date NOT BETWEEN start_of_year AND end_of_year
  THEN 
    RETURN false;
  ELSIF (
    SELECT count(*)
    FROM bids
    WHERE care_taker_email = email
    AND is_accepted = true
    AND date BETWEEN start_date AND end_date
  ) > 0
  THEN 
    RETURN false;
  ELSE
    RETURN true;
  END IF;
END;
$$
LANGUAGE 'plpgsql';

CREATE TABLE care_taker_full_timers_unavailable_dates (
  email VARCHAR REFERENCES care_taker_full_timers(email),
  date DATE NOT NULL,
  CHECK(check_care_taker_availability(email, date)),
  PRIMARY KEY(email, date)
);

CREATE TABLE care_taker_part_timers_available_dates (
  email VARCHAR REFERENCES care_taker_part_timers(email),
  date DATE NOT NULL,
  CHECK(check_care_taker_pt_availability(email, date)),
  PRIMARY KEY(email, date)
);

CREATE OR REPLACE FUNCTION care_taker_full_timer_unavailable_dates_insert_trigger_funct()
  RETURNS trigger AS
$$
DECLARE
  start_of_year DATE = (date_trunc('year', NOW()::date))::date;
  end_of_year DATE = (date_trunc('year', NOW()::date) + interval '1 year' - interval '1 day')::date;
  num_threehundred INT;
  num_onefifty INT;
BEGIN
  /* Ensures there at least 300 working days */
  IF (
    SELECT count(*)
    FROM care_taker_full_timers_unavailable_dates
    WHERE email = NEW.email
    ) > 65
  THEN 
    RAISE EXCEPTION 'No leave days left %', NEW.date;
  END IF;
  /* Generate available dates */
  WITH available_dates AS (
    SELECT *
    FROM (
      SELECT date::date
      FROM GENERATE_SERIES(start_of_year, end_of_year,  '1 day'::INTERVAL) AS date
      EXCEPT
      SELECT date
      FROM care_taker_full_timers_unavailable_dates
      WHERE email = NEW.email
    ) AS series
    ORDER BY series.date
  ),
  /* Create paritions of consecutive available dates */
  /* Credits to Anon: Adapted from top answer to https://stackoverflow.com/questions/20402089/detect-consecutive-dates-ranges-using-sql */
  grouped_available_dates AS (
    SELECT MIN(date) AS min, MAX(date) max
    FROM (
      SELECT date, (ROW_NUMBER() OVER (ORDER BY date))::int AS i 
      FROM available_dates
      GROUP BY date
    ) AS grouped
    GROUP BY DATE_PART('day', date - i)
  )

  /* Splits data into two cases, parition with at least 150 (and below 300) and another with atleast 300 */
  /* Date_part calculates FULL days between, so offset of -2 is need to include max and min */
  SELECT COUNT(one_fifty) , COUNT(three_hundred) INTO num_onefifty, num_threehundred
  FROM (
    SELECT
    CASE
      WHEN calculate_duration(min::timestamp, max::timestamp) >= 298 THEN 1
      ELSE NULL
    END AS three_hundred,
    CASE
      WHEN calculate_duration(min::timestamp, max::timestamp) >= 298 THEN NULL
      WHEN calculate_duration(min::timestamp, max::timestamp) >= 148 THEN 1
      ELSE NULL
    END AS one_fifty
    FROM grouped_available_dates
  ) AS sub;

  IF num_onefifty < 2 AND num_threehundred < 1 
  THEN
    RAISE EXCEPTION 'No leave days left %', NEW.date;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_care_taker_availability(email VARCHAR, date DATE)
  RETURNS BOOLEAN AS 
$$
DECLARE
  start_of_year DATE = (date_trunc('year', NOW()::date))::date;
  end_of_year DATE = (date_trunc('year', NOW()::date) + interval '1 year' - interval '1 day')::date;
BEGIN
  IF date NOT BETWEEN start_of_year AND end_of_year
  THEN 
    RETURN false;
  ELSIF (
    SELECT count(*)
    FROM bids
    WHERE care_taker_email = email
    AND is_accepted = true
    AND date BETWEEN start_date AND end_date
  ) > 0
  THEN 
    RETURN false;
  ELSE
    RETURN true;
  END IF;
END;
$$
LANGUAGE 'plpgsql';

CREATE TABLE care_taker_full_timers_unavailable_dates (
  email VARCHAR REFERENCES care_taker_full_timers(email),
  date DATE NOT NULL,
  CHECK(check_care_taker_availability(email, date)),
  PRIMARY KEY(email, date)
);

CREATE TABLE care_taker_part_timers_available_dates (
  email VARCHAR REFERENCES care_taker_part_timers(email),
  date DATE NOT NULL,
  PRIMARY KEY(email, date)
);

CREATE OR REPLACE FUNCTION care_taker_full_timer_unavailable_dates_insert_trigger_funct()
  RETURNS trigger AS
$$
DECLARE
  start_of_year DATE = (date_trunc('year', NOW()::date))::date;
  end_of_year DATE = (date_trunc('year', NOW()::date) + interval '1 year' - interval '1 day')::date;
  num_threehundred INT;
  num_onefifty INT;
BEGIN
  /* Ensures there at least 300 working days */
  IF (
    SELECT count(*)
    FROM care_taker_full_timers_unavailable_dates
    WHERE email = NEW.email
    ) > 65
  THEN 
    RAISE EXCEPTION 'No leave days left %', NEW.date;
  END IF;
  /* Generate available dates */
  WITH available_dates AS (
    SELECT *
    FROM (
      SELECT date::date
      FROM GENERATE_SERIES(start_of_year, end_of_year,  '1 day'::INTERVAL) AS date
      EXCEPT
      SELECT date
      FROM care_taker_full_timers_unavailable_dates
      WHERE email = NEW.email
    ) AS series
    ORDER BY series.date
  ),
  /* Create paritions of consecutive available dates */
  /* Credits to Anon: Adapted from top answer to https://stackoverflow.com/questions/20402089/detect-consecutive-dates-ranges-using-sql */
  grouped_available_dates AS (
    SELECT MIN(date) AS min, MAX(date) max
    FROM (
      SELECT date, (ROW_NUMBER() OVER (ORDER BY date))::int AS i 
      FROM available_dates
      GROUP BY date
    ) AS grouped
    GROUP BY DATE_PART('day', date - i)
  )

  /* Splits data into two cases, parition with at least 150 (and below 300) and another with atleast 300 */
  /* Date_part calculates FULL days between, so offset of -2 is need to include max and min */
  SELECT COUNT(one_fifty) , COUNT(three_hundred) INTO num_onefifty, num_threehundred
  FROM (
    SELECT
    CASE
      WHEN calculate_duration(min::timestamp, max::timestamp) >= 298 THEN 1
      ELSE NULL
    END AS three_hundred,
    CASE
      WHEN calculate_duration(min::timestamp, max::timestamp) >= 298 THEN NULL
      WHEN calculate_duration(min::timestamp, max::timestamp) >= 148 THEN 1
      ELSE NULL
    END AS one_fifty
    FROM grouped_available_dates
  ) AS sub;

  IF num_onefifty < 2 AND num_threehundred < 1 
  THEN
    RAISE EXCEPTION 'No leave days left %', NEW.date;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER care_taker_full_timers_unavailable_dates_insert_trigger
AFTER INSERT
ON care_taker_full_timers_unavailable_dates
FOR EACH ROW
EXECUTE PROCEDURE care_taker_full_timer_unavailable_dates_insert_trigger_funct();

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
