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
    SELECT * FROM care_takers WHERE email=$1;
  `,
  SELECT_PET_OWNER: `
    SELECT * FROM pet_owners WHERE email=$1;
  `,
  SELECT_ADMINISTRATOR: `
    SELECT * FROM psc_administrators WHERE email=$1;
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
  APPROVE_ADMINISTRATOR: `
    UPDATE psc_administrators SET is_approved=true WHERE email=$1;
  `,
  UPDATE_PET_OWNER: `
    UPDATE pet_owners SET name=$2, gender=$3, contact=$4, area=$5, location=$6, bio=$7 WHERE email=$1
  `,
  UPDATE_CARE_TAKER: `
    UPDATE care_takers SET name=$2, gender=$3, contact=$4, area=$5, location=$6, bio=$7 WHERE email=$1
  `,
  UPDATE_ADMINISTRATOR: `
    UPDATE psc_administrators SET name=$2, gender=$3, contact=$4, location=$5 WHERE email=$1
  `,
  CREATE_PET_CATEGORY: `
    INSERT INTO pet_categories (
      category, base_price
    ) VALUES (
      $1, $2
    );
  `,
  FETCH_PET_CATEGORIES: `
    SELECT * FROM pet_categories WHERE is_deleted=false;
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
    SELECT email, name, area, location, gender, contact, bio
    FROM care_takers
    WHERE is_deleted = false;
  `,
  FETCH_ALL_CARE_TAKERS_BY_LOCATION: `
    SELECT c1.email, c1.name, c1.area, c1.location, c1.gender, c1.contact, c1.bio
    FROM care_takers c1
    INNER JOIN pet_owners p1 ON p1.area = c1.area
    WHERE c1.is_deleted = false AND p1.is_deleted = false AND p1.email=$1;
  `,
  FETCH_CARE_TAKER: `
    SELECT CASE
              WHEN ctf.email IS NULL THEN 'Part Timer'
              WHEN ctp.email IS NULL THEN 'Full Timer'
            END AS type, 
            ct.email, ct.name, ct.area, ct.location, ct.gender, ct.contact, ct.bio
    FROM care_takers ct
    LEFT JOIN care_taker_full_timers ctf ON ctf.email=ct.email
    LEFT JOIN care_taker_part_timers ctp ON ctp.email=ct.email
    WHERE ct.email = $1;
  `,
  FETCH_CARE_TAKER_SKILLS: `
      SELECT category, price FROM care_taker_skills
      WHERE email = $1;
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
};

export default SQLQueries;
