import Assert from 'assert';
import pool from '../../src/Utils/DBUtils';
import PetService from '../../src/Pet/PetService';
import PetFixtures from '../Fixtures/PetFixtures';
import UserFixtures from '../Fixtures/UserFixtures';

describe('Test PetCreateService', () => {
  beforeEach('PetCreateService beforeEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
    await UserFixtures.SeedPetOwners(1);
    await PetFixtures.SeedPetCategories(2);
  });

  afterEach('PetCreateService afterEach', async () => {
    await pool.query('DELETE FROM pets');
    await pool.query('DELETE FROM pet_categories');
    await pool.query('DELETE FROM pet_owners');
  });

  it('Service should create pet', async () => {
    const name = 'pet0';
    const email = 'test0@example.com';
    const category = 'category0';
    const needs = 'test';
    const diet = 'test';

    await PetService.PetCreate({
      name,
      category,
      email,
      needs,
      diet,
    });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      {name, email, category, needs, diet, is_deleted: false},
      pets[0],
    );
  });

  it('Service should create pet', async () => {
    const name1 = 'pet0';
    const name2 = 'pet1';
    const email = 'test0@example.com';
    const category = 'category0';
    const needs = 'test';
    const diet = 'test';

    await PetService.PetCreate({
      name: name1,
      category,
      email,
      needs,
      diet,
    });
    await PetService.PetCreate({
      name: name2,
      category,
      email,
      needs,
      diet,
    });

    const {rows: pets} = await pool.query(
      `SELECT * FROM pets WHERE email='${email}'`,
    );
    Assert.deepStrictEqual(
      [
        {name: name1, email, category, needs, diet, is_deleted: false},
        {name: name2, email, category, needs, diet, is_deleted: false},
      ],
      pets,
    );
  });

  it('Service should reject duplicate pets', async () => {
    const name = 'pet0';
    const email = 'test0@example.com';
    const category = 'category0';
    const needs = 'test';
    const diet = 'test';

    await PetService.PetCreate({
      name,
      category,
      email,
      needs,
      diet,
    });

    await Assert.rejects(
      () =>
        PetService.PetCreate({
          name,
          category,
          email,
          needs,
          diet,
        }),
      Error,
    );
  });

  it('Service should reject if pet category does not exist', async () => {
    const name = 'pet0';
    const email = 'test0@example.com';
    const category = 'category3';
    const needs = 'test';
    const diet = 'test';

    await Assert.rejects(
      () =>
        PetService.PetCreate({
          name,
          category,
          email,
          needs,
          diet,
        }),
      Error,
    );
  });
});
