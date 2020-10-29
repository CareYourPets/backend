import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import RoleUtils from '../../src/Utils/RoleUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';
import BidFixtures from '../Fixtures/BidFixtures';
import UserService from '../../src/User/UserService';

describe('TestUserNotificationReadService', () => {
  beforeEach('UserNotificationReadService beforeEach', async () => {
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

  afterEach('UserNotificationReadService afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owner_notifications');
    await pool.query('DELETE FROM care_taker_notifications');
  });

  it('Service should read petOwnerNotification', async () => {
    const careTakerEmail = 'test0@example.com';
    const role = RoleUtils.PET_OWNER;
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

    const {rows: petOwnerNotifications} = await UserService.NotificationsInfo({
      email: petOwnerEmail,
      role,
    });
    // eslint-disable-next-line camelcase
    const {notif_date} = petOwnerNotifications[0];
    // eslint-disable-next-line camelcase
    const new_notif_date = moment(notif_date).toISOString(true);
    // eslint-disable-next-line camelcase
    const is_read = true;
    await UserService.NotificationRead({
      notif_date: new_notif_date,
      email: petOwnerEmail,
      role,
    });
    // await pool.query(`UPDATE pet_owner_notifications SET is_read=TRUE WHERE notif_date='${new_notif_date}' AND email='${petOwnerEmail}';`);

    const {
      rows: petOwnerNotificationsRead,
    } = await UserService.NotificationsInfo({email: petOwnerEmail, role});

    Assert.deepStrictEqual(petOwnerNotificationsRead[0].is_read, is_read);
  });

  it('Service should read petOwnerNotification', async () => {
    const careTakerEmail = 'test0@example.com';
    const role = RoleUtils.PET_OWNER;
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

    const {rows: careTakerNotifications} = await UserService.NotificationsInfo({
      email: careTakerEmail,
      role,
    });
    // eslint-disable-next-line camelcase
    const {notif_date} = careTakerNotifications[0];
    // eslint-disable-next-line camelcase
    const new_notif_date = moment(notif_date).toISOString(true);
    // eslint-disable-next-line camelcase
    const is_read = true;
    await UserService.NotificationRead({
      notif_date: new_notif_date,
      email: careTakerEmail,
      role,
    });

    const {
      rows: petOwnerNotificationsRead,
    } = await UserService.NotificationsInfo({email: careTakerEmail, role});

    Assert.deepStrictEqual(petOwnerNotificationsRead[0].is_read, is_read);
  });
});
