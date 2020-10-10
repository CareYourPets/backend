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
};

export default SQLQueries;
