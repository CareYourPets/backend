import express from 'express';
import Version from './Version';

const app = express();

app.use('/', Version.app);

export default app;
