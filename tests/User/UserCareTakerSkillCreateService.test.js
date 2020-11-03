import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetFixtures from '../Fixtures/PetFixtures';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';

describe('Test UserCareTakerSkillCreateService', () => {
  beforeEach('UserCareTakerSkillCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
    await UserFixtures.SeedCareTakers(1);
    await PetFixtures.SeedPetCategories(1);
  });

  afterEach('UserCareTakerSkillCreateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should create care taker skill', async () => {
    const email = 'test0@example.com';
    const category = 'category0';
    const price = 1.1;

    await UserService.UserCareTakerSkillCreate({email, category, price});
    const {rows: skills} = await pool.query(
      `SELECT * FROM care_taker_skills WHERE email='${email}'`,
    );
    Assert.deepStrictEqual({email, category, price}, skills[0]);
  });

  it('Service should reject on duplicate care taker skill', async () => {
    const email = 'test0@example.com';
    const category = 'category0';
    const price = 1.1;

    await UserService.UserCareTakerSkillCreate({email, category, price});

    await Assert.rejects(
      () => UserService.UserCareTakerSkillCreate({email, category, price}),
      Error,
    );
  });
});
