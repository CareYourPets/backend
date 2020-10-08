import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {validationResult} from 'express-validator';
import pool from './DBUtils';
import SQLQueries from './SQLUtils';
import RoleUtils from "./RoleUtils";

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
    const {email, role} = DecodeAccessToken(accessToken);

    let users = [];
    if (role === RoleUtils.CARE_TAKER) {
      users = await pool.query(SQLQueries.SELECT_CARE_TAKER, [email]);
    } else if (role === RoleUtils.PET_OWNER) {
      users = await pool.query(SQLQueries.SELECT_PET_OWNER, [email]);
    } else {
      throw new Error('Invalid Role');
    }
    if (users.rows.length !== 1) {
      res.status(401);
      return res.json({error: 'Unauthorized'});
    }

    req.user = {email, role};
    next();
  } catch (e) {
    res.status(401);
    return res.json({error: 'Unauthorized'});
  }
}
