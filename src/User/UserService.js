import _ from 'lodash';
import pool from '../Utils/DBUtils';
import {
  HashPassword,
  GenerateAccessToken,
  IsPasswordVerified,
} from '../Utils/AuthUtils';
import SQLQueries from '../Utils/SQLUtils';
import RoleUtils from '../Utils/RoleUtils';

const UserCreate = async ({email, password, role}) => {
  const hashed = await HashPassword(password);
  if (role === RoleUtils.CARE_TAKER) {
    await pool.query(SQLQueries.CREATE_CARE_TAKER, [email, hashed]);
  } else if (role === RoleUtils.PET_OWNER) {
    await pool.query(SQLQueries.CREATE_PET_OWNER, [email, hashed]);
  } else if (role === RoleUtils.ADMINISTRATOR) {
    await pool.query(SQLQueries.CREATE_ADMINISTRATOR, [email, hashed]);
  } else {
    throw new Error('Invalid Role');
  }
  return {accessToken: GenerateAccessToken({email, role})};
};

const UserInfo = async ({email, role}) => {
  let users = null;
  if (role === RoleUtils.CARE_TAKER) {
    users = await pool.query(SQLQueries.SELECT_CARE_TAKER, [email]);
  } else if (role === RoleUtils.PET_OWNER) {
    users = await pool.query(SQLQueries.SELECT_PET_OWNER, [email]);
  } else if (role === RoleUtils.ADMINISTRATOR) {
    users = await pool.query(SQLQueries.SELECT_ADMINISTRATOR, [email]);
  } else {
    throw new Error('Invalid Role');
  }
  const user = _.omit(users.rows[0], ['password']);
  return user;
};

const UserLogin = async ({email, password, role}) => {
  let users = null;
  if (role === RoleUtils.CARE_TAKER) {
    users = await pool.query(SQLQueries.SELECT_CARE_TAKER, [email]);
  } else if (role === RoleUtils.PET_OWNER) {
    users = await pool.query(SQLQueries.SELECT_PET_OWNER, [email]);
  } else if (role === RoleUtils.ADMINISTRATOR) {
    users = await pool.query(SQLQueries.SELECT_ADMINISTRATOR, [email]);
  } else {
    throw new Error('Invalid Role');
  }
  const user = users.rows[0];
  if (role === RoleUtils.ADMINISTRATOR && user.is_approved === false) {
    throw new Error('Unapproved');
  }
  if (await IsPasswordVerified(password, user.password)) {
    return {accessToken: GenerateAccessToken({email, role})};
  }
  throw new Error('Unauthorized');
};

const UserDelete = async ({email, role}) => {
  if (role === RoleUtils.CARE_TAKER) {
    await pool.query(SQLQueries.DELETE_CARE_TAKER, [email]);
  } else if (role === RoleUtils.PET_OWNER) {
    await pool.query(SQLQueries.DELETE_PET_OWNER, [email]);
  } else if (role === RoleUtils.ADMINISTRATOR) {
    await pool.query(SQLQueries.DELETE_ADMINISTRATOR, [email]);
  } else {
    throw new Error('Invalid Role');
  }
  return {status: 'ok'};
};

const UserApprove = async ({role, approvedEmail}) => {
  if (role === RoleUtils.ADMINISTRATOR) {
    await pool.query(SQLQueries.APPROVE_ADMINISTRATOR, [approvedEmail]);
  } else {
    throw new Error('Invalid Role');
  }
  return {status: 'ok'};
};

const UserPetOwnerUpdate = async ({
  email,
  name,
  gender,
  contact,
  area,
  location,
  bio,
}) => {
  await pool.query(SQLQueries.UPDATE_PET_OWNER, [
    email,
    name,
    gender,
    contact,
    area,
    location,
    bio,
  ]);
  return {status: 'ok'};
};

const UserCareTakerUpdate = async ({
  email,
  name,
  gender,
  contact,
  area,
  location,
  bio,
}) => {
  await pool.query(SQLQueries.UPDATE_CARE_TAKER, [
    email,
    name,
    gender,
    contact,
    area,
    location,
    bio,
  ]);
  return {status: 'ok'};
};

