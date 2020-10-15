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

app.post(
  '/category/fetch',
  [body('category').exists()],
  AuthRequired,
  async (req, res) => {
    try {
      const response = await service.PetCategoryFetch({
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

export default {
  app,
};
