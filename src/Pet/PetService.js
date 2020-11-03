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
  FetchCareTakerReviews,
};
