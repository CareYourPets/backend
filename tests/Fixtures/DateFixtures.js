import moment from 'moment';
import _ from 'lodash';
import SQLQueries from '../../src/Utils/SQLUtils';
import pool from '../../src/Utils/DBUtils';

const SeedUnavailableDate = async ({email, date}) => {
  await pool.query(SQLQueries.CREATE_CARE_TAKER_UNAVAILABLE_DATE, [
    email,
    date,
  ]);
  return {email, date};
};

const SeedAvailableDate = async ({email, date}) => {
  await pool.query(SQLQueries.CREATE_CARE_TAKER_AVAILABLE_DATE, [email, date]);
  return {email, date};
};

/** Seeds available dates for a part time care taker that match those created in @see BidFixtures.CreateBidDates */
const SeedAvaliableDates = async (i, email) => {
  await Promise.all(
    _.times(i, (idx) => {
      const date = moment().add(idx, 'days').toISOString(true);
      return SeedAvailableDate({email, date});
    }),
  );
};

/* Note: Need an offset of +1 to moment#add because of a weird bug with moment#startOf('year') */
const SeedAllLeaveDays = async () => {
  const email = 'test0@example.com';
  return Promise.all(
    _.times(65, (idx) => {
      const next = moment().startOf('year').add(idx, 'days');
      return pool.query(
        `INSERT INTO care_taker_full_timers_unavailable_dates ( email, date ) VALUES ( '${email}', '${next.toISOString(
          true,
        )}')`,
      );
    }),
  );
};

/* Note: Need an offset of +1 to moment#add because of a weird bug with moment#startOf('year') */
const SeedEdgeCaseDates = async () => {
  const email = 'test0@example.com';
  // start 1 Jan
  await Promise.all(
    _.times(32, (idx) => {
      const next = moment().startOf('year').add(idx, 'days');
      return pool.query(
        `INSERT INTO care_taker_full_timers_unavailable_dates ( email, date ) VALUES ( '${email}', '${next.toISOString(
          true,
        )}')`,
      );
    }),
  );
  // leave 150 day gap
  // start 1 June
  return Promise.all(
    _.times(32, (idx) => {
      const next = moment().startOf('year').add(181, 'days').add(idx, 'days');
      return pool.query(
        `INSERT INTO care_taker_full_timers_unavailable_dates ( email, date ) VALUES ( '${email}', '${next.toISOString(
          true,
        )}')`,
      );
    }),
  );
};

export default {
  SeedUnavailableDate,
  SeedAllLeaveDays,
  SeedEdgeCaseDates,
  SeedAvailableDate,
  SeedAvaliableDates,
};
