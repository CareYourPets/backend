import express from 'express';
import {body, validationResult} from 'express-validator';
import RoleUtils from '../Utils/RoleUtils';
import service from './UserService';
import {AuthRequired} from '../Utils/AuthUtils';

const app = express();

app.post(
  '/create',
  [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('firstName').isLength({min: 1}),
    body('lastName').isLength({min: 1}),
    body('role').custom((value) => {
      if (!(value === RoleUtils.CARE_TAKER || value === RoleUtils.PET_OWNER)) {
        throw new Error('Invalid Role');
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    const response = await service.UserCreate(req.body);
    return res.json(response);
  },
);

app.get('/info', AuthRequired, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  const response = await service.UserInfo(req.user);
  return res.json(response);
});

export default {
  app,
};
