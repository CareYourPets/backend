import Assert from 'assert';
import _ from 'lodash';
import Chai from 'chai';
import ChaiHttp from 'chai-http';
import pool from '../../src/Utils/DBUtils';
import {DecodeAccessToken} from '../../src/Utils/AuthUtils';
import App from '../../src/App';
import RoleUtils from '../../src/Utils/RoleUtils';

Chai.use(ChaiHttp);

describe('Test UserCreate Controller', () => {
  beforeEach('UserCreateController beforeEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  afterEach('UserCreateController afterEach', async () => {
    await pool.query('DELETE FROM care_takers');
    await pool.query('DELETE FROM pet_owners');
    await pool.query('DELETE FROM psc_administrators');
  });

  it('API should return access token for pet owner', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.PET_OWNER;
    const res = await Chai.request(App).post('/user/create').send({
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
      _.omit(decodedToken, ['uid', 'iat']),
    );
  });

  it('API should return access token for care taker', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.CARE_TAKER;
    const res = await Chai.request(App).post('/user/create').send({
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
      _.omit(decodedToken, ['uid', 'iat']),
    );
  });

  it('API should return 422 for invalid role', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;
    const res = await Chai.request(App).post('/user/create').send({
      email,
      password,
      role,
    });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing role', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const res = await Chai.request(App).post('/user/create').send({
      email,
      password,
    });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing email', async () => {
    const password = 'password';
    const role = RoleUtils.ADMINISTRATOR;
    const res = await Chai.request(App).post('/user/create').send({
      password,
      role,
    });
    Assert.deepStrictEqual(422, res.status);
  });

  it('API should return 422 for missing password', async () => {
    const email = 'test@example.com';
    const role = RoleUtils.ADMINISTRATOR;
    const res = await Chai.request(App).post('/user/create').send({
      email,
      role,
    });
    Assert.deepStrictEqual(422, res.status);
  });
});
