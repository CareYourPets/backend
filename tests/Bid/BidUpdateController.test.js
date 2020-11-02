import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import App from '../../src/App';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import {BID_PAYMENT_MODE, PET_DELIVERY_MODE} from '../../src/Utils/BidUtils';

Chai.use(ChaiHttp);

describe('Test BidUpdate Controller', () => {
  beforeEach('BidCreateController beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
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

  afterEach('BidCreateController afterEach', async () => {
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

    const {rows: bids} = await pool.query(
      `SELECT * 
        FROM bids 
        WHERE pet_name='${petName}' 
        AND pet_owner_email='${petOwnerEmail}'
        AND care_taker_email='${careTakerEmail}'
        AND start_date='${startDate}'
       `,
    );

    Assert.deepStrictEqual(bids[0].is_accepted, isAccepted);
    Assert.deepStrictEqual(bids[0].payment_mode, paymentMode);
    Assert.deepStrictEqual(bids[0].amount, amount);
    Assert.deepStrictEqual(
      moment(bids[0].review_date).format(DateTimeUtils.MOMENT_TIME_FORMAT),
      moment(reviewDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
    );
    Assert.deepStrictEqual(bids[0].transportation_mode, transportationMode);
    Assert.deepStrictEqual(bids[0].review, review);
    Assert.deepStrictEqual(
      moment(bids[0].transaction_date).format(DateTimeUtils.MOMENT_TIME_FORMAT),
      moment(transactionDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
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

    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    const res = await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
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

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing transaction date', async () => {
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

    const isAccepted = true;
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    const res = await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
        isAccepted,
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

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing payment mode', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    const res = await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
        isAccepted,
        transactionDate,
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

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing amount', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    const res = await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
        isAccepted,
        transactionDate,
        paymentMode,
        reviewDate,
        transportationMode,
        review,
        rating,
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing review date', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    const res = await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
        isAccepted,
        transactionDate,
        paymentMode,
        amount,
        transportationMode,
        review,
        rating,
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing transportation mode', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const review = 'Horrible';
    const rating = 1;

    const res = await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
        isAccepted,
        transactionDate,
        paymentMode,
        amount,
        reviewDate,
        review,
        rating,
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing review', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const rating = 1;

    const res = await Chai.request(App)
      .post('/bid/update')
      .set('accessToken', accessToken)
      .send({
        isAccepted,
        transactionDate,
        paymentMode,
        amount,
        reviewDate,
        transportationMode,
        rating,
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing rating', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = null;

    const res = await Chai.request(App)
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
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 401 for missing access token', async () => {
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

    const isAccepted = true;
    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    const res = await Chai.request(App).post('/bid/update').send({
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

    Assert.deepStrictEqual(401, res.status);
  });
});
