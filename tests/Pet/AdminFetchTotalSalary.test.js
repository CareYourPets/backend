import moment from 'moment';
import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import BidFixtures from '../Fixtures/BidFixtures';

Chai.use(ChaiHttp);

describe('Test AdminFetchTotalSalary Controller', () => {
  beforeEach('AdminFetchTotalSalary beforeEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('AdminFetchTotalSalary afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should fetch total monthly salary', async () => {
    await BidFixtures.SeedMultipleBidsWithTransactionDate();
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const month = moment().month() + 1;
    const year = moment().year();

    const res = await Chai.request(App)
      .post('/pet/caretaker/salary/fetchtotal')
      .set('accessToken', accessToken)
      .send({
        month,
        year,
      });

    Assert.deepStrictEqual(
      [
        {
          total: 3000,
        },
      ],
      res.body,
    );
  });
});
