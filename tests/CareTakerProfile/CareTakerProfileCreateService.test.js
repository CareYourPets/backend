import _ from 'lodash';
import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import CareTakerProfileService from '../../src/CareTakerProfile/CareTakerProfileService';

describe('Test CareTakerProfileCreate Service', () => {
  beforeEach('CareTakerProfileCreate beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_profile');
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  afterEach('CareTakerProfileCreate afterEach', async () => {
    await pool.query('DELETE FROM care_taker_profile');
    await pool.query('DELETE FROM roles');
    await pool.query('DELETE FROM users');
  });

  it('Service should create care taker profile', async () => {
    const careTaker = await UserFixtures.SeedCareTakers(1);
    const careTakerId = careTaker.users[0][0];
    await CareTakerProfileService.CareTakerProfileCreate({
      user: {uid: careTakerId},
      bio: 'bio',
      location: 'Florida',
      gender: 'MALE',
    });
    const {rows: profiles} = await pool.query(
      `SELECT * FROM care_taker_profile WHERE uid='${careTakerId}' AND deleted=0`,
    );
    Assert.equal(1, profiles.length);
    Assert.deepEqual(
      {
        uid: careTakerId,
        bio: 'bio',
        location: 'Florida',
        gender: 'MALE',
        deleted: false,
      },
      _.omit(profiles[0], ['pid', 'created_at', 'updated_at']),
    );
  });
});
