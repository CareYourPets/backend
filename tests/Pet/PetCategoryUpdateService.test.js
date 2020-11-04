import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import PetFixtures from '../Fixtures/PetFixtures';
import UserFixtures from '../Fixtures/UserFixtures';

describe('Test PetUpdateService', () => {
  beforeEach('PetUpdateService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
    await UserFixtures.SeedPetOwners(1);
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(2, email, category);
  });

  afterEach('PetUpdateService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('Service should update pet category in pets', async () => {
    const currentCategory = 'category0';
    const category = 'category1';
    const basePrice = 1.0;
    const email = 'test0@example.com';

    await PetService.PetCategoryUpdate({
      currentCategory,
      category,
      basePrice,
    });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      [
        {
          name: 'pet0',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: false,
        },
        {
          name: 'pet1',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: false,
        },
      ],
      pets,
    );
  });
});
