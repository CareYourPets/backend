import express from 'express';
import {body} from 'express-validator';
import service from './PetService';
import {AuthRequired} from '../Utils/AuthUtils';

const app = express();

app.post(
  '/category/create',
  [body('category').isString(), body('basePrice').isNumeric()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.PetCategoryCreate({
        ...req.user,
        ...req.body,
      });
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post('/category/fetch', [body('category').exists()], async (req, res) => {
  try {
    const response = await service.PetCategoryFetch({
      ...req.user,
      ...req.body,
    });
    return res.json(response);
  } catch (error) {
    return res.status(403).json({error});
  }
});

app.post(
  '/category/update',
  [
    body('category').isString(),
    body('currentCategory').isString(),
    body('basePrice').isNumeric(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.PetCategoryUpdate({
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
  '/category/delete',
  [body('category').isString()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.PetCategoryDelete({
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
  '/create',
  [
    body('category').isString(),
    body('name').isString(),
    body('diet').exists(),
    body('needs').exists(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.PetCreate({...req.user, ...req.body});
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/update',
  [
    body('currentName').isString(),
    body('category').isString(),
    body('name').isString(),
    body('diet').exists(),
    body('needs').exists(),
  ],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.PetUpdate({...req.user, ...req.body});
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/delete',
  [body('name').isString()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.PetDelete({...req.user, ...req.body});
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post('/fetch', AuthRequired, async (req, res) => {
  try {
    const response = await service.PetFetch({...req.user});
    return res.json(response);
  } catch (error) {
    return res.status(403).json({error});
  }
});

app.post(
  '/caretaker/fetchall',
  [body('isByLocation').exists()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.FetchAllCareTakers({
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
  '/caretaker/fetch',
  [body('email').isEmail()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.FetchCareTaker({...req.body});
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/petowner/fetch',
  [body('email').isEmail()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.FetchPetOwner({...req.body});
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

app.post(
  '/caretaker/reviews/fetch',
  [body('careTakerEmail').isEmail()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.FetchCareTakerReviews({...req.body});
      return res.json(response);
    } catch (error) {
      return res.status(403).json({error});
    }
  },
);

export default {
  app,
};
