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
    UPDATE pet_owners SET name=$2, gender=$3, contact=$4, location=$5, bio=$6 WHERE email=$1
  `,
  UPDATE_CARE_TAKER: `
    UPDATE care_takers SET name=$2, gender=$3, contact=$4, location=$5, bio=$6 WHERE email=$1
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
  FETCH_PET: `
    SELECT * FROM pets WHERE email=$1 AND is_deleted=false;
  `,
  FETCH_CARE_TAKERS_FOR_PET_OWNERS_BY_LOCATION: `
    SELECT care_takers.email, care_takers.name, split_part(care_takers.location, '-#-', 2), care_takers.gender, care_takers.contact, care_takers.bio 
    FROM care_takers INNER JOIN pet_owners ON split_part(care_takers.location, '-#-', 1) = split_part(pet_owners.location, '-#-', 1)
    WHERE pet_owners.email = $1 AND pet_owners.is_deleted = false AND care_takers.is_deleted = false;
  `,
  FETCH_CARE_TAKERS_FOR_PET_OWNERS: `
    SELECT email, name, location, gender, contact, bio FROM care_takers
    WHERE is_deleted = false;
  `,
  FETCH_PET_OWNERS_BY_LOCATION: `
  SELECT p1.name, p1.bio
  FROM pet_owners p1
  WHERE location = $1
  EXCEPT
  SELECT p2.name, p2.bio
  FROM pet_owners p2
  WHERE email = $2;
  `,
};

export default SQLQueries;
