import Assert from 'assert';
import moment from 'moment';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import RoleUtils from '../../src/Utils/RoleUtils';
import DateFixtures from '../Fixtures/DateFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('TestUserCareTakerAvailabilityDateDeleteController', () => {
  beforeEach(
    'UserCareTakerAvailabilityDeleteController beforeEach',
    async () => {
      await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
      await pool.query('DELETE FROM care_taker_part_timers_available_dates');
      await pool.query('DELETE FROM care_taker_part_timers');
      await pool.query('DELETE FROM care_taker_full_timers');
      await pool.query('DELETE FROM care_takers');
    },
  );

  afterEach('UserCareTakerAvailabilityDeleteController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should delete unavailable date of full timer', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {accessToken} = data[0];
    const email = 'test0@example.com';
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedUnavailableDate({email, date});
    await DateFixtures.SeedUnavailableDate({email, date: nextDate});
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;

    await Chai.request(App)
      .post('/user/caretaker/availability/delete')
      .set('accessToken', accessToken)
      .send({
        type,
        date,
      });

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

  it('API should delete available date of part timer', async () => {
    const data = await UserFixtures.SeedCareTakerPartTimers(2);
    const {accessToken} = data[0];
    const email = 'test0@example.com';
    const type = RoleUtils.CARE_TAKER_PART_TIMER;
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedAvailableDate({email, date});
    await DateFixtures.SeedAvailableDate({email, date: nextDate});

    await Chai.request(App)
      .post('/user/caretaker/availability/delete')
      .set('accessToken', accessToken)
      .send({
        type,
        date,
      });
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

  it('API should return 401 on missing access token', async () => {
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().toISOString(true);
    const res = await Chai.request(App)
      .post('/user/caretaker/availability/delete')
      .send({
        date,
        type,
      });
    Assert.deepStrictEqual(401, res.status);
  });
});
