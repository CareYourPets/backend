import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';

Chai.use(ChaiHttp);

describe('Test UserCareTakerSkillDeleteController', () => {
  beforeEach('UserCareTakerSkillDeleteController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerSkillDeleteController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should delete care taker skill', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];
    await UserFixtures.SeedCareTakerSkills(2, email);
    const category = 'category0';
    const price = '1';

    await Chai.request(App)
      .post('/user/caretaker/skill/delete')
      .set('accessToken', accessToken)
      .send({
        category,
      });

    const {rows: skills} = await pool.query(
      `SELECT * FROM care_taker_skills WHERE email='${email}'`,
    );
    Assert.deepStrictEqual({email, category: 'category1', price}, skills[0]);
  });

  it('API should return 401 on missing access token', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email} = users[0];
    await UserFixtures.SeedCareTakerSkills(2, email);
    const category = 'category0';

    const res = await Chai.request(App)
      .post('/user/caretaker/skill/delete')
      .send({
        category,
      });

    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on  missing category', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];
    await UserFixtures.SeedCareTakerSkills(2, email);

    const res = await Chai.request(App)
      .post('/user/caretaker/skill/delete')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual(422, res.status);
  });
});
