import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {validationResult} from 'express-validator';
import _ from 'lodash';
import pool from './DBUtils';
import SQLQueries from './SQLUtils';

const salt = 10;

export const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';

export const HashPassword = async (password) => {
  return bcrypt.hash(password, salt);
};

export const IsPasswordVerified = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const GenerateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

export const DecodeAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export async function AuthRequired(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  try {
    const accessToken = req.headers.accesstoken;
    const decodedToken = DecodeAccessToken(accessToken);
    const {email} = decodedToken;

    const {rows} = await pool.query(SQLQueries.SELECT_USER_ROLE_FOR_AUTH, [
      email,
    ]);
    const roles = _.map(rows, (row) => row.role);

    const user = {...decodedToken, roles};

    req.user = user; // {uid, email, roles, role}
    next();
  } catch {
    res.status(401);
    return res.json({error: 'Not Authorized'});
  }
}
