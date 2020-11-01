import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import BidService from '../../src/Bid/BidService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';

describe('Test BidCreate Service', () => {
  beforeEach('BidCreateService beforeEach', async () => {
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

  afterEach('BidCreateService afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should create bid', async () => {
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await BidService.BidCreate({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
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
    Assert.deepStrictEqual(bids[0].pet_name, petName);
    Assert.deepStrictEqual(bids[0].pet_owner_email, petOwnerEmail);
    Assert.deepStrictEqual(bids[0].care_taker_email, careTakerEmail);
    Assert.deepStrictEqual(
      moment(bids[0].start_date).format(DateTimeUtils.MOMENT_TIME_FORMAT),
      moment(startDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
    );
  });

  it('Service should reject bid when start_date after end_date', async () => {
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateInvalidBidDates();
    await Assert.rejects(
      () =>
        BidService.BidCreate({
          petName,
          petOwnerEmail,
          careTakerEmail,
          startDate,
          endDate,
        }),
      Error,
    );
  });

  it('Service should reject duplicate bids', async () => {
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await BidService.BidCreate({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });
    await Assert.rejects(
      () =>
        BidService.BidCreate({
          petName,
          petOwnerEmail,
          careTakerEmail,
          startDate,
          endDate,
        }),
      Error,
    );
  });

  it('Service should accept bid if full timer has up to 5 pets', async () => {
    await pool.query('DELETE FROM pets');
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petNames = ['pet0', 'pet1', 'pet2', 'pet3', 'pet4'];
    const category = 'category0';
    await PetFixtures.SeedPets(6, petOwnerEmail, category);
    for (let i = 0; i < petNames.length; i++) {
      const {startDate, endDate} = BidFixtures.CreateBidDates();
      // eslint-disable-next-line no-await-in-loop
      await BidService.BidCreate({
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
        endDate,
      });
      // eslint-disable-next-line no-await-in-loop
      await BidService.BidUpdate({
        isAccepted: true,
        transactionDate: null,
        paymentMode: null,
        amount: null,
        reviewDate: null,
        transportationMode: null,
        review: null,
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });
      // eslint-disable-next-line no-await-in-loop
      const {rows: bids} = await pool.query(`
        SELECT * FROM bids
      `);
      Assert.deepStrictEqual(bids[i].pet_name, `pet${i}`);
    }
  });

  it('Service should accept bid if full timer has more than 5 pets', async () => {
    await pool.query('DELETE FROM pets');
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petNames = ['pet0', 'pet1', 'pet2', 'pet3', 'pet4'];
    const category = 'category0';
    await PetFixtures.SeedPets(6, petOwnerEmail, category);
    for (let i = 0; i < petNames.length; i++) {
      const {startDate, endDate} = BidFixtures.CreateBidDates();
      // eslint-disable-next-line no-await-in-loop
      await BidService.BidCreate({
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
        endDate,
      });
      // eslint-disable-next-line no-await-in-loop
      await BidService.BidUpdate({
        isAccepted: true,
        transactionDate: null,
        paymentMode: null,
        amount: null,
        reviewDate: null,
        transportationMode: null,
        review: null,
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });
    }
    const {newStartDate, newEndDate} = BidFixtures.CreateBidDates();
    await Assert.rejects(
      () =>
        BidService.BidCreate({
          petName: 'pet5',
          petOwnerEmail,
          careTakerEmail,
          startDate: newStartDate,
          endDate: newEndDate,
        }),
      Error,
    );
  });

  it('Service should accept bid if full timer has 5 overlapping pets and 1 other pet', async () => {
    await pool.query('DELETE FROM pets');
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petNames = ['pet0', 'pet1', 'pet2', 'pet3', 'pet4'];
    const category = 'category0';
    await PetFixtures.SeedPets(6, petOwnerEmail, category);
    for (let i = 0; i < petNames.length; i++) {
      const {startDate, endDate} = BidFixtures.CreateBidDates();
      // eslint-disable-next-line no-await-in-loop
      await BidService.BidCreate({
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
        endDate,
      });
      // eslint-disable-next-line no-await-in-loop
      await BidService.BidUpdate({
        isAccepted: true,
        transactionDate: null,
        paymentMode: null,
        amount: null,
        reviewDate: null,
        transportationMode: null,
        review: null,
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });
    }
    const newStartDate = moment().add(2, 'weeks').toISOString(true);
    const newEndDate = moment().add(2, 'weeks').toISOString(true);
    await BidService.BidCreate({
      petName: 'pet5',
      petOwnerEmail,
      careTakerEmail,
      startDate: newStartDate,
      endDate: newEndDate,
    });
    const {rows: bids} = await pool.query(`
        SELECT * FROM bids WHERE pet_name = 'pet5'
      `);
    await Assert.deepStrictEqual(bids[0].pet_name, 'pet5');
  });
});
