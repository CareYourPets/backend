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
  area area_enum,
  location VARCHAR,
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
  category VARCHAR REFERENCES pet_categories(category) ON UPDATE CASCADE,
  price FLOAT NOT NULL,
  PRIMARY KEY(email, category)
);

CREATE OR REPLACE FUNCTION care_taker_full_timer_existence_check(new_email VARCHAR)
  RETURNS BOOLEAN AS
$$
BEGIN
  IF (
      SELECT count(*)
      FROM care_taker_part_timers
      WHERE email = new_email
     ) > 0
  THEN
    RAISE EXCEPTION 'Caretaker is already part timer';
    RETURN false;
  END IF;
  RETURN true;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION care_taker_part_timer_existence_check(new_email VARCHAR)
  RETURNS BOOLEAN AS
$$
BEGIN
  IF (
      SELECT count(*)
      FROM care_taker_full_timers
      WHERE email = new_email
     ) > 0
  THEN
    RAISE EXCEPTION 'Caretaker is already full timer';
    RETURN false;
  END IF;
  RETURN true;
END;
$$
LANGUAGE 'plpgsql';

CREATE TABLE care_taker_full_timers (
  email VARCHAR REFERENCES care_takers(email),
  CHECK(care_taker_full_timer_existence_check(email)),
  PRIMARY KEY(email)
);

CREATE TABLE care_taker_part_timers (
  email VARCHAR REFERENCES care_takers(email),
  CHECK(care_taker_part_timer_existence_check(email)),
  PRIMARY KEY(email)
);

CREATE OR REPLACE FUNCTION check_care_taker_pt_availability(email VARCHAR, date DATE)
  RETURNS BOOLEAN AS
$$
DECLARE
  /* Must be within 2 years window of current_timestamp's year */
  upper_bound DATE = (date_trunc('year', current_timestamp::date) + interval '2 year' - interval '1 day')::date;
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
  email VARCHAR REFERENCES care_taker_full_timers(email) ON DELETE CASCADE,
  date DATE NOT NULL,
  CHECK(check_care_taker_availability(email, date)),
  PRIMARY KEY(email, date)
);

CREATE TABLE care_taker_part_timers_available_dates (
  email VARCHAR REFERENCES care_taker_part_timers(email) ON DELETE CASCADE,
  date DATE NOT NULL,
  CHECK(check_care_taker_pt_availability(email, date)),
  PRIMARY KEY(email, date)
);

CREATE OR REPLACE FUNCTION care_taker_full_timers_unavailable_dates_insert_trigger_funct()
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
    FROM (
      SELECT MIN(date) AS min, MAX(date) max
      FROM (
        /* Create paritions of consecutive available dates */
        /* Credits to Anon: Adapted from top answer to https://stackoverflow.com/questions/20402089/detect-consecutive-dates-ranges-using-sql */
        SELECT date, (ROW_NUMBER() OVER (ORDER BY date))::int AS i
        FROM (
          /* Generate available dates */
          SELECT date::date
          FROM GENERATE_SERIES(start_of_year, end_of_year,  '1 day'::INTERVAL) AS date
          EXCEPT
          SELECT date
          FROM care_taker_full_timers_unavailable_dates
          WHERE email = NEW.email
        ) AS series
        GROUP BY date
      ) AS grouped
      GROUP BY DATE_PART('day', date - i)
    ) AS grouped_available_dates
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
EXECUTE PROCEDURE care_taker_full_timers_unavailable_dates_insert_trigger_funct();

