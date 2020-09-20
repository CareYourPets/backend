import Assert from 'assert';
import _ from 'lodash';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';

describe('Test UserLogin Service', () => {
  beforeEach('UserLoginService beforeEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
    await UserFixtures.SeedCareTakers(2);
  });

  afterEach('UserLoginService afterEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('Should return user access token', async () => {
    const {accessToken} = await UserService.UserLogin({
      email: 'caretaker1@example.com',
      password: 'password',
      role: 'CARE_TAKER',
    });
    const decodedToken = DecodeAccessToken(accessToken);
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
