import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';

Chai.use(ChaiHttp);

describe('Test CareTakerFetch Controller', () => {
  beforeEach('CareTakerFetchController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_categories');
  });

  afterEach('CareTakerFetchController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_categories');
  });

  it('API should fetch care taker full timer', async () => {
    const users = await UserFixtures.SeedCareTakerFullTimers(1);
    const {accessToken} = users[0];
    const {email} = users[0];

    const res = await Chai.request(App)
      .post('/pet/caretaker/fetch')
      .set('accessToken', accessToken)
      .send({
        email,
      });

    Assert.deepStrictEqual(
      [
        [
          {
            type: 'Full Timer',
            email: 'test0@example.com',
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [],
      ],
      res.body,
    );
  });

  it('API should fetch care taker part timer', async () => {
    const users = await UserFixtures.SeedCareTakerPartTimers(1);
    const {accessToken} = users[0];
    const {email} = users[0];

    const res = await Chai.request(App)
      .post('/pet/caretaker/fetch')
      .set('accessToken', accessToken)
      .send({
        email,
      });

    Assert.deepStrictEqual(
      [
        [
          {
            type: 'Part Timer',
            email: 'test0@example.com',
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [],
      ],
      res.body,
    );
  });

  it('API should fetch care takers with skills', async () => {
    const users = await UserFixtures.SeedCareTakerFullTimers(1);
    const {accessToken} = users[0];
    const {email} = users[0];
    await UserFixtures.SeedCareTakerSkills(1, email);

    const res = await Chai.request(App)
      .post('/pet/caretaker/fetch')
      .set('accessToken', accessToken)
      .send({
        email,
      });

    Assert.deepStrictEqual(
      [
        [
          {
            type: 'Full Timer',
            email,
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [
          {
            category: 'category0',
            price: '0',
          },
        ],
      ],
      res.body,
    );
  });
});