CREATE OR REPLACE FUNCTION calculate_duration (start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
  RETURNS INT AS 
$$
DECLARE
  start_trunc timestamp = DATE_TRUNC('day', start_date);
  end_trunc timestamp = DATE_TRUNC('day', end_date);
  duration_interval INTERVAL;
  duration INT = 0;
BEGIN
  duration_interval = end_trunc - start_trunc;
  duration = DATE_PART('day', duration_interval);
  -- offset of +1 since date part calculates num of full days
  -- between start and end
  return duration + 1;
END;
$$ 
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calculate_ft_salary (care_taker_id VARCHAR, dateFormat VARCHAR)
  RETURNS FLOAT AS
$$
DECLARE 
  pet_days INT = 0;
  current_days INT = 60;
  salary FLOAT = 3000;
  care_period INT = 0;
  temp_row RECORD;
BEGIN
  FOR temp_row in 
    SELECT * FROM bids 
    WHERE care_taker_id = bids.care_taker_email
    AND TO_CHAR(bids.transaction_date, 'YYYY-MM-DDTHH:mm:ss.sssZ') LIKE dateFormat
    AND bids.is_deleted=false AND bids.is_accepted=true
    ORDER BY bids.end_date, bids.start_date
  LOOP
  if pet_days > 60
    then current_days := pet_days;
  end if;
  care_period := calculate_duration(temp_row.start_date, temp_row.end_date);
  pet_days := pet_days + care_period;
  if pet_days > 60
    then salary := salary + 0.8 * (temp_row.amount / care_period) * (pet_days - current_days);
  end if;
  END LOOP;
  RETURN salary;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION get_full_timer_number_of_pets(
                           new_pet_name VARCHAR,
                           new_pet_owner_email VARCHAR,
                           new_care_taker_email VARCHAR,
                           new_start_date TIMESTAMPTZ,
                           new_end_date TIMESTAMPTZ)
  RETURNS INT AS
$$
DECLARE
  num_of_pets INT = 0;
  BEGIN
    IF EXISTS(
      SELECT 1
      FROM care_taker_part_timers
      WHERE email = new_care_taker_email
    ) THEN
        RETURN num_of_pets;
    ELSIF EXISTS(
      SELECT 1
      FROM bids
      WHERE pet_name = new_pet_name
      AND pet_owner_email = new_pet_owner_email
      AND care_taker_email = new_care_taker_email
      AND start_date = new_start_date
    ) THEN
      SELECT -1 INTO num_of_pets;
    ELSE
      SELECT 0 INTO num_of_pets;
    END IF;
      SELECT COUNT(*) + num_of_pets
      INTO num_of_pets
      FROM bids AS b
      WHERE b.care_taker_email = new_care_taker_email
      AND (
        (new_start_date::date BETWEEN b.start_date::date AND b.end_date::date)
        OR
        (new_end_date::date BETWEEN b.start_date::date AND b.end_date::date)
      )
      AND is_accepted = TRUE;
      RETURN num_of_pets;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION get_part_timer_number_of_pets(
                           new_pet_name VARCHAR,
                           new_pet_owner_email VARCHAR,
                           new_care_taker_email VARCHAR,
                           new_start_date TIMESTAMPTZ,
                           new_end_date TIMESTAMPTZ)
  RETURNS INT AS
$$
DECLARE
  num_of_pets INT = 0;
  BEGIN
    IF EXISTS(
      SELECT 1
      FROM care_taker_full_timers
      WHERE email = new_care_taker_email
    ) THEN
        RETURN num_of_pets;
    ELSIF EXISTS(
      SELECT 1
      FROM bids
      WHERE pet_name = new_pet_name
      AND pet_owner_email = new_pet_owner_email
      AND care_taker_email = new_care_taker_email
      AND start_date = new_start_date
    ) THEN
      SELECT -1 INTO num_of_pets;
    ELSE
      SELECT 0 INTO num_of_pets;
    END IF;
      SELECT COUNT(*) + num_of_pets
      INTO num_of_pets
      FROM bids AS b
      WHERE b.care_taker_email = new_care_taker_email
      AND (
        (new_start_date::date BETWEEN b.start_date::date AND b.end_date::date)
        OR
        (new_end_date::date BETWEEN b.start_date::date AND b.end_date::date)
      )
      AND is_accepted = TRUE;
      RETURN num_of_pets;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION get_average_rating(new_care_taker_email VARCHAR)
  RETURNS FLOAT AS
$$
  DECLARE
  avg_rating FLOAT = 0.0;
  BEGIN
    SELECT AVG(rating)
    INTO avg_rating
    FROM bids
    WHERE bids.care_taker_email = new_care_taker_email
    AND review IS NOT NULL;
    RETURN avg_rating;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_care_taker_availability_for_bid(
                              new_care_taker_email VARCHAR,
                              start_date TIMESTAMPTZ,
                              end_date TIMESTAMPTZ
                            )
  RETURNS BOOLEAN AS
$$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM care_taker_full_timers
      WHERE email = new_care_taker_email
    )
    THEN
      -- full time care taker must not have a leave day in the bid dates range
      IF EXISTS (
        SELECT 1
        FROM care_taker_full_timers_unavailable_dates
        WHERE date BETWEEN start_date::date AND end_date::date
        AND email = new_care_taker_email
      )
      THEN
        RETURN false;
      ELSE
        RETURN true;
      END IF;
    ELSIF EXISTS (
      SELECT 1
      FROM care_taker_part_timers
      WHERE email = new_care_taker_email
    )
    THEN
      -- part time care taker must have be available for all days in the bid dates range
      IF (
        SELECT count(*)
        FROM care_taker_part_timers_available_dates
        WHERE date BETWEEN start_date::date AND end_date::date -- dates inclusive of start_date and end_date
        AND email = new_care_taker_email
      ) = (calculate_duration(start_date, end_date)) -- offset of +1 to include start_date
      THEN
        RETURN true;
      ELSE
        RETURN false;
      END IF;
    ELSE
      RETURN false;
    END IF;
  END;
$$
LANGUAGE 'plpgsql';

