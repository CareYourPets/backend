import express from 'express';
import {body, validationResult} from 'express-validator';
import RoleUtils from '../Utils/RoleUtils';
import GenderUtils from '../Utils/GenderUtils';
import AreaUtils from '../Utils/AreaUtils';
import service from './UserService';
import {AuthRequired} from '../Utils/AuthUtils';

const app = express();

app.post(
  '/create',
  [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('role').isIn([
      RoleUtils.CARE_TAKER,
      RoleUtils.PET_OWNER,
      RoleUtils.ADMINISTRATOR,
    ]),
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
    body('role').isIn([
      RoleUtils.CARE_TAKER,
      RoleUtils.PET_OWNER,
      RoleUtils.ADMINISTRATOR,
    ]),
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

app.post(
  '/approve',
  [body('approvedEmail').isEmail()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserApprove({...req.user, ...req.body});
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/update/admin',
  [
    body('name').isString(),
    body('gender').isIn([GenderUtils.MALE, GenderUtils.FEMALE]),
    body('contact').isString(),
    body('location').isString(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserAdministratorUpdate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/update/petowner',
  [
    body('name').isString(),
    body('gender').isIn([GenderUtils.MALE, GenderUtils.FEMALE]),
    body('contact').isString(),
    body('area').isIn([
      AreaUtils.NORTH,
      AreaUtils.SOUTH,
      AreaUtils.EAST,
      AreaUtils.WEST,
      AreaUtils.CENTRAL,
      AreaUtils.NORTHEAST,
      AreaUtils.NORTHWEST,
      AreaUtils.SOUTHEAST,
      AreaUtils.SOUTHWEST,
    ]),
    body('location').isString(),
    body('bio').isString(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserPetOwnerUpdate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/update/caretaker',
  [
    body('name').isString(),
    body('gender').isIn([GenderUtils.MALE, GenderUtils.FEMALE]),
    body('contact').isString(),
    body('area').isIn([
      AreaUtils.NORTH,
      AreaUtils.SOUTH,
      AreaUtils.EAST,
      AreaUtils.WEST,
      AreaUtils.CENTRAL,
      AreaUtils.NORTHEAST,
      AreaUtils.NORTHWEST,
      AreaUtils.SOUTHEAST,
      AreaUtils.SOUTHWEST,
    ]),
    body('location').isString(),
    body('bio').isString(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerUpdate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.get('/caretaker/skill/fetch', AuthRequired, async (req, res) => {
  try {
    const response = await service.UserCareTakerSkillFetch({
      ...req.user,
    });
    return res.json(response);
  } catch (error) {
    return res.status(403).json({error});
  }
});

app.post(
  '/caretaker/skill/create',
  [body('category').isString(), body('price').isNumeric()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerSkillCreate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/caretaker/skill/update',
  [body('category').isString(), body('price').isNumeric()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerSkillUpdate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/caretaker/skill/delete',
  [body('category').isString()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerSkillDelete({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/caretaker/type/create',
  [
    body('type').isIn([
      RoleUtils.CARE_TAKER_FULL_TIMER,
      RoleUtils.CARE_TAKER_PART_TIMER,
    ]),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerTypeCreate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/caretaker/type/delete',
  [
    body('type').isIn([
      RoleUtils.CARE_TAKER_FULL_TIMER,
      RoleUtils.CARE_TAKER_PART_TIMER,
    ]),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerTypeDelete({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/caretaker/availability/create',
  [
    body('type').isIn([
      RoleUtils.CARE_TAKER_FULL_TIMER,
      RoleUtils.CARE_TAKER_PART_TIMER,
    ]),
    body('date').isString(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerAvailabilityDateCreate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.get(
  '/caretaker/availability/info',
  [
    body('type').isIn([
      RoleUtils.CARE_TAKER_FULL_TIMER,
      RoleUtils.CARE_TAKER_PART_TIMER,
    ]),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerAvailabilityDatesInfo({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/caretaker/availability/delete',
  [
    body('type').isIn([
      RoleUtils.CARE_TAKER_FULL_TIMER,
      RoleUtils.CARE_TAKER_PART_TIMER,
    ]),
    body('date').isISO8601(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.UserCareTakerAvailabilityDateDelete({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

export default {
  app,
};
