import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import DateFixtures from '../Fixtures/DateFixtures';

describe('Test UserCareTakerAvailabilityDateCreateService', () => {
  beforeEach('UserCareTakerTypeCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerTypeCreateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should create unavailable date for full timer', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().toISOString();
    await UserService.UserCareTakerFullTimeAvailabilityDateCreate({
      email,
      date,
      type,
    });
    const {rows: dates} = await pool.query(
      `SELECT * FROM care_taker_full_timers_unavailable_dates WHERE email='${email}' AND date='${date}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        date: moment(date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
      },
      {
        email: dates[0].email,
        date: moment(dates[0].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
      },
    );
  });

  it('Service should create unavailable date for full timer near edge case of 2 x 150', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().startOf('year').add(214, 'days').toISOString();
    await UserService.UserCareTakerFullTimeAvailabilityDateCreate({
      email,
      date,
      type,
    });
    const {rows: dates} = await pool.query(
      `SELECT * FROM care_taker_full_timers_unavailable_dates WHERE email='${email}' AND date='${date}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        date: moment(date)
          .subtract(1, 'day')
          .format(DateTimeUtils.MOMENT_DATE_FORMAT),
      },
      {
        email: dates[0].email,
        date: moment(dates[0].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
      },
    );
  });

  it('Service should reject unavailable dates if there are 65 or more leave days taken already', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().startOf('year').add(65, 'days').toISOString();
    await DateFixtures.SeedAllLeaveDays();

    await Assert.rejects(
      () =>
        UserService.UserCareTakerFullTimeAvailabilityDateCreate({
          email,
          date,
          type,
        }),
      Error,
    );
  });

  it('Service should reject unavailable dates if adding the next date added will violate the 2 x 150 working days constriant', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    await DateFixtures.SeedEdgeCaseDates();
    // adding a day inside one of the 150 day blocks
    const date = moment().startOf('year').add(220, 'days').toISOString();

    await Assert.rejects(
      () =>
        UserService.UserCareTakerFullTimeAvailabilityDateCreate({
          email,
          date,
          type,
        }),
      Error,
    );
  });

  it('Service should reject if unavailable date not within current year', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    // adding a day inside one of the 150 day blocks
    const date = moment().startOf('year').subtract(10, 'days').toISOString();

    await Assert.rejects(
      () =>
        UserService.UserCareTakerFullTimeAvailabilityDateCreate({
          email,
          date,
          type,
        }),
      Error,
    );
  });
});
