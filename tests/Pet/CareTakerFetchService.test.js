import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import UserFixtures from '../Fixtures/UserFixtures';

describe('Test CareTakerFetchService', () => {
  beforeEach('CareTakerFetchService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_categories');
  });

  afterEach('CareTakerFetchService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should fetch care taker with zero skills', async () => {
    const users = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = users[0];
    const results = await PetService.FetchCareTaker({email});

    Assert.deepStrictEqual(
      [
        [
          {
            type: 'Full Timer',
            email: 'test0@example.com',
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [],
      ],
      results,
    );
  });

  it('Service should fetch care taker with 2 skills', async () => {
    const users = await UserFixtures.SeedCareTakerFullTimers(1);
    const {email} = users[0];
    await UserFixtures.SeedCareTakerSkills(2, email);
    const results = await PetService.FetchCareTaker({email});

    Assert.deepStrictEqual(
      [
        [
          {
            type: 'Full Timer',
            email: 'test0@example.com',
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [
          {
            category: 'category0',
            price: '0',
          },
          {
            category: 'category1',
            price: '1',
          },
        ],
      ],
      results,
    );
  });
});
