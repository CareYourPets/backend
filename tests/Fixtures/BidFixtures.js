import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import SQLQueries from '../../src/Utils/SQLUtils';
import MOMENT_TIME_FORMAT from '../../src/Utils/DateTimeUtils';

const SeedBids = async ({
  petName,
  petOwnerEmail,
  careTakerEmail,
  startDate,
  endDate,
}) => {
  await pool.query(SQLQueries.CREATE_BID, [
    petName,
    petOwnerEmail,
    careTakerEmail,
    startDate,
    endDate,
  ]);
  return {petName, petOwnerEmail, careTakerEmail, startDate};
};

const CreateBidDates = () => {
  const startDate = moment().format(MOMENT_TIME_FORMAT);
  const endDate = moment().add(7, 'days').format(MOMENT_TIME_FORMAT);
  return {startDate, endDate};
};

const CreateInvalidBidDates = () => {
  const startDate = moment().format(MOMENT_TIME_FORMAT);
  const endDate = moment().subtract(7, 'days').format(MOMENT_TIME_FORMAT);
  return {startDate, endDate};
};

export default {
  SeedBids,
  CreateBidDates,
  CreateInvalidBidDates,
};
