import Assert from 'assert';
import _ from 'lodash';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';
import RoleUtils from '../../src/Utils/RoleUtils';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserLogin Controller', () => {
  beforeEach('UserLoginController beforeEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
    await UserFixtures.SeedCareTakers(2);
  });

  afterEach('UserLoginController afterEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('API should return user access token', async () => {
    const res = await Chai.request(App).post('/user/login').send({
      email: 'caretaker1@example.com',
      password: 'password',
      role: RoleUtils.CARE_TAKER,
    });
    const decodedToken = DecodeAccessToken(res.body.accessToken);
    Assert.deepEqual(
      {
        email: 'caretaker1@example.com',
        role: RoleUtils.CARE_TAKER,
        roles: [RoleUtils.CARE_TAKER],
      },
      _.omit(decodedToken, ['uid', 'iat']),
    );
  });
});
