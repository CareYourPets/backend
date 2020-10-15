import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetDeleteController', () => {
  beforeEach('PetDeleteController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  afterEach('PetDeleteController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('API should delete pet', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const name = 'pet0';
    await Chai.request(App)
      .post('/pet/delete')
      .set('accessToken', accessToken)
      .send({
        name,
      });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      [
        {
          name: 'pet1',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: false,
        },
        {
          name: 'pet0',
          email,
          category,
          needs: null,
          diet: null,
          is_deleted: true,
        },
      ],
      pets,
    );
  });

  it('API should return 401 on missing access token pet', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const name = 'pet0';
    const res = await Chai.request(App).post('/pet/delete').send({
      name,
    });
    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 on missing name', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];
    const categories = await PetFixtures.SeedPetCategories(1);
    const {category} = categories[0];
    await PetFixtures.SeedPets(2, email, category);

    const res = await Chai.request(App)
      .post('/pet/delete')
      .set('accessToken', accessToken);

    Assert.deepStrictEqual(422, res.status);
  });
});
