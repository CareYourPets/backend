import Assert from 'assert';
import _ from 'lodash';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';

Chai.use(ChaiHttp);

describe('Test UserCareTakerSkillFetchController', () => {
  beforeEach('UserCareTakerSkillFetchController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerSkillFetchController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should fetch care taker skills', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];
    const careTakerSkills = await UserFixtures.SeedCareTakerSkills(2, email);

    const res = await Chai.request(App)
      .post('/user/caretaker/skill/fetch')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual(
      careTakerSkills,
      _.map(res.body, (skill) => ({...skill, email})),
    );
  });

  it('API should return 401 on missing access token', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email} = users[0];
    await UserFixtures.SeedCareTakerSkills(2, email);

    const res = await Chai.request(App).post('/user/caretaker/skill/fetch');

    Assert.deepStrictEqual(401, res.status);
  });
});
