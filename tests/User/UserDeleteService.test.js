import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test UserLogin Service', () => {
  beforeEach('UserLoginService beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
    await UserFixtures.SeedCareTakers(1);
    await UserFixtures.SeedPetOwners(2);
  });

  afterEach('UserLoginService afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Service should delete care taker', async () => {
    const email = 'test0@example.com';
    const role = RoleUtils.CARE_TAKER;

    await UserService.UserDelete({email, role});

    const {rows: users} = await pool.query(
      `SELECT * FROM care_takers WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(true, users[0].is_deleted);
  });

  it('Service should delete pet owner', async () => {
    const email = 'test0@example.com';
    const role = RoleUtils.PET_OWNER;

    await UserService.UserDelete({email, role});

    const {rows: users} = await pool.query(
      `SELECT * FROM pet_owners WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(true, users[0].is_deleted);
  });
});
