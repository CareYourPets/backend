import pool from '../Utils/DBUtils';
import SQLQueries from '../Utils/SQLUtils';
import RoleUtils from '../Utils/RoleUtils';

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

/**
 * Fetches all bids involving a user.
 * @param {String} email
 * @param {Enum} role
 */
const BidsInfo = async ({email, role}) => {
  let bids = null;
  if (role === RoleUtils.CARE_TAKER) {
    bids = await pool.query(SQLQueries.SELECT_CARE_TAKER_BIDS, [email]);
  } else if (role === RoleUtils.PET_OWNER) {
    bids = await pool.query(SQLQueries.SELECT_PET_OWNER_BIDS, [email]);
  } else if (role === RoleUtils.ADMINISTRATOR) {
    bids = await pool.query(SQLQueries.SELECT_BIDS);
  } else {
    throw new Error('Invalid Role');
  }
  return bids.rows;
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
  BidsInfo,
  BidDelete,
  BidCreate,
  BidUpdate,
};
