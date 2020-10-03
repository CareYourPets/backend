import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import pool from '../Utils/DBUtils';
import {
  HashPassword,
  GenerateAccessToken,
  IsPasswordVerified,
} from '../Utils/AuthUtils';
import SQLQueries from '../Utils/SQLUtils';

const UserCreate = async ({email, password, role, firstName, lastName}) => {
  const hashed = await HashPassword(password);
  const timestamp = moment(Date.now()).format();
  const uid = uuidv4();

  // use sql transaction to insert into tables users and roles
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(SQLQueries.CREATE_USER, [
      uid,
      email,
      hashed,
      firstName,
      lastName,
      timestamp,
      timestamp,
    ]);
    await client.query(SQLQueries.CREATE_ROLE, [
      uid,
      role,
      timestamp,
      timestamp,
    ]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return {accessToken: GenerateAccessToken({uid, email, role, roles: [role]})};
};

const UserInfo = async (user) => {
  const {email} = user;
  const {rows} = await pool.query(SQLQueries.SELECT_USER_ROLE_FOR_AUTH, [
    email,
  ]);
  const roles = _.map(rows, (row) => row.role);
  return {...user, roles};
};

const UserLogin = async ({email, password, role}) => {
  const {rows} = await pool.query(SQLQueries.SELECT_USER_ROLE_FOR_AUTH, [
    email,
  ]);
  const roles = _.map(rows, (row) => row.role);
  if (
    !_.includes(roles, role) ||
    !IsPasswordVerified(password, rows[0].password)
  ) {
    throw new Error('Not Authorized');
  }
  const {uid} = rows[0];
  return {accessToken: GenerateAccessToken({uid, email, role, roles})};
};

const UserDelete = async (user) => {
  const timestamp = moment(Date.now()).format();
  await pool.query(SQLQueries.DELETE_USER, [user.email, timestamp]);
  return {status: 'ok'};
};

export default {
  UserCreate,
  UserInfo,
  UserLogin,
  UserDelete,
};
