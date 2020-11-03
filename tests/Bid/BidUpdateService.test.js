import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import BidService from '../../src/Bid/BidService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import {BID_PAYMENT_MODE, PET_DELIVERY_MODE} from '../../src/Utils/BidUtils';

describe('Test BidUpdate Service', () => {
  beforeEach('BidCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedCareTakers(1);
    await PetFixtures.SeedPetCategories(2);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('BidCreateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
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
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    await BidService.BidUpdate({
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
    const reviewDate = moment().toISOString();
    const transportationMode = PET_DELIVERY_MODE.CARE_TAKER_PICK_UP;
    const review = 'Horrible';
    const rating = 1;

    await Assert.rejects(
      () =>
        BidService.BidUpdate({
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

  it('Service should automatically update the care_taker_skill.price after an update to the rating', async () => {
    await pool.query('DELETE FROM care_takers');
    await UserFixtures.SeedCareTakerFullTimers(1);
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category0', 10);
    `);
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const actualAmount = 50;
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await BidService.BidCreate({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });
    await BidService.BidUpdate({
      isAccepted: true,
      transactionDate: null,
      paymentMode: null,
      reviewDate: null,
      transportationMode: null,
      review: 'Awesome',
      rating: 5,
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
    });

    const {rows: careTakerSkills} = await pool.query(
      `SELECT * 
			FROM care_taker_skills
			WHERE email='${careTakerEmail}'
			AND category='category0'
			`,
    );
    Assert.deepStrictEqual(careTakerSkills[0].price, actualAmount);
  });
});
