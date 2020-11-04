import _ from 'lodash';
import pool from '../Utils/DBUtils';
import SQLQueries from '../Utils/SQLUtils';

const PetCategoryCreate = async ({category, basePrice}) => {
  await pool.query(SQLQueries.CREATE_PET_CATEGORY, [category, basePrice]);

  return {status: 'ok'};
};

const PetCategoryFetch = async ({category}) => {
  let petCategories = [];
  if (category === null) {
    const results = await pool.query(SQLQueries.FETCH_PET_CATEGORIES);
    petCategories = results.rows;
  } else {
    const results = await pool.query(SQLQueries.FETCH_PET_CATEGORY, [category]);
    petCategories = results.rows;
  }
  return petCategories;
};

const PetCategoryDelete = async ({category}) => {
  await pool.query(SQLQueries.DELETE_PET_CATEGORY, [category]);
  return {status: 'ok'};
};

const PetCategoryUpdate = async ({currentCategory, category, basePrice}) => {
  await pool.query(SQLQueries.UPDATE_PET_CATEGORY, [
    category,
    basePrice,
    currentCategory,
  ]);
  return {status: 'ok'};
};

const PetCreate = async ({email, category, needs, diet, name}) => {
  await pool.query(SQLQueries.CREATE_PET, [name, category, email, needs, diet]);
  return {status: 'ok'};
};

const PetDelete = async ({email, name}) => {
  await pool.query(SQLQueries.DELETE_PET, [name, email]);
  return {status: 'ok'};
};

const PetUpdate = async ({email, currentName, category, needs, diet, name}) => {
  await pool.query(SQLQueries.UPDATE_PET, [
    name,
    category,
    needs,
    diet,
    currentName,
    email,
  ]);
  return {status: 'ok'};
};

const PetFetch = async ({email}) => {
  const results = await pool.query(SQLQueries.FETCH_PET, [email]);
  return results.rows;
};

const FetchAllCareTakers = async ({email, isByLocation}) => {
  let careTakers = [];
  if (isByLocation) {
    const results = await pool.query(
      SQLQueries.FETCH_ALL_CARE_TAKERS_BY_LOCATION,
      [email],
    );
    careTakers = results.rows;
  } else {
    const results = await pool.query(SQLQueries.FETCH_ALL_CARE_TAKERS);
    careTakers = results.rows;
  }
  // include each care taker's skills
  const result = [];

  /* eslint-disable no-await-in-loop */
  /* eslint-disable no-restricted-syntax */
  for (const ct of careTakers) {
    let skills = await pool.query(SQLQueries.FETCH_CARE_TAKER_SKILLS, [
      ct.email,
    ]);
    skills = skills.rows.map((skill) => _.omit(skill, ['email']));
    result.push({
      ...ct,
      skills,
    });
  }
  return result;
};

const FetchCareTaker = async ({email}) => {
  const caretakers = await pool.query(SQLQueries.FETCH_CARE_TAKER, [email]);
  const skills = await pool.query(SQLQueries.FETCH_CARE_TAKER_SKILLS, [email]);
  return [caretakers.rows, skills.rows];
};

const FetchPetOwner = async ({email}) => {
  const petowner = await pool.query(SQLQueries.FETCH_PET_OWNER, [email]);
  const pets = await pool.query(SQLQueries.FETCH_PET, [email]);
  return [petowner.rows, pets.rows];
};

const FetchCareTakerSalary = async ({email, month, year}) => {
  const paddedMonth = `000${month.toString()}`;
  const newMonth = paddedMonth.substr(paddedMonth.length - 2);
  const dateFormat = `${year.toString()}-${newMonth}-%`;
  const caretakerType = await pool.query(SQLQueries.FETCH_CARE_TAKER_ROLE, [
    email,
  ]);
  let totalAmount = 0;
  let amount = {};

  if (caretakerType.rows[0].type === 1) {
    amount = await pool.query(
      SQLQueries.FETCH_CARE_TAKER_FULL_TIMER_MONTHLY_PAYMENT,
      [email, dateFormat],
    );
    totalAmount = amount.rows;
  } else if (caretakerType.rows[0].type === 2) {
    amount = await pool.query(
      SQLQueries.FETCH_CARE_TAKER_PART_TIMER_MONTHLY_PAYMENT,
      [email, dateFormat],
    );
    totalAmount = amount.rows;
  }
  return totalAmount;
};

