import _ from 'lodash';
import pool from '../../src/Utils/DBUtils';
import SQLQueries from '../../src/Utils/SQLUtils';

const SeedPetCateogry = async ({category, basePrice}) => {
  await pool.query(SQLQueries.CREATE_PET_CATEGORY, [category, basePrice]);
  return {category, basePrice};
};

const SeedPetCategories = async (i) => {
  return Promise.all(
    _.times(i, (idx) =>
      SeedPetCateogry({category: `category${idx}`, basePrice: idx}),
    ),
  );
};

const SeedPet = async ({name, email, category}) => {
  await pool.query(SQLQueries.CREATE_PET, [name, category, email, null, null]);
  return {name, email, category};
};

const SeedPets = async (i, email, category) => {
  return Promise.all(
    _.times(i, (idx) => SeedPet({name: `pet${idx}`, email, category})),
  );
};

export default {
  SeedPetCategories,
  SeedPets,
};
