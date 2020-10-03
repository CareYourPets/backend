import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';

describe('Test UserInfo Service', () => {
  beforeEach('UserInfoService beforeEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  afterEach('UserInfoService afterEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('Should fetch user information', async () => {
    const timestamp = moment(Date.now()).format();
    const {accessToken} = await UserService.UserCreate({
      email: 'test@example.com',
      password: 'password',
      role: RoleUtils.CARE_TAKER,
      firstName: 'Brandon',
      lastName: 'Ng',
    });
    const decodedToken = DecodeAccessToken(accessToken);
    await pool.query(
      `
      INSERT INTO roles 
        (
          uid, 
          role, 
          deleted, 
          created_at, 
          updated_at
        ) 
      VALUES 
        (
          '${decodedToken.uid}', 
          '${RoleUtils.ADMINISTRATOR}', 
          0, 
          '${timestamp}', 
          '${timestamp}'
        );`,
    );
    const userInfo = await UserService.UserInfo(decodedToken);
    Assert.equal(2, userInfo.roles.length);
  });
});
