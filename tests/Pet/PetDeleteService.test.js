import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import PetFixtures from '../Fixtures/PetFixtures';
import UserFixtures from '../Fixtures/UserFixtures';

describe('Test PetDeleteService', () => {
  beforeEach('PetDeleteService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
    await UserFixtures.SeedPetOwners(1);
    await PetFixtures.SeedPetCategories(1);
    const email = 'test0@example.com';
    const category = 'category0';
    await PetFixtures.SeedPets(2, email, category);
  });

  afterEach('PetDeleteService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('Service should delete pet', async () => {
    const name = 'pet0';
    const email = 'test0@example.com';
    const category = 'category0';
    await PetService.PetDelete({
      name,
      email,
    });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      [
        {
          name: 'pet1',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: false,
        },
        {
          name: 'pet0',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: true,
        },
      ],
      pets,
    );
  });
});
