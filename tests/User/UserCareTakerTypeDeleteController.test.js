import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import RoleUtils from '../../src/Utils/RoleUtils';

Chai.use(ChaiHttp);

describe('Test UserCareTakerRoleCreateController', () => {
  beforeEach('UserCareTakerRoleCreateController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerRoleCreateController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
  });

  it('API should delete full timer', async () => {
    const users = await UserFixtures.SeedCareTakerFullTimers(2);
    const {accessToken} = users[0];
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;

    await Chai.request(App)
      .post('/user/caretaker/type/delete')
      .set('accessToken', accessToken)
      .send({
        type,
      });

    const {rows: careTakers} = await pool.query(
      `SELECT * FROM care_taker_full_timers`,
    );
    Assert.deepStrictEqual([{email: 'test1@example.com'}], careTakers);
  });

  it('API should delete part timer', async () => {
    const users = await UserFixtures.SeedCareTakerPartTimers(2);
    const {accessToken} = users[0];
    const type = RoleUtils.CARE_TAKER_PART_TIMER;

    await Chai.request(App)
      .post('/user/caretaker/type/delete')
      .set('accessToken', accessToken)
      .send({
        type,
      });

    const {rows: careTakers} = await pool.query(
      `SELECT * FROM care_taker_part_timers`,
    );
    Assert.deepStrictEqual([{email: 'test1@example.com'}], careTakers);
  });

  it('API should return 401 on missing access token', async () => {
    const type = RoleUtils.CARE_TAKER_FULL_TIMER;

    const res = await Chai.request(App)
      .post('/user/caretaker/type/delete')
      .send({
        type,
      });
    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing type', async () => {
    const users = await UserFixtures.SeedCareTakerPartTimers(1);
    const {accessToken} = users[0];

    const res = await Chai.request(App)
      .post('/user/caretaker/type/delete')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on invalid type', async () => {
    const users = await UserFixtures.SeedCareTakerPartTimers(1);
    const {accessToken} = users[0];
    const type = 'test';

    const res = await Chai.request(App)
      .post('/user/caretaker/type/delete')
      .set('accessToken', accessToken)
      .send({
        type,
      });
    Assert.deepStrictEqual(422, res.status);
  });
});
