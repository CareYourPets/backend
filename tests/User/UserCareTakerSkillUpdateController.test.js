import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';

Chai.use(ChaiHttp);

describe('Test UserCareTakerSkillUpdateController', () => {
  beforeEach('UserCareTakerSkillUpdateController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerSkillUpdateController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should create care taker skill', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];
    await UserFixtures.SeedCareTakerSkills(1, email);
    const category = 'category0';
    const price = '2';

    await Chai.request(App)
      .post('/user/caretaker/skill/update')
      .set('accessToken', accessToken)
      .send({
        category,
        price,
      });

    const {rows: skills} = await pool.query(
      `SELECT * FROM care_taker_skills WHERE email='${email}'`,
    );
    Assert.deepStrictEqual({email, category, price}, skills[0]);
  });

  it('API should return 401 on missing access token', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email} = users[0];
    await UserFixtures.SeedCareTakerSkills(1, email);
    const category = 'category0';
    const price = '2';

    const res = await Chai.request(App)
      .post('/user/caretaker/skill/update')
      .send({
        category,
        price,
      });

    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing category', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];
    await UserFixtures.SeedCareTakerSkills(1, email);
    const price = '2';

    const res = await Chai.request(App)
      .post('/user/caretaker/skill/update')
      .set('accessToken', accessToken)
      .send({
        price,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing price', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];
    await UserFixtures.SeedCareTakerSkills(1, email);
    const category = 'category0';

    const res = await Chai.request(App)
      .post('/user/caretaker/skill/update')
      .set('accessToken', accessToken)
      .send({
        category,
      });

    Assert.deepStrictEqual(422, res.status);
  });
});
