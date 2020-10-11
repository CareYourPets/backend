import _ from 'lodash';
import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import GenderUtils from '../../src/Utils/GenderUtils';

describe('Test UserCareTakerUpdate Service', () => {
  beforeEach('UserCareTakerUpdateService beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await UserFixtures.SeedCareTakers(1);
  });

  afterEach('UserCareTakerUpdateService afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should update care taker info', async () => {
    const email = 'test0@example.com';
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const location = 'test';
    const bio = 'test';

    await UserService.UserCareTakerUpdate({
      email,
      name,
      gender,
      contact,
      location,
      bio,
    });
    const {rows: users} = await pool.query(
      `SELECT * FROM care_takers WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        name,
        gender,
        contact,
        location,
        bio,
        is_deleted: false,
      },
      _.omit(users[0], ['password']),
    );
  });
});
