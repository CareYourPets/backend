import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';

Chai.use(ChaiHttp);

describe('Test CareTakerFetchAll Controller', () => {
  beforeEach('CareTakerFetchAllController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('CareTakerFetchAllController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should fetch all care takers', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const {email} = users[0];
    const isByLocation = false;

    const res = await Chai.request(App)
      .post('/pet/caretaker/fetchall')
      .set('accessToken', accessToken)
      .send({
        email,
        isByLocation,
      });

    Assert.deepStrictEqual([], res.body);
  });

  it('API should fetch care takers by location', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const {email} = users[0];
    const isByLocation = true;

    const res = await Chai.request(App)
      .post('/pet/caretaker/fetchall')
      .set('accessToken', accessToken)
      .send({
        email,
        isByLocation,
      });

    Assert.deepStrictEqual([], res.body);
  });
});
