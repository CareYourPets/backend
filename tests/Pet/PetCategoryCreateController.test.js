import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';

Chai.use(ChaiHttp);

describe('Test PetCategoryCreateController', () => {
  beforeEach('PetCategoryCreateController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('PetCategoryCreateController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should create pet category', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const category = 'test';
    const basePrice = 1.1;

    await Chai.request(App)
      .post('/pet/category/create')
      .set('accessToken', accessToken)
      .send({
        category,
        basePrice,
      });
    const {rows: petCategories} = await pool.query(
      `SELECT * FROM pet_categories WHERE category='${category}'`,
    );
    Assert.deepStrictEqual(
      {category, base_price: '1.1', is_deleted: false},
      petCategories[0],
    );
  });

  it('API should return 401 on missing access token', async () => {
    const category = 'test';
    const basePrice = 1.1;

    const res = await Chai.request(App).post('/pet/category/create').send({
      category,
      basePrice,
    });
    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing category', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const basePrice = 1.1;

    const res = await Chai.request(App)
      .post('/pet/category/create')
      .set('accessToken', accessToken)
      .send({
        basePrice,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing basePrice', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const category = 'test';

    const res = await Chai.request(App)
      .post('/pet/category/create')
      .set('accessToken', accessToken)
      .send({
        category,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 403 on duplicate category', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const category = 'test';
    const basePrice = '1.1';

    await Chai.request(App)
      .post('/pet/category/create')
      .set('accessToken', accessToken)
      .send({
        category,
        basePrice,
      });

    const res = await Chai.request(App)
      .post('/pet/category/create')
      .set('accessToken', accessToken)
      .send({
        category,
        basePrice,
      });
    Assert.deepStrictEqual(403, res.status);
  });
});
