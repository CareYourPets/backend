import _ from 'lodash';
import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserApprove Controller', () => {
  beforeEach('UserApproveController beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('UserApproveController afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Should approve administrator', async () => {
    const users = await UserFixtures.SeedAdministrators(2);
    const {accessToken} = users[0];
    const {email} = users[1];

    await Chai.request(App)
      .post('/user/approve')
      .set('accessToken', accessToken)
      .send({
        approvedEmail: email,
      });

    const {rows} = await pool.query(
      `SELECT * FROM psc_administrators WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        name: null,
        gender: null,
        contact: null,
        location: null,
        is_approved: true,
        is_deleted: false,
      },
      _.omit(rows[0], ['password']),
    );
  });

  it('Should return 401 for missing approvedEmail', async () => {
    const res = await Chai.request(App).post('/user/approve');

    Assert.deepStrictEqual(422, res.status);
  });

  it('Should return 401 for missing accesstoken', async () => {
    const users = await UserFixtures.SeedAdministrators(2);
    const {email} = users[1];

    const res = await Chai.request(App).post('/user/approve').send({
      approvedEmail: email,
    });
    Assert.deepStrictEqual(401, res.status);
  });
});
