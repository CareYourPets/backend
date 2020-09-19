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
  return jwt.sign(payload, JWT_SECRET);
};

export const DecodeAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export function AuthRequired(req, res, next) {
  try {
    const accessToken = req.headers.accesstoken;
    const decodedToken = DecodeAccessToken(accessToken);
    req.user = decodedToken; // {uid, email, roles}
    next();
  } catch {
    res.status(401);
    return res.json({error: 'Not Authorized'});
  }
}
