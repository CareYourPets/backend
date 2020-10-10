import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserInfo Controller', () => {
  beforeEach('UserInfoController beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('UserInfoController afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Should return pet owner information', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];

    const res = await Chai.request(App)
      .get('/user/info')
      .set('accessToken', accessToken);
    Assert.deepStrictEqual(
      {
        email,
        name: null,
        gender: null,
        contact: null,
        location: null,
        bio: null,
        is_deleted: false,
      },
      res.body,
    );
  });

  it('Should return care taker information', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];

    const res = await Chai.request(App)
      .get('/user/info')
      .set('accessToken', accessToken);
    Assert.deepStrictEqual(
      {
        email,
        name: null,
        gender: null,
        contact: null,
        location: null,
        bio: null,
        is_deleted: false,
      },
      res.body,
    );
  });

  it('Should return administrator information', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {email, accessToken} = users[0];

    const res = await Chai.request(App)
      .get('/user/info')
      .set('accessToken', accessToken);
    Assert.deepStrictEqual(
      {
        email,
        name: null,
        gender: null,
        contact: null,
        location: null,
        is_approved: false,
        is_deleted: false,
      },
      res.body,
    );
  });

  it('Should return 401 for missing accesstoken', async () => {
    const res = await Chai.request(App).get('/user/info');
    Assert.deepStrictEqual(401, res.status);
  });
});
