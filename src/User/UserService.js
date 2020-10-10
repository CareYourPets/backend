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

export default {
  UserCreate,
  UserLogin,
  UserInfo,
  UserDelete,
  UserApprove,
};
