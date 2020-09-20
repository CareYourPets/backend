import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
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

  it('Service should delete user', async () => {
    const {accessToken} = await UserService.UserLogin({
      email: 'caretaker1@example.com',
      password: 'password',
      role: 'CARE_TAKER',
    });
    const decodedToken = DecodeAccessToken(accessToken);
    await UserService.UserDelete(decodedToken);

    const {rows: deletedUsers} = await pool.query(
      `
      SELECT * 
        FROM users 
      WHERE 
      email='caretaker1@example.com' AND 
      is_deleted=false;`,
    );
    Assert.equal(0, deletedUsers.length);

    const {rows: existingUsers} = await pool.query(
      `
      SELECT * 
        FROM users 
      WHERE 
        email='caretaker0@example.com' AND 
        is_deleted=false;`,
    );
    Assert.equal(1, existingUsers.length);
  });
});
