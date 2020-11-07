import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import BidFixtures from '../Fixtures/BidFixtures';

Chai.use(ChaiHttp);

describe('Test CareTakerFetchExpSalary Controller', () => {
  beforeEach('CareTakerFetchExpSalary beforeEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('CareTakerFetchExpSalary afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should fetch total monthly salary', async () => {
    const {users} = await BidFixtures.SeedMultipleBidsWithTransactionDate();
    const {accessToken} = users[1];

    const res = await Chai.request(App)
      .get('/pet/caretaker/salary/fetchexpected')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual('3000.00', res.body);
  });
});
