import _ from 'lodash';
import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test UserApprove Service', () => {
  beforeEach('UserApproveService beforeEach', async () => {
    await pool.query('DELETE FROM psc_administrators');
    await UserFixtures.SeedAdministrators(2);
  });

  afterEach('UserApproveService afterEach', async () => {
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Service should return care taker info', async () => {
    const approvedEmail = 'test1@example.com';
    const role = RoleUtils.ADMINISTRATOR;
    await UserService.UserApprove({
      role,
      approvedEmail,
    });
    const {rows: users} = await pool.query(
      `SELECT * FROM psc_administrators WHERE email='${approvedEmail}'`,
    );
    Assert.deepStrictEqual(
      {
        email: approvedEmail,
        name: null,
        gender: null,
        contact: null,
        location: null,
        is_approved: true,
        is_deleted: false,
      },
      _.omit(users[0], ['password']),
    );
  });
});
