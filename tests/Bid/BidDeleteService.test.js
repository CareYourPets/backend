import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import PetFixtures from '../Fixtures/PetFixtures';
import UserFixtures from '../Fixtures/UserFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import BidService from '../../src/Bid/BidService';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';

describe('Test BidDeleteService', () => {
  beforeEach('BidDeleteService beforeEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedCareTakers(1);
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('BidDeleteService afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should delete bid', async () => {
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();

    BidFixtures.SeedBids({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    await BidService.BidDelete({
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
        is_deleted: true,
      },
      bids[0],
    );
  });
});
