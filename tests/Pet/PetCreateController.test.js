import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetCreateController', () => {
  beforeEach('PetCreateController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCreateController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('API should create pet', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];

    const category = 'category0';
    const needs = 'test';
    const diet = 'test';
    const name = 'pet0';
    await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        category,
        needs,
        diet,
        name,
      });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      [{name, email, category, needs, diet, is_deleted: false}],
      pets,
    );
  });

  it('API should return 403 for duplicate pets', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];

    const category = 'category0';
    const needs = 'test';
    const diet = 'test';
    const name = 'pet0';
    await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        category,
        needs,
        diet,
        name,
      });
    const res = await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        category,
        needs,
        diet,
        name,
      });

    Assert.deepStrictEqual(403, res.status);
  });

  it('API should return 403 for wrong pet category', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];

    const category = 'category2';
    const needs = 'test';
    const diet = 'test';
    const name = 'pet0';

    const res = await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        category,
        needs,
        diet,
        name,
      });

    Assert.deepStrictEqual(403, res.status);
  });

  it('API should return 401 for missing access token', async () => {
    const category = 'category0';
    const needs = 'test';
    const diet = 'test';
    const name = 'pet0';

    const res = await Chai.request(App).post('/pet/create').send({
      category,
      needs,
      diet,
      name,
    });

    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 for missing category', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];

    const needs = 'test';
    const diet = 'test';
    const name = 'pet0';

    const res = await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        needs,
        diet,
        name,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing needs', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];

    const category = 'category2';
    const diet = 'test';
    const name = 'pet0';

    const res = await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        category,
        diet,
        name,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing diet', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];

    const category = 'category2';
    const needs = 'test';
    const name = 'pet0';

    const res = await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        category,
        needs,
        name,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing name', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];

    const category = 'category2';
    const needs = 'test';
    const diet = 'test';

    const res = await Chai.request(App)
      .post('/pet/create')
      .set('accessToken', accessToken)
      .send({
        category,
        needs,
        diet,
      });

    Assert.deepStrictEqual(422, res.status);
  });
});
