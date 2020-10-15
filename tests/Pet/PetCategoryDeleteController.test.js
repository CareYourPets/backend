import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetCategoryDeleteController', () => {
  beforeEach('PetCategoryDeleteController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCategoryDeleteController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should delete pet category', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const category = 'category0';

    await Chai.request(App)
      .post('/pet/category/delete')
      .set('accessToken', accessToken)
      .send({
        category,
      });

    const {rows: petCategories} = await pool.query(
      `SELECT * FROM pet_categories WHERE category='${category}'`,
    );
    Assert.deepStrictEqual(
      [{category, base_price: '0', is_deleted: true}],
      petCategories,
    );
  });

  it('API should return 401 on missing access token', async () => {
    const category = 'category0';

    const res = await Chai.request(App).post('/pet/category/delete').send({
      category,
    });

    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing category', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {accessToken} = users[0];

    const res = await Chai.request(App)
      .post('/pet/category/delete')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual(422, res.status);
  });
});
