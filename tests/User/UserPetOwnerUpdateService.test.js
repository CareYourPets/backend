import _ from 'lodash';
import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import GenderUtils from '../../src/Utils/GenderUtils';
import AreaUtils from '../../src/Utils/AreaUtils';

describe('Test UserPetOwnerUpdate Service', () => {
  beforeEach('UserPetOwnerUpdateService beforeEach', async () => {
    await pool.query('DELETE FROM pet_owners');
    await UserFixtures.SeedPetOwners(1);
  });

  afterEach('UserPetOwnerUpdateService afterEach', async () => {
    await pool.query('DELETE FROM pet_owners');
  });

  it('Service should update pet owner info', async () => {
    const email = 'test0@example.com';
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const area = AreaUtils.NORTH;
    const location = 'test';
    const bio = 'test';

    await UserService.UserPetOwnerUpdate({
      email,
      name,
      gender,
      contact,
      area,
      location,
      bio,
    });
    const {rows: users} = await pool.query(
      `SELECT * FROM pet_owners WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      {
        email,
        name,
        gender,
        contact,
        area,
        location,
        bio,
        is_deleted: false,
      },
      _.omit(users[0], ['password']),
    );
  });
});
