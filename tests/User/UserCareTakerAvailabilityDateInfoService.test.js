import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import DateFixtures from '../Fixtures/DateFixtures';

describe('TestUserCareTakerAvailabilityDateInfoService', () => {
  beforeEach('UserCareTakerTypeCreateService beforeEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerTypeCreateService afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should fetch unavailable dates of a full timer', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedUnavailableDate({email, date});
    await DateFixtures.SeedUnavailableDate({email, date: nextDate});
    const dates = await UserService.UserCareTakerAvailabilityDatesInfo({
      email,
      type,
    });
    Assert.deepStrictEqual(
      [
        {
          email,
          date: moment(date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
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
        {
          email: dates[1].email,
          date: moment(dates[1].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
      ],
    );
  });

  it('Service should fetch available dates of a part timer', async () => {
    const data = await UserFixtures.SeedCareTakerPartTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_PART_TIMER;
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedAvailableDate({email, date});
    await DateFixtures.SeedAvailableDate({email, date: nextDate});
    const dates = await UserService.UserCareTakerAvailabilityDatesInfo({
      email,
      type,
    });
    Assert.deepStrictEqual(
      [
        {
          email,
          date: moment(date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
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
        {
          email: dates[1].email,
          date: moment(dates[1].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
        },
      ],
    );
  });
});
