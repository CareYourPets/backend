import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserService from '../../src/User/UserService';
import {IsPasswordVerified} from '../../src/Utils/AuthUtils';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test UserCreate Service', () => {
  beforeEach('UserCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('UserCreateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Service should create care taker', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;

    await UserService.UserCreate({
      email,
      password,
      role,
    });

    const {rows: users} = await pool.query(
      `SELECT * FROM care_takers WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(email, users[0].email);
  });

  it('Service should create pet owner', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;

    await UserService.UserCreate({
      email,
      password,
      role,
    });

    const {rows: users} = await pool.query(
      `SELECT * FROM pet_owners WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(email, users[0].email);
  });

  it('Service should create administrator', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;

    await UserService.UserCreate({
      email,
      password,
      role,
    });

    const {rows: users} = await pool.query(
      `SELECT * FROM psc_administrators WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(email, users[0].email);
  });

  it('Service should create user with password with valid hashed', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;

    await UserService.UserCreate({
      email,
      password,
      role,
    });

    const {rows: users} = await pool.query(
      `SELECT * FROM pet_owners WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      true,
      await IsPasswordVerified(password, users[0].password),
    );
  });

  it('Service should reject duplicate email for care takers', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;

    await UserService.UserCreate({
      email,
      password,
      role,
    });
    await Assert.rejects(
      () =>
        UserService.UserCreate({
          email,
          password,
          role,
        }),
      Error,
    );
  });

  it('Service should reject duplicate email for pet owners', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;

    await UserService.UserCreate({
      email,
      password,
      role,
    });
    await Assert.rejects(
      () =>
        UserService.UserCreate({
          email,
          password,
          role,
        }),
      Error,
    );
  });

  it('Service should reject duplicate email for administrators', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;

    await UserService.UserCreate({
      email,
      password,
      role,
    });
    await Assert.rejects(
      () =>
        UserService.UserCreate({
          email,
          password,
          role,
        }),
      Error,
    );
  });
});
