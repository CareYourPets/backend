import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import pool from '../Utils/DBUtils';
import SQLQueries from '../Utils/SQLUtils';

const CareTakerProfileCreate = async ({user, bio, location, gender}) => {
  const timestamp = moment(Date.now()).format();
  const pid = uuidv4();

  const {uid} = user;
  await pool.query(SQLQueries.CREATE_CARE_TAKER_PROFILE, [
    pid,
    uid,
    bio,
    location,
    gender,
    timestamp,
    timestamp,
  ]);
  return {status: 'ok'};
};

const CareTakerProfileInfo = async (user) => {
  return {};
};

const CareTakerProfileUpdate = async (user) => {
  return {};
};

const CareTakerProfileDelete = async (user) => {
  return {};
};

export default {
  CareTakerProfileCreate,
  CareTakerProfileInfo,
  CareTakerProfileUpdate,
  CareTakerProfileDelete,
};
