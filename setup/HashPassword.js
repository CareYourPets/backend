const bcrypt = require('bcrypt');

const salt = 10;

const HashPassword = async (password) => {
  const hash = await bcrypt.hash(password, salt);
  // eslint-disable-next-line no-console
  console.log(hash);

  const authFailed = await bcrypt.compare('test', hash);
  const authSuccess = await bcrypt.compare(password, hash);
  if (!authFailed && authSuccess) {
    // eslint-disable-next-line no-console
    console.log('Password is hashed correctly');
  } else {
    // eslint-disable-next-line no-console
    console.log('Password is hashed incorrectly');
  }
};

(async () => {
  await HashPassword('password');
})();
