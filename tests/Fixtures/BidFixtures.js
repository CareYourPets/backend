import moment from 'moment';
import DateTimeUtils from '../../src/Utils/DateTimeUtils';
import pool from '../../src/Utils/DBUtils';
import SQLQueries from '../../src/Utils/SQLUtils';
import PetFixtures from './PetFixtures';
import UserFixtures from './UserFixtures';

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
  return {
    pet_name: petName,
    pet_owner_email: petOwnerEmail,
    care_taker_email: careTakerEmail,
    start_date: moment(startDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
  };
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

const SeedMultipleBids = async () => {
  const careTakers = await UserFixtures.SeedCareTakerFullTimers(1);
  const petOwners = await UserFixtures.SeedPetOwners(1);
  const petCategories = await PetFixtures.SeedPetCategories(1);
  // pet owner A's pets
  const pets = await PetFixtures.SeedPets(
    2,
    petOwners[0].email,
    petCategories[0].category,
  );
  const {startDate, endDate} = CreateBidDates();
  const bids = [];
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < 2; i++) {
    // pet owner
    const bid = await SeedBids({
      petName: pets[i].name,
      petOwnerEmail: petOwners[0].email,
      careTakerEmail: careTakers[0].email,
      startDate,
      endDate,
    });
    const bidInfo = {
      ...bid,
      end_date: moment(endDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
      is_deleted: false,
      is_accepted: false,
      transaction_date: null,
      payment_mode: null,
      amount: null,
      review_date: null,
      transportation_mode: null,
      review: null,
      rating: 0,
    };
    bids.push(bidInfo);
  }
  /* eslint-enable no-await-in-loop */
  /* eslint-disable no-nested-ternary */
  bids.sort((a, b) =>
    a.pet_name > b.pet_name ? 1 : b.pet_name > a.pet_name ? -1 : 0,
  );
  return {
    bidData: bids,
    users: [petOwners[0], careTakers[0]],
  };
};

const SeedBidsWithTransactionDate = async ({
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
  await pool.query(SQLQueries.UPDATE_BID, [
    true,
    startDate,
    null,
    null,
    null,
    null,
    5,
    petName,
    petOwnerEmail,
    careTakerEmail,
    startDate,
  ]);
  return {
    pet_name: petName,
    pet_owner_email: petOwnerEmail,
    care_taker_email: careTakerEmail,
    start_date: moment(startDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
  };
};

const SeedMultipleBidsWithTransactionDate = async () => {
  const careTakers = await UserFixtures.SeedCareTakerFullTimers(1);
  const petOwners = await UserFixtures.SeedPetOwners(1);
  const petCategories = await PetFixtures.SeedPetCategories(1);
  // pet owner A's pets
  const pets = await PetFixtures.SeedPets(
    2,
    petOwners[0].email,
    petCategories[0].category,
  );
  const {startDate, endDate} = CreateBidDates();
  const bids = [];
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < 2; i++) {
    // pet owner
    const bid = await SeedBidsWithTransactionDate({
      petName: pets[i].name,
      petOwnerEmail: petOwners[0].email,
      careTakerEmail: careTakers[0].email,
      startDate,
      endDate,
    });
    const bidInfo = {
      ...bid,
      end_date: moment(endDate).format(DateTimeUtils.MOMENT_TIME_FORMAT),
      is_deleted: false,
      is_accepted: true,
      transaction_date: startDate,
      payment_mode: null,
      amount: null,
      review_date: null,
      transportation_mode: null,
      review: 5,
    };
    bids.push(bidInfo);
  }
  /* eslint-enable no-await-in-loop */
  return {
    bidData: bids,
    users: [petOwners[0], careTakers[0]],
  };
};

export default {
  SeedBids,
  CreateBidDates,
  SeedMultipleBids,
  CreateInvalidBidDates,
  SeedMultipleBidsWithTransactionDate,
};
