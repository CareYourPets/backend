import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import _times from 'lodash/times';
import _map from 'lodash/map';
import pool from '../../src/Utils/DBUtils';
import RoleUtils from '../../src/Utils/RoleUtils';

const SeedUsers = async (i, role) => {
  const hashed = '$2b$10$/IJdSgnkHJ4kOgEPxiLEuebNDJ4Jtig.KVG7OtvVd8l1qKANnneu2'; // hashed of 'password'
  const timestamp = moment(Date.now()).format();
  const users = _times(i, (idx) => [
    `${uuidv4()}`,
    `${role}${idx}@example.com`,
    `${hashed}`,
    false,
    `first${idx}`,
    `last${idx}`,
    `${timestamp}`,
    `${timestamp}`,
  ]);
  const userRecords = _map(
    users,
    (user) =>
      `('${user[0]}','${user[1]}','${user[2]}','${user[3]}','${user[4]}','${user[5]}','${user[6]}','${user[7]}')`,
  ).join(',');
  const userQuery = `INSERT INTO users (uid, email, password, is_deleted, first_name, last_name, created_at, updated_at) VALUES ${userRecords};`;
  await pool.query(userQuery);
  return users;
};

const SeedRoles = async (uids, role) => {
  const timestamp = moment(Date.now()).format();
  const roles = _map(uids, (uid) => [
    `${uid}`,
    `${role}`,
    false,
    `${timestamp}`,
    `${timestamp}`,
  ]);
  const roleRecords = _map(
    roles,
    (role) =>
      `('${role[0]}','${role[1]}','${role[2]}','${role[3]}','${role[4]}')`,
  ).join(',');
  const roleQuery = `INSERT INTO roles (uid, role, is_deleted, created_at, updated_at) VALUES ${roleRecords};`;
  await pool.query(roleQuery);
  return roles;
};

const SeedAdministrators = async (i) => {
  const users = await SeedUsers(i, 'admin');
  const uids = _map(users, (user) => user[0]);
  const roles = await SeedRoles(uids, RoleUtils.ADMINISTRATOR);
  return {
    users,
    roles,
  };
};

const SeedPetOwners = async (i) => {
  const users = await SeedUsers(i, 'petowner');
  const uids = _map(users, (user) => user[0]);
  const roles = await SeedRoles(uids, RoleUtils.PET_OWNER);
  return {
    users,
    roles,
  };
};

const SeedCareTakers = async (i) => {
  const users = await SeedUsers(i, 'caretaker');
  const uids = _map(users, (user) => user[0]);
  const roles = await SeedRoles(uids, RoleUtils.CARE_TAKER);
  return {
    users,
    roles,
  };
};

export default {
  SeedAdministrators,
  SeedPetOwners,
  SeedCareTakers,
};
