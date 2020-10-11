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
    INSERT INTO pet_category (
      category, base_price, created_at, updated_at 
    ) VALUES (
      $1, $2, $3, $4
    );
  `,
  CREATE_PET: `
    INSERT INTO pet (
      name, category, pet_owner_id, special_needs, diet, is_deleted, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    );
  `,
  SELECT_ALL_PET_CATEGORIES: `
    SELECT 
      category, 
      base_price 
    FROM 
      pet_category;
  `,
  SELECT_OWNER_PETS: `
    SELECT
      pet.name,
      pet.special_needs,
      pet.diet,
      pet.category,
      pet_category.base_price
    FROM 
      pet
    INNER JOIN 
      pet_category ON pet_category.category = pet.category
    WHERE
      pet.pet_owner_id     = $1     AND
      pet.is_deleted       = false;
  `,
  SELECT_EACH_PET: `
    SELECT
      pet.special_needs,
      pet.diet,
      pet.category,
      pet_category.base_price,
    FROM 
      pet
    INNER JOIN 
      pet_category ON ON pet_category.category = pet.category
    WHERE 
      pet.name         = $1 AND
      pet.pet_owner_id = $2 AND
      pet.is_deleted   = false;
  `,
  UPDATE_PET_CATEGORY: `
    UPDATE pet_category SET category=$1, base_price=$2 WHERE category=$3;
  `,
  DELETE_PET: `
    UPDATE pet SET is_deleted=true WHERE name=$1 AND pet_category_id=$2;
  `,
};

export default SQLQueries;
