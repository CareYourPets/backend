INSERT INTO psc_administrators (
	email,
	password,
	name,
	gender,
  contact,
  location
) VALUES (
  'nwjbrandon@gmail.com', 
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Brandon Ng',
  'MALE',
  '(+65)93221923',
  '32-B Haw Par Village'
);

INSERT INTO psc_administrators (
	email,
	password,
	name,
	gender,
  contact,
  location
) VALUES (
  'ambhinav@yahoo.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Brandon Ng',
  'MALE',
  '(+65)93221923',
  '32-B Haw Par Village'
);

INSERT INTO psc_administrators (
	email,
	password,
	name,
	gender,
  contact,
  location
) VALUES (
  'amir97azhar@gmail.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Amir Azhar',
  'MALE',
  '(+65)93221923',
  '32-B Haw Par Village'
);

INSERT INTO psc_administrators (
	email,
	password,
	name,
	gender,
  contact,
  location
) VALUES (
  'arunkumarr97@gmail.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Arun Kumar',
  'MALE',
  '(+65)93221923',
  '32-B Haw Par Village'
);

INSERT INTO psc_administrators (
	email,
	password,
	name,
	gender,
  contact,
  location
) VALUES (
  'dragontho@gmail.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Paul Tho',
  'MALE',
  '(+65)93221923',
  '32-B Haw Par Village'
);

INSERT INTO pet_owners (
  email,
	password,
	name,
	gender,
  contact,
  area,
  location,
  bio
) VALUES (
  'petowner@example.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Pet Owner',
  'MALE',
  '(+65)98765432',
  'NORTH-EAST',
  'Hougang Ave 9, Blk 1, #02-1322, Singapore 123001',
  'I am a pet owner.'
);

INSERT INTO care_takers (
  email,
	password,
	name,
	gender,
  contact,
  area,
  location,
  bio
) VALUES (
  'caretaker@example.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Care Taker',
  'MALE',
  '(+65)98123456',
  'NORTH-EAST',
  'Hougang Ave 2, Blk 10, #05-14, Singapore 145010',
  'I am a care taker.'
);

INSERT INTO care_takers (
  email,
	password,
	name,
	gender,
  contact,
  area,
  location,
  bio
) VALUES (
  'caretaker2@example.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Care Taker 2',
  'MALE',
  '(+65)98123456',
  'NORTH-EAST',
  'Hougang Ave 2, Blk 10, #05-14, Singapore 145010',
  'I am a care taker 2.'
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
  diet
) VALUES (
  'jackie',
  'bulldog',
  'petowner@example.com',
  NULL,
  'vegan'
), (
  'tommy',
  'rabbit',
  'petowner@example.com',
  'He is blind.',
  'cannibal'
);
