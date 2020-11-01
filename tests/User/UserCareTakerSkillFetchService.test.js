import Assert from 'assert';
import _ from 'lodash';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import UserService from '../../src/User/UserService';

describe('Test UserCareTakerSkillFetchService', () => {
  beforeEach('UserCareTakerSkillFetchService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerSkillFetchService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_takers');
  });

  it('Service should fetch care taker skills', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email} = users[0];
    const careTakerSkills = await UserFixtures.SeedCareTakerSkills(2, email);

    const skills = await UserService.UserCareTakerSkillFetch({
      email: careTakerSkills[0].email,
    });

    Assert.deepStrictEqual(
      careTakerSkills,
      _.map(skills, (skill) => ({...skill, email})),
    );
  });
});