const FetchExpectedSalary = async ({email}) => {
  const now = new Date();
  const numOfDaysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  const paddedMonth = `000${now.getMonth().toString()}`;
  const newMonth = paddedMonth.substr(paddedMonth.length - 2);
  const dateFormat = `${now.getFullYear().toString()}-${newMonth}-%`;
  const caretakerType = await pool.query(SQLQueries.FETCH_CARE_TAKER_ROLE, [
    email,
  ]);

  let expAmount = 0;

  if (caretakerType.rows[0].type === 1) {
    const currAmount = await pool.query(
      SQLQueries.FETCH_CARE_TAKER_MONTHLY_RAW_PAYMENT,
      [email, dateFormat],
    );
    const currPetDays = await pool.query(SQLQueries.FETCH_CARE_TAKER_PET_DAYS, [
      email,
      dateFormat,
    ]);
    const expRawAmount =
      (currAmount.rows[0].sum / now.getDate()) * numOfDaysInMonth;
    const expRawPetDays =
      (currPetDays.rows[0].sum / now.getDate()) * numOfDaysInMonth;
    if (expRawPetDays <= 60) {
      expAmount = 3000;
    } else {
      expAmount =
        3000 + 0.8 * expRawAmount * ((expRawPetDays - 60) / expRawPetDays);
    }
  } else if (caretakerType.rows[0].type === 2) {
    const currAmount = await pool.query(
      SQLQueries.FETCH_CARE_TAKER_PART_TIMER_MONTHLY_PAYMENT,
      [email, dateFormat],
    );
    expAmount = (currAmount.rows[0].sum / now.getDate()) * numOfDaysInMonth;
  }
  return expAmount;
};

const FetchTotalCareTakerSalary = async ({month, year}) => {
  const paddedMonth = `000${month.toString()}`;
  const newMonth = paddedMonth.substr(paddedMonth.length - 2);
  const dateFormat = `${year.toString()}-${newMonth}-%`;
  const totalAmount = await pool.query(
    SQLQueries.FETCH_TOTAL_CARE_TAKERS_SALARY,
    [dateFormat],
  );
  return totalAmount.rows;
};

const FetchMonthlyTotalPet = async ({month, year}) => {
  const paddedMonth = `000${month.toString()}`;
  const newMonth = paddedMonth.substr(paddedMonth.length - 2);
  const dateFormat = `${year.toString()}-${newMonth}-%`;
  const totalPets = await pool.query(
    SQLQueries.FETCH_MONTHLY_TOTAL_NUMBER_OF_UNIQUE_PET,
    [dateFormat],
  );
  return totalPets.rows;
};

const FetchMonthlyTotalPetDays = async ({email, month, year}) => {
  const paddedMonth = `000${month.toString()}`;
  const newMonth = paddedMonth.substr(paddedMonth.length - 2);
  const dateFormat = `${year.toString()}-${newMonth}-%`;
  const totalPetDays = await pool.query(SQLQueries.FETCH_CARE_TAKER_PET_DAYS, [
    email,
    dateFormat,
  ]);
  return totalPetDays.rows;
};

const FetchMonthWithHighestJobs = async () => {
  const month = await pool.query(SQLQueries.FETCH_MONTH_WITH_HIGHEST_JOBS);
  return month.rows;
};

const FetchCareTakerReviews = async ({careTakerEmail}) => {
  const {rows} = await pool.query(SQLQueries.FETCH_CARE_TAKER_REVIEWS, [
    careTakerEmail,
  ]);
  return rows;
};

export default {
  PetCategoryCreate,
  PetCategoryFetch,
  PetCategoryDelete,
  PetCreate,
  PetDelete,
  PetUpdate,
  PetCategoryUpdate,
  PetFetch,
  FetchAllCareTakers,
  FetchCareTaker,
  FetchPetOwner,
  FetchCareTakerSalary,
  FetchTotalCareTakerSalary,
  FetchMonthlyTotalPet,
  FetchMonthWithHighestJobs,
  FetchMonthlyTotalPetDays,
  FetchExpectedSalary,
  FetchCareTakerReviews,
};
