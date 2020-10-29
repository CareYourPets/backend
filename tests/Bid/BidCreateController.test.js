import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import App from '../../src/App';
import MOMENT_TIME_FORMAT from '../../src/Utils/DateTimeUtils';

Chai.use(ChaiHttp);

describe('Test BidCreate Controller', () => {
  beforeEach('BidCreateController beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM psc_administrators');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM care_taker_notifications');
    await pool.query('DELETE FROM pet_owner_notifications');
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
    await pool.query('DELETE FROM care_taker_notifications');
    await pool.query('DELETE FROM pet_owner_notifications');
  });

  it('API should create bid', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
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
      // moment(bids[0].start_date).toISOString(),
      moment(bids[0].start_date).format(MOMENT_TIME_FORMAT),
      moment(startDate).format(MOMENT_TIME_FORMAT),
    );
  });

  it('API should reject bid when start_date after end_date', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateInvalidBidDates();
    const res = await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
        endDate,
      });

    Assert.deepStrictEqual(403, res.status);
  });

  it('API should reject duplicate bids', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
        endDate,
      });

    const res = await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
        petName,
        petOwnerEmail,
        careTakerEmail,
        startDate,
        endDate,
      });

    Assert.deepStrictEqual(403, res.status);
  });

  it('API should return 422 for missing pet name', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    const res = await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
        petOwnerEmail,
        careTakerEmail,
        startDate,
        endDate,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing pet owner email', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const careTakerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    const res = await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
        petName,
        careTakerEmail,
        startDate,
        endDate,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing care taker email', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const petName = 'pet0';
    const petOwnerEmail = 'test0@example.com';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    const res = await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
        petName,
        petOwnerEmail,
        startDate,
        endDate,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing dates', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];
    const petName = 'pet0';
    const petOwnerEmail = 'test0@example.com';
    const careTakerEmail = 'test0@example.com';
    const res = await Chai.request(App)
      .post('/bid/create')
      .set('accessToken', accessToken)
      .send({
        petName,
        petOwnerEmail,
        careTakerEmail,
      });
    Assert.deepStrictEqual(422, res.status);
  });
});
