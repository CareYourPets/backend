INSERT INTO users (
  uid, email, 
  password, 
  deleted, 
  first_name, 
  last_name, 
  created_at, 
  updated_at
) VALUES (
  'e584bdfc-8253-42de-bfb3-2c658533a881', 
  'nwjbrandon@gmail.com', 
  '$2b$10$/IJdSgnkHJ4kOgEPxiLEuebNDJ4Jtig.KVG7OtvVd8l1qKANnneu2', 
  0, 
  'Brandon', 
  'Ng', 
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
);

INSERT INTO roles (
  uid,
  role,
  deleted,
  created_at,
  updated_at
) VALUES (
  'e584bdfc-8253-42de-bfb3-2c658533a881',
  'PET_OWNER',
  0,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
), (
  'e584bdfc-8253-42de-bfb3-2c658533a881',
  'ADMINISTRATOR',
  0,
  '2020-09-19T12:43:27+08:00', 
  '2020-09-19T12:43:27+08:00'
);