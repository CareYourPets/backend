import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';
import App from '../../src/App';
import RoleUtils from '../../src/Utils/RoleUtils';

Chai.use(ChaiHttp);

describe('Test UserCreate Controller', () => {
  beforeEach('UserCreateController beforeEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
    await UserFixtures.SeedCareTakers(2);
  });

  afterEach('UserCreateController afterEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('Should return access token for user', async () => {
    const res = await Chai.request(App).post('/user/create').send({
      email: 'test@example.com',
      password: 'password',
      role: RoleUtils.PET_OWNER,
      firstName: 'Brandon',
      lastName: 'Ng',
    });
    const accessToken = DecodeAccessToken(res.body.accessToken);
    Assert.equal('test@example.com', accessToken.email);
  });
});
