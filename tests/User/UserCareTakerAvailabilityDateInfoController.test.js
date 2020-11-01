import Assert from 'assert';
import moment from 'moment';
import ChaiHttp from 'chai-http';
import Chai from 'chai';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import RoleUtils from '../../src/Utils/RoleUtils';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import App from '../../src/App';
import DateFixtures from '../Fixtures/DateFixtures';

Chai.use(ChaiHttp);

describe('TestUserCareTakerAvailabilityDateInfoController', () => {
  beforeEach('UserCareTakerTypeInfoController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerTypeInfoController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should fetch unavailable date for full timer', async () => {
    const data = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email, accessToken} = data[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedUnavailableDate({email, date});
    await DateFixtures.SeedUnavailableDate({email, date: nextDate});
    const res = await Chai.request(App)
      .post('/user/caretaker/availability/info')
      .set('accessToken', accessToken)
      .send({
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
          email: res.body[0].email,
          date: moment(res.body[0].date).format(
            DateTimeUtils.MOMENT_DATE_FORMAT,
          ),
        },
        {
          email: res.body[1].email,
          date: moment(res.body[1].date).format(
            DateTimeUtils.MOMENT_DATE_FORMAT,
          ),
        },
      ],
    );
  });

  it('API should fetch available date for part timer', async () => {
    const data = await UserFixtures.SeedCareTakerPartTimers(1);
    const {email, accessToken} = data[0];
    const type = RoleUtils.CARE_TAKER_PART_TIMER;
    const date = moment().toISOString(true);
    const nextDate = moment().add(1, 'day').toISOString(true);
    await DateFixtures.SeedAvailableDate({email, date});
    await DateFixtures.SeedAvailableDate({email, date: nextDate});
    const res = await Chai.request(App)
      .post('/user/caretaker/availability/info')
      .set('accessToken', accessToken)
      .send({
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
          email: res.body[0].email,
          date: moment(res.body[0].date).format(
            DateTimeUtils.MOMENT_DATE_FORMAT,
          ),
        },
        {
          email: res.body[1].email,
          date: moment(res.body[1].date).format(
            DateTimeUtils.MOMENT_DATE_FORMAT,
          ),
        },
      ],
    );
  });

  it('API should return 401 on missing access token', async () => {
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;
    const res = await Chai.request(App)
      .post('/user/caretaker/availability/info')
      .send({
        type,
      });
    Assert.deepStrictEqual(401, res.status);
  });
});
