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
};

export default SQLQueries;
