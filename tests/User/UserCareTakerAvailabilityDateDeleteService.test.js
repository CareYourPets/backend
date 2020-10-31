import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import DateFixtures from '../Fixtures/DateFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';

describe('TestUserCareTakerAvailabilityDateDeleteService', () => {
  beforeEach('UserCareTakerAvailabilityDeleteService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerAvailabilityDeleteService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should delete unavailable date of full timer', async () => {
    await UserFixtures.SeedCareTakerFullTimers(1);
    const email = 'test0@example.com';
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedUnavailableDate({email, date});
    await DateFixtures.SeedUnavailableDate({email, date: nextDate});
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;

    await UserService.UserCareTakerAvailabilityDateDelete({email, date, type});
    const {rows: dates} = await pool.query(
      `SELECT * FROM care_taker_full_timers_unavailable_dates`,
    );

    Assert.deepStrictEqual(
      [
        {
          email,
          date: moment(nextDate).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
      ],
      [
        {
          email: dates[0].email,
          date: moment(dates[0].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
      ],
    );
  });

  it('Service should delete available date of part timer', async () => {
    await UserFixtures.SeedCareTakerPartTimers(2);
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_PART_TIMER;
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedAvailableDate({email, date});
    await DateFixtures.SeedAvailableDate({email, date: nextDate});

    await UserService.UserCareTakerAvailabilityDateDelete({email, date, type});
    const {rows: dates} = await pool.query(
      `SELECT * FROM care_taker_part_timers_available_dates`,
    );

    Assert.deepStrictEqual(
      [
        {
          email,
          date: moment(nextDate).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
      ],
      [
        {
          email: dates[0].email,
          date: moment(dates[0].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
      ],
    );
  });
});
