import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

describe('Test PetFetchAllService', () => {
  beforeEach('PetFetchAllService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetFetchAllService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('Service should fetch all pets of pet owner', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email} = users[0];
    await PetFixtures.SeedPets(2, email, 'category1');
    const results = await PetService.PetFetch({email});

    Assert.deepStrictEqual(
      [
        {
          name: 'pet0',
          category: 'category1',
          email,
          needs: null,
          diet: null,
          is_deleted: false,
        },
        {
          name: 'pet1',
          category: 'category1',
          email,
          needs: null,
          diet: null,
          is_deleted: false,
        },
      ],
      results,
    );
  });
});
