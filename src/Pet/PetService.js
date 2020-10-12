import pool from '../Utils/DBUtils';
import SQLQueries from '../Utils/SQLUtils';

const PetCreate = async (userEmail, category, specialNeeds, diet, name) => {
  await pool.query(SQLQueries.CREATE_PET, [
    name,
    category,
    userEmail,
    specialNeeds,
    diet,
    false,
  ]);

  return {status: 'ok'};
};

const PetCategoryCreate = async (category, basePrice) => {
  await pool.query(SQLQueries.CREATE_PET_CATEGORY, [category, basePrice]);

  return {status: 'ok'};
};

const SelectAllCategories = async () => {
  const client = await pool.connect();
  const {rows} = await pool.query(SQLQueries.SELECT_ALL_PET_CATEGORIES);
  client.release();
  return rows;
};

const SelectAllPets = async ({email}) => {
  const {rows} = await pool.query(SQLQueries.SELECT_OWNER_PETS, [email]);
  return rows;
};

export default {
  PetCreate,
  PetCategoryCreate,
  SelectAllPets,
  SelectAllCategories,
};
