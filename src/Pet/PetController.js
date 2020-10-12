import express from 'express';
import {validationResult} from 'express-validator';
import service from './PetService';
import {AuthRequired} from '../Utils/AuthUtils';

const app = express();

app.post('/createPet', AuthRequired, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  try {
    const {email} = req.user;
    const response = await service.PetCreate(
      email,
      req.body.category,
      req.body.special_needs,
      req.body.diet,
      req.body.name,
    );
    return res.json(response);
  } catch (error) {
    return res.status(403).json({error});
  }
});

app.get('/getPet', AuthRequired, async (req, res) => {
  const response = await service.SelectAllPets(req.user);
  return res.json(response);
});

app.get('/getAllPetCategories', AuthRequired, async (req, res) => {
  const response = await service.SelectAllCategories();
  return res.json(response);
});

export default {
  app,
};
