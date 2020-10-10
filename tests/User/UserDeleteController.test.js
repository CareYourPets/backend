import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserDelete Controller', () => {
  beforeEach('UserDeleteController beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('UserDeleteController afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('Should delete pet owner', async () => {
    const users = await UserFixtures.SeedPetOwners(1);
    const {email, accessToken} = users[0];

    await Chai.request(App)
      .post('/user/delete')
      .set('accessToken', accessToken);

    const {rows} = await pool.query(
      `SELECT * FROM pet_owners WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(true, rows[0].is_deleted);
  });

  it('Should delete care taker', async () => {
    const users = await UserFixtures.SeedCareTakers(1);
    const {email, accessToken} = users[0];

    await Chai.request(App)
      .post('/user/delete')
      .set('accessToken', accessToken);

    const {rows} = await pool.query(
      `SELECT * FROM care_takers WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(true, rows[0].is_deleted);
  });

  it('Should delete administrator', async () => {
    const users = await UserFixtures.SeedAdministrators(1);
    const {email, accessToken} = users[0];

    await Chai.request(App)
      .post('/user/delete')
      .set('accessToken', accessToken);

    const {rows} = await pool.query(
      `SELECT * FROM psc_administrators WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(true, rows[0].is_deleted);
  });

  it('Should return 401 for missing accesstoken', async () => {
    const res = await Chai.request(App).post('/user/delete');

    Assert.deepStrictEqual(401, res.status);
  });
});
