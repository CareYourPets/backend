import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import BidService from '../../src/Bid/BidService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import {BID_PAYMENT_MODE, PET_DELIVERY_MODE} from '../../src/Utils/BidUtils';

describe('TestBidUpdateService', () => {
  beforeEach('BidUpdateService beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedCareTakers(1);
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('BidUpdateService afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should update bid', async () => {
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

    await BidService.BidUpdate({
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
    Assert.deepStrictEqual(bids[0].rating, rating);
    Assert.deepStrictEqual(
      moment(bids[0].transaction_date).format(DateTimeUtils.MOMENT_TIME_FORMAT),
      moment(transactionDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
    );
  });

  it('Service will reject update when missing is_accepted', async () => {
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

    const transactionDate = moment().toISOString();
    const paymentMode = BID_PAYMENT_MODE.CASH;
    const amount = 100.0;
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    await Assert.rejects(
      () =>
        BidService.BidUpdate({
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
        }),
      Error,
    );
  });

  it('Service will reject update when rating is less than 0', async () => {
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
    const rating = -1;

    await Assert.rejects(
      () =>
        BidService.BidUpdate({
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
        }),
      Error,
    );
  });

  it('Service will reject update when rating is more than 5', async () => {
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
    const rating = 6;

    await Assert.rejects(
      () =>
        BidService.BidUpdate({
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
        }),
      Error,
    );
  });
});
