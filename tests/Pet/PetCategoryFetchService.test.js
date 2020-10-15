import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import PetFixtures from '../Fixtures/PetFixtures';

describe('Test PetCategoryFetchService', () => {
  beforeEach('PetCategoryFetchService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCategoryFetchService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should fetch all pet categories', async () => {
    const category = null;
    const results = await PetService.PetCategoryFetch({category});

    Assert.deepStrictEqual(
      [
        {
          category: 'category0',
          base_price: '0',
          is_deleted: false,
        },
        {
          category: 'category1',
          base_price: '1',
          is_deleted: false,
        },
      ],
      results,
    );
  });

  it('Service should fetch a pet category', async () => {
    const category = 'category1';
    const results = await PetService.PetCategoryFetch({category});

    Assert.deepStrictEqual(
      [
        {
          category: 'category1',
          base_price: '1',
          is_deleted: false,
        },
      ],
      results,
    );
  });
});
