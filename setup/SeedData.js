const bcrypt = require('bcrypt');
const randomName = require('node-random-name');
const randomSentence = require('random-sentence');
const randomEmail = require('random-email');
const randomMobile = require('random-mobile');
const _ = require('lodash');
const {Pool} = require('pg');

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:password@localhost/dev',
});

const salt = 10;

const GENDERS = ['MALE', 'FEMALE'];

const AREAS = [
  'NORTH',
  'SOUTH',
  'WEST',
  'EAST',
  'CENTRAL',
  'NORTH-EAST',
  'NORTH-WEST',
  'SOUTH-EAST',
  'SOUTH-WEST',
];

const SQL = {
  insertPetOwner:
    'INSERT INTO pet_owners (email, password, name, gender, contact, area, location, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
  insertCareTaker:
    'INSERT INTO care_takers (email, password, name, gender, contact, area, location, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
  insertAdministrator:
    'INSERT INTO psc_administrators (email, password, name, gender, contact, area, location) VALUES ($1, $2, $3, $4, $5, $6, $7)',
  insertPetCategory:
    'INSERT INTO pet_categories (category, base_price) VALUES ($1, $2)',
  insertPet:
    'INSERT INTO pets(name, category, email, needs, diet) VALUES ($1, $2, $3, $4, $5)',
  insertCareTakerSkill:
    'INSERT INTO care_taker_skills(email, category, price) VALUES ($1, $2, $3)',
  insertCareTakerFullTime:
    'INSERT INTO care_taker_full_timers(email) VALUES ($1)',
  insertCareTakerPartTime:
    'INSERT INTO care_taker_part_timers(email) VALUES ($1)',
  fetchPetOwners: 'SELECT email FROM pet_owners',
  fetchCareTakers: 'SELECT email FROM care_takers',
  fetchPetCategories: 'SELECT category, base_price FROM pet_categories',
};

const CATEGORIES = [
  'Alpacas',
  'Camels',
  'Cats',
  'Cattle',
  'Dogs',
  'Donkeys',
  'Ferrets',
  'Goats',
  'Hedgehogs',
  'Horses',
  'Llamas',
  'Pigs',
  'Rabbits',
  'Red foxes',
  'Rodents',
  'Sheep',
  'Sugar gliders',
  'Chicken',
  'Companion parrots',
  'Fowl',
  'Columbines',
  'Passerines',
  'Goldfish',
  'Koi',
  'Siamese',
  'Barb',
  'Guppy',
  'Molly',
  'Mosquitofish',
  'Oscar',
  'Arthropods',
  'Bees',
  'Silk moth',
];

const HashPassword = async (password) => {
  return bcrypt.hash(password, salt);
};

const petOwnerPayload = async (client) => {
  const email = randomEmail();
  const password = await HashPassword('password');
  const name = randomName();
  const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
  const contact = randomMobile({formatted: true});
  const area = AREAS[Math.floor(Math.random() * AREAS.length)];
  const location = randomSentence({min: 10, max: 15});
  const bio = randomSentence({min: 100, max: 300});
  await client.query(SQL.insertPetOwner, [
    email,
    password,
    name,
    gender,
    contact,
    area,
    location,
    bio,
  ]);
};
const careTakerPayload = async (client) => {
  const email = randomEmail();
  const password = await HashPassword('password');
  const name = randomName();
  const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
  const contact = randomMobile({formatted: true});
  const area = AREAS[Math.floor(Math.random() * AREAS.length)];
  const location = randomSentence({min: 10, max: 15});
  const bio = randomSentence({min: 100, max: 300});
  await client.query(SQL.insertCareTaker, [
    email,
    password,
    name,
    gender,
    contact,
    area,
    location,
    bio,
  ]);
};

const administratorPayload = async (client) => {
  const email = randomEmail();
  const password = await HashPassword('password');
  const name = randomName();
  const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
  const contact = randomMobile({formatted: true});
  const area = AREAS[Math.floor(Math.random() * AREAS.length)];
  const location = randomSentence({min: 10, max: 15});
  await client.query(SQL.insertAdministrator, [
    email,
    password,
    name,
    gender,
    contact,
    area,
    location,
  ]);
};

const categoryPayload = async (client, category) => {
  const basePrice = (Math.random() * (0.12 - 0.02) + 0.02).toFixed(4) * 100;
  await client.query(SQL.insertPetCategory, [category, basePrice]);
};

const petPayload = async (client, email) => {
  const categories = _.sampleSize(CATEGORIES, 2);

  const name1 = randomName();
  const needs1 = randomSentence({min: 5, max: 15});
  const diet1 = randomSentence({min: 5, max: 15});
  await client.query(SQL.insertPet, [
    name1,
    categories[0],
    email,
    needs1,
    diet1,
  ]);

  const name2 = randomName();
  const needs2 = randomSentence({min: 5, max: 15});
  const diet2 = randomSentence({min: 5, max: 15});
  await client.query(SQL.insertPet, [
    name2,
    categories[1],
    email,
    needs2,
    diet2,
  ]);
};

const careTakerSkillPayload = async (client, email, petCategories) => {
  const categories = _.sampleSize(petCategories, 2);
  await client.query(SQL.insertCareTakerSkill, [
    email,
    categories[0].category,
    categories[0].base_price,
  ]);
  await client.query(SQL.insertCareTakerSkill, [
    email,
    categories[1].category,
    categories[1].base_price,
  ]);
};

const careTakerEmploymentTypePayload = async (client, email, i) => {
  if (i % 2 === 0) {
    await client.query(SQL.insertCareTakerFullTime, [email]);
  } else {
    await client.query(SQL.insertCareTakerPartTime, [email]);
  }
};

const main = async () => {
  const noOfCareTakers = 1000;
  const noOfPetOwners = 1000;
  const noOfAdministrators = 10;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await Promise.all(
      _.times(noOfPetOwners, async () => {
        await petOwnerPayload(client);
      }),
    );
    await Promise.all(
      _.times(noOfCareTakers, async () => {
        await careTakerPayload(client);
      }),
    );
    await Promise.all(
      _.times(noOfAdministrators, async () => {
        await administratorPayload(client);
      }),
    );
    await Promise.all(
      _.map(CATEGORIES, async (category, _) => {
        if (category === undefined) return;
        await categoryPayload(client, category);
      }),
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  const {rows: petOwners} = await pool.query(SQL.fetchPetOwners);
  const client2 = await pool.connect();
  try {
    await client2.query('BEGIN');
    await Promise.all(
      _.map(petOwners, async ({email}) => {
        await petPayload(client, email);
      }),
    );
    await client2.query('COMMIT');
  } catch (e) {
    await client2.query('ROLLBACK');
    throw e;
  } finally {
    client2.release();
  }

  const {rows: careTakers} = await pool.query(SQL.fetchCareTakers);
  const {rows: petCategories} = await pool.query(SQL.fetchPetCategories);
  const client3 = await pool.connect();
  try {
    await client3.query('BEGIN');
    await Promise.all(
      _.map(careTakers, async ({email}) => {
        await careTakerSkillPayload(client, email, petCategories);
      }),
    );
    await Promise.all(
      _.map(careTakers, async ({email}, i) => {
        await careTakerEmploymentTypePayload(client, email, i);
      }),
    );
    await client3.query('COMMIT');
  } catch (e) {
    await client3.query('ROLLBACK');
    throw e;
  } finally {
    client3.release();
  }
};

(async () => {
  await main();
})();
