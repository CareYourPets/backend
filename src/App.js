import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Version from './Version';
import User from './User';
import Pet from './Pet';
import Bid from './Bid';

const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.use('/bid', Bid.app);
app.use('/user', User.app);
app.use('/pet', Pet.app);
app.use('/', Version.app);

export default app;