const UserAdministratorUpdate = async ({
  email,
  name,
  gender,
  contact,
  location,
}) => {
  await pool.query(SQLQueries.UPDATE_ADMINISTRATOR, [
    email,
    name,
    gender,
    contact,
    location,
  ]);
  return {status: 'ok'};
};

const UserCareTakerSkillCreate = async ({email, category, price}) => {
  await pool.query(SQLQueries.CREATE_CARE_TAKER_SKILL, [
    email,
    category,
    price,
  ]);
  return {status: 'ok'};
};

const UserCareTakerSkillDelete = async ({email, category}) => {
  await pool.query(SQLQueries.DELETE_CARE_TAKER_SKILL, [email, category]);
  return {status: 'ok'};
};

const UserCareTakerSkillUpdate = async ({email, category, price}) => {
  await pool.query(SQLQueries.UPDATE_CARE_TAKER_SKILL, [
    price,
    email,
    category,
  ]);
  return {status: 'ok'};
};

const UserCareTakerTypeCreate = async ({email, type}) => {
  if (type === RoleUtils.CARE_TAKER_FULL_TIMER) {
    await pool.query(SQLQueries.CREATE_CARE_TAKER_FULL_TIMER, [email]);
  } else if (type === RoleUtils.CARE_TAKER_PART_TIMER) {
    await pool.query(SQLQueries.CREATE_CARE_TAKER_PART_TIMER, [email]);
  } else {
    throw new Error('Invalid Type');
  }
};

const UserCareTakerTypeDelete = async ({email, type}) => {
  if (type === RoleUtils.CARE_TAKER_FULL_TIMER) {
    await pool.query(SQLQueries.DELETE_CARE_TAKER_FULL_TIMER, [email]);
  } else if (type === RoleUtils.CARE_TAKER_PART_TIMER) {
    await pool.query(SQLQueries.DELETE_CARE_TAKER_PART_TIMER, [email]);
  } else {
    throw new Error('Invalid Type');
  }
};

const UserCareTakerAvailabilityDateCreate = async ({email, date, type}) => {
  if (type === RoleUtils.CARE_TAKER_FULL_TIMER) {
    await pool.query(SQLQueries.CREATE_CARE_TAKER_UNAVAILABLE_DATE, [
      email,
      date,
    ]);
  } else if (type === RoleUtils.CARE_TAKER_PART_TIMER) {
    await pool.query(SQLQueries.CREATE_CARE_TAKER_AVAILABLE_DATE, [
      email,
      date,
    ]);
  } else {
    throw new Error('Invalid Type');
  }
};

const UserCareTakerAvailabilityDatesInfo = async ({email, type}) => {
  if (type === RoleUtils.CARE_TAKER_FULL_TIMER) {
    await pool.query(SQLQueries.SELECT_CARE_TAKER_FT_UNAVAILABLE_DATES, [
      email,
    ]);
  } else if (type === RoleUtils.CARE_TAKER_PART_TIMER) {
    await pool.query(SQLQueries.SELECT_CARE_TAKER_PT_AVAILABLE_DATES, [email]);
  } else {
    throw new Error('Invalid Type');
  }
};

const UserCareTakerAvailabilityDateDelete = async ({email, date, type}) => {
  if (type === RoleUtils.CARE_TAKER_FULL_TIMER) {
    await pool.query(SQLQueries.DELETE_CARE_TAKER_FT_UNAVAILABLE_DATE, [
      email,
      date,
    ]);
  } else if (type === RoleUtils.CARE_TAKER_PART_TIMER) {
    await pool.query(SQLQueries.DELETE_CARE_TAKER_PT_AVAILABLE_DATE, [
      email,
      date,
    ]);
  } else {
    throw new Error('Invalid Type');
  }
};

export default {
  UserCreate,
  UserLogin,
  UserInfo,
  UserDelete,
  UserApprove,
  UserPetOwnerUpdate,
  UserCareTakerUpdate,
  UserAdministratorUpdate,
  UserCareTakerSkillCreate,
  UserCareTakerSkillDelete,
  UserCareTakerSkillUpdate,
  UserCareTakerTypeCreate,
  UserCareTakerTypeDelete,
  UserCareTakerAvailabilityDateCreate,
  UserCareTakerAvailabilityDatesInfo,
  UserCareTakerAvailabilityDateDelete,
};
