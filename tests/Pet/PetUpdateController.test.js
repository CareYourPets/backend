import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetUpdateController', () => {
  beforeEach('PetUpdateController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  afterEach('PetUpdateController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('API should update pet', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const currentName = 'pet0';
    const name = 'pet2';
    const diet = 'test';
    const needs = 'test';
    await Chai.request(App)
      .post('/pet/update')
      .set('accessToken', accessToken)
      .send({
        name,
        currentName,
        diet,
        needs,
        category,
      });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      [
        {
          name: 'pet1',
          email,
          category: 'category0',
          needs: null,
          diet: null,
          is_deleted: false,
        },
        {
          name: 'pet2',
          email,
          category: 'category0',
          needs: 'test',
          diet: 'test',
          is_deleted: false,
        },
      ],
      pets,
    );
  });

  it('API should return 401 on missing access token', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const currentName = 'pet0';
    const name = 'pet2';
    const diet = 'test';
    const needs = 'test';
    const res = await Chai.request(App).post('/pet/update').send({
      name,
      currentName,
      diet,
      needs,
      category,
    });
    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing name', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const currentName = 'pet0';
    const diet = 'test';
    const needs = 'test';
    const res = await Chai.request(App)
      .post('/pet/update')
      .set('accessToken', accessToken)
      .send({
        currentName,
        diet,
        needs,
        category,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing name', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const name = 'pet2';
    const diet = 'test';
    const needs = 'test';
    const res = await Chai.request(App)
      .post('/pet/update')
      .set('accessToken', accessToken)
      .send({
        name,
        diet,
        needs,
        category,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing name', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const currentName = 'pet0';
    const name = 'pet2';
    const needs = 'test';
    const res = await Chai.request(App)
      .post('/pet/update')
      .set('accessToken', accessToken)
      .send({
        name,
        currentName,
        needs,
        category,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing name', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const currentName = 'pet0';
    const name = 'pet2';
    const diet = 'test';
    const res = await Chai.request(App)
      .post('/pet/update')
      .set('accessToken', accessToken)
      .send({
        name,
        currentName,
        diet,
        category,
      });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 on missing name', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const currentName = 'pet0';
    const name = 'pet2';
    const diet = 'test';
    const needs = 'test';
    const res = await Chai.request(App)
      .post('/pet/update')
      .set('accessToken', accessToken)
      .send({
        name,
        currentName,
        diet,
        needs,
      });
    Assert.deepStrictEqual(422, res.status);
  });
});
