import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import {IsPasswordVerified} from '../../src/Utils/AuthUtils';

describe('Test UserCreate Service', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
    await UserFixtures.SeedCareTakers(2);
  });

  afterEach(async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('Should create user', async () => {
    await UserService.UserCreate({
      email: 'test@example.com',
      password: 'password',
      role: 'CARE_TAKER',
      firstName: 'Brandon',
      lastName: 'Ng',
    });
    const users = (
      await pool.query("SELECT * FROM users WHERE email='test@example.com'")
    ).rows;
    Assert.equal(1, users.length);
    Assert.equal(true, await IsPasswordVerified('password', users[0].password));
  });

  it('Should throw error on same email', async () => {
    await Assert.rejects(
      () =>
        UserService.UserCreate({
          email: 'caretaker1@example.com',
          password: 'password',
          role: 'CARE_TAKER',
          firstName: 'Brandon',
          lastName: 'Ng',
        }),
      Error,
    );
  });
});
