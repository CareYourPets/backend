import 'dotenv/config';
import App from './src/App';

App.listen(5000, () =>
  // eslint-disable-next-line no-console
  console.log('Visit http://localhost:5000 for the healthcheck'),
);
