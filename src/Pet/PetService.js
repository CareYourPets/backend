import moment from 'moment';
import pool from '../Utils/DBUtils';
import SQLQueries from '../Utils/SQLUtils';

const PetCreate = async ({user, category, specialNeeds, diet, name}) => {
  // Create timestamp and uid for pet
  const timestamp = moment(Date.now()).format();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Find UID of pet_owner
    const {uid} = user;

    await client.query(SQLQueries.CREATE_PET, [
      name,
      category,
      uid,
      specialNeeds,
      diet,
      false,
      timestamp,
      timestamp,
    ]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return {status: 'ok'};
};

const PetOwnerCreate = async (user) => {
  const timestamp = moment(Date.now()).format();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Find UID of user
    const {uid} = user;

    await client.query(SQLQueries.CREATE_PET_OWNER_PROFILE, [
      uid,
      false,
      timestamp,
      timestamp,
    ]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return {status: 'ok'};
};

const PetCategoryCreate = async ({category, basePrice}) => {
  const timestamp = moment(Date.now()).format();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(SQLQueries.CREATE_PET_CATEGORY, [
      category,
      basePrice,
      timestamp,
      timestamp,
    ]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return {status: 'ok'};
};

const SelectAllCategories = async () => {
  const client = await pool.connect();
  const {rows} = await pool.query(SQLQueries.SELECT_ALL_PET_CATEGORIES);
  client.release();
  return rows;
};

const SelectAllPets = async (user) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Find UID of user
    const {uid} = user;
    // console.log(uid);
    const {results} = await pool.query(SQLQueries.SELECT_OWNER_PETS, [uid]);
    // const {results} = await pool.query("SELECT pet.name, pet.special_needs, pet.diet, pet.category, pet_category.base_price FROM pet INNER JOIN pet_category ON pet_category.category = pet.category WHERE pet.pet_owner_id ='e584bdfc-8253-42de-bfb3-2c658533a881' AND pet.is_deleted = false;");
    // console.log(results);
    await client.query('COMMIT');
    return {results};
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default {
  PetCreate,
  PetOwnerCreate,
  PetCategoryCreate,
  SelectAllPets,
  SelectAllCategories,
};
