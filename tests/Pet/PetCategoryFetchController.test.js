import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetCategoryFetchController', () => {
  beforeEach('PetCategoryFetchController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCategoryFetchController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should fetch pet categories', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const category = null;

    const res = await Chai.request(App)
      .post('/pet/category/fetch')
      .set('accessToken', accessToken)
      .send({
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
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const category = 'category0';

    const res = await Chai.request(App)
      .post('/pet/category/fetch')
      .set('accessToken', accessToken)
      .send({
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

  it('API should return 401 on missing access token', async () => {
    const category = null;

    const res = await Chai.request(App).post('/pet/category/fetch').send({
      category,
    });

    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing category', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const res = await Chai.request(App)
      .post('/pet/category/fetch')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual(422, res.status);
  });
});
