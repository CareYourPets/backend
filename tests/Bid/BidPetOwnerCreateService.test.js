import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import BidService from '../../src/Bid/BidService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import {MOMENT_TIME_FORMAT} from '../../src/Utils/DateTimeUtils';

describe('Test BidCreate Service', () => {
  beforeEach('BidCreateService beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
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
    Assert.deepStrictEqual(petName, bids[0].pet_name);
    Assert.deepStrictEqual(petOwnerEmail, bids[0].pet_owner_email);
    Assert.deepStrictEqual(careTakerEmail, bids[0].care_taker_email);
    Assert.deepStrictEqual(
      startDate,
      moment(bids[0].start_date).format(MOMENT_TIME_FORMAT),
    );
  });

  /*

  it('Service should create pet owner', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;

    await BidService.BidCreate({
      email,
      password,
      role,
    });

    const {rows: users} = await pool.query(
      `SELECT * FROM pet_owners WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(email, users[0].email);
  });

  it('Service should create administrator', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;

    await BidService.BidCreate({
      email,
      password,
      role,
    });

    const {rows: users} = await pool.query(
      `SELECT * FROM psc_administrators WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(email, users[0].email);
  });

  it('Service should create user with password with valid hashed', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;

    await BidService.BidCreate({
      email,
      password,
      role,
    });

    const {rows: users} = await pool.query(
      `SELECT * FROM pet_owners WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      true,
      await IsPasswordVerified(password, users[0].password),
    );
  });

  it('Service should reject duplicate email for care takers', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;

    await BidService.BidCreate({
      email,
      password,
      role,
    });
    await Assert.rejects(
      () =>
        BidService.BidCreate({
          email,
          password,
          role,
        }),
      Error,
    );
  });

  it('Service should reject duplicate email for pet owners', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;

    await BidService.BidCreate({
      email,
      password,
      role,
    });
    await Assert.rejects(
      () =>
        BidService.BidCreate({
          email,
          password,
          role,
        }),
      Error,
    );
  });

  it('Service should reject duplicate email for administrators', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;

    await BidService.BidCreate({
      email,
      password,
      role,
    });
    await Assert.rejects(
      () =>
        BidService.BidCreate({
          email,
          password,
          role,
        }),
      Error,
    );
  });
  */
});
