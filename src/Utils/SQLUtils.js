const SQLQueries = {
  CREATE_USER: `
      INSERT INTO users (
        uid, email, password, is_deleted, first_name, last_name, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      );
    `,
  CREATE_ROLE: `
      INSERT INTO roles (
        uid, role, is_deleted, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5
      );
    `,
  SELECT_USER_ROLE_FOR_AUTH: `
      SELECT 
        users.uid AS uid, 
        email, 
        first_name AS firstname, 
        password,
        last_name AS lastname, 
        roles.role AS role 
      FROM 
        users 
      LEFT JOIN roles 
        ON 
          users.uid=roles.uid 
        WHERE 
          users.email=$1 AND 
          users.is_deleted=false AND 
          roles.is_deleted=false;
    `,
  DELETE_USER: `
    UPDATE users SET is_deleted=true, updated_at=$2 WHERE email=$1 AND is_deleted=false;
  `,
  /* 
     Section: Pet
     Author: Arun
  */
  SELECT_PET_OWNER_FOR_ID: `
    SELECT 
      users.uid AS uid
    FROM 
      users
    INNER JOIN 
      pet_owner_profile   ON    users.uid  = pet_owner_profile.uid
    WHERE
      users.email                   = $1    AND
      pet_owner_profile.is_deleted  = false;
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
  CREATE_PET_OWNER: `
    INSERT INTO pet_owner (
      uid, is_deleted, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4
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
};

export default SQLQueries;
