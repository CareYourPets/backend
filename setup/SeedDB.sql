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
  'test@example.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Michael Scott',
  'MALE',
  '(+65)98765432',
  'NORTH-EAST',
  'Hougang Ave 9, Blk 1, #02-1322, Singapore 123001',
  'I am a little kid lover.'
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
  'test@example.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Dwight Schrute',
  'MALE',
  '(+65)98123456',
  'NORTH-EAST',
  'Hougang Ave 2, Blk 10, #05-14, Singapore 145010',
  'Beets.'
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
  'test2@example.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Dwight Schrute',
  'MALE',
  '(+65)98123456',
  'NORTH-EAST',
  'Hougang Ave 2, Blk 10, #05-14, Singapore 145010',
  'Beets.'
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
  'test@example.com',
  NULL,
  'vegan'
), (
  'tommy',
  'rabbit',
  'test@example.com',
  'He is blind.',
  'cannibal'
);
