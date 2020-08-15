import 'dotenv/config';
import App from './src/App';

const PORT = process.env.PORT || 5000;

App.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Visit http://localhost:${PORT} for the healthcheck`),
);
