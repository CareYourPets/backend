import pool from '../Utils/DBUtils';
import SQLQueries from '../Utils/SQLUtils';

const BidCreate = async ({
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
  return {status: 'ok'};
};

const BidInfo = async ({petName, petOwnerEmail, careTakerEmail, startDate}) => {
  const bid = await pool.query(SQLQueries.SELECT_BID, [
    petName,
    petOwnerEmail,
    careTakerEmail,
    startDate,
  ]);
  return bid;
};

const BidDelete = async ({
  petName,
  petOwnerEmail,
  careTakerEmail,
  startDate,
}) => {
  await pool.query(SQLQueries.DELETE_BID, [
    petName,
    petOwnerEmail,
    careTakerEmail,
    startDate,
  ]);
  return {status: 'ok'};
};

const BidUpdate = async ({
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
}) => {
  await pool.query(SQLQueries.UPDATE_BID, [
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
  ]);
  return {status: 'ok'};
};

export default {
  BidCreate,
  BidInfo,
  BidUpdate,
  BidDelete,
};
