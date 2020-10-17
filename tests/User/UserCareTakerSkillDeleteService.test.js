import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';

describe('Test UserCareTakerSkillDeleteService', () => {
  beforeEach('UserCareTakerSkillDeleteService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerSkillDeleteService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should delete care taker skill', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email} = users[0];
    const careTakerSkills = await UserFixtures.SeedCareTakerSkills(2, email);

    await UserService.UserCareTakerSkillDelete({
      email: careTakerSkills[0].email,
      category: careTakerSkills[0].category,
    });

    const {rows: skills} = await pool.query(`SELECT * FROM care_taker_skills`);
    Assert.deepStrictEqual(careTakerSkills[1], skills[0]);
  });
});
