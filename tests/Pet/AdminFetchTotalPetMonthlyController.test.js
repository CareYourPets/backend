import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import BidFixtures from '../Fixtures/BidFixtures';

Chai.use(ChaiHttp);

describe('Test AdminFetchTotalPetMonthly Controller', () => {
  beforeEach('AdminFetchTotalPetMonthly beforeEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('AdminFetchTotalPetMonthly afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should fetch total pets', async () => {
    await BidFixtures.SeedMultipleBidsWithTransactionDate();
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const month = 11;
    const year = 2020;

    const res = await Chai.request(App)
      .post('/pet/admin/month/fetchpet')
      .set('accessToken', accessToken)
      .send({
        month,
        year,
      });

    Assert.deepStrictEqual(
      [
        {
          count: '2',
        },
      ],
      res.body,
    );
  });
});
