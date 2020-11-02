import Assert from 'assert';
import moment from 'moment';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import PetFixtures from '../Fixtures/PetFixtures';
import UserFixtures from '../Fixtures/UserFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test BidDeleteConroller', () => {
  beforeEach('BidDeleteController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedCareTakers(1);
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('BidDeleteController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('API should delete bid', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();

    await BidFixtures.SeedBids({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    await Chai.request(App)
      .post('/bid/delete')
      .set('accessToken', accessToken)
      .send({
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });

    const {rows: bids} = await pool.query(
      `SELECT * 
        FROM bids 
        WHERE pet_name='${petName}' 
        AND pet_owner_email='${petOwnerEmail}'
        AND care_taker_email='${careTakerEmail}'
        AND start_date='${startDate}'
       `,
    );

    const formattedStartDate = moment(bids[0].start_date).format(
      DateTimeUtils.MOMENT_TIME_FORMAT,
    );
    bids[0].start_date = formattedStartDate;
    const formattedEndDate = moment(bids[0].end_date).format(
      DateTimeUtils.MOMENT_TIME_FORMAT,
    );
    bids[0].end_date = formattedEndDate;

    Assert.deepStrictEqual(
      {
        pet_name: petName,
        pet_owner_email: petOwnerEmail,
        care_taker_email: careTakerEmail,
        is_accepted: false,
        start_date: moment(startDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
        end_date: moment(endDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
        transaction_date: null,
        payment_mode: null,
        amount: null,
        review_date: null,
        transportation_mode: null,
        review: null,
        rating: null,
        is_deleted: true,
      },
      bids[0],
    );
  });

  it('API should return 401 for missing access token', async () => {
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();

    await BidFixtures.SeedBids({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    const res = await Chai.request(App).post('/bid/delete').send({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
    });

    Assert.deepStrictEqual(401, res.status);
  });
});
