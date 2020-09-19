import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserInfo Controller', () => {
  beforeEach('UserInfoController beforeEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
    await UserFixtures.SeedCareTakers(2);
  });

  afterEach('UserInfoController afterEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('Should return user information', async () => {
    const {accessToken} = await UserService.UserCreate({
      email: 'test@example.com',
      password: 'password',
      role: RoleUtils.CARE_TAKER,
      firstName: 'Brandon',
      lastName: 'Ng',
    });
    const res = await Chai.request(App)
      .get('/user/info')
      .set('accessToken', accessToken);
    const user = res.body;
    Assert.equal(1, user.roles.length);
  });
});
