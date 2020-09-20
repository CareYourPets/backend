import Assert from 'assert';
import _ from 'lodash';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';
import App from '../../src/App';
import RoleUtils from '../../src/Utils/RoleUtils';

Chai.use(ChaiHttp);

describe('Test UserCreate Controller', () => {
  beforeEach('UserCreateController beforeEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  afterEach('UserCreateController afterEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('API should return access token for user', async () => {
    const res = await Chai.request(App).post('/user/create').send({
      email: 'test@example.com',
      password: 'password',
      role: RoleUtils.PET_OWNER,
      firstName: 'Brandon',
      lastName: 'Ng',
    });
    const decodedToken = DecodeAccessToken(res.body.accessToken);
    Assert.deepEqual(
      {
        email: 'test@example.com',
        role: RoleUtils.PET_OWNER,
        roles: [RoleUtils.PET_OWNER],
      },
      _.omit(decodedToken, ['uid', 'iat']),
    );
  });
});
