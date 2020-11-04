import _ from 'lodash';
import pool from '../../src/Utils/DBUtils';
import RoleUtils from '../../src/Utils/RoleUtils';
import SQLQueries from '../../src/Utils/SQLUtils';
import PetFixtures from './PetFixtures';
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

const SeedSkills = async ({email, category, price}) => {
  await pool.query(SQLQueries.CREATE_CARE_TAKER_SKILL, [
    email,
    category,
    price,
  ]);
  return {email, category, price};
};

const SeedCareTakerSkills = async (i, email) => {
  await PetFixtures.SeedPetCategories(i);
  return Promise.all(
    _.times(i, (idx) =>
      SeedSkills({email, category: `category${idx}`, price: idx}),
    ),
  );
};

const SeedCareTakerRole = async ({email, role}) => {
  if (role === RoleUtils.CARE_TAKER_PART_TIMER) {
    return pool.query(SQLQueries.CREATE_CARE_TAKER_PART_TIMER, [email]);
  }
  return pool.query(SQLQueries.CREATE_CARE_TAKER_FULL_TIMER, [email]);
};

const SeedCareTakerFullTimers = async (i) => {
  return Promise.all(
    _.times(i, async (idx) => {
      const role = RoleUtils.CARE_TAKER;
      const timerRole = RoleUtils.CARE_TAKER_FULL_TIMER;
      const {email, accessToken} = await SeedUsers({
        email: `test${idx}@example.com`,
        role,
      });
      await SeedCareTakerRole({email, role: timerRole});
      return {email, role, accessToken};
    }),
  );
};

const SeedCareTakerPartTimers = async (i) => {
  return Promise.all(
    _.times(i, async (idx) => {
      const role = RoleUtils.CARE_TAKER;
      const timerRole = RoleUtils.CARE_TAKER_PART_TIMER;
      const {email, accessToken} = await SeedUsers({
        email: `test${idx}@example.com`,
        role,
      });
      await SeedCareTakerRole({email, role: timerRole});
      return {email, role, accessToken};
    }),
  );
};

export default {
  SeedAdministrators,
  SeedPetOwners,
  SeedCareTakers,
  SeedCareTakerSkills,
  SeedCareTakerFullTimers,
  SeedCareTakerPartTimers,
};
