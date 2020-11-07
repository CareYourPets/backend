import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import DateFixtures from '../Fixtures/DateFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

describe('Test UserCareTakerAvailabilityDateCreateService', () => {
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

  it('Service should create unavailable date for full timer', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().toISOString(true);
    await UserService.UserCareTakerAvailabilityDateCreate({
      email,
      date,
      type,
    });
    const {rows: dates} = await pool.query(
      `SELECT email, timezone('Asia/Singapore', date) AS date FROM care_taker_full_timers_unavailable_dates WHERE email='${email}' AND date='${date}'`,
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

  it('Service should create available date for part timer', async () => {
    const data = await UserFixtures.SeedCareTakerPartTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_PART_TIMER;
    const date = moment().toISOString(true);
    await UserService.UserCareTakerAvailabilityDateCreate({
      email,
      date,
      type,
    });
    const {rows: dates} = await pool.query(
      `SELECT email, timezone('Asia/Singapore', date) AS date FROM care_taker_part_timers_available_dates WHERE email='${email}' AND date='${date}'`,
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
    await DateFixtures.SeedEdgeCaseDates();
    const date = moment().startOf('year').add(215, 'days').toISOString(true);
    await UserService.UserCareTakerAvailabilityDateCreate({
      email,
      date,
      type,
    });
    const {rows: dates} = await pool.query(
      `SELECT email, timezone('Asia/Singapore', date) AS date FROM care_taker_full_timers_unavailable_dates WHERE email='${email}' AND date='${date}'`,
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

  it('Service should reject available date for pt if it exceeds 2 year window', async () => {
    const data = await UserFixtures.SeedCareTakerPartTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_PART_TIMER;
    const date = moment().add(2, 'years').toISOString(true);

    await Assert.rejects(
      () =>
        UserService.UserCareTakerAvailabilityDateCreate({
          email,
          date,
          type,
        }),
      Error,
    );
  });

  it('Service should reject unavailable dates if full timer has a pet under their care', async () => {
    const user = await UserFixtures.SeedPetOwners(1);
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const category = await PetFixtures.SeedPetCategories(1);
    const pet = await PetFixtures.SeedPets(
      1,
      user[0].email,
      category[0].category,
    );
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const startDate = moment().toISOString();
    const endDate = moment().add(4, 'days').toISOString(true);
    const date = moment().add(2, 'days').toISOString(true);
    await BidFixtures.SeedBids({
      petName: pet[0].name,
      petOwnerEmail: user[0].email,
      careTakerEmail: email,
      startDate,
      endDate,
    });
    await pool.query(
      `UPDATE bids SET is_accepted=true WHERE pet_name='${pet[0].name}' AND pet_owner_email='${user[0].email}' AND care_taker_email='${email}' AND start_date='${startDate}'`,
    );

    await Assert.rejects(
      () =>
        UserService.UserCareTakerAvailabilityDateCreate({
          email,
          date,
          type,
        }),
      Error,
    );
  });

  it('Service should reject unavailable dates if there are 65 or more leave days taken already', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().startOf('year').add(65, 'days').toISOString(true);
    await DateFixtures.SeedAllLeaveDays();

    await Assert.rejects(
      () =>
        UserService.UserCareTakerAvailabilityDateCreate({
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
    const date = moment().startOf('year').add(220, 'days').toISOString(true);

    await Assert.rejects(
      () =>
        UserService.UserCareTakerAvailabilityDateCreate({
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
    const date = moment()
      .startOf('year')
      .subtract(10, 'days')
      .toISOString(true);

    await Assert.rejects(
      () =>
        UserService.UserCareTakerAvailabilityDateCreate({
          email,
          date,
          type,
        }),
      Error,
    );
  });
});
