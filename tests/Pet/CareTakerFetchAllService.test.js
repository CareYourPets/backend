import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import UserFixtures from '../Fixtures/UserFixtures';

describe('Test CareTakerFetchAllService', () => {
  beforeEach('CareTakerFetchAllService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
  });

  afterEach('CareTakerFetchAllService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
  });

  it('Service should fetch all care takers', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {email} = users[0];
    const isByLocation = false;
    const results = await PetService.FetchAllCareTakers({email, isByLocation});

    Assert.deepStrictEqual(
      [
        {
          email: 'test0@example.com',
          name: null,
          area: null,
          location: null,
          gender: null,
          contact: null,
          bio: null,
        },
        {
          email: 'test1@example.com',
          name: null,
          area: null,
          location: null,
          gender: null,
          contact: null,
          bio: null,
        },
      ],
      results,
    );
  });

  it('Service should fetch care takers by location', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {email} = users[0];
    const isByLocation = true;
    const results = await PetService.FetchAllCareTakers({email, isByLocation});

    Assert.deepStrictEqual([], results);
  });
});
