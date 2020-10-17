import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';

describe('Test UserCareTakerSkillUpdateService', () => {
  beforeEach('UserCareTakerSkillUpdateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerSkillUpdateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should update care taker skill', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email} = users[0];
    const careTakerSkills = await UserFixtures.SeedCareTakerSkills(1, email);
    const price = '2';
    await UserService.UserCareTakerSkillUpdate({
      email: careTakerSkills[0].email,
      category: careTakerSkills[0].category,
      price,
    });

    const {rows: skills} = await pool.query(`SELECT * FROM care_taker_skills`);
    Assert.deepStrictEqual({...careTakerSkills[0], price}, skills[0]);
  });
});