CREATE TABLE bids (
  pet_name VARCHAR NOT NULL,
  pet_owner_email VARCHAR NOT NULL,
  care_taker_email VARCHAR REFERENCES care_takers(email),
  is_accepted BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  transaction_date TIMESTAMPTZ,
  payment_mode payment_enum,
  amount FLOAT,
  review_date TIMESTAMPTZ,
  transportation_mode delivery_enum,
  review VARCHAR,
  rating INTEGER NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (pet_name, pet_owner_email) REFERENCES pets (name, email) ON DELETE CASCADE,
  CHECK(rating BETWEEN 0 AND 5),
  CHECK(calculate_duration(start_date, end_date) >= 1),
  CHECK(get_full_timer_number_of_pets(pet_name, pet_owner_email, care_taker_email, start_date, end_date) < 5),
  CHECK(
      (get_part_timer_number_of_pets(pet_name, pet_owner_email, care_taker_email, start_date, end_date) < 5
      AND
      get_average_rating(care_taker_email) >= 4)
      OR
      (get_part_timer_number_of_pets(pet_name, pet_owner_email, care_taker_email, start_date, end_date) < 2
      AND
      get_average_rating(care_taker_email) < 4)
    ),
  CHECK(check_care_taker_availability_for_bid(care_taker_email, start_date, end_date)),
  PRIMARY KEY (pet_name, pet_owner_email, care_taker_email, start_date)
);

CREATE OR REPLACE FUNCTION accept_as_full_timer_if_possible_trigger_funct()
  RETURNS TRIGGER AS
$$
  BEGIN
    IF EXISTS(
      SELECT 1
      FROM care_taker_full_timers
      WHERE NEW.care_taker_email = care_taker_full_timers.email
    ) AND EXISTS(
      SELECT 1
      FROM care_taker_skills JOIN pets
      ON care_taker_skills.category = pets.category
      WHERE NEW.care_taker_email = care_taker_skills.email
      AND NEW.pet_name = pets.name
    )
    THEN
      UPDATE bids
      SET is_accepted = TRUE,
          transaction_date = NEW.start_date
      WHERE care_taker_email = NEW.care_taker_email
      AND pet_owner_email = NEW.pet_owner_email
      AND pet_name = NEW.pet_name
      AND start_date = NEW.start_date
      AND end_date = NEW.end_date;
    END IF;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION auto_calculate_amount_trigger_funct()
  RETURNS TRIGGER AS
$$
  DECLARE new_amount FLOAT;
  DECLARE new_category VARCHAR;
  BEGIN
    -- Get category for new pet
    SELECT pet_info.category
    INTO new_category
    FROM (pets NATURAL JOIN pet_categories) pet_info
    WHERE NEW.pet_name = pet_info.name;
    -- Get price from care_taker_skills
    SELECT price
    INTO new_amount
    FROM care_taker_skills
    WHERE NEW.care_taker_email = email
    AND category = new_category;
    IF (calculate_duration(NEW.start_date, NEW.end_date) = 0) THEN
      UPDATE bids
      SET amount = new_amount
      WHERE pet_name = NEW.pet_name
      AND pet_owner_email = NEW.pet_owner_email
      AND care_taker_email = NEW.care_taker_email
      AND start_date = NEW.start_date;
    ELSE
      UPDATE bids
      SET amount = new_amount * calculate_duration(NEW.start_date, NEW.end_date)
      WHERE pet_name = NEW.pet_name
      AND pet_owner_email = NEW.pet_owner_email
      AND care_taker_email = NEW.care_taker_email
      AND start_date = NEW.start_date;
    END IF;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION update_care_taker_skill_price_trigger_funct()
  RETURNS TRIGGER AS
$$
  DECLARE
    base_price FLOAT;
    avg_rating FLOAT;
    new_category VARCHAR;
    bonus_per_rating INT = 10;
  BEGIN
    IF EXISTS(
      SELECT 1
      FROM bids
      WHERE NEW.review IS NOT NULL
    ) THEN
      -- Get base price from pet_categories and category of pet in bid
      SELECT pet_info.base_price, pet_info.category
      INTO base_price, new_category
      FROM (pets NATURAL JOIN pet_categories) pet_info
      WHERE NEW.pet_name = pet_info.name;
      -- Get average rating from bids
      SELECT AVG(rating)
      INTO avg_rating
      FROM bids
      WHERE NEW.care_taker_email = care_taker_email;
      -- Update entry in care_taker_skills
      UPDATE care_taker_skills
      SET price = base_price + bonus_per_rating * avg_rating
      WHERE email = NEW.care_taker_email
      AND category = new_category;
    ELSE
      SELECT pet_info.base_price
      INTO base_price
      FROM (pets NATURAL JOIN pet_categories) pet_info
      WHERE NEW.pet_name = pet_info.name;
    END IF;
    RETURN NEW;
  END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER accept_as_full_timer_if_possible_trigger
AFTER INSERT
ON bids
FOR EACH ROW
EXECUTE PROCEDURE accept_as_full_timer_if_possible_trigger_funct();

CREATE TRIGGER update_care_taker_skill_price_trigger
AFTER UPDATE
ON bids
FOR EACH ROW
EXECUTE PROCEDURE update_care_taker_skill_price_trigger_funct();

CREATE TRIGGER auto_calculate_amount_trigger
AFTER INSERT
ON bids
FOR EACH ROW
EXECUTE PROCEDURE auto_calculate_amount_trigger_funct();
