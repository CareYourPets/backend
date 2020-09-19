import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import _map from 'lodash/map';
import _omit from 'lodash/omit';
import pool from '../Utils/DBUtils';
import {HashPassword, GenerateAccessToken} from '../Utils/AuthUtils';

const UserCreate = async ({email, password, role, firstName, lastName}) => {
  const hashed = await HashPassword(password);
  const timestamp = moment(Date.now()).format();
  const uid = uuidv4();
  const userQuery = `INSERT INTO users (uid, email, password, is_deleted, first_name, last_name, created_at, updated_at) VALUES ('${uid}', '${email}', '${hashed}', false, '${firstName}', '${lastName}', '${timestamp}', '${timestamp}');`;
  await pool.query(userQuery);
  const roleQuery = `INSERT INTO roles (uid, role, is_deleted, created_at, updated_at) VALUES ('${uid}', '${role}', false, '${timestamp}', '${timestamp}');`;
  await pool.query(roleQuery);
  return {accessToken: GenerateAccessToken({uid, email, roles: [role]})};
};

const UserInfo = async (user) => {
  const {uid} = user;
  const userQuery = `SELECT users.uid AS uid, email, first_name AS firstName, last_name AS lastName, users.created_at AS createdAt, roles.role AS role FROM users INNER JOIN roles ON users.uid=roles.uid WHERE users.uid='${uid}' AND users.is_deleted=false AND roles.is_deleted=false;`;
  const userRoles = (await pool.query(userQuery)).rows;
  const roles = _map(userRoles, (userRole) => userRole.role);
  const userInfo = _omit({...userRoles[0], roles}, ['role']);
  return userInfo;
};

export default {
  UserCreate,
  UserInfo,
};
