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

  it('Service should update pet', async () => {
    const currentName = 'pet0';
    const email = 'test0@example.com';
    const category = 'category0';
    const diet = 'test';
    const needs = 'test';
    const name = 'pet2';

    await PetService.PetUpdate({
      currentName,
      email,
      category,
      diet,
      needs,
      name,
    });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      [
        {
          name: 'pet1',
          email,
          category: 'category0',
          needs: null,
          diet: null,
          is_deleted: false,
        },
        {
          name: 'pet2',
          email,
          category: 'category0',
          needs: 'test',
          diet: 'test',
          is_deleted: false,
        },
      ],
      pets,
    );
  });
});
