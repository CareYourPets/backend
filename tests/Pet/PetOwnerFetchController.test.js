import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import App from '../../src/App';
import UserFixtures from '../Fixtures/UserFixtures';
import PetFixtures from '../Fixtures/PetFixtures';

Chai.use(ChaiHttp);

describe('Test PetOwnerFetch Controller', () => {
  beforeEach('PetOwnerFetchController beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetOwnerFetchController afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('API should fetch pet owners', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];
    const {email} = users[0];

    const res = await Chai.request(App)
      .post('/pet/petowner/fetch')
      .set('accessToken', accessToken)
      .send({
        email,
      });

    Assert.deepStrictEqual(
      [
        [
          {
            email,
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [],
      ],
      res.body,
    );
  });

  it('API should fetch pet owners with pets', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {accessToken} = users[0];
    const {email} = users[0];
    await PetFixtures.SeedPets(1, email, 'category1');

    const res = await Chai.request(App)
      .post('/pet/petowner/fetch')
      .set('accessToken', accessToken)
      .send({
        email,
      });

    Assert.deepStrictEqual(
      [
        [
          {
            email,
            name: null,
            area: null,
            location: null,
            gender: null,
            contact: null,
            bio: null,
          },
        ],
        [
          {
            name: 'pet0',
            category: 'category1',
            email,
            needs: null,
            diet: null,
            is_deleted: false,
          },
        ],
      ],
      res.body,
    );
  });
});
