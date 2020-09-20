import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import _map from 'lodash/map';
import _omit from 'lodash/omit';
import pool from '../Utils/DBUtils';
import {HashPassword, GenerateAccessToken} from '../Utils/AuthUtils';
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
      false,
      firstName,
      lastName,
      timestamp,
      timestamp,
    ]);
    await client.query(SQLQueries.CREATE_ROLE, [
      uid,
      role,
      false,
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
  const {uid} = user;
  const userRoles = (
    await pool.query(SQLQueries.SELECT_USER_ROLE_FOR_AUTH, [uid])
  ).rows;
  const roles = _map(userRoles, (userRole) => userRole.role);
  const userInfo = _omit({...userRoles[0], roles}, ['role']);
  return userInfo;
};

export default {
  UserCreate,
  UserInfo,
};
