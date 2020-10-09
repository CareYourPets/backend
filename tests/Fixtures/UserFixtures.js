import _ from 'lodash';
import pool from '../../src/Utils/DBUtils';
import RoleUtils from '../../src/Utils/RoleUtils';
import SQLQueries from '../../src/Utils/SQLUtils';
import {HashPassword, GenerateAccessToken} from '../../src/Utils/AuthUtils';

const SeedUsers = async ({email, role}) => {
  const hashed = await HashPassword('password');
  if (role === RoleUtils.CARE_TAKER) {
    await pool.query(SQLQueries.CREATE_CARE_TAKER, [email, hashed]);
  } else if (role === RoleUtils.PET_OWNER) {
    await pool.query(SQLQueries.CREATE_PET_OWNER, [email, hashed]);
  } else {
    await pool.query(SQLQueries.CREATE_ADMINISTRATOR, [email, hashed]);
  }
  return {email, role, accessToken: GenerateAccessToken({email, role})};
};

const SeedPetOwners = async (i) => {
  const role = RoleUtils.PET_OWNER;
  return Promise.all(
    _.times(i, (idx) => SeedUsers({email: `test${idx}@example.com`, role})),
  );
};

const SeedCareTakers = async (i) => {
  const role = RoleUtils.CARE_TAKER;
  return Promise.all(
    _.times(i, (idx) => SeedUsers({email: `test${idx}@example.com`, role})),
  );
};

const SeedAdministrators = async (i) => {
  const role = RoleUtils.ADMINISTRATOR;
  return Promise.all(
    _.times(i, (idx) => SeedUsers({email: `test${idx}@example.com`, role})),
  );
};

export default {
  SeedAdministrators,
  SeedPetOwners,
  SeedCareTakers,
};
