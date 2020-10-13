import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';

describe('Test PetCategoryCreateService', () => {
  beforeEach('PetCategoryCreateService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  afterEach('PetCategoryCreateService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('Service should create pet category', async () => {
    const category = 'test';
    const basePrice = '1.1';

    await PetService.PetCategoryCreate({
      category,
      basePrice,
    });

    const {rows: petCategories} = await pool.query(
      `SELECT * FROM pet_categories WHERE category='${category}'`,
    );
    Assert.deepStrictEqual(
      {category, base_price: basePrice, is_deleted: false},
      petCategories[0],
    );
  });

  it('Service should reject duplicate pet category', async () => {
    const category = 'test';
    const basePrice = '1.1';

    await PetService.PetCategoryCreate({
      category,
      basePrice,
    });

    await Assert.rejects(
      () =>
        PetService.PetCategoryCreate({
          category,
          basePrice,
        }),
      Error,
    );
  });
});
