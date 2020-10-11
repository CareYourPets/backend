import _ from 'lodash';
import Assert from 'assert';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import App from '../../src/App';
import GenderUtils from '../../src/Utils/GenderUtils';

Chai.use(ChaiHttp);

describe('Test UserCareTakerUpdate Controller', () => {
  beforeEach('UserCareTakerUpdate beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
  });

  afterEach('UserCareTakerUpdate afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
  });

  it('Should update pet owner', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {email, accessToken} = users[0];
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const location = 'test';
    const bio = 'test';

    await Chai.request(App)
      .post('/user/update/caretaker')
      .set('accessToken', accessToken)
      .send({
        name,
        gender,
        contact,
        location,
        bio,
      });

    const {rows} = await pool.query(
      `SELECT * FROM care_takers WHERE email='${email}'`,
    );

    Assert.deepStrictEqual(
      {
        email,
        name,
        gender,
        contact,
        location,
        bio,
        is_deleted: false,
      },
      _.omit(rows[0], ['password']),
    );
  });

  it('Should return 422 for missing name', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const location = 'test';
    const bio = 'test';

    const res = await Chai.request(App)
      .post('/user/update/caretaker')
      .set('accessToken', accessToken)
      .send({
        gender,
        contact,
        location,
        bio,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('Should return 422 for missing gender', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const name = 'test';
    const contact = 'test';
    const location = 'test';
    const bio = 'test';

    const res = await Chai.request(App)
      .post('/user/update/caretaker')
      .set('accessToken', accessToken)
      .send({
        name,
        contact,
        location,
        bio,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('Should return 422 for missing contact', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const name = 'test';
    const gender = GenderUtils.MALE;
    const location = 'test';
    const bio = 'test';

    const res = await Chai.request(App)
      .post('/user/update/caretaker')
      .set('accessToken', accessToken)
      .send({
        name,
        gender,
        location,
        bio,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('Should return 422 for missing location', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const bio = 'test';

    const res = await Chai.request(App)
      .post('/user/update/caretaker')
      .set('accessToken', accessToken)
      .send({
        name,
        gender,
        contact,
        bio,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('Should return 422 for missing bio', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const location = 'test';

    const res = await Chai.request(App)
      .post('/user/update/caretaker')
      .set('accessToken', accessToken)
      .send({
        name,
        gender,
        contact,
        location,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('Should return 422 for invalid gender', async () => {
    const users = await UserFixtures.SeedCareTakers(2);
    const {accessToken} = users[0];
    const name = 'test';
    const gender = 'test';
    const contact = 'test';
    const location = 'test';
    const bio = 'test';

    const res = await Chai.request(App)
      .post('/user/update/caretaker')
      .set('accessToken', accessToken)
      .send({
        name,
        gender,
        contact,
        location,
        bio,
      });

    Assert.deepStrictEqual(422, res.status);
  });

  it('Should return 401 for missing accesstoken', async () => {
    const name = 'test';
    const gender = GenderUtils.MALE;
    const contact = 'test';
    const location = 'test';
    const bio = 'test';

    const res = await Chai.request(App).post('/user/update/caretaker').send({
      name,
      gender,
      contact,
      location,
      bio,
    });

    Assert.deepStrictEqual(401, res.status);
  });
});
