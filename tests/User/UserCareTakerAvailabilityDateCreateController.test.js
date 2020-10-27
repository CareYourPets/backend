import Assert from 'assert';
import moment from 'moment';
import ChaiHttp from 'chai-http';
import Chai from 'chai';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import RoleUtils from '../../src/Utils/RoleUtils';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserCareTakerAvailabilityDateCreateController', () => {
  beforeEach('UserCareTakerTypeCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerTypeCreateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should create unavailable date for full timer', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email, accessToken} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().format(DateTimeUtils.MOMENT_DATE_FORMAT);
    await Chai.request(App)
      .post('/user/caretaker/availability/create')
      .set('accessToken', accessToken)
      .send({
        date,
        type,
      });

    const {rows: dates} = await pool.query(
      `SELECT email, timezone('Asia/Singapore', date) AS date FROM care_taker_full_timers_unavailable_dates WHERE email='${email}' AND date='${date}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        date,
      },
      {
        email: dates[0].email,
        date: moment(dates[0].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
      },
    );
  });

  it('API should create available date for part timer', async () => {
    const data = await UserFixtures.SeedCareTakerPartTimers(1);
    const {email, accessToken} = data[0];
    const type = RoleUtils.CARE_TAKER_PART_TIMER;
    const date = moment().format(DateTimeUtils.MOMENT_DATE_FORMAT);
    await Chai.request(App)
      .post('/user/caretaker/availability/create')
      .set('accessToken', accessToken)
      .send({
        date,
        type,
      });

    const {rows: dates} = await pool.query(
      `SELECT email, timezone('Asia/Singapore', date) AS date FROM care_taker_part_timers_available_dates WHERE email='${email}' AND date='${date}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        date,
      },
      {
        email: dates[0].email,
        date: moment(dates[0].date).format(DateTimeUtils.MOMENT_DATE_FORMAT),
      },
    );
  });

  it('API should return 401 on missing access token', async () => {
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().format(DateTimeUtils.MOMENT_DATE_FORMAT);
    const res = await Chai.request(App)
      .post('/user/caretaker/availability/create')
      .send({
        date,
        type,
      });
    Assert.deepStrictEqual(401, res.status);
  });
});
