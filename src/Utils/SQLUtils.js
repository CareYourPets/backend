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
        first_name AS firstName, 
        last_name AS lastName, 
        roles.role AS role 
      FROM 
        users 
      LEFT JOIN roles 
        ON 
          users.uid=roles.uid 
        WHERE 
          users.uid = $1 AND 
          users.is_deleted=false AND 
          roles.is_deleted=false;
    `,
};

export default SQLQueries;
