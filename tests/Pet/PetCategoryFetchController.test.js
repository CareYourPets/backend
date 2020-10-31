import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetCategoryFetchController', () => {
  beforeEach('PetCategoryFetchController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCategoryFetchController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
  });

  it('API should fetch pet categories', async () => {
    const category = null;

    const res = await Chai.request(App).post('/pet/category/fetch').send({
      category,
    });

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
      res.body,
    );
  });

  it('API should fetch a pet category', async () => {
    const category = 'category0';

    const res = await Chai.request(App).post('/pet/category/fetch').send({
      category,
    });

    Assert.deepStrictEqual(
      [
        {
          category: 'category0',
          base_price: '0',
          is_deleted: false,
        },
      ],
      res.body,
    );
  });
});
