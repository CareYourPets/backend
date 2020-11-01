import _ from 'lodash';
import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import GenderUtils from '../../src/Utils/GenderUtils';
import AreaUtils from '../../src/Utils/AreaUtils';

describe('Test UserCareTakerUpdate Service', () => {
  beforeEach('UserCareTakerUpdateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await UserFixtures.SeedCareTakers(1);
  });

  afterEach('UserCareTakerUpdateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should update care taker info', async () => {
    const email = 'test0@example.com';
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const area = AreaUtils.NORTH;
    const location = 'test';
    const bio = 'test';

    await UserService.UserCareTakerUpdate({
      email,
      name,
      gender,
      contact,
      area,
      location,
      bio,
    });
    const {rows: users} = await pool.query(
      `SELECT * FROM care_takers WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        name,
        gender,
        contact,
        area,
        location,
        bio,
        is_deleted: false,
      },
      _.omit(users[0], ['password']),
    );
  });
});
