import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test UserCareTakerTypeDeleteService', () => {
  beforeEach('UserCareTakerTypeDeleteService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerTypeDeleteService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should delete full timer', async () => {
    await UserFixtures.SeedCareTakerFullTimers(2);
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;

    await UserService.UserCareTakerTypeDelete({email, type});
    const {rows: users} = await pool.query(
      `SELECT * FROM care_taker_full_timers`,
    );
    Assert.deepStrictEqual([{email: 'test1@example.com'}], users);
  });

  it('Service should delete part timer', async () => {
    await UserFixtures.SeedCareTakerPartTimers(2);
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_PART_TIMER;

    await UserService.UserCareTakerTypeDelete({email, type});
    const {rows: users} = await pool.query(
      `SELECT * FROM care_taker_part_timers`,
    );
    Assert.deepStrictEqual([{email: 'test1@example.com'}], users);
  });
});
