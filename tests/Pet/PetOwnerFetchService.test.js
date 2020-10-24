import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import PetFixtures from '../Fixtures/PetFixtures';
import UserFixtures from '../Fixtures/UserFixtures';

describe('Test PetOwnerFetchService', () => {
  beforeEach('PetOwnerFetchService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pet_categories');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCategoryFetchService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should fetch all pet owners with zero pets', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email} = users[0];
    const results = await PetService.FetchPetOwner({email});

    Assert.deepStrictEqual(
      [
        [
          {
            email,
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [],
      ],
      results,
    );
  });

  it('Service should fetch all pet owners with two pets', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email} = users[0];
    await PetFixtures.SeedPets(2, email, 'category1');
    const results = await PetService.FetchPetOwner({email});

    Assert.deepStrictEqual(
      [
        [
          {
            email,
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
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
      ],
      results,
    );
  });
});
