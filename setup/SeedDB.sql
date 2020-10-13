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
  location,
  bio,
  is_deleted
) VALUES (
  'pet-owner-01@gmail.com',
  '$2b$10$OAOoB9h1ZVnakibXe9PFV.E.i1o3nF4j9STVugRvPdIFKWZWimr3.',
  'Michael Scott',
  'MALE',
  '(+65)98765432',
  'Pulau Tekong',
  'I am a little kid lover.',
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
