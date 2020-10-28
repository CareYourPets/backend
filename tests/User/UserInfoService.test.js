import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test UserInfo Service', () => {
  beforeEach('UserInfoService beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
    await UserFixtures.SeedCareTakers(1);
    await UserFixtures.SeedPetOwners(2);
    await UserFixtures.SeedAdministrators(2);
  });

  afterEach('UserInfoService afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Service should return care taker info', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;
    const userInfo = await UserService.UserInfo({
      email,
      password,
      role,
    });
    Assert.deepStrictEqual(
      {
        email,
        name: null,
        gender: null,
        contact: null,
        area: null,
        location: null,
        bio: null,
        is_deleted: false,
      },
      userInfo,
    );
  });

  it('Service should return pet owner info', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;
    const userInfo = await UserService.UserInfo({
      email,
      password,
      role,
    });
    Assert.deepStrictEqual(
      {
        email,
        name: null,
        gender: null,
        contact: null,
        area: null,
        location: null,
        bio: null,
        is_deleted: false,
      },
      userInfo,
    );
  });

  it('Service should return administrator info', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;
    const userInfo = await UserService.UserInfo({
      email,
      password,
      role,
    });
    Assert.deepStrictEqual(
      {
        email,
        name: null,
        gender: null,
        contact: null,
        location: null,
        is_approved: false,
        is_deleted: false,
      },
      userInfo,
    );
  });
});
