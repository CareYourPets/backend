import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Version from './Version';
import User from './User';
import Pet from './Pet';

const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.use('/user', User.app);
app.use('/', Version.app);
app.use('/pet', Pet.app);

export default app;
