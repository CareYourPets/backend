import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import App from '../../src/App';
import {BID_PAYMENT_MODE, PET_DELIVERY_MODE} from '../../src/Utils/BidUtils';

Chai.use(ChaiHttp);

describe('FetchCareTakerReviewsController', () => {
  beforeEach('FetchCareTakerReviewsController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM psc_administrators');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedCareTakerFullTimers(1);
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('FetchCareTakerReviewsController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should update bid', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
        isAccepted,
        transactionDate,
        paymentMode,
        amount,
        reviewDate,
        transportationMode,
        review,
        rating,
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });

    // Testing service
    const res = await Chai.request(App)
      .post('/pet/caretaker/reviews/fetch')
      .set('accessToken', accessToken)
      .send({
        careTakerEmail,
      });
    Assert.deepStrictEqual(
      [
        {
          email: 'test0@example.com',
          name: null,
          review: 'Horrible',
          rating: 1,
        },
      ],
      res.body,
    );
  });

  it('API should return 422 for missing is_accepted', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const careTakerEmail = 'test0@example.com';
    const petName = 'pet0';
    const petOwnerEmail = 'test0@example.com';
    const {startDate, endDate} = BidFixtures.CreateBidDates();

    await BidFixtures.SeedBids({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    const res = await Chai.request(App)
      .post('/pet/caretaker/reviews/fetch')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 401 for missing access token', async () => {
    const careTakerEmail = 'test0@example.com';

    const res = await Chai.request(App)
      .post('/pet/caretaker/reviews/fetch')
      .send({
        careTakerEmail,
      });

    Assert.deepStrictEqual(401, res.status);
  });
});
