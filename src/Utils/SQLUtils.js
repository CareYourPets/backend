const SQLQueries = {
  CREATE_CARE_TAKER: `
      INSERT INTO care_takers (
        email, password
      ) VALUES (
        $1, $2
      );
    `,
  CREATE_PET_OWNER: `
    INSERT INTO pet_owners (
      email, password
    ) VALUES (
      $1, $2
    );
  `,
  CREATE_ADMINISTRATOR: `
    INSERT INTO psc_administrators (
      email, password
    ) VALUES (
      $1, $2
    );
  `,
  SELECT_CARE_TAKER: `
    SELECT * FROM care_takers WHERE email=$1 AND is_deleted=false;
  `,
  SELECT_PET_OWNER: `
    SELECT * FROM pet_owners WHERE email=$1 AND is_deleted=false;
  `,
  SELECT_ADMINISTRATOR: `
    SELECT * FROM psc_administrators WHERE email=$1 AND is_deleted=false;
  `,
  DELETE_CARE_TAKER: `
    UPDATE care_takers SET is_deleted=true WHERE email=$1;
  `,
  DELETE_PET_OWNER: `
    UPDATE pet_owners SET is_deleted=true WHERE email=$1;
  `,
  DELETE_ADMINISTRATOR: `
    UPDATE psc_administrators SET is_deleted=true WHERE email=$1;
  `,
  UPDATE_PET_OWNER: `
    UPDATE pet_owners SET name=$2, gender=$3, contact=$4, area=$5, location=$6, bio=$7 WHERE email=$1
  `,
  UPDATE_CARE_TAKER: `
    UPDATE care_takers SET name=$2, gender=$3, contact=$4, area=$5, location=$6, bio=$7 WHERE email=$1
  `,
  UPDATE_ADMINISTRATOR: `
    UPDATE psc_administrators SET name=$2, gender=$3, contact=$4, area=$5, location=$6 WHERE email=$1
  `,
  CREATE_PET_CATEGORY: `
    INSERT INTO pet_categories (
      category, base_price
    ) VALUES (
      $1, $2
    );
  `,
  FETCH_PET_CATEGORIES: `
    SELECT * FROM pet_categories WHERE is_deleted=false ORDER BY category;
  `,
  FETCH_PET_CATEGORY: `
    SELECT * FROM pet_categories WHERE category=$1 AND is_deleted=false;`,
  DELETE_PET_CATEGORY: `
    UPDATE pet_categories SET is_deleted=true WHERE category=$1;
  `,
  CREATE_PET: `
    INSERT INTO pets (
      name, category, email, needs, diet
    ) VALUES (
      $1, $2, $3, $4, $5
    );
  `,
  DELETE_PET: `
    UPDATE pets SET is_deleted=true WHERE name=$1 AND email=$2;
  `,
  UPDATE_PET_CATEGORY: `
    UPDATE pet_categories SET category=$1, base_price=$2 WHERE category=$3;
  `,
  UPDATE_PET: `
    UPDATE pets SET name=$1, category=$2, needs=$3, diet=$4 WHERE name=$5 AND email=$6;
  `,
  SELECT_CARE_TAKER_SKILLS: `
    SELECT category, price FROM care_taker_skills WHERE email=$1;
  `,
  CREATE_CARE_TAKER_SKILL: `
    INSERT INTO care_taker_skills (
      email, category, price
    ) VALUES (
      $1, $2, $3
    );
  `,
  DELETE_CARE_TAKER_SKILL: `
    DELETE FROM care_taker_skills WHERE email=$1 AND category=$2;
  `,
  UPDATE_CARE_TAKER_SKILL: `
    UPDATE care_taker_skills SET price=$1 WHERE email=$2 AND category=$3;
  `,
  CREATE_CARE_TAKER_FULL_TIMER: `
    INSERT INTO care_taker_full_timers (
      email
    ) VALUES (
      $1
    )
  `,
  CREATE_CARE_TAKER_PART_TIMER: `
    INSERT INTO care_taker_part_timers (
      email
    ) VALUES (
      $1
    )
  `,
  DELETE_CARE_TAKER_FULL_TIMER: `
    DELETE FROM care_taker_full_timers WHERE email=$1;
  `,
  DELETE_CARE_TAKER_PART_TIMER: `
    DELETE FROM care_taker_part_timers WHERE email=$1;
  `,
  FETCH_PET: `
    SELECT * FROM pets WHERE email=$1 AND is_deleted=false;
  `,
  FETCH_ALL_CARE_TAKERS: `
    SELECT 
      subquery.email AS email,
      type,
      subquery.name AS name,
      subquery.area AS area,
      subquery.location AS location, 
      subquery.gender AS gender,
      subquery.contact AS contact, 
      subquery.bio AS bio
    FROM 
    (
      SELECT 
        care_takers.email AS email, 
        CASE
        WHEN care_taker_full_timers.email IS NOT NULL THEN 'CARE_TAKER_FULL_TIMER'
        WHEN care_taker_part_timers.email IS NOT NULL THEN 'CARE_TAKER_PART_TIMER'
        ELSE NULL
        END AS type,
        name, 
        area, 
        location, 
        gender, 
        contact, 
        bio
      FROM care_takers
      LEFT JOIN care_taker_full_timers
        ON care_taker_full_timers.email=care_takers.email
      LEFT JOIN care_taker_part_timers
        ON care_taker_part_timers.email=care_takers.email
      WHERE 
        is_deleted = false AND
        name IS NOT NULL AND
        area IS NOT NULL AND
        location IS NOT NULL AND
        gender IS NOT NULL AND
        contact IS NOT NULL AND
        bio IS NOT NULL 
    ) AS subquery
    WHERE
      type IS NOT NULL
    ORDER BY email ASC, name ASC;
  `,
  FETCH_ALL_CARE_TAKERS_BY_LOCATION: `
    SELECT 
      subquery.email AS email,
      type,
      subquery.name AS name,
      subquery.area AS area,
      subquery.location AS location, 
      subquery.gender AS gender,
      subquery.contact AS contact, 
      subquery.bio AS bio
    FROM 
    (
      SELECT 
        care_takers.email AS email, 
        CASE
        WHEN care_taker_full_timers.email IS NOT NULL THEN 'CARE_TAKER_FULL_TIMER'
        WHEN care_taker_part_timers.email IS NOT NULL THEN 'CARE_TAKER_PART_TIMER'
        ELSE NULL
        END AS type,
        name, 
        area, 
        location, 
        gender, 
        contact, 
        bio
      FROM care_takers
      LEFT JOIN care_taker_full_timers
        ON care_taker_full_timers.email=care_takers.email
      LEFT JOIN care_taker_part_timers
        ON care_taker_part_timers.email=care_takers.email
      WHERE 
        is_deleted = false AND
        name IS NOT NULL AND
        area IS NOT NULL AND
        location IS NOT NULL AND
        gender IS NOT NULL AND
        contact IS NOT NULL AND
        bio IS NOT NULL 
    ) AS subquery
    INNER JOIN pet_owners 
      ON pet_owners.area=subquery.area
    WHERE 
      type IS NOT NULL AND
      pet_owners.email=$1
    ORDER BY subquery.email ASC, subquery.name ASC;
  `,
  FETCH_CARE_TAKER: `
    SELECT CASE
              WHEN ctf.email IS NOT NULL THEN 'CARE_TAKER_FULL_TIMER'
              WHEN ctp.email IS NOT NULL THEN 'CARE_TAKER_PART_TIMER'
              ELSE NULL
            END AS type, 
            ct.email, ct.name, ct.area, ct.location, ct.gender, ct.contact, ct.bio
    FROM care_takers ct
    LEFT JOIN care_taker_full_timers ctf ON ctf.email=ct.email
    LEFT JOIN care_taker_part_timers ctp ON ctp.email=ct.email
    WHERE ct.email = $1;
  `,
  FETCH_CARE_TAKER_SKILLS: `
      SELECT category, price FROM care_taker_skills
      WHERE email = $1
      ORDER BY category;
  `,
  FETCH_PET_OWNERS_BY_LOCATION: `
    SELECT email, name, area, location, gender, contact, bio
    FROM pet_owners
    WHERE is_deleted=false AND area = $1;
  `,
  FETCH_PET_OWNER: `
    SELECT email, name, area, location, gender, contact, bio
    FROM pet_owners
    WHERE email = $1;
  `,
  CREATE_BID: `
    INSERT INTO bids (
      pet_name, pet_owner_email, care_taker_email, start_date, end_date
    ) VALUES (
      $1, $2, $3, $4, $5
    )
  `,
  UPDATE_BID: `
    UPDATE bids
    SET is_accepted=$1,
        transaction_date=$2,
        payment_mode=$3,
        review_date=$4,
        transportation_mode=$5,
        review=$6,
        rating=$7
    WHERE pet_name=$8 AND pet_owner_email=$9 AND care_taker_email=$10 AND start_date=$11;
  `,
  DELETE_BID: `
    UPDATE bids SET is_deleted=true WHERE pet_name=$1 AND pet_owner_email=$2 AND care_taker_email=$3 AND start_date=$4;
  `,
  SELECT_BIDS: `
    SELECT * FROM bids WHERE is_deleted=false;
  `,
  SELECT_CARE_TAKER_BIDS: `
    SELECT
      pet_name,
      pet_owner_email,
      care_taker_email,
      is_accepted,
      start_date,
      end_date, 
      transaction_date,
      payment_mode, 
      amount, 
      review_date,
      transportation_mode,
      review,
      rating, 
      name,
      gender,
      contact, 
      area, 
      location, 
      bio
    FROM bids 
    INNER JOIN pet_owners 
      ON bids.pet_owner_email=pet_owners.email 
    WHERE 
      care_taker_email=$1 AND 
      bids.is_deleted=false;
  `,
  SELECT_PET_OWNER_BIDS: `
    SELECT
      pet_name,
      pet_owner_email,
      care_taker_email,
      is_accepted,
      start_date,
      end_date, 
      transaction_date,
      payment_mode, 
      amount, 
      review_date,
      transportation_mode,
      review,
      rating, 
      name,
      gender,
      contact, 
      area, 
      location, 
      bio
    FROM bids 
    INNER JOIN care_takers 
      ON bids.care_taker_email=care_takers.email 
    WHERE 
      pet_owner_email=$1 AND 
      bids.is_deleted=false;
  `,
  CREATE_CARE_TAKER_UNAVAILABLE_DATE: `
    INSERT INTO care_taker_full_timers_unavailable_dates (
      email, date
    ) VALUES (
      $1, $2::date
    )
  `,
  CREATE_CARE_TAKER_AVAILABLE_DATE: `
    INSERT INTO care_taker_part_timers_available_dates (
      email, date
    ) VALUES (
      $1, $2::date
    )
  `,
  SELECT_CARE_TAKER_FT_UNAVAILABLE_DATES: `
    SELECT * FROM care_taker_full_timers_unavailable_dates WHERE email=$1
  `,
  SELECT_CARE_TAKER_PT_AVAILABLE_DATES: `
    SELECT * FROM care_taker_part_timers_available_dates WHERE email=$1
  `,
  DELETE_CARE_TAKER_FT_UNAVAILABLE_DATE: `
    DELETE FROM care_taker_full_timers_unavailable_dates WHERE email=$1 AND date=$2
  `,
  DELETE_CARE_TAKER_PT_AVAILABLE_DATE: `
    DELETE FROM care_taker_part_timers_available_dates WHERE email=$1 AND date=$2
  `,
  FETCH_CARE_TAKER_REVIEWS: `
    SELECT email, name, review, rating 
    FROM bids
    INNER JOIN pet_owners
      ON pet_owners.email=bids.pet_owner_email
    WHERE
      care_taker_email=$1 AND
      is_accepted=true AND
      review IS NOT NULL AND
      rating IS NOT NULL;
  `,
  FETCH_CARE_TAKER_PET_DAYS: `
    SELECT SUM(calculate_duration(start_date, end_date) + 1)
    FROM bids
    WHERE care_taker_email=$1 AND is_accepted=true AND
          TO_CHAR(transaction_date, 'YYYY-MM-DDTHH:mm:ss.sssZ') LIKE $2;
  `,
  FETCH_CARE_TAKER_PART_TIMER_MONTHLY_PAYMENT: `
    SELECT COALESCE(0.75 * SUM(COALESCE(amount,0)), 0) AS sum
    FROM bids
    WHERE care_taker_email=$1 AND is_accepted=true AND
          TO_CHAR(transaction_date, 'YYYY-MM-DDTHH:mm:ss.sssZ') LIKE $2;
  `,
  FETCH_CARE_TAKER_FULL_TIMER_MONTHLY_PAYMENT: `
    SELECT calculate_ft_salary($1, $2);
  `,
  FETCH_CARE_TAKER_MONTHLY_RAW_PAYMENT: `
    SELECT SUM(amount)
    FROM bids
    WHERE care_taker_email=$1 AND is_accepted=true AND
          TO_CHAR(transaction_date, 'YYYY-MM-DDTHH:mm:ss.sssZ') LIKE $2;
  `,
  FETCH_TOTAL_CARE_TAKERS_SALARY: `
    WITH ptt AS (
      SELECT 0.75 * SUM(amount) AS total
      FROM bids INNER JOIN care_taker_part_timers ctp ON bids.care_taker_email = ctp.email
      WHERE is_accepted=true AND TO_CHAR(transaction_date, 'YYYY-MM-DDTHH:mm:ss.sssZ') LIKE $1
    ), ctt AS (
      SELECT SUM(calculate_ft_salary(ct.email, $1)) AS total
      FROM care_takers ct
      INNER JOIN care_taker_full_timers ctf ON ctf.email=ct.email
    )
      SELECT COALESCE(ctt.total,0) + COALESCE(ptt.total,0) AS total
      FROM ctt, ptt;
  `,
  FETCH_CARE_TAKER_ROLE: `
    SELECT CASE 
            WHEN ctf.email=$1 THEN 1
            WHEN ctp.email=$1 THEN 2
            ELSE 0
           END as type
    FROM care_takers ct
    LEFT JOIN care_taker_full_timers ctf ON ctf.email=ct.email
    LEFT JOIN care_taker_part_timers ctp ON ctp.email=ct.email
    WHERE ct.email=$1;
  `,
  FETCH_MONTHLY_TOTAL_NUMBER_OF_UNIQUE_PET: `
    SELECT COUNT(DISTINCT(pet_name, pet_owner_email))
    FROM bids
    WHERE is_accepted=true AND
    (TO_CHAR(start_date, 'YYYY-MM-DDTHH:mm:ss.sssZ') LIKE $1 OR 
     TO_CHAR(end_date, 'YYYY-MM-DDTHH:mm:ss.sssZ') LIKE $1);
  `,
  FETCH_MONTH_WITH_HIGHEST_JOBS: `
    SELECT substring(TO_CHAR(bids.transaction_date, 'YYYY-MM-DDTHH:mm:ss.sssZ'), 1, 7) AS time, COUNT(*) AS total 
    FROM bids 
    GROUP BY substring(TO_CHAR(bids.transaction_date, 'YYYY-MM-DDTHH:mm:ss.sssZ'), 1, 7)
    ORDER BY total DESC, time DESC
    LIMIT 1;
  `,
};

export default SQLQueries;
