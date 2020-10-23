import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetCategoryUpdateController', () => {
  beforeEach('PetCategoryFetchController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  afterEach('PetCategoryUpdateController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('API should update pet categories', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(2);
    const {category: currentCategory} = categories[0];
    await PetFixtures.SeedPets(2, email, currentCategory);

    const category = 'category3';
    const basePrice = 1.1;
    await Chai.request(App)
      .post('/pet/category/update')
      .set('accessToken', accessToken)
      .send({
        category,
        currentCategory,
        basePrice,
      });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}' ORDER BY name`,
    );
    Assert.deepStrictEqual(
      [
        {
          name: 'pet0',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: false,
        },
        {
          name: 'pet1',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: false,
        },
      ],
      pets,
    );
  });

  it('API should return 401 on missing access token', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email} = users[0];
    const categories = await PetFixtures.SeedPetCategories(2);
    const {category: currentCategory} = categories[0];
    await PetFixtures.SeedPets(2, email, currentCategory);

    const category = 'category3';
    const basePrice = 1.1;
    const res = await Chai.request(App).post('/pet/category/update').send({
      category,
      currentCategory,
      basePrice,
    });

    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing category', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(2);
    const {category: currentCategory} = categories[0];
    await PetFixtures.SeedPets(2, email, currentCategory);

    const basePrice = 1.1;
    const res = await Chai.request(App)
      .post('/pet/category/update')
      .set('accessToken', accessToken)
      .send({
        currentCategory,
        basePrice,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing currentCategory', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(2);
    const {category: currentCategory} = categories[0];
    await PetFixtures.SeedPets(2, email, currentCategory);

    const category = 'category3';
    const basePrice = 1.1;
    const res = await Chai.request(App)
      .post('/pet/category/update')
      .set('accessToken', accessToken)
      .send({
        category,
        basePrice,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing basePrice', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(2);
    const {category: currentCategory} = categories[0];
    await PetFixtures.SeedPets(2, email, currentCategory);

    const category = 'category3';
    const res = await Chai.request(App)
      .post('/pet/category/update')
      .set('accessToken', accessToken)
      .send({
        category,
        currentCategory,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  // it('API should fetch a pet category', async () => {
  //   const users = await UserFixtures.SeedAdministrators(1);
  //   const {accessToken} = users[0];

  //   const category = 'category0';

  //   const res = await Chai.request(App).post('/pet/category/fetch').set('accessToken', accessToken).send({
  //     category
  //   });

  //   Assert.deepStrictEqual(
  //     [
  //       {
  //         category: 'category0',
  //         base_price: '0',
  //         is_deleted: false,
  //       },
  //     ],
  //     res.body,
  //   );
  // });

  // it('API should return 401 on missing access token', async () => {
  //   const category = null;

  //   const res = await Chai.request(App).post('/pet/category/fetch').send({
  //     category
  //   });

  //   Assert.deepStrictEqual(401, res.status)
  // });

  // it('API should return 422 on missing category', async () => {
  //   const users = await UserFixtures.SeedAdministrators(1);
  //   const {accessToken} = users[0];

  //   const res = await Chai.request(App).post('/pet/category/fetch').set('accessToken', accessToken);

  //   Assert.deepStrictEqual(422, res.status)

  // });
});
