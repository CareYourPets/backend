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
    body('role').custom((value) => {
      if (
        !(
          value === RoleUtils.CARE_TAKER ||
          value === RoleUtils.PET_OWNER ||
          value === RoleUtils.ADMINISTRATOR
        )
      ) {
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
    try {
      const response = await service.UserCreate(req.body);
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.get('/info', AuthRequired, async (req, res) => {
  const response = await service.UserInfo(req.user);
  return res.json(response);
});

app.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('role').custom((value) => {
      if (
        !(
          value === RoleUtils.CARE_TAKER ||
          value === RoleUtils.PET_OWNER ||
          value === RoleUtils.ADMINISTRATOR
        )
      ) {
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
    try {
      const response = await service.UserLogin(req.body);
      return res.json(response);
    } catch (error) {
      return res.status(401).json({error});
    }
  },
);

app.post('/delete', AuthRequired, async (req, res) => {
  const response = await service.UserDelete(req.user);
  return res.json(response);
});

export default {
  app,
};
