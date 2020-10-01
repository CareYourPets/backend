import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import RoleUtils from '../../src/Utils/RoleUtils';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserDelete Controller', () => {
  beforeEach('UserDeleteController beforeEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
    await UserFixtures.SeedCareTakers(2);
  });

  afterEach('UserDeleteController afterEach', async () => {
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('Should return user information', async () => {
    const {
      body: {accessToken},
    } = await Chai.request(App).post('/user/login').send({
      email: 'caretaker1@example.com',
      password: 'password',
      role: RoleUtils.CARE_TAKER,
    });

    await Chai.request(App)
      .post('/user/delete')
      .set('accessToken', accessToken);

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
