import Assert from 'assert';
import moment from 'moment';
import Chai from 'chai';
import _ from 'lodash';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import BidFixtures from '../Fixtures/BidFixtures';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';

Chai.use(ChaiHttp);

describe('Test BidInfo Controller', () => {
  beforeEach('BidInfoController beforeEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('BidInfoController afterEach', async () => {
    await pool.query('DELETE FROM care_taker_full_timers');
    await pool.query('DELETE FROM care_taker_part_timers');
    await pool.query('DELETE FROM bids');
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should fetch all bids made by pet owner', async () => {
    const data = await BidFixtures.SeedMultipleBids();
    const petOwner = data.users[0];

    const res = await Chai.request(App)
      .get('/bid/info')
      .set('accessToken', petOwner.accessToken);

    const bids = res.body.response;

    for (let i = 0; i < bids.length; i++) {
      const formattedStartDate = moment(bids[i].start_date).format(
        DateTimeUtils.MOMENT_TIME_FORMAT,
      );
      bids[i].start_date = formattedStartDate;
      const formattedEndDate = moment(bids[i].end_date).format(
        DateTimeUtils.MOMENT_TIME_FORMAT,
      );
      bids[i].end_date = formattedEndDate;
    }
    const petOwnerInfo = {
      name: null,
      gender: null,
      contact: null,
      area: null,
      location: null,
      bio: null,
    };
    const expected = data.bidData.map((data) =>
      _.omit({...data, ...petOwnerInfo}, ['is_deleted']),
    );

    /* eslint-disable no-nested-ternary */
    bids.sort((a, b) =>
      a.pet_name > b.pet_name ? 1 : b.pet_name > a.pet_name ? -1 : 0,
    );

    Assert.deepStrictEqual(expected, bids);
  });

  it('API should fetch all bids involving care taker', async () => {
    const data = await BidFixtures.SeedMultipleBids();
    const careTaker = data.users[1];

    const res = await Chai.request(App)
      .get('/bid/info')
      .set('accessToken', careTaker.accessToken);

    const bids = res.body.response;

    for (let i = 0; i < bids.length; i++) {
      const formattedStartDate = moment(bids[i].start_date).format(
        DateTimeUtils.MOMENT_TIME_FORMAT,
      );
      bids[i].start_date = formattedStartDate;
      const formattedEndDate = moment(bids[i].end_date).format(
        DateTimeUtils.MOMENT_TIME_FORMAT,
      );
      bids[i].end_date = formattedEndDate;
    }
    const careTakerInfo = {
      name: null,
      gender: null,
      contact: null,
      area: null,
      location: null,
      bio: null,
    };
    const expected = data.bidData.map((data) =>
      _.omit({...data, ...careTakerInfo}, ['is_deleted']),
    );

    // bids.sort((a, b) => a.pet_name - b.pet_name);

    Assert.deepStrictEqual(expected, bids);
  });

  it('API should fetch all bids for admin', async () => {
    const data = await BidFixtures.SeedMultipleBids();
    const admins = await UserFixtures.SeedAdministrators(1);

    const res = await Chai.request(App)
      .get('/bid/info')
      .set('accessToken', admins[0].accessToken);

    const bids = res.body.response;

    for (let i = 0; i < bids.length; i++) {
      const formattedStartDate = moment(bids[i].start_date).format(
        DateTimeUtils.MOMENT_TIME_FORMAT,
      );
      bids[i].start_date = formattedStartDate;
      const formattedEndDate = moment(bids[i].end_date).format(
        DateTimeUtils.MOMENT_TIME_FORMAT,
      );
      bids[i].end_date = formattedEndDate;
    }

    // bids.sort((a, b) => a.pet_name - b.pet_name);

    Assert.deepStrictEqual(data.bidData, bids);
  });

  it('API should return 401 for missing access token', async () => {
    const res = await Chai.request(App).get('/bid/info');

    Assert.deepStrictEqual(401, res.status);
  });
});
