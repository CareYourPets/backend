import _ from 'lodash';
import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import GenderUtils from '../../src/Utils/GenderUtils';

describe('Test UserAdministratorUpdate Service', () => {
  beforeEach('UserAdministratorUpdateService beforeEach', async () => {
    await pool.query('DELETE FROM psc_administrators');
    await UserFixtures.SeedAdministrators(1);
  });

  afterEach('UserAdministratorUpdateService afterEach', async () => {
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Service should update care taker info', async () => {
    const email = 'test0@example.com';
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const location = 'test';
    const area = 'CENTRAL';

    await UserService.UserAdministratorUpdate({
      email,
      name,
      gender,
      area,
      contact,
      location,
    });
    const {rows: users} = await pool.query(
      `SELECT * FROM psc_administrators WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        name,
        gender,
        contact,
        area,
        location,
        is_deleted: false,
      },
      _.omit(users[0], ['password']),
    );
  });
});
