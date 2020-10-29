import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import RoleUtils from '../../src/Utils/RoleUtils';
import BidService from '../../src/Bid/BidService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import {BID_PAYMENT_MODE, PET_DELIVERY_MODE} from '../../src/Utils/BidUtils';
import UserService from '../../src/User/UserService';

describe('TestUserNotificationInfoService', () => {
  beforeEach('UserNotificationInfoService beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owner_notifications');
    await pool.query('DELETE FROM care_taker_notifications');
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedCareTakers(1);
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(1, email, category);
  });

  afterEach('UserNotificationInfoService afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owner_notifications');
    await pool.query('DELETE FROM care_taker_notifications');
  });

  it('Service should create petOwnerNotification on create bid', async () => {
    const careTakerEmail = 'test0@example.com';
    const role = RoleUtils.PET_OWNER;
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    const petOwnerNotification = `Bid has been created for ${petOwnerEmail}`;
    await BidFixtures.SeedBids({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    const {rows: petOwnerNotifications} = await UserService.NotificationsInfo({
      email: petOwnerEmail,
      role,
    });
    Assert.deepStrictEqual(
      petOwnerNotifications[0].message,
      petOwnerNotification,
    );
    Assert.deepStrictEqual(petOwnerNotifications[0].email, petOwnerEmail);
  });

  it('Service should create careTakerNotification on create bid', async () => {
    const careTakerEmail = 'test0@example.com';
    const role = RoleUtils.CARE_TAKER;
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    const careTakerNotification = `Bid has been created for ${careTakerEmail}`;
    await BidFixtures.SeedBids({
      petName,
      petOwnerEmail,
      careTakerEmail,
      startDate,
      endDate,
    });

    const {rows: careTakerNotifications} = await UserService.NotificationsInfo({
      email: careTakerEmail,
      role,
    });

    Assert.deepStrictEqual(
      careTakerNotifications[0].message,
      careTakerNotification,
    );
    Assert.deepStrictEqual(careTakerNotifications[0].email, careTakerEmail);
  });

  it('Service should create petOwnerNotification on update bid', async () => {
    const careTakerEmail = 'test0@example.com';
    const petOwnerEmail = 'test0@example.com';
    const role = RoleUtils.PET_OWNER;
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    const petOwnerNotification = `Bid has been updated for ${petOwnerEmail}`;

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

    await BidService.BidUpdate({
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

    const {rows: petOwnerNotifications} = await UserService.NotificationsInfo({
      email: petOwnerEmail,
      role,
    });

    Assert.deepStrictEqual(
      petOwnerNotifications[1].message,
      petOwnerNotification,
    );
    Assert.deepStrictEqual(petOwnerNotifications[1].email, petOwnerEmail);
  });

  it('Service should create careTakerNotification on update bid', async () => {
    const careTakerEmail = 'test0@example.com';
    const role = RoleUtils.CARE_TAKER;
    const petOwnerEmail = 'test0@example.com';
    const petName = 'pet0';
    const {startDate, endDate} = BidFixtures.CreateBidDates();
    const careTakerNotification = `Bid has been updated for ${careTakerEmail}`;

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

    await BidService.BidUpdate({
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

    const {rows: careTakerNotifications} = await UserService.NotificationsInfo({
      email: careTakerEmail,
      role,
    });

    Assert.deepStrictEqual(
      careTakerNotifications[1].message,
      careTakerNotification,
    );
    Assert.deepStrictEqual(careTakerNotifications[1].email, careTakerEmail);
  });
});
