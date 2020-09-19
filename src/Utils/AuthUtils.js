import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const salt = 10;

export const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';

export const HashPassword = async (password) => {
  return bcrypt.hash(password, salt);
};

export const IsPasswordVerified = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const GenerateAccessToken = (payload) => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(payload, JWT_SECRET, {expiresIn: '1800s'});
};

export const DecodeAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
