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

export default {
  PetCategoryCreate,
  PetCategoryFetch,
  PetCategoryDelete,
  PetCreate,
  PetDelete,
  PetUpdate,
  PetCategoryUpdate,
};
