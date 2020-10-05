INSERT INTO users (
  uid, email, 
  password, 
  is_deleted, 
  first_name, 
  last_name, 
  created_at, 
  updated_at
) VALUES (
  'e584bdfc-8253-42de-bfb3-2c658533a881', 
  'nwjbrandon@gmail.com', 
  '$2b$10$/IJdSgnkHJ4kOgEPxiLEuebNDJ4Jtig.KVG7OtvVd8l1qKANnneu2', 
  false, 
  'Brandon', 
  'Ng', 
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
);

INSERT INTO roles (
  uid,
  role,
  is_deleted,
  created_at,
  updated_at
) VALUES (
  'e584bdfc-8253-42de-bfb3-2c658533a881',
  'PET_OWNER',
  false,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
), (
  'e584bdfc-8253-42de-bfb3-2c658533a881',
  'ADMINISTRATOR',
  false,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
);

INSERT INTO pet_owner (
  uid,
  is_deleted,
  created_at,
  updated_at
) VALUES (
  'e584bdfc-8253-42de-bfb3-2c658533a881',
  false,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
);

INSERT INTO pet_category (
  category,
  base_price,
  created_at,
  updated_at
) VALUES (
  'bulldog',
  55.50,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
), (
  'snail',
  10.90,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
), (
  'rabbit',
  28.00,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
);

INSERT INTO pet (
  name,
  category,
  pet_owner_id,
  special_needs,
  diet,
  is_deleted,
  created_at,
  updated_at
) VALUES (
  'jackie',
  'bulldog',
  'e584bdfc-8253-42de-bfb3-2c658533a881',
  NULL,
  'vegan',
  false,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
), (
  'tommy',
  'rabbit',
  'e584bdfc-8253-42de-bfb3-2c658533a881',
  'He is blind.',
  'cannibal',
  false,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
);