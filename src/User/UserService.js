import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
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
  return GenerateAccessToken({uid, email, role});
};

export default {
  UserCreate,
};
