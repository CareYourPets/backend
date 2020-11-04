import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import BidService from '../../src/Bid/BidService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import {BID_PAYMENT_MODE, PET_DELIVERY_MODE} from '../../src/Utils/BidUtils';
import PetService from '../../src/Pet/PetService';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('FetchCareTakerReviewsService', () => {
  beforeEach('FetchCareTakerReviewsService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedCareTakers(2);
    await UserFixtures.SeedCareTakerRole({
      email: 'test0@example.com',
      role: RoleUtils.CARE_TAKER_FULL_TIMER,
    });
    await UserFixtures.SeedCareTakerRole({
      email: 'test1@example.com',
      role: RoleUtils.CARE_TAKER_PART_TIMER,
    });
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('FetchCareTakerReviewsService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should update bid', async () => {
    // Setting up test case
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

    await pool.query(
      `SELECT * 
        FROM bids 
        WHERE pet_name='${petName}' 
        AND pet_owner_email='${petOwnerEmail}'
        AND care_taker_email='${careTakerEmail}'
        AND start_date='${startDate}'
       `,
    );

    // Testing service
    const reviews = await PetService.FetchCareTakerReviews({careTakerEmail});
    Assert.deepStrictEqual(
      [
        {
          email: 'test0@example.com',
          name: null,
          review: 'Horrible',
          rating: 1,
        },
      ],
      reviews,
    );
  });
});
