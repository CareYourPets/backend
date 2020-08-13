import express from 'express';
import service from './VersionService';

const app = express();

app.get('/', (_, res) => {
  return res.json(service.getVersion());
});

export default {
  app,
};
