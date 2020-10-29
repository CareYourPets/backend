import Assert from 'assert';
import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import BidService from '../../src/Bid/BidService';
import BidFixtures from '../Fixtures/BidFixtures';
import UserFixtures from '../Fixtures/UserFixtures';
import MOMENT_TIME_FORMAT from '../../src/Utils/DateTimeUtils';

describe('Test BidInfo Service', () => {
  beforeEach('BidInfoService beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
    await pool.query('DELETE FROM care_taker_notifications');
    await pool.query('DELETE FROM pet_owner_notifications');
  });

  afterEach('BidInfoService afterEach', async () => {
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
    await pool.query('DELETE FROM care_taker_notifications');
    await pool.query('DELETE FROM pet_owner_notifications');
  });

  it('Service should fetch all bids made by pet owner', async () => {
    const data = await BidFixtures.SeedMultipleBids();
    const petOwner = data.users[0];
    const bids = await BidService.BidsInfo({
      email: petOwner.email,
      role: petOwner.role,
    });

    for (let i = 0; i < bids.length; i++) {
      const formattedStartDate = moment(bids[i].start_date).format(
        MOMENT_TIME_FORMAT,
      );
      bids[i].start_date = formattedStartDate;
      const formattedEndDate = moment(bids[i].end_date).format(
        MOMENT_TIME_FORMAT,
      );
      bids[i].end_date = formattedEndDate;
    }

    Assert.deepStrictEqual(data.bidData, bids);
  });

  it('Service should fetch all bids involving care taker', async () => {
    const data = await BidFixtures.SeedMultipleBids();
    const careTaker = data.users[1];
    const bids = await BidService.BidsInfo({
      email: careTaker.email,
      role: careTaker.role,
    });

    for (let i = 0; i < bids.length; i++) {
      const formattedStartDate = moment(bids[i].start_date).format(
        MOMENT_TIME_FORMAT,
      );
      bids[i].start_date = formattedStartDate;
      const formattedEndDate = moment(bids[i].end_date).format(
        MOMENT_TIME_FORMAT,
      );
      bids[i].end_date = formattedEndDate;
    }

    Assert.deepStrictEqual(data.bidData, bids);
  });

  it('Service should fetch all bids for admin', async () => {
    const data = await BidFixtures.SeedMultipleBids();
    const admins = await UserFixtures.SeedAdministrators(1);
    const bids = await BidService.BidsInfo({
      email: admins[0].email,
      role: admins[0].role,
    });

    for (let i = 0; i < bids.length; i++) {
      const formattedStartDate = moment(bids[i].start_date).format(
        MOMENT_TIME_FORMAT,
      );
      bids[i].start_date = formattedStartDate;
      const formattedEndDate = moment(bids[i].end_date).format(
        MOMENT_TIME_FORMAT,
      );
      bids[i].end_date = formattedEndDate;
    }

    Assert.deepStrictEqual(data.bidData, bids);
  });
});
