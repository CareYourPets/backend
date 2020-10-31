import Assert from 'assert';
import _ from 'lodash';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';

describe('Test UserLogin Service', () => {
  beforeEach('UserLoginService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
    await UserFixtures.SeedCareTakers(1);
    await UserFixtures.SeedPetOwners(2);
    await UserFixtures.SeedAdministrators(2);
  });

  afterEach('UserLoginService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Service should return care taker access token', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;
    const {accessToken} = await UserService.UserLogin({
      email,
      password,
      role,
    });
    const decodedToken = DecodeAccessToken(accessToken);
    Assert.deepStrictEqual(
      {
        email,
        role,
      },
      _.omit(decodedToken, ['iat']),
    );
  });

  it('Service should return pet owner access token', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;
    const {accessToken} = await UserService.UserLogin({
      email,
      password,
      role,
    });
    const decodedToken = DecodeAccessToken(accessToken);
    Assert.deepStrictEqual(
      {
        email,
        role,
      },
      _.omit(decodedToken, ['iat']),
    );
  });

  it('Service should return administrator access token', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;
    await pool.query(
      `UPDATE psc_administrators SET is_approved=true WHERE email='${email}';`,
    );
    const {accessToken} = await UserService.UserLogin({
      email,
      password,
      role,
    });
    const decodedToken = DecodeAccessToken(accessToken);
    Assert.deepStrictEqual(
      {
        email,
        role,
      },
      _.omit(decodedToken, ['iat']),
    );
  });

  it('Service should reject unapproved administrator', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;

    await Assert.rejects(
      () =>
        UserService.UserLogin({
          email,
          password,
          role,
        }),

      Error,
    );
  });
});
