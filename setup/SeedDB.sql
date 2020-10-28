INSERT INTO psc_administrators (
	email,
	password,
	name,
	gender,
  contact,
  location,
  is_deleted
) VALUES (
  'nwjbrandon@gmail.com', 
  '$2b$10$/IJdSgnkHJ4kOgEPxiLEuebNDJ4Jtig.KVG7OtvVd8l1qKANnneu2', 
  'Brandon Ng',
  'MALE',
  '(+65)93221923',
  '32-B Haw Par Village',
  false
);

INSERT INTO pet_owners (
  email,
	password,
	name,
	gender,
  contact,
  area,
  location,
  bio,
  is_deleted
) VALUES (
  'pet-owner-01@gmail.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Michael Scott',
  'MALE',
  '(+65)98765432',
  'NORTH-EAST',
  'Hougang Ave 9, Blk 1, #02-1322, Singapore 123001',
  'I am a little kid lover.',
  false
);

INSERT INTO care_takers (
  email,
	password,
	name,
	gender,
  contact,
  area,
  location,
  bio,
  is_deleted
) VALUES (
  'care-taker-01@gmail.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Dwight Schrute',
  'MALE',
  '(+65)98123456',
  'NORTH-EAST',
  'Hougang Ave 2, Blk 10, #05-14, Singapore 145010',
  'Beets.',
  false
);

INSERT INTO pet_categories (
  category,
  base_price
) VALUES (
  'bulldog',
  55.50
), (
  'snail',
  10.90
), (
  'rabbit',
  28.00
);

INSERT INTO pets (
  name,
  category,
  email,
  needs,
  diet,
  is_deleted
) VALUES (
  'jackie',
  'bulldog',
  'pet-owner-01@gmail.com',
  NULL,
  'vegan',
  false
), (
  'tommy',
  'rabbit',
  'pet-owner-01@gmail.com',
  'He is blind.',
  'cannibal',
  false
);
