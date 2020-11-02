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
  petOwner:
    'INSERT INTO pet_owners (email, password, name, gender, contact, area, location, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
  careTaker:
    'INSERT INTO care_takers (email, password, name, gender, contact, area, location, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
  administrator:
    'INSERT INTO psc_administrators (email, password, name, gender, contact, area, location) VALUES ($1, $2, $3, $4, $5, $6, $7)',
  petCategory:
    'INSERT INTO pet_categories (category, base_price) VALUES ($1, $2)',
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
  client.query(SQL.petOwner, [
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
  client.query(SQL.careTaker, [
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
  client.query(SQL.administrator, [
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
  client.query(SQL.petCategory, [category, basePrice]);
};

const main = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await Promise.all(
      _.times(1000, async () => {
        await petOwnerPayload(client);
        
      }),
    );
    await Promise.all(
      _.times(1000, async () => {
        await careTakerPayload(client);
        
      }),
    );
    await Promise.all(
      _.times(10, async () => {
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
};

(async () => {
  await main();
})();
