import moment from 'moment';
import pool from '../../src/Utils/DBUtils';
import SQLQueries from '../../src/Utils/SQLUtils';

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
  const startDate = moment().toISOString();
  const endDate = moment().add(7, 'days').toISOString();
  return {startDate, endDate};
};

const CreateInvalidBidDates = () => {
  const startDate = moment().toISOString();
  const endDate = moment().subtract(7, 'days').toISOString();
  return {startDate, endDate};
};

export default {
  SeedBids,
  CreateBidDates,
  CreateInvalidBidDates,
};
