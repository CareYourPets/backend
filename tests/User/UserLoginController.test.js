import Assert from 'assert';
import _ from 'lodash';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import UserFixtures from '../Fixtures/UserFixtures';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';
import RoleUtils from '../../src/Utils/RoleUtils';
import App from '../../src/App';

Chai.use(ChaiHttp);

describe('Test UserLogin Controller', () => {
  beforeEach('UserLoginController beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
    await UserFixtures.SeedCareTakers(1);
    await UserFixtures.SeedPetOwners(1);
    await UserFixtures.SeedAdministrators(1);
  });

  afterEach('UserLoginController afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should return care taker access token', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;
    const res = await Chai.request(App).post('/user/login').send({
      email,
      password,
      role,
    });
    const decodedToken = DecodeAccessToken(res.body.accessToken);
    Assert.deepStrictEqual(
      {
        email,
        role,
      },
      _.omit(decodedToken, ['iat']),
    );
  });

  it('API should return pet owner access token', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;
    const res = await Chai.request(App).post('/user/login').send({
      email,
      password,
      role,
    });
    const decodedToken = DecodeAccessToken(res.body.accessToken);
    Assert.deepStrictEqual(
      {
        email,
        role,
      },
      _.omit(decodedToken, ['iat']),
    );
  });

  it('API should return administrator access token', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;
    await pool.query(
      `UPDATE psc_administrators SET is_approved=true WHERE email='${email}';`,
    );

    const res = await Chai.request(App).post('/user/login').send({
      email,
      password,
      role,
    });
    const decodedToken = DecodeAccessToken(res.body.accessToken);
    Assert.deepStrictEqual(
      {
        email,
        role,
      },
      _.omit(decodedToken, ['iat']),
    );
  });

  it('API should reject unapproved administrator', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;

    const res = await Chai.request(App).post('/user/login').send({
      email,
      password,
      role,
    });
    Assert.deepStrictEqual(401, res.status);
  });

  it('API should return 422 for missing email', async () => {
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;
    const res = await Chai.request(App).post('/user/login').send({
      password,
      role,
    });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing passowrd', async () => {
    const email = 'test0@example.com';
    const role = RoleUtils.CARE_TAKER;
    const res = await Chai.request(App).post('/user/login').send({
      email,
      role,
    });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing role', async () => {
    const email = 'test0@example.com';
    const password = 'password';
    const res = await Chai.request(App).post('/user/login').send({
      email,
      password,
    });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 401 for invalid password', async () => {
    const email = 'test0@example.com';
    const password = 'wrongpassword';
    const role = RoleUtils.CARE_TAKER;
    const res = await Chai.request(App).post('/user/login').send({
      email,
      password,
      role,
    });
    Assert.deepStrictEqual(401, res.status);
  });
});
