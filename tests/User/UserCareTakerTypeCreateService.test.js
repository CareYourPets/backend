import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test UserCareTakerTypeCreateService', () => {
  beforeEach('UserCareTakerTypeCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await UserFixtures.SeedCareTakers(1);
  });

  afterEach('UserCareTakerTypeCreateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should create full timer', async () => {
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;

    await UserService.UserCareTakerTypeCreate({email, type});
    const {rows: users} = await pool.query(
      `SELECT * FROM care_taker_full_timers WHERE email='${email}'`,
    );
    Assert.deepStrictEqual({email}, users[0]);
  });

  it('Service should create part timer', async () => {
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_PART_TIMER;

    await UserService.UserCareTakerTypeCreate({email, type});
    const {rows: users} = await pool.query(
      `SELECT * FROM care_taker_part_timers WHERE email='${email}'`,
    );
    Assert.deepStrictEqual({email}, users[0]);
  });

  it('Service should reject on duplicate full timer', async () => {
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;

    await UserService.UserCareTakerTypeCreate({email, type});
    await Assert.rejects(
      () => UserService.UserCareTakerTypeCreate({email, type}),
      Error,
    );
  });

  it('Service should reject on duplicate part timer', async () => {
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_PART_TIMER;

    await UserService.UserCareTakerTypeCreate({email, type});
    await Assert.rejects(
      () => UserService.UserCareTakerTypeCreate({email, type}),
      Error,
    );
  });

  it('Service should reject part timer if full timer exists', async () => {
    const email = 'test0@example.com';
    const fullTimer = RoleUtils.CARE_TAKER_FULL_TIMER;
    const partTimer = RoleUtils.CARE_TAKER_PART_TIMER;

    await UserService.UserCareTakerTypeCreate({email, type: fullTimer});
    await Assert.rejects(
      () => UserService.UserCareTakerTypeCreate({email, type: partTimer}),
      Error,
    );
  });

  it('Service should reject full timer if part timer exists', async () => {
    const email = 'test0@example.com';
    const fullTimer = RoleUtils.CARE_TAKER_FULL_TIMER;
    const partTimer = RoleUtils.CARE_TAKER_PART_TIMER;

    await UserService.UserCareTakerTypeCreate({email, type: partTimer});
    await Assert.rejects(
      () => UserService.UserCareTakerTypeCreate({email, type: fullTimer}),
      Error,
    );
  });
});
