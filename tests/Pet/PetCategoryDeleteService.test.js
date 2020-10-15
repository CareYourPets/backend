import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import PetFixtures from '../Fixtures/PetFixtures';

describe('Test PetCategoryDeleteService', () => {
  beforeEach('PetCategoryDeleteService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCategoryDeleteService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should delete all pet category', async () => {
    const category = 'category1';
    await PetService.PetCategoryDelete({category});

    const {rows: petCategories} = await pool.query(
      `SELECT * FROM pet_categories WHERE category='${category}'`,
    );
    Assert.deepStrictEqual(
      [{category, base_price: '1', is_deleted: true}],
      petCategories,
    );
  });
});
