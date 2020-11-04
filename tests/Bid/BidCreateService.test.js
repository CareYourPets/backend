import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import BidService from '../../src/Bid/BidService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import DateFixtures from '../Fixtures/DateFixtures';
import RoleUtils from '../../src/Utils/RoleUtils';

describe('Test BidCreate Service', () => {
  beforeEach('BidCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
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
    await PetFixtures.SeedPetCategories(2);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('BidCreateService afterEach', async () => {
    await pool.query('DELETE FROM care_taker_part_timers_available_dates');
    await pool.query('DELETE FROM care_taker_full_timers_unavailable_dates');
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_taker_skills');
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

  it('Service should create bid for avail part timer', async () => {
    const careTakerEmail = 'test1@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await DateFixtures.SeedAvaliableDates(8);
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
        reviewDate: null,
        transportationMode: null,
        review: null,
        rating: 0,
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

  it('Service should not accept bid if full timer has more than 5 pets', async () => {
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
        reviewDate: null,
        transportationMode: null,
        review: null,
        rating: 0,
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });
    }
    const {
      startDate: newStartDate,
      endDate: newEndDate,
    } = BidFixtures.CreateBidDates();
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
        reviewDate: null,
        transportationMode: null,
        review: null,
        rating: 0,
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });
    }
    const newStartDate = moment().add(3, 'weeks').toISOString(true);
    const newEndDate = moment().add(3, 'weeks').toISOString(true);
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

  it('Service should automatically accept bid for full timers', async () => {
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category0', 10);
    `);
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
    Assert.deepStrictEqual(bids[0].is_accepted, true);
  });

  it('Service should not automatically accept bid for full timers outside their skills', async () => {
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category1', 10);
    `);
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
    Assert.deepStrictEqual(bids[0].is_accepted, false);
  });

  it('Service should not automatically accept bid for part timers', async () => {
    const careTakerEmail = 'test1@example.com';
    await DateFixtures.SeedAvaliableDates(8);
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category0', 10);
    `);
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
    Assert.deepStrictEqual(bids[0].is_accepted, false);
  });

  it('Service should not accept bid if part timer has more than 5 pets and is above 4 stars', async () => {
    await pool.query('DELETE FROM pets');
    const careTakerEmail = 'test1@example.com';
    await DateFixtures.SeedAvaliableDates(8);
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
        reviewDate: null,
        transportationMode: null,
        review: 'asdf',
        rating: 5,
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

  it('Service should accept bid if part timer has 5 pets or less, more than 2 pets and is above 4 stars', async () => {
    await pool.query('DELETE FROM pets');
    const careTakerEmail = 'test1@example.com';
    await DateFixtures.SeedAvaliableDates(8);
    const petOwnerEmail = 'test0@example.com';
    const petNames = ['pet0', 'pet1', 'pet2'];
    const category = 'category0';
    await PetFixtures.SeedPets(4, petOwnerEmail, category);
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
        reviewDate: null,
        transportationMode: null,
        review: 'asdf',
        rating: 5,
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });
    }
    const {
      startDate: newStartDate,
      endDate: newEndDate,
    } = BidFixtures.CreateBidDates();
    await BidService.BidCreate({
      petName: 'pet3',
      petOwnerEmail,
      careTakerEmail,
      startDate: newStartDate,
      endDate: newEndDate,
    });
    await BidService.BidUpdate({
      isAccepted: true,
      transactionDate: null,
      paymentMode: null,
      reviewDate: null,
      transportationMode: null,
      review: 'asdf',
      rating: 5,
      petName: 'pet3',
      petOwnerEmail,
      careTakerEmail,
      startDate: newStartDate,
    });
    const {rows: bids} = await pool.query(
      `SELECT * 
			FROM bids 
			WHERE pet_name='pet3';
			`,
    );
    await Assert.deepStrictEqual(bids[0].pet_name, 'pet3');
  });

  it('Service should not accept bid if part timer has 5 pets or less, more than 2 pets and is below 4 stars', async () => {
    await pool.query('DELETE FROM pets');
    const careTakerEmail = 'test1@example.com';
    await DateFixtures.SeedAvaliableDates(8);
    const petOwnerEmail = 'test0@example.com';
    const petNames = ['pet0', 'pet1'];
    const category = 'category0';
    await PetFixtures.SeedPets(3, petOwnerEmail, category);
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
        reviewDate: null,
        transportationMode: null,
        review: 'asdf',
        rating: 1,
        petName: petNames[i],
        petOwnerEmail,
        careTakerEmail,
        startDate,
      });
    }
    const {
      startDate: newStartDate,
      endDate: newEndDate,
    } = BidFixtures.CreateBidDates();

    await Assert.rejects(
      () =>
        BidService.BidCreate({
          petName: 'pet2',
          petOwnerEmail,
          careTakerEmail,
          startDate: newStartDate,
          endDate: newEndDate,
        }),
      Error,
    );
  });

  it('Service should automatically calculate an amount for the bid', async () => {
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category0', 10);
    `);
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const actualAmount = 80;
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
    Assert.deepStrictEqual(bids[0].amount, actualAmount);
  });

  it('Service should automatically calculate the correct amount for the correct bid', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category0', 10);
    `);
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category1', 20);
    `);
    await pool.query(`
        INSERT INTO pets(name, category, email, needs, diet)
        VALUES('pet0', 'category0', 'test0@example.com', null, null);
    `);
    await pool.query(`
        INSERT INTO pets(name, category, email, needs, diet)
        VALUES('pet1', 'category1', 'test0@example.com', null, null);
    `);
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const petName1 = 'pet1';
    const actualAmountCatZero = 80;
    const actualAmountCatOne = 160;
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await BidService.BidCreate({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    await BidService.BidCreate({
      petName: petName1,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    const {rows: catZeroBids} = await pool.query(
      `SELECT * 
			FROM bids 
			WHERE pet_name='${petName}' 
			`,
    );
    const {rows: catOneBids} = await pool.query(
      `SELECT * 
			FROM bids 
			WHERE pet_name='${petName1}' 
			`,
    );
    Assert.deepStrictEqual(catZeroBids[0].amount, actualAmountCatZero);
    Assert.deepStrictEqual(catOneBids[0].amount, actualAmountCatOne);
  });

  it('Service should automatically calculate an amount for a bid of 0 days', async () => {
    await pool.query(`
        INSERT INTO care_taker_skills(email, category, price)
        VALUES('test0@example.com', 'category0', 10);
    `);
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const actualAmount = 10;
    const startDate = moment().toISOString(true);
    const endDate = moment().toISOString(true);
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
    Assert.deepStrictEqual(bids[0].amount, actualAmount);
  });

  it('Service should reject a bid if full time care taker is not available for the bid dates range', async () => {
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    // start date is today and end date is 7 days from now
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    // unavail date is within now and 7 days from now
    const unavailDate = moment().add('3', 'days').toISOString(true);
    await DateFixtures.SeedUnavailableDate({
      email: careTakerEmail,
      date: unavailDate,
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

  it('Service should reject a bid if part time care taker is not available for the bid dates range', async () => {
    const parTimeCareTakerEmail = 'test1@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    // start date is today and end date is 7 days from now
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await DateFixtures.SeedAvaliableDates(7); // one day missing

    await Assert.rejects(
      () =>
        BidService.BidCreate({
          petName,
          petOwnerEmail,
          careTakerEmail: parTimeCareTakerEmail,
          startDate,
          endDate,
        }),
      Error,
    );
  });
});
