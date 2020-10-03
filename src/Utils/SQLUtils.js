const SQLQueries = {
  CREATE_USER: `
      INSERT INTO users (
        uid, email, password, deleted, first_name, last_name, created_at, updated_at
      ) VALUES (
        $1, $2, $3, 0, $4, $5, $6, $7
      );
    `,
  CREATE_ROLE: `
      INSERT INTO roles (
        uid, role, deleted, created_at, updated_at
      ) VALUES (
        $1, $2, 0, $3, $4
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
        users.deleted=0 AND 
        roles.deleted=0;
    `,
  DELETE_USER: `
    UPDATE users SET 
      deleted=((SELECT n_deleted FROM (SELECT MAX(deleted) AS n_deleted FROM users) AS n_deleted_value) + 1), 
      updated_at=$2 
    WHERE email=$1 AND deleted=0;
  `,
  CREATE_CARE_TAKER_PROFILE: `
      INSERT INTO care_taker_profile (
        pid, uid, bio, location, gender, deleted, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, 0, $6, $7
      );
    `,
};

export default SQLQueries;
